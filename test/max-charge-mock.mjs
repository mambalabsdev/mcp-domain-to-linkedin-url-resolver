// Test only. Fake Apify API that logs each request with its body as one JSON line to MAX_CHARGE_LOG.
import { appendFileSync } from "node:fs";

const json = (body, code = 200) =>
  new Response(JSON.stringify(body), { status: code, headers: { "Content-Type": "application/json" } });

globalThis.fetch = async (url, init = {}) => {
  const u = String(url);
  const method = (init.method || "GET").toUpperCase();
  appendFileSync(process.env.MAX_CHARGE_LOG, JSON.stringify({ method, url: u, body: init.body ?? null }) + "\n");
  if (method === "POST" && /\/v2\/acts\/[^/]+\/runs/.test(u)) return json({ data: { id: "run123", status: "RUNNING", defaultDatasetId: "ds123" } }, 201);
  if (/\/v2\/actor-runs\/run123/.test(u)) return json({ data: { id: "run123", status: "SUCCEEDED", defaultDatasetId: "ds123" } });
  if (/\/v2\/datasets\/ds123\/items/.test(u)) return json([{ row_status: "ok" }]);
  return json({ error: { message: "unexpected " + method + " " + u } }, 404);
};
