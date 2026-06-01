# Domain to LinkedIn URL Resolver MCP Server

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

## Full actor documentation

This server is a thin client and holds no resolution logic. For the complete input and output reference, pricing, and run history, see the Apify Store page:

https://apify.com/mambalabs/domain-to-linkedin-url-resolver

## Mamba Labs GTM Suite

This is one of six actors in the Mamba Labs GTM Suite, covering hiring signals, tech stack detection, signal aggregation, job board keyword scanning, LinkedIn URL resolution, and ICP scoring. See them all at https://apify.com/mambalabs.

## License

MIT

Built by Mamba Labs. https://apify.com/mambalabs
