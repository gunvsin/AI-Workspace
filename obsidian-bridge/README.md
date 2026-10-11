# Obsidian Bridge — sync brain/ ↔ Obsidian vault

Zero-dep Node script. Watches `my-business-brain/brain/` and mirrors to
an Obsidian vault folder (or any folder). Runs as a sidecar process.

## Usage

```bash
node obsidian-bridge.js --watch my-business-brain/brain --vault /path/to/vault
```

## What it does

1. Initial sync: copy brain/ structure → vault/
2. Watch: on change (fs.watch), copy changed file
3. Back-sync (optional): on vault change, copy back

## Folder mapping (Wilkins taxonomy)

```
brain/                    → vault/
  00-daily/               → 00-daily/
  10-raw/                 → 10-raw/
  20-notes/               → 20-notes/
  30-projects/            → 30-projects/
  97-topics/              → 97-topics/
  98-assets/              → 98-assets/
  99-templates/           → 99-templates/
  Agent.md                → Agent.md
  VAULT-INDEX.md          → VAULT-INDEX.md
```

## Why bridge (not import)

- Obsidian vault = plain Markdown on disk
- brain/ = source of truth in repo
- Bridge keeps both in sync without coupling
- No shared runtime, no vendor lock-in

## Setup

1. `npm init -y` (if no package.json)
2. `node obsidian-bridge.js --help`

## Limitations

- fs.watch is best-effort (Linux inotify, macOS FSEvents, Windows ReadDirectoryChangesW)
- No conflict resolution (last-write-wins)
- No binary diffing (copies whole file)

## Next (optional)

- Add `--watch` polling interval
- Add conflict marker on simultaneous edits
- Add git hook (pre-commit sync)
