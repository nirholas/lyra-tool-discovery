# lyra-tool-discovery examples

AI-powered MCP tool discovery - find, analyze, and generate plugin configs for Model Context Protocol servers

## Example 1

```bash
# Only tools updated in the last 6 months
lyra-discover discover --max-age 6

# Only tools updated in the last 3 months (bleeding edge)
lyra-discover discover --max-age 3

# Tools up to 24 months old
lyra-discover discover --max-age 24
```

## Example 2

```bash
# Global install (recommended for CLI usage)
pnpm add -g @nirholas/lyra-tool-discovery

# Or with npm
npm install -g @nirholas/lyra-tool-discovery

# Or as a project dependency
pnpm add @nirholas/lyra-tool-discovery

# Or run directly with npx (no install)
npx @nirholas/lyra-tool-discovery discover --help
```

## Example 3

```bash
# Using OpenAI (default when both keys present)
export OPENAI_API_KEY="sk-..."

# Or using Anthropic
export ANTHROPIC_API_KEY="sk-ant-..."

# Optional: Force a specific provider
export AI_PROVIDER="anthropic"  # or "openai"

# Optional: Specify a model
export AI_MODEL="claude-sonnet-4-20250514"

# Optional: GitHub token for higher rate limits
export GITHUB_TOKEN="ghp_..."
```

## Example 4

```bash
# Discover MCP servers from GitHub and npm
lyra-discover discover --sources github,npm --limit 10

# Run in dry-run mode (no AI calls)
lyra-discover discover --dry-run --limit 20

# Analyze a specific GitHub repository
lyra-discover analyze-repo anthropics claude-mcp

# Analyze an npm package
lyra-discover analyze-npm @modelcontextprotocol/server-github

# Check available AI providers
lyra-discover providers

# View all plugin templates
lyra-discover templates
```

## Example 5

```bash
lyra-discover discover [options]
```

## Example 6

```bash
# Discover crypto MCP tools from GitHub only, limit 10 results
lyra-discover discover --sources github --limit 10

# Find tools updated in the last 6 months only
lyra-discover discover --max-age 6 --limit 20

# Dry run to preview what would be analyzed
lyra-discover discover --dry-run --sources npm --limit 20

# Use Anthropic Claude for analysis
lyra-discover discover --provider anthropic --model claude-sonnet-4-20250514

# Use OpenAI GPT-4o for analysis
lyra-discover discover --provider openai --model gpt-4o
```

## Example 7

```text
🔍 Discovering crypto/DeFi/web3 tools from: github, npm
📅 Max age: 12 months
  Found 5 from github
  Found 3 from npm

📊 Total discovered: 8 tools
🪙 Crypto-related: 6 tools
🔌 MCP-compatible: 5 tools

🤖 Analyzing: mcp-server-ethereum...
  Template: mcp-stdio
  Reasoning: Has MCP SDK dependency and bin entry for local execution

✅ Analyzed 5 tools

📦 Generated Configs:

--- mcp-server-ethereum ---
Template: mcp-stdio
Config: {
  "identifier": "mcp-server-ethereum",
  "customParams": {
    "mcp": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "mcp-server-ethereum"]
    }
  }
}
```

## Example 8

```bash
lyra-discover analyze-repo <owner> <repo> [options]
```


Every snippet above is taken from the [repository documentation](https://github.com/nirholas/lyra-tool-discovery#readme).
