#!/usr/bin/env node
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";

const here = dirname(fileURLToPath(import.meta.url));
const pkg = JSON.parse(
  readFileSync(join(here, "..", "package.json"), "utf8"),
) as { version: string; name: string };

// Distinctive UA so Apify run meta.userAgent marks MCP-originated runs.
const USER_AGENT = `mambalabs-mcp ${pkg.name}@${pkg.version}`;

const APIFY_TOKEN = process.env.APIFY_TOKEN;

// The tilde between the org name and the actor name is Apify's required separator.
const ACTOR_ENDPOINT =
  "https://api.apify.com/v2/acts/mambalabs~domain-to-linkedin-url-resolver/run-sync-get-dataset-items?timeout=300";

const server = new McpServer({
  name: "mamba-domain-to-linkedin-url-resolver",
  version: pkg.version,
});

server.registerTool(
  "resolve_linkedin_url",
  {
    title: "Resolve LinkedIn URL",
    description:
      "Resolve a company domain or name to its LinkedIn company URL. Returns the LinkedIn URL with a confidence score, plus firmographics such as employee count, industry, and headquarters, and social links, as a flat, Clay-ready JSON row. Provide at least one of company_domain or company_name. Read-only; requires an APIFY_TOKEN and consumes Apify credits per call.",
    annotations: {
      title: "Resolve LinkedIn URL",
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
      openWorldHint: true,
    },
    inputSchema: {
    company_domain: z
      .string()
      .optional()
      .describe(
        "Bare company domain without https:// and without a trailing slash. Example: stripe.com. Required if company_name is not provided.",
      ),
    company_name: z
      .string()
      .optional()
      .describe("Company name. Required if company_domain is not provided."),
  },
  },
  async ({ company_domain, company_name }) => {
    if (
      (company_domain === undefined || company_domain === "") &&
      (company_name === undefined || company_name === "")
    ) {
      return {
        isError: true,
        content: [
          {
            type: "text",
            text: "Provide at least one of company_domain or company_name.",
          },
        ],
      };
    }

    if (!APIFY_TOKEN) {
      return { isError: true, content: [{ type: "text", text: "APIFY_TOKEN is not set. Create a token at https://console.apify.com/account/integrations and set it as the APIFY_TOKEN environment variable." }] };
    }

    const input: Record<string, unknown> = {};
    if (company_domain !== undefined) input.company_domain = company_domain;
    if (company_name !== undefined) input.company_name = company_name;

    let response: Response;
    try {
      response = await fetch(ACTOR_ENDPOINT, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${APIFY_TOKEN}`,
          "Content-Type": "application/json",
          "User-Agent": USER_AGENT,
        },
        body: JSON.stringify(input),
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      return {
        isError: true,
        content: [{ type: "text", text: `Could not reach the Apify API: ${message}` }],
      };
    }

    if (!response.ok) {
      let detail = "";
      try {
        const body = (await response.json()) as { error?: { message?: string } };
        if (body?.error?.message) detail = ` ${body.error.message}`;
      } catch {
        detail = "";
      }

      let message: string;
      switch (response.status) {
        case 401:
          message = "Invalid Apify token. Check your APIFY_TOKEN environment variable.";
          break;
        case 402:
          message =
            "Insufficient Apify credits. Check your account balance at https://console.apify.com/billing";
          break;
        case 408:
          message =
            "Actor run timed out after 300 seconds. Try again, or run the actor on Apify directly for longer jobs.";
          break;
        default:
          message = `Apify request failed with status ${response.status}.${detail}`;
      }
      return { isError: true, content: [{ type: "text", text: message }] };
    }

    const items = await response.json();
    return {
      content: [{ type: "text", text: JSON.stringify(items, null, 2) }],
    };
  },
);

const transport = new StdioServerTransport();
await server.connect(transport);
