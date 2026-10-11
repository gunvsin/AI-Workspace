# Connector Options — research + recommendation

## Option A: Obsidian plugin (Smart Connections / Copilot)
- **What:** Connects obsidian vault to LLM (OpenAI/Anthropic/Ollama local). RAG over vault notes.
- **Pros:** Mature (Smart Connections ~200k users), local embeddings via transformers.js/Ollama, vault stays on disk, 2,000+ plugins ecosystem.
- **Cons:** Plugin拼凑 (stitchwork) — no unified assistant; setup friction; mobile sync pain; embeddings quality varies by model.
- **Fit for this repo:** Low — my-business-brain already has its own Next.js API layer; Obsidian would duplicate capture.

## Option B: Local Ollama + pgvector (self-hosted RAG)
- **What:** Run Ollama (llama3/gemma2) locally; embed notes via `nomic-embed-text` into pgvector; query via /api/search.
- **Pros:** Fully private, zero per-seat cost, works offline, BYO model; matches "local-first" pattern (Obsidian edge). pgvector HNSW index handles 10k–1M chunks.
- **Cons:** Needs local GPU for speed (CPU ≈ 1.5x realtime for whisper; LLM inference slower); setup effort (docker-compose for ollama + postgres + pgvector).
- **Fit:** **HIGH** — aligns with antigravity sample (already uses Ollama endpoint at localhost:11434 in agy_sample.py), and with repo philosophy (self-hosted, no vendor lock-in).

## Option C: Notion AI API + database sync
- **What:** Sync my-business-brain notes → Notion database; use Notion AI search.
- **Pros:** Best all-in-one database power; team collab; web clipper.
- **Cons:** Cloud-only (no self-host); AI credits metering (unpredictable cost); export lossy; vendor lock-in.
- **Fit:** Low — violates independence principle; adds cost + lock-in.

## Option D: Capacities-style object graph (self-built)
- **What:** Typed objects (person/budget/blocker/project) with relations; smart queries.
- **Pros:** Best "structured Roam" pattern; enforces schema; enables graph queries.
- **Cons:** Not a plugin — requires building (NoteEntity + EntityRelation models already proposed in integration-patterns.md).
- **Fit:** **HIGH** — entity-graph.js already renders this pattern; schema exists; just needs API + UI.

## Option E: NotebookLM-style source-grounded RAG
- **What:** Upload sources (PDFs/docs/links/audio); AI Q&A grounded in sources with citations.
- **Pros:** Lowest hallucination (grounded answers); Audio Overview feature; free tier generous.
- **Cons:** Google-only (no self-host); limited structuring of long-term KB; privacy concerns.
- **Fit:** Medium — pattern worth stealing (cite chunks), but not as connector.

## Option F: Whisper audio capture pipeline
- **What:** Mic → /api/capture audio → Whisper large-v3 (local) → transcript → Note.content.
- **Pros:** Fully private, free, 99 languages, WER 2–5% English; matches "audio in, everything out" pattern.
- **Cons:** Needs local GPU for realtime; CPU ≈ 1.5x realtime.
- **Fit:** **HIGH** — spec explicitly requires audio capture; Whisper is the only self-hosted option.

---

## RECOMMENDATION (best option)

**B + D + F combined — self-hosted stack:**
1. **Ollama + pgvector** (B) — local LLM + semantic search, zero cost, private
2. **Object graph** (D) — NoteEntity/EntityRelation models + entity-graph.js rendering
3. **Whisper capture** (F) — audio → transcript → notes

Why: aligns with repo philosophy (independence, self-hosted, no vendor lock-in), reuses existing assets (agy_sample.py already targets Ollama, entity-graph.js already renders objects, schema proposed), and fills the exact gaps from the spec (vector search, entity graph, audio capture).

## IMPLEMENTATION (next 2 min)

Step 1: Add `/api/search` endpoint to my-business-brain (pgvector CTE pattern from integration-patterns.md)
Step 2: Add `/api/capture` audio branch (accepts `audio/base64` → writes to `brain/inbox/audio/` → Whisper worker)
Step 3: Wire entity-graph.js to `GET /api/entities` (NoteEntity + EntityRelation)
Step 4: Add docker-compose service for ollama + pgvector (postgres:16 + pgvector extension)
