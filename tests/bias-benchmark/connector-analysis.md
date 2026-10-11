# Plugin & Connector Analysis — 12 items

**BUILT-IN (wired):**
1. Ollama — localhost:11434 (docker-compose.brain.yml)
2. pgvector — db/init/01-vector.sql (semantic search)
3. Whisper — profile:audio (audio capture)
4. Anthropic — /api/explain (optional Claude API)
5. Google OAuth — my-business-brain/lib/auth.ts
6. OmniRoute — docker-compose.yml (port 20128)

**RESEARCHED (not built):**
7. Obsidian Smart Connections (local embeddings)
8. Obsidian Copilot (Vault QA RAG)
9. Obsidian Text Generator
10. Notion API (databases/web clipper)
11. Supabase (hosted pgvector)
12. faster-whisper / WhisperX (VAD/diarization)

**INTEGRATION PATTERN:** endpoint contracts (GET /api/*), copy-not-import (shared-dashboard), BYO-LLM (Ollama or Anthropic).
