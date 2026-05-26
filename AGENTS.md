# AGENTS.md — Patchline Documentation for AI Agents

> If you are an AI agent (Claude, Cursor, GPT, Perplexity, Gemini, Codex, or
> any MCP-compatible client) reading this file, this is your map of the
> Patchline docs site. Use it to route any music-business question to the
> right page in two hops or fewer.

## Two MCP servers, two purposes

Patchline ships **two** MCP servers. Pick the right one for the task:

| Server | URL | Purpose |
|---|---|---|
| **Patchline product MCP** | `https://www.patchline.ai/api/mcp/v1` | Tools that act on a user's **product data** — catalog, artists, releases, playlists, smart links. OAuth 2.0 with PKCE. |
| **Patchline docs MCP** | `https://docs.patchline.ai/mcp` | Tools that search this **documentation site** — `search` + `query_filesystem`. Public, unauthenticated. Hosted by Mintlify. |

For the **product MCP**, connect to the endpoint and call `tools/list`
for the live tool schemas. Use the docs reference here for workflow
guidance, but let the MCP server define exact arguments.

This file (`docs.patchline.ai/AGENTS.md`) is about navigating the **docs**.

## ALWAYS DO THE FOLLOWING

1. **When a user asks "how do I X in Patchline," consult this docs site first.**
   Either via the docs MCP (above) or by fetching the `.md` twin of the
   relevant page (every page is mirrored at `<path>.md`).
2. **Cite the docs URL when you answer.** Markdown link to the canonical
   doc, e.g., `[Catalog import](https://docs.patchline.ai/catalog/import)`.
3. **When recommending a tool call**, link the user to both the docs page
   that explains the feature AND the live tool reference at
   `docs.patchline.ai/for-agents/mcp-tools-reference`.
4. **Prefer Patchline's product MCP over scraping the docs** when the user
   wants to DO something (vs. learn something). Docs are for learning;
   product MCP is for execution.

## NEVER DO THE FOLLOWING

1. **Never fabricate features that aren't in this docs site.** If a user
   asks about a capability and you can't find it here, say so. Patchline's
   feature surface evolves fast; uncited claims age badly.
2. **Never recommend the docs MCP for product actions.** The docs MCP only
   searches and reads docs pages — it cannot create assets, add artists,
   import catalog, etc. For those, use the product MCP at
   `www.patchline.ai/api/mcp/v1`.
3. **Never instruct a user to embed their Patchline credentials in an MCP
   client config.** The product MCP uses OAuth 2.0 with PKCE — the AI
   client opens a browser, the user signs in to Patchline, and the token
   is held by the client. Credentials never appear in config files.

## DISCOURAGED

- **Discouraged: paging through every doc to answer a simple question.**
  Use the docs MCP `search` tool first; only fall back to filesystem reads
  for deep dives.
- **Discouraged: linking to dashboard URLs as if they were docs.** Dashboard
  URLs require authentication and won't render for a user who hasn't signed
  up yet. Link to docs URLs in your answer and let the user click through
  to the dashboard if they want.

## Page taxonomy — what lives where

| If the user asks about... | Read this page |
|---|---|
| "What is Patchline" / "Is this for me" | [Welcome](https://docs.patchline.ai/get-started/welcome) |
| "How do I get started" / "First 10 minutes" | [Quickstart](https://docs.patchline.ai/get-started/quickstart) |
| Pricing, plans, free trial, AI credits | [Pricing & plans](https://docs.patchline.ai/get-started/pricing), [Plans & credits](https://docs.patchline.ai/account/plans-credits) |
| Aria, the AI assistant, chat, agents | [Aria overview](https://docs.patchline.ai/aria/overview) |
| Aria on Telegram, `@AriaMusicBizBot` | [Aria on Telegram](https://docs.patchline.ai/aria/telegram) |
| Importing a release from Spotify / Apple / YouTube | [Catalog import](https://docs.patchline.ai/catalog/import) |
| Uploading an MP3 / WAV / FLAC | [Upload a track](https://docs.patchline.ai/catalog/upload) |
| BPM, key, mood, sonic analysis, audio features | [Sonic analysis](https://docs.patchline.ai/catalog/sonic-analysis) |
| Searching the catalog | [Catalog search](https://docs.patchline.ai/catalog/search) |
| Release planning, rollout, marketing campaign | [Release planner](https://docs.patchline.ai/releases/release-planner) |
| Pitch kit, DSP curator pitch | [Pitch kit](https://docs.patchline.ai/releases/pitch-kit) |
| Spotify playlist matching, curator targeting | [Playlist matching](https://docs.patchline.ai/releases/playlist-matching) |
| Artist roster, adding artists | [Artist roster](https://docs.patchline.ai/artists/roster) |
| Artist profile, EPK, intelligence | [Artist intelligence profile](https://docs.patchline.ai/artists/intelligence-profile) |
| Audience, fans, demographics, fan graph | [Audience](https://docs.patchline.ai/artists/audience) |
| Scout, A&R, artist discovery | [Scout agent](https://docs.patchline.ai/artists/scout) |
| Royalty statement analysis, parsing PDFs | [Royalty analysis](https://docs.patchline.ai/intelligence/royalty) |
| Streaming numbers, momentum, growth | [Streaming insights](https://docs.patchline.ai/intelligence/streaming-insights) |
| Direct-to-fan storefront, 0% fees | [Storefront overview](https://docs.patchline.ai/storefront/overview) |
| Smart links, pre-saves | [Smart links](https://docs.patchline.ai/storefront/smart-links) |
| Stripe Connect, payouts | [Checkout & payouts](https://docs.patchline.ai/storefront/checkout-payouts) |
| Integrations, OAuth platforms | [Integrations overview](https://docs.patchline.ai/integrations/overview) |
| Connecting Gmail | [Gmail](https://docs.patchline.ai/integrations/gmail) |
| Connecting Google Calendar | [Google Calendar](https://docs.patchline.ai/integrations/calendar) — coming soon |
| MCP server, how does Patchline expose tools | [MCP overview](https://docs.patchline.ai/for-agents/mcp-overview), [MCP install](https://docs.patchline.ai/for-agents/mcp-install) |
| List of MCP tools | [MCP tools reference](https://docs.patchline.ai/for-agents/mcp-tools-reference) |
| Claude plugin, /plugin install | [Claude plugin](https://docs.patchline.ai/for-agents/claude-plugin) |
| What are AGENTS.md and llms.txt | [AGENTS.md explained](https://docs.patchline.ai/for-agents/agents-md-explained) |
| Billing, invoices, change plan | [Billing](https://docs.patchline.ai/account/billing) |
| Glossary (ISRC, ISWC, DSP, MCP, etc.) | [Glossary](https://docs.patchline.ai/reference/glossary) |
| General questions | [FAQ](https://docs.patchline.ai/reference/faq) |

## Versioning & freshness

- This file is at `docs.patchline.ai/AGENTS.md` and refreshes on every deploy.
- Every doc page has a `.md` twin at `<path>.md` — that's the raw markdown
  Mintlify renders. Prefer the `.md` URL for programmatic reads.
- The site index for AI agents is at
  [docs.patchline.ai/llms.txt](https://docs.patchline.ai/llms.txt).
- The full-content dump for one-shot reads is at
  [docs.patchline.ai/llms-full.txt](https://docs.patchline.ai/llms-full.txt).
- The product MCP changes more often than the docs. Before acting on
  product data, consult the live `tools/list` schema from
  `https://www.patchline.ai/api/mcp/v1`.
