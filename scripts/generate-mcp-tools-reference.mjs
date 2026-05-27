#!/usr/bin/env node

/**
 * Generate for-agents/mcp-tools-reference.mdx from the live Patchline MCP
 * tools/list response.
 *
 * Required auth:
 *   PATCHLINE_MCP_API_KEY=... node scripts/generate-mcp-tools-reference.mjs
 * or
 *   PATCHLINE_MCP_BEARER=... node scripts/generate-mcp-tools-reference.mjs
 *
 * Optional:
 *   PATCHLINE_MCP_URL=https://www.patchline.ai/api/mcp/v1
 */

import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const repoRoot = path.resolve(__dirname, '..')
const outPath = path.join(repoRoot, 'for-agents', 'mcp-tools-reference.mdx')

const MCP_URL = process.env.PATCHLINE_MCP_URL || 'https://www.patchline.ai/api/mcp/v1'
const apiKey = process.env.PATCHLINE_MCP_API_KEY || process.env.PATCHLINE_MCP_X_API_KEY
const bearer = process.env.PATCHLINE_MCP_BEARER

if (!apiKey && !bearer) {
  console.error('Missing PATCHLINE_MCP_API_KEY or PATCHLINE_MCP_BEARER')
  process.exit(1)
}

const headers = {
  'content-type': 'application/json',
  accept: 'application/json, text/event-stream',
}
if (bearer) headers.authorization = `Bearer ${bearer}`
if (apiKey) headers['x-api-key'] = apiKey

function parseRpcResponse(text) {
  const trimmed = text.trim()
  if (!trimmed) throw new Error('Empty MCP response')

  if (trimmed.startsWith('event:') || trimmed.startsWith('data:')) {
    const dataLines = trimmed
      .split(/\r?\n/)
      .filter((line) => line.startsWith('data:'))
      .map((line) => line.slice('data:'.length).trim())
      .filter((line) => line && line !== '[DONE]')

    for (const line of dataLines) {
      const parsed = JSON.parse(line)
      if (parsed?.result || parsed?.error) return parsed
    }
  }

  return JSON.parse(trimmed)
}

async function rpc(method, params = {}, id = 1) {
  const response = await fetch(MCP_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      jsonrpc: '2.0',
      id,
      method,
      params,
    }),
  })

  const text = await response.text()
  if (!response.ok) {
    throw new Error(`MCP ${method} failed with HTTP ${response.status}: ${text.slice(0, 500)}`)
  }

  const parsed = parseRpcResponse(text)
  if (parsed.error) {
    throw new Error(`MCP ${method} error: ${JSON.stringify(parsed.error)}`)
  }
  return parsed.result
}

function groupFor(toolName) {
  if (toolName === 'analyze_url') return 'Dispatch'
  if (['browse_catalog', 'catalog_search', 'get_asset'].includes(toolName)) return 'Catalog'
  if (['get_asset_upload_link', 'confirm_asset_upload'].includes(toolName)) return 'Audio Upload'
  if (['create_project', 'get_artist_context', 'create_campaign'].includes(toolName)) return 'Projects'
  if (['get_artist_intelligence', 'browse_roster', 'search_artists', 'get_trending_artists'].includes(toolName)) return 'Artists'
  if (toolName === 'get_releases') return 'Releases'
  if (['find_playlists', 'inspect_playlist'].includes(toolName)) return 'Playlists'
  if (toolName === 'create_smart_link') return 'Storefront'
  if (toolName.startsWith('create_') || toolName === 'read_public_surface') return 'Public Surfaces'
  if (['get_audio_features', 'get_work_metadata', 'get_song_intelligence'].includes(toolName)) return 'Music Data'
  if (['get_bio', 'generate_pitch'].includes(toolName)) return 'AI Generation'
  if (['add_artist', 'remove_artist'].includes(toolName)) return 'Roster'
  if (toolName === 'find_similar_tracks') return 'Similarity'
  return 'Other'
}

const groupOrder = [
  'Dispatch',
  'Catalog',
  'Audio Upload',
  'Projects',
  'Artists',
  'Releases',
  'Playlists',
  'Storefront',
  'Public Surfaces',
  'Music Data',
  'AI Generation',
  'Roster',
  'Similarity',
  'Other',
]

function modeFor(tool) {
  const annotations = tool.annotations || {}
  if (annotations.destructiveHint) return 'Destructive'
  if (annotations.readOnlyHint) return 'Read'
  return 'Write'
}

function inputsFor(tool) {
  const schema = tool.inputSchema || {}
  const properties = schema.properties || {}
  const required = new Set(schema.required || [])
  return Object.keys(properties)
    .map((name) => required.has(name) ? `${name}*` : name)
    .join(', ') || '-'
}

