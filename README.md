# Patchline Docs

Source for [docs.patchline.ai](https://docs.patchline.ai) — public
documentation for [Patchline](https://patchline.ai), the AI command center
for the modern music business.

## Stack

- **Hosting:** [Mintlify](https://mintlify.com)
- **Format:** MDX in this repo, rendered by Mintlify
- **Config:** [`docs.json`](docs.json)

## Local preview

```bash
npm i -g mint
mint dev
```

Open `http://localhost:3000`.

## Editing

Each page is an MDX file under `<section>/<slug>.mdx`. Pages must:

- Have one H1 (`title:` frontmatter) and use H2/H3 in the body.
- Follow the standard page template — see any page in `aria/` or `catalog/`
  for the canonical shape (frontmatter → hero → summary → what/when/where →
  quickstart → prereqs → how-it-works → examples → pricing → related → FAQ
  → AI-agent tip block).
- Cite product behavior to real code paths. No fabrication. If a claim
  isn't verifiable, drop a `{/* TODO verify */}` comment and add it to
  `docs-planning/gaps.md` (in the parent repo).

## Custom components (snippets)

All under [`snippets/`](snippets/):

- `<TierBadge tier="pro" />` — consistent tier-gating badges.
- `<AICallout />` — bottom-of-page block for AI agents (links to .md twin,
  AGENTS.md, and the product MCP source of truth).
- `<AriaPromptCard prompt="..." />` — render an example Aria prompt with
  copy + "open in dashboard" buttons.
- `<MCPToolCard name="analyze_url" />` — reference an MCP tool by name.
- `<SurfaceMatrix feature="aria" />` — cross-surface availability matrix
  (web / Telegram / Claude / MCP).

## The AI-agent layer

This docs site is dual-audience by construction — humans and AI agents both
get first-class support:

- [`AGENTS.md`](AGENTS.md) — docs navigation rules of engagement.
- [`robots.txt`](robots.txt) — explicit AI-bot allowlist.
- Every page has a `.md` twin at `docs.patchline.ai/<path>.md` (Mintlify auto-generates).
- `docs.patchline.ai/llms.txt` is the page index (Mintlify auto-generates).
- `docs.patchline.ai/llms-full.txt` is the full-content dump (Mintlify auto-generates).
- `docs.patchline.ai/mcp` is the Mintlify-hosted docs MCP server (auto).
- JSON-LD schema lives in page frontmatter; Mintlify renders it.

## Cross-references with the product site

The marketing/product site at [www.patchline.ai](https://www.patchline.ai)
ships its own `AGENTS.md`, `llms.txt`, and product MCP endpoint at
`/api/mcp/v1`. Those describe tools that act on user data; this docs
site describes the documentation. Both sites cross-link.

## License

Content © Patchline AI. Code (config, snippets) MIT.
