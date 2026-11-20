# my-business-brain — Claude Code Second Brain

Built with Claude Code and Claude Agent SDK. Source: [coleam00/second-brain-starter](https://github.com/coleam00/second-brain-starter).

## Key Paths
- Memory vault: `templates/memory/` (SOUL.md, USER.md, MEMORY.md, HEARTBEAT.md, HABITS.md, BOOTSTRAP.md, daily/)
- Skill: `.claude/skills/create-second-brain-prd/`
- Hooks: `.claude/hooks/` (SessionStart, PreCompact, SessionEnd)
- Scripts: `.claude/scripts/`
- Docker image: `docker-image/`

## Build Commands
- `docker build -t second-brain docker-image/`
- `git init` + commit (attribution below)

## Conventions
- Memory files concise; loaded into every conversation
- No secrets in vault
- Phase-by-phase execution (see starter architecture reference)
- Update this file when paths/commands added

## Completed Phases (placeholder)
- Phase 1: Memory layer scaffolded
- Phase 2-9: pending

## Attribution
- Co-Authored-By: Claude Code <noreply@anthropic.com>
- 🤖 Generated with [Claude Code](https://claude.com/claude-code)
