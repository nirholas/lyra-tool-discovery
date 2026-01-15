# llm.energy ⚡

> Extract documentation for AI agents from any site with llms.txt support

## What It Does

llm.energy fetches documentation from websites that support the llms.txt standard and organizes it into downloadable markdown files optimized for AI assistants.

1. User enters a documentation URL
2. The app fetches `/llms-full.txt` or `/llms.txt` from the site
3. Content is parsed and organized into individual sections
4. Results are presented with:
   - MCP server configuration
   - REST API endpoint
   - Multiple download formats

## Features

- 🔍 Auto-detection of llms.txt or llms-full.txt
- 📄 Split content into organized markdown sections
- 📦 MCP Server for programmatic access
- 🔌 REST API endpoint
- 📥 Individual files or ZIP download
- 🤖 Agent-ready output with AGENT-GUIDE.md

## Tech Stack

- Next.js 14
- Tailwind CSS
- Framer Motion
- TSParticles
- Lucide Icons

## Running Locally

```bash
cd llms-forge
pnpm install
pnpm dev
```

Open http://localhost:3001

## MCP Server

Install the MCP server for programmatic access:

```json
{
  "mcpServers": {
    "llm-energy": {
      "command": "npx",
      "args": ["-y", "@llm-energy/mcp-server"]
    }
  }
}
```

## Links

- Website: https://llm.energy
- Docs: https://llm.energy/docs
- GitHub: https://github.com/nirholas/lyra-tool-discovery

---

*Built by [nich](https://x.com/nichxbt)*
