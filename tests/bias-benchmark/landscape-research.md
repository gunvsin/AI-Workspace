# Second Brain — Research Findings (2025–2026 landscape)

## 1. App comparison

| App | Core features | Distinct edge | Pricing | Self-hostable | Known gaps / complaints |
|---|---|---|---|---|---|
| **Obsidian + AI plugins** | Local Markdown vault, backlinks, graph, 2,000+ community plugins; AI via Smart Connections (local embeddings, transformers.js/Ollama), Copilot (chat + Vault QA RAG mode), Text Generator | Local-first, zero lock-in, files on disk, offline, huge plugin ecosystem | Core free; plugins like Smart Connections have paid tiers (~$10–15/mo); bring-your-own LLM/Ollama = free inference | **Yes** — vault is plain Markdown; sync via iCloud/Syncthing/Obsidian Sync (paid) | Setup friction; AI features are plugin拼凑 (stitchwork), no unified assistant; mobile sync/config pain; embeddings quality varies by model |
| **Notion AI** | Databases (table/board/calendar/gallery), relations, templates, web clipper, API, AI search/auto-summarize, AI agents | Best all-in-one workspace + database power; team collab | Free; Plus $10/member/mo; Business $20; Enterprise custom; AI add-on ~$10/member/mo (annual) or credit-based (~$10/1,000 credits, 2025 credit system) | No (cloud only; export Markdown/CSV) | AI credits metering (cost unpredictable with agents); export is lossy for databases; offline weak; free tier block limits historically |
| **Mem** | AI-first notes, Smart Search semantic retrieval, Mem Chat, daily notes, collections | AI chat over everything is the product, not a bolt-on | Paid-only ~$15/mo (free tier historically gone/limited) | No | Price for what's a fairly thin editor; hallucinated chat answers; sync/import complaints; data-export concerns |
| **Capacities** | **Object-based** PKM: everything = typed object (person, book, project) with relations; daily notes, backlinks, graph, AI assistant, smart queries | Best "structured Roam" — objects + relations enforce schema without databases | Free (unlimited objects, 5 then 100/mo media uploads); Pro $9.99/mo (yearly −16%); Believer from $12.49/mo; Plus add-on $8.33/mo annual | No (full import/export) | Less database power than Notion; AI usage caps on free; smaller community; price crept from early LTD |
| **Tana** | Outliner + **supertags** (tag = type + template + fields), superblocks, live queries, AI queries/actions | Most powerful outliner; tags carry full data model | Free Standard (caps); Plus ~$8/user/mo (~$6 annual); Enterprise; AI via monthly credits (quota changed repeatedly 2024–25) | No | Steepest learning curve; AI credit churn frustrates heavy users; closed platform; overkill for simple notes |
| **Heptabase** | **Whiteboards** as core unit: cards, connected boards, graph view, AI search | Visual thinkers — spatially organize ideas into boards then connect | Free (~3 boards, ~100MB, 7-day history); Standard ~$8–12/mo; Pro ~$16–24/mo | No | Few boards on free tier; weaker text/database tooling; niche compared to Notion/Obsidian |
| **Reflect** | Daily notes, bi-directional backlinks, graph, GPT-powered AI assistant, calendar/task integration, API, fast native sync | Speed + polish; backlinks quality; "Roam without hosting Roam" | Free (~1,000 notes); Individual ~$10/mo; Team ~$15/user/mo | No (no local-file export — lock-in complaint) | No Android app (per reviews); cloud-only, lock-in concerns vs Obsidian/Logseq |
| **Google NotebookLM** | Upload sources (PDFs, docs, links, audio), AI Q&A grounded in sources, **Audio Overview** (auto podcast), study guides | Source-grounded answers (low hallucination), free tier generous, Google ecosystem | Free tier; Plus ~$19.99/mo (also bundled in Google One AI Premium); Workspace tiers vary | No | Hallucinations still occur outside sources; audio overview can misrepresent nuance; Google account/data privacy; limited structuring of your own long-term KB |

**Pricing caveats:** rates change often (Notion credit system and Tana credits both churned in 2024–25).

## 2. Supporting tech

**pgvector (semantic search for personal KB):**
Use `halfvec`, HNSW: `CREATE INDEX ON items USING hnsw (embedding vector_cosine_ops) WITH (m=16, ef_construction=64);` then `SET hnsw.ef_search = 40;` (higher recall). **Pre-filter CTE, then order by distance** — pgvector <0.7 filters *after* vector op, causing missed results. `ANALYZE` after big loads; skip index under ~50k rows (seq scan wins). Don't `SELECT *` — embedding columns huge. 10k–1M-chunk personal plenty; partition by date if grows.

**Whisper (audio capture):**
Whisper large-v3: English ~2–5% WER, major languages ~5–10%, low-resource 15–25%+; 99 languages. faster-whisper / WhisperX add VAD diarization. INT8 quantization costs ~1–2% WER. Runs local (RTX 4090 ≈ 0.3x realtime, CPU ≈ 1.5x). Fully private, free; `pip install -U openai-whisper` → `whisper file.wav --model large-v3 --language <code>`.

**Bias-detection prompting (for decision journals):**
- **Sunk cost:** "Ignore past spend — fresh $/time today, same choice?" (Heath's *Decisive*: attain distance)
- **Confirmation bias:** "What evidence would prove this wrong?", steelman opposite, red-team, seek disconfirming data *first*
- **Pre-mortem:** assume failure at 12 months, write why (Klein)
- **Outside view/base rates:** "What happens in similar cases?" (Tetlock)
Compose single system-prompt checklist. LLM-specific bias checklists are thin in literature — assemble from above.

**Decision-journal post-mortem automation:**
Log *at decision time*: options, expected outcome, confidence date, sunk-cost check, disconfirming-evidence check. Schedule follow-up (calendar/cron) → compare outcome → prediction score → calibration (Brier score). LLM auto-generates post-mortem notes, root-cause tagging, counterfactuals. Human judgment + automation saves aggregation, not analysis.

## 3. Patterns worth stealing

1. **Object-first data model** (Capacities/Tana supertags) — typed entities + relations beat flat folders; enables smart queries
2. **Local-first BYO-LLM** (Obsidian + Ollama/Smart Connections) — privacy, zero per-seat cost; pgvector retrieval
3. **Source-grounded answers** (NotebookLM) — cite chunks, low hallucination; most trusted RAG pattern
4. **Audio in, everything out** (NotebookLM Audio Overview + Whisper local) — capture meetings/voice notes → transcript
5. **Credit-metering backlash** (Notion/Tana) — users hate unpredictable bills; flat local inference wins
