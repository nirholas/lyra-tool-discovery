# Documentation Site Deployment

The documentation at [https://lyra-tool-discovery.modelcontextprotocol.name](https://lyra-tool-discovery.modelcontextprotocol.name) is the static `docs/` folder hosted on Cloudflare Pages.

| Item | Value |
|------|-------|
| Host | Cloudflare Pages, project `lyra-tool-discovery` |
| Production URL | `https://lyra-tool-discovery.modelcontextprotocol.name` |
| Headers | `docs/_headers` (security headers; `.md` files served as readable text) |
| DNS | Proxied CNAME in the `modelcontextprotocol.name` zone to `lyra-tool-discovery.pages.dev` |

## Deploy

Export `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`, then from the repository root:

```bash
npx wrangler@4 pages deploy docs --project-name=lyra-tool-discovery --branch=main
```

Deploys are manual. GitHub Actions is not used for this site.

## Verify

```bash
curl -sI https://lyra-tool-discovery.modelcontextprotocol.name | head -1   # HTTP/2 200
```

## Rollback

Cloudflare dashboard → Workers & Pages → lyra-tool-discovery → Deployments → pick an earlier production deployment → Rollback.
