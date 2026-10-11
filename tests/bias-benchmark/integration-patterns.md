# pgvector + Prisma schema additions for second-brain

## Extension setup (Supabase / Postgres 15+)

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

## Prisma schema (add to schema.prisma)

```prisma
model Note {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  title     String
  content   String
  tags      String[]
  pinned    Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  // NEW: embeddings + entities
  embedding  Unsupported("vector(1536)")? // OpenAI text-embedding-3-small dim
  entities   NoteEntity[]
  decisions  Decision[]

  @@index([userId])
  @@index([userId, createdAt])
}

// typed object model (Capacities/Tana pattern)
model NoteEntity {
  id        String   @id @default(cuid())
  noteId    String
  note      Note     @relation(fields: [noteId], references: [id])
  kind      String   // person | budget | blocker | project | topic
  name      String
  relation  String?  // works-for | blocks | funds | owns
  createdAt DateTime @default(now())

  @@unique([noteId, kind, name])
  @@index([kind, name])
}

// decision journal with post-mortem (60–90 day follow-up)
model Decision {
  id              String   @id @default(cuid())
  userId          String
  user            User     @relation(fields: [userId], references: [id])
  noteId          String?
  note            Note?    @relation(fields: [noteId], references: [id])
  question        String
  options         Json     // [{ label, rationale }]
  chosen          String
  expectedOutcome String
  confidencePct   Int      // 1–100
  biasChecks      Json     // { sunkCost: bool, confirmation: bool, recency: bool }
  reviewAt        DateTime // 60–90 days out
  outcome         String?  // filled at post-mortem
  brierScore      Float?   // calibration
  createdAt       DateTime @default(now())

  @@index([userId, reviewAt])
}

// entity graph relations (people/budgets/blockers)
model EntityRelation {
  id         String @id @default(cuid())
  fromId     String
  toId       String
  from       NoteEntity @relation("from", fields: [fromId], references: [id])
  to         NoteEntity @relation("to", fields: [toId], references: [id])
  type       String // blocks | funds | owns | works-for

  @@unique([fromId, toId, type])
}
```

Note: EntityRelation uses two relations to the same model — Prisma requires explicit relation names ("from"/"to").

## Semantic search endpoint (correct pgvector pattern)

```sql
-- Pre-filter CTE, then order by distance (pgvector < 0.7 filters AFTER vector op)
WITH candidates AS (
  SELECT id, title, content, tags
  FROM "Note"
  WHERE "userId" = $1
    AND createdAt > now() - interval '365 days'
)
SELECT c.*, n."embedding" <-> $2 AS distance
FROM candidates c
JOIN "Note" n ON n.id = c.id
ORDER BY distance
LIMIT 10;
```

HNSW index (create after loading):
```sql
CREATE INDEX ON "Note" USING hnsw ("embedding" vector_cosine_ops)
  WITH (m = 16, ef_construction = 64);
SET hnsw.ef_search = 40;  -- higher recall
ANALYZE "Note";
```

Rules: skip HNSW under ~50k rows (seq scan wins); never SELECT * (embedding columns are huge); run ANALYZE after big loads.

## Whisper capture (local, private, free)

```bash
pip install -U openai-whisper
whisper recording.wav --model large-v3 --language en
# → recording.txt (WER ~2–5% English; 99 languages)
```

faster-whisper for VAD + diarization; INT8 quantization costs ~1–2% WER.
RTX 4090 ≈ 0.3x realtime; CPU ≈ 1.5x.

## Bias-detection checklist (compose into production prompt)

- Sunk cost: "Ignore past spend — fresh $/time today, same choice?"
- Confirmation: "What evidence would prove this wrong?" — steelman opposite, seek disconfirming data first
- Pre-mortem: assume failure at 12 months, write why
- Outside view: "What happens in similar cases?" (base rates)

## Post-mortem automation (60–90 days)

1. Log at decision time: options, expected outcome, confidence %, bias checks
2. Schedule reviewAt = now + 60–90 days (cron or calendar)
3. Compare outcome vs prediction → Brier score (calibration)
4. LLM auto-generates post-mortem note: root-cause tags, counterfactuals

Human judgment + automation saves aggregation, not analysis.
