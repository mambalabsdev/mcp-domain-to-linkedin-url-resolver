// Test preload: replaces global fetch with a fake Apify API so the start and
// poll path runs offline. Every request is appended to MOCK_LOG. MOCK_MODE
// "fail" makes the run finish FAILED.
import { appendFileSync } from "node:fs";

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { "content-type": "application/json" } });

globalThis.fetch = async (url, opts = {}) => {
  const method = opts.method ?? "GET";
  if (process.env.MOCK_LOG) appendFileSync(process.env.MOCK_LOG, `${method} ${url}\n`);
  const u = String(url);
  if (method === "POST" && /\/v2\/acts\/[^/]+\/runs\?/.test(u)) {
    return json({ data: { id: "run1", status: "RUNNING", defaultDatasetId: "ds1" } }, 201);
  }
  if (u.includes("/v2/actor-runs/run1")) {
    const status = process.env.MOCK_MODE === "fail" ? "FAILED" : "SUCCEEDED";
    return json({ data: { id: "run1", status, defaultDatasetId: "ds1" } });
  }
  if (u.includes("/v2/datasets/ds1/items")) {
    return json([{ row_status: "ok", error_reason: null }]);
  }
  return json({ error: { message: `unexpected request ${method} ${u}` } }, 500);
};
