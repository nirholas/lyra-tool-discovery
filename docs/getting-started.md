# Getting started with lyra-tool-discovery

AI-powered MCP tool discovery - find, analyze, and generate plugin configs for Model Context Protocol servers

## Install

```bash
pnpm add -g @nirholas/lyra-tool-discovery
```

## Verify the install

Clone the repository and run its checks to confirm everything works on your machine:

```bash
git clone https://github.com/nirholas/lyra-tool-discovery.git
cd lyra-tool-discovery
```

Available commands:

| Command | Runs |
|---|---|
| `npm run build` | `tsup` |
| `npm run dev` | `tsx src/cli.ts` |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run test` | `vitest run` |

## Next steps

- [Examples](./examples.md) shows runnable snippets.
- The [README](https://github.com/nirholas/lyra-tool-discovery#readme) is the complete reference.
- Found a problem? [Open an issue](https://github.com/nirholas/lyra-tool-discovery/issues).
