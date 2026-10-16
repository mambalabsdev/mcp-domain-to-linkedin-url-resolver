import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const repo = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (f) => JSON.parse(readFileSync(join(repo, f), "utf8"));

// Every file that states the package version must state the same one.
test("version files agree with package.json", () => {
  const v = read("package.json").version;
  assert.equal(read(".cursor-plugin/plugin.json").version, v);
  const server = read("server.json");
  assert.equal(server.version, v);
  for (const p of server.packages ?? []) assert.equal(p.version, v);
  if (existsSync(join(repo, "manifest.json"))) assert.equal(read("manifest.json").version, v);
  const lock = read("package-lock.json");
  assert.equal(lock.version, v);
  assert.equal(lock.packages[""].version, v);
});
