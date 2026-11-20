# Agent.md — Second Brain Agent Protocol

This file teaches the agent (Claude / antigravity) how this brain works.
Keep it updated as the system evolves. Never set-and-forget.

## Vault taxonomy (numbered folders)

- `00-daily/` — daily notes (YYYY-MM-DD.md)
- `10-raw/` — unrefined captures (fleeting thoughts, transcripts)
- `20-notes/` — refined atomic notes (one idea, own words)
- `30-projects/` — active project pages
- `97-topics/` — evergreen topic pages
- `98-assets/` — images, PDFs, attachments
- `99-templates/` — note templates

## Required metadata (4 fields per note)

Every note must carry:
1. **Type** — matches folder (daily / raw / note / project / topic)
2. **Parent** — link to parent topic or project
3. **Links** — related notes (forward/back)
4. **Status** — draft / refining / polished / archived

## Linking rules

- Link liberally within same branch (topic → notes).
- Avoid "sister" links that break hierarchy.
- Backlinks: use `[[note]]` style or NoteRelation model.
- Every project links to ≥1 topic.

## Workflow (agent instructions)

1. Capture → `10-raw/` (no editing at capture time)
2. Refine → move to `20-notes/`, add metadata, write in own words
3. Connect → add links section, update backlinks
4. Index → update `VAULT-INDEX.md` (agent-maintained)
5. Review → weekly inbox sweep (empty `10-raw/`)

## Maintenance routines

- Daily: capture to `10-raw/`, review `00-daily/`
- Weekly: refine `10-raw/` → `20-notes/`, update index
- Monthly: archive stale `30-projects/`, prune links

## Agent access

- Read/write: `brain/` (all numbered folders)
- Never read: `.env`, `node_modules/`, `secrets/`
- Update `Agent.md` when structure changes
- `CLAUDE.md` (project root) lists frequent skills/needs

## Vault Index

`VAULT-INDEX.md` at `brain/` root — agent maintains:
- List of all notes by folder
- Last updated per note
- Orphaned notes (no links)
- Stale notes (>90 days unmodified)
