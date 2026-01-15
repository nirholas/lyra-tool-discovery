# FAQ

Frequently asked questions about LLMs Forge.

---

## :material-help-circle: General

??? question "What sites work with LLMs Forge?"

    Any site that provides `/llms.txt` or `/llms-full.txt` endpoints. This includes many modern documentation platforms.

??? question "Is LLMs Forge free?"

    Yes, completely free and open source.

??? question "Do I need to create an account?"

    No, just paste a URL and extract.

??? question "Where is my data stored?"

    Nowhere. LLMs Forge doesn't store any extracted content. Everything is processed in your browser session.

---

## :material-code-tags: Technical

??? question "What's the difference between llms.txt and llms-full.txt?"

    | File | Description |
    |------|-------------|
    | `llms.txt` | Typically a concise summary of documentation |
    | `llms-full.txt` | Complete documentation content |
    
    LLMs Forge tries the full version first.

??? question "Why does extraction fail for some sites?"

    The site may not support llms.txt, or the file may be at a different path. Some sites use different conventions.

??? question "Can I use the API programmatically?"

    Yes, see the [API Reference](api-reference.md).

??? question "Is there an MCP server?"

    Yes! LLMs Forge includes a fully functional [MCP Server](mcp-server.md) that allows AI assistants like Claude to extract documentation programmatically. Install it with:

    ```bash
    npx @llms-forge/mcp-server
    ```

??? question "How are tokens counted?"

    Token count is estimated as `character_count / 4`, which is a rough approximation for English text.

---

## :material-book-open-variant: Usage

??? question "What's the best way to use the downloaded files?"

    | Use Case | Recommended File |
    |----------|------------------|
    | Comprehensive context | `llms-full.md` |
    | Specific topics | Individual section files |
    | AI assistants | Include `AGENT-GUIDE.md` |

??? question "Can I extract private documentation?"

    LLMs Forge only fetches publicly accessible URLs. It cannot access content that requires authentication.

??? question "Why did you build this?"

    To make llms.txt content more accessible and organized for people working with AI assistants.

---

## :material-information: About

??? question "Who made this?"

    Created by [nich](https://x.com/nichxbt).

??? question "Is this open source?"

    Yes, part of the [lyra-tool-discovery](https://github.com/nirholas/lyra-tool-discovery) project.

??? question "How can I contribute?"

    Open an issue or pull request on GitHub.

??? question "Wait, can't I just add /llms-full.txt to URLs myself?"

    Yes! That's the "secret." This tool just makes it easier to organize and download the content. We even tell you this after extraction. :material-lightbulb:
