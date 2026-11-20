---
name: ingest
description: Scan brain/inbox/, categorize files, update semantic.md, create cross-linked wiki pages
---

# Ingest Skill

## Process

1. **Scan** all files inside `brain/inbox/` (skip files with `processed: true` frontmatter)
2. **Read** `brain/memory/user.md` to check for active objectives
3. **Read** `brain/config.yaml` for formatting and ingest settings
4. **Categorize** each capture: topic, tags, relevance to active goals
5. **Update** `brain/memory/semantic.md` — add new entities, facts, decisions
6. **Generate** clean Markdown page(s) in `brain/wiki/` with `[[cross-links]]`
7. **Mark** source file processed: add `processed: true` frontmatter (never delete)

## Wiki Page Format

```markdown
---
title: <Topic>
tags: [tag1, tag2]
sources: [inbox file names]
created: YYYY-MM-DD
---

# <Topic>

## Summary
<concise summary per config.yaml summarize_length>

## Key Points
- ...

## Related
- [[Other Topic]]
```

## Rules

- Follow formatting style from config.yaml (concise/detailed, voice)
- If `cross_link: true`, link to existing wiki pages via `[[Page Name]]`
- If `auto_tag: true`, infer tags from content
- Respect quiet_hours for any notification behavior