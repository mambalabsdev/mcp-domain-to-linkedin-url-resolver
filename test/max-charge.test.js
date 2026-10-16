import { test } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFileSync, existsSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { fileURLToPath, pathToFileURL } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, "..");

// Start the built server against the fake Apify API, list the tool, then call
// it with its required inputs plus max_charge_usd. Returns the request log.
async function callWithCap() {
  const log = join(mkdtempSync(join(tmpdir(), "maxcharge-")), "log.jsonl");
  await new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["--import", pathToFileURL(join(here, "max-charge-mock.mjs")).href, join(repo, "build", "index.js")], {
      stdio: ["pipe", "pipe", "pipe"],
      env: { ...process.env, APIFY_TOKEN: "test-token", MAX_CHARGE_LOG: log },
    });
    let out = "";
    let called = false;
    const timer = setTimeout(() => { child.kill(); reject(new Error("timed out")); }, 30000);
    const send = (m) => child.stdin.write(JSON.stringify(m) + "\n");
    child.stdout.on("data", (c) => {
      out += c.toString();
      for (const line of out.split("\n")) {
        let msg;
        try { msg = JSON.parse(line); } catch { continue; }
        if (msg.id === 2 && !called) {
          called = true;
          const tool = msg.result.tools.find((x) => x.name === "resolve_linkedin_url");
          const sample = {"company_domain":"stripe.com"};
          const args = { ...(sample ?? {}), max_charge_usd: 0.25 };
          const props = tool.inputSchema.properties;
          const need = [...(tool.inputSchema.required ?? [])];
          if (!sample && !need.length) {
            const k = ["domain", "company_domain", "url", "company_name", "name", "email", "contacts", "domains"].find((x) => x in props);
            if (k) need.push(k);
          }
          for (const k of sample ? [] : need) {
            const ty = props[k]?.type;
            args[k] = ty === "array" ? ["example.com"] : ty === "number" || ty === "integer" ? 1 : ty === "boolean" ? false : "example.com";
          }
          send({ jsonrpc: "2.0", id: 3, method: "tools/call", params: { name: "resolve_linkedin_url", arguments: args } });
        }
        if (msg.id === 3) { clearTimeout(timer); child.kill(); resolve(); }
      }
    });
    child.on("error", reject);
    send({ jsonrpc: "2.0", id: 1, method: "initialize", params: { protocolVersion: "2025-06-18", capabilities: {}, clientInfo: { name: "wrapper-test", version: "0.0.0" } } });
    send({ jsonrpc: "2.0", method: "notifications/initialized" });
    send({ jsonrpc: "2.0", id: 2, method: "tools/list", params: {} });
  });
  return existsSync(log) ? readFileSync(log, "utf8").trim().split("\n").filter(Boolean).map((l) => JSON.parse(l)) : [];
}

// The buyer cost cap must reach the actor run input unchanged.
test("max_charge_usd is passed through to the actor run input", async () => {
  const start = (await callWithCap()).find((r) => r.method === "POST" && /\/runs/.test(r.url));
  assert.ok(start, "no run start request");
  assert.equal(JSON.parse(start.body).max_charge_usd, 0.25);
});
