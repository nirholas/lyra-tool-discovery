# API Reference

LLMs Forge exposes a simple API for programmatic access.

---

## Extract Endpoint

### `POST /api/extract`

Extracts documentation from a given URL.

=== "Request"

    ```json
    {
      "url": "https://docs.example.com"
    }
    ```

=== "Response"

    ```json
    {
      "url": "https://docs.example.com",
      "sourceUrl": "https://docs.example.com/llms-full.txt",
      "rawContent": "...",
      "documents": [
        {
          "filename": "getting-started.md",
          "title": "Getting Started",
          "content": "...",
          "tokens": 1234
        }
      ],
      "fullDocument": {
        "filename": "llms-full.md",
        "title": "Complete Documentation",
        "content": "...",
        "tokens": 5678
      },
      "agentGuide": {
        "filename": "AGENT-GUIDE.md",
        "title": "Agent Guide",
        "content": "...",
        "tokens": 456
      },
      "stats": {
        "totalTokens": 7368,
        "documentCount": 5,
        "processingTime": 1234
      }
    }
    ```

!!! example "Example with curl"

    ```bash
    curl -X POST https://llms-forge.vercel.app/api/extract \
      -H "Content-Type: application/json" \
      -d '{"url": "https://docs.anthropic.com"}'
    ```

---

## Download Endpoint

### `POST /api/download`

Generates a ZIP file containing all documents.

=== "Request"

    ```json
    {
      "documents": [...],
      "fullDocument": {...},
      "agentGuide": {...},
      "siteName": "example-docs"
    }
    ```

=== "Response"

    Binary ZIP file with `Content-Type: application/zip`.

---

## Error Handling

Errors return appropriate HTTP status codes:

| Status Code | Description |
|-------------|-------------|
| `400` | Invalid request (missing URL) |
| `404` | No llms.txt found at the given URL |
| `422` | Content found but could not be parsed |
| `500` | Server error during extraction |

!!! warning "Error Response Format"

    ```json
    {
      "error": "Description of what went wrong"
    }
    ```

---

## Rate Limits

!!! info "No Rate Limits"
    The public API currently has no rate limits, but please be respectful with usage.

The public API has reasonable rate limits to prevent abuse. For high-volume usage, consider self-hosting.
