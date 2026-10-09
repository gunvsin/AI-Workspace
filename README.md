=== SECURITY GUARDRAILS (Recommendation 4) ===
- No secrets in vault (SOUL.md, USER.md, MEMORY.md must never contain API keys/tokens)
- Python auth wrapper: CLI passes data only; LLM never sees tokens
- .env excluded from git (.gitignore)