function clean(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .replace(/\|/g, '\\|')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .trim()
}

function oneSentence(description) {
  const first = clean(description).split(/(?<=\.)\s+/)[0]
  return first || '-'
}

function render(tools) {
  const today = new Date().toISOString().slice(0, 10)
  const grouped = new Map()
  for (const tool of tools) {
    const group = groupFor(tool.name)
    if (!grouped.has(group)) grouped.set(group, [])
    grouped.get(group).push(tool)
  }

  const inventoryRows = groupOrder
    .filter((group) => grouped.has(group))
    .map((group) => `| ${group} | ${grouped.get(group).length} |`)
    .join('\n')

  const sections = groupOrder
    .filter((group) => grouped.has(group))
    .map((group) => {
      const anchors = grouped.get(group)
        .map((tool) => `<a id="${tool.name}" />`)
        .join('\n')
      const rows = grouped.get(group)
        .map((tool) =>
          `| \`${tool.name}\` | ${modeFor(tool)} | \`${inputsFor(tool)}\` | ${oneSentence(tool.description)} |`,
        )
        .join('\n')
      return `## ${group}\n\n${anchors}\n\n| Tool | Mode | Inputs | What it does |\n|---|---|---|---|\n${rows}`
    })
    .join('\n\n')

  return `---
title: "MCP tools reference"
sidebarTitle: "Tools reference"
description: "Generated reference for Patchline's product MCP tool inventory. The live tools/list response is the source of truth."
icon: "list-tree"
keywords:
  - patchline mcp tools
  - mcp tools reference
  - mcp tool schemas
  - aria tool list
---

import { AICallout } from "/snippets/ai-callout.mdx"
import { TierBadge } from "/snippets/tier-badge.mdx"

<!-- AUTO-GENERATED by scripts/generate-mcp-tools-reference.mjs from live tools/list on ${today}. Do not edit tool tables by hand. -->

This page is the human-readable snapshot of Patchline's product MCP
tools. The exact machine-readable schema comes from \`tools/list\` on:

\`\`\`text
${MCP_URL}
\`\`\`

<TierBadge tier="all" /> &nbsp; The MCP endpoint is available on every tier. Individual actions may still be shaped by workspace limits and feature availability.

## Generated Inventory

Generated on **${today}** from the live product MCP \`tools/list\`
response.

| Group | Tools |
|---|---:|
${inventoryRows}

Total: **${tools.length} tools**.

${sections}

## Common Patterns

### User pasted a URL

Call \`analyze_url\` first. It returns a canonical identity and suggested
next tools with the argument shape to use next.

### User wants to upload audio through Aria

Use \`get_asset_upload_link\`, have the client upload the file bytes to
the returned URL, then call \`confirm_asset_upload\`. Track analysis
starts after confirmation.

### User asks for a roster list

Use \`browse_roster\`. Use \`get_artist_intelligence\` only after the user
chooses a specific artist or asks for deeper context.

### User asks for playlist strategy

For catalog tracks, start with \`get_asset\` or \`get_song_intelligence\`,
then call \`find_playlists\`. For a specific playlist URL, use
\`inspect_playlist\`.

## Regenerate This Page

Run the generator from the docs repo with an MCP credential:

\`\`\`bash
PATCHLINE_MCP_API_KEY="..." node scripts/generate-mcp-tools-reference.mjs
\`\`\`

or:

\`\`\`bash
PATCHLINE_MCP_BEARER="..." node scripts/generate-mcp-tools-reference.mjs
\`\`\`

The generator calls the live MCP endpoint, runs \`tools/list\`, and
rewrites this page. Do not update the tool tables manually.

## Related Pages

- [MCP overview](/for-agents/mcp-overview) - what the Patchline MCP is for
- [Install in your AI tool](/for-agents/mcp-install) - per-client install
- [Agent discovery files](/for-agents/agents-md-explained) - how agents find the docs
- [Aria overview](/aria/overview) - same product intelligence in chat form

<AICallout page="/for-agents/mcp-tools-reference" />
`
}

await rpc('initialize', {
  protocolVersion: '2025-03-26',
  capabilities: {},
  clientInfo: { name: 'patchline-docs-generator', version: '1.0.0' },
}, 1)

const result = await rpc('tools/list', {}, 2)
const tools = result.tools || []
if (!Array.isArray(tools) || tools.length === 0) {
  throw new Error('tools/list returned no tools')
}

await fs.writeFile(outPath, render(tools), 'utf8')
console.log(`Generated ${path.relative(repoRoot, outPath)} from ${tools.length} tools`)
