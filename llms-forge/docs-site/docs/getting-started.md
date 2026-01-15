# Getting Started

Get up and running with LLMs Forge in under a minute.

---

## Using the Web App

### Step 1: Enter a URL

Paste any documentation site URL into the input field.

!!! example "Try these sites"
    - `https://modelcontextprotocol.io`
    - `https://docs.anthropic.com`
    - `https://docs.stripe.com`

### Step 2: Extract

Click the **Extract** button. LLMs Forge will:

1. Find the `llms.txt` or `llms-full.txt` file on the site
2. Parse the content into sections
3. Generate organized markdown files

!!! info "Processing Time"
    Extraction usually takes just a few seconds, depending on the size of the documentation.

### Step 3: Download

Once extraction is complete, you can:

| Option | Description |
|--------|-------------|
| :material-download: Individual files | Click the download icon next to any file |
| :material-archive: Download as ZIP | Get everything in one bundle |

---

## Using the Downloaded Files

=== "Claude"

    1. Start a new conversation
    2. Upload the files (or paste the content of `llms-full.md`)
    3. Ask questions about the documentation

=== "ChatGPT"

    1. Start a new conversation
    2. Upload the files to the conversation
    3. Reference the documentation in your prompts

=== "Other AI Assistants"

    The markdown files work with any AI assistant that accepts text or file uploads. The `AGENT-GUIDE.md` file contains specific instructions that help AI assistants understand the documentation structure.

---

## Tips

!!! tip "Best Practices"
    - **llms-full.md** is best for comprehensive context
    - **Individual files** are better when you need specific sections
    - **AGENT-GUIDE.md** helps AI assistants navigate the documentation

!!! note "Pro Tip"
    You can access llms.txt content directly by adding `/llms-full.txt` to most documentation URLs. LLMs Forge just makes it easier to organize and download.
