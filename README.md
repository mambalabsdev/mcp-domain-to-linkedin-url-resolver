# Domain to LinkedIn URL Resolver MCP Server

[![Smithery](https://smithery.ai/badge/mambabuilt/mcp-domain-to-linkedin-url-resolver)](https://smithery.ai/servers/mambabuilt/mcp-domain-to-linkedin-url-resolver) [![Glama score](https://glama.ai/mcp/servers/mambalabsdev/mcp-domain-to-linkedin-url-resolver/badges/score.svg)](https://glama.ai/mcp/servers/mambalabsdev/mcp-domain-to-linkedin-url-resolver) [![MCP Registry](https://img.shields.io/badge/dynamic/json?url=https%3A%2F%2Fregistry.modelcontextprotocol.io%2Fv0%2Fservers%3Fsearch%3Dcom.mambabuilt%252Fmcp-domain-to-linkedin-url-resolver%26limit%3D1&query=%24.servers%5B0%5D._meta%5B%22io.modelcontextprotocol.registry%2Fofficial%22%5D.status&label=mcp%20registry&color=blue)](https://registry.modelcontextprotocol.io/v0/servers?search=com.mambabuilt/mcp-domain-to-linkedin-url-resolver&limit=1) [![npm version](https://img.shields.io/npm/v/@mambalabsdev/mcp-domain-to-linkedin-url-resolver)](https://www.npmjs.com/package/@mambalabsdev/mcp-domain-to-linkedin-url-resolver) [![npm downloads](https://img.shields.io/npm/dm/@mambalabsdev/mcp-domain-to-linkedin-url-resolver)](https://www.npmjs.com/package/@mambalabsdev/mcp-domain-to-linkedin-url-resolver) [![license](https://img.shields.io/github/license/mambalabsdev/mcp-domain-to-linkedin-url-resolver)](https://github.com/mambalabsdev/mcp-domain-to-linkedin-url-resolver/blob/main/LICENSE) [![mcpservers.org](https://img.shields.io/badge/mcpservers.org-listed-blue)](https://mcpservers.org/servers/mambalabsdev/mcp-domain-to-linkedin-url-resolver)

An MCP server that resolves a company domain or name to its LinkedIn company URL. It wraps the Mamba Labs Domain to LinkedIn URL Resolver actor on Apify and returns a Clay-ready flat JSON row to any MCP client.

## What it does

Give it a company domain or a company name and it finds the matching LinkedIn company page, with a confidence score so you know how much to trust it. You also get firmographics such as employee count, industry, and headquarters, plus social links, all in one flat row ready for Clay, a CRM, or an AI agent workflow. All of the resolution runs on Apify. This package is a thin client that calls the actor and hands back the result.

## Quick start

You need Node.js 18 or newer and an Apify account with an API token.

Add this to your Claude Desktop config:

```json
{
  "mcpServers": {
    "mamba-linkedin-resolver": {
      "command": "npx",
      "args": ["-y", "@mambalabsdev/mcp-domain-to-linkedin-url-resolver"],
      "env": {
        "APIFY_TOKEN": "your-apify-token"
      }
    }
  }
}
```

Get your token at https://console.apify.com/account/integrations, paste it in, and restart Claude Desktop. The `resolve_linkedin_url` tool will be available.

## Prerequisites

- Node.js 18 or newer
- An Apify account with an API token

## Example prompts

- "Find the LinkedIn page for stripe.com."
- "What is the LinkedIn company URL for openai.com? Include the confidence score."
- "Resolve the company named Figma to its LinkedIn URL and firmographics."
- "Get the LinkedIn URL, employee count, and industry for datadoghq.com."

## Inputs

- `company_domain` (optional): the bare company domain, no `https://` and no trailing slash. Example: `stripe.com`
- `company_name` (optional): the company name.

Provide at least one of the two. If both are given, the domain takes priority.

## Output

The tool returns the actor's flat JSON row, including the resolved LinkedIn company URL, a confidence score, firmographics such as employee count, industry, and headquarters, and social links. See the Apify Store page for the full output schema.

## Example output

```json
{
  "company_domain": "linear.app",
  "company_name": "Linear",
  "linkedin_company_url": "https://www.linkedin.com/company/linear-app",
  "linkedin_slug": "linear-app",
  "resolution_method": "google_search",
  "confidence": "high",
  "industry": "Software Development",
  "employee_count_approx": "201",
  "hq_location": "San Francisco, California, United States",
  "run_date": "2026-05-28"
}
```

## Features

- Google search plus URL pattern matching for high accuracy
- Fixes the LinkedIn URL gaps in Clay native enrichment
- Confidence scoring (high, medium, low) and resolution_method
- Firmographics (employee count, industry, HQ) plus social links

## Full actor documentation

This server is a thin client and holds no resolution logic. For the complete input and output reference, pricing, and run history, see the Apify Store page:

https://apify.com/mambalabs/domain-to-linkedin-url-resolver

---

## Mamba Labs GTM Suite

This server is part of the **Mamba Labs GTM Suite**, a fleet of eight specialized MCP servers for go-to-market signal intelligence, each backed by a dedicated Apify actor.

| Actor | Immutable Actor ID |
|---|---|
| [GTM Hiring Signal Scraper](https://console.apify.com/actors/D7O1SA2EqwHGsGr1P) | `D7O1SA2EqwHGsGr1P` |
| [GTM Tech Stack Signal Enrichment](https://console.apify.com/actors/qyd7nNyqFPelQViBx) | `qyd7nNyqFPelQViBx` |
| [GTM Signals Aggregator](https://console.apify.com/actors/xKdRfnfFNkdMpFuNs) | `xKdRfnfFNkdMpFuNs` |
| [Job Board Keyword Signal Scanner](https://console.apify.com/actors/4DvqpvhMR74NLcDDY) | `4DvqpvhMR74NLcDDY` |
| [Domain to LinkedIn URL Resolver](https://console.apify.com/actors/3HtnSaqPHOg1Qg5gx) | `3HtnSaqPHOg1Qg5gx` |
| [ICP Fit Scorer](https://console.apify.com/actors/W161DT8W4kW55dMFh) | `W161DT8W4kW55dMFh` |
| [Domain Deliverability Checker](https://console.apify.com/actors/0tVgxI7A6o9jMlxmc) | `0tVgxI7A6o9jMlxmc` |
| [Company Firmographic Enricher](https://console.apify.com/actors/YlUtLWjfPpqykmB8g) | `YlUtLWjfPpqykmB8g` |

> Built by [Mamba Labs](https://github.com/mambalabsdev) | [npm](https://www.npmjs.com/org/mambalabsdev) | [Apify Store](https://apify.com/mambabuilt)

## License

MIT

Built by Mamba Labs. https://apify.com/mambalabs
