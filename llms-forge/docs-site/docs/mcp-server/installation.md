# Installation

Set up the LLMs Forge MCP server for AI assistants.

---

## What is MCP?

The [Model Context Protocol](https://modelcontextprotocol.io) (MCP) allows AI assistants to interact with external tools and data sources.

---

## Quick Setup

=== "npx (Recommended)"

    No installation required:

    ```json
    {
      "mcpServers": {
        "llms-forge": {
          "command": "npx",
          "args": ["-y", "@llms-forge/mcp-server"]
        }
      }
    }
    ```

=== "Global Install"

    ```bash
    npm install -g @llms-forge/mcp-server
    ```

    ```json
    {
      "mcpServers": {
        "llms-forge": {
          "command": "llms-forge-mcp"
        }
      }
    }
    ```

---

## Configuration

=== "Claude Desktop"

    Add to your Claude Desktop config:

    | OS | Path |
    |----|------|
    | macOS | `~/Library/Application Support/Claude/claude_desktop_config.json` |
    | Windows | `%APPDATA%\Claude\claude_desktop_config.json` |

=== "VS Code / Cursor"

    Add to workspace settings or MCP configuration:

    ```json
    {
      "llms-forge": {
        "command": "npx",
        "args": ["-y", "@llms-forge/mcp-server"]
      }
    }
    ```

---

## Verify Installation

After configuration, restart your AI client. Ask:

> "What tools does llms-forge provide?"

The assistant should list the available extraction tools.
