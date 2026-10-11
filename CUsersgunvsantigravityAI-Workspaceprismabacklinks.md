# Backlinks — Obsidian-style (from cellos.blog framework)

Model addition to schema.prisma:

model NoteRelation {
  id        String @id @default(cuid())
  fromNoteId String
  toNoteId   String
  fromNote   Note @relation("from", fields: [fromNoteId], references: [id])
  toNote     Note @relation("to", fields: [toNoteId], references: [id])
  type       String @default("links") // links | blocks | funds

  @@unique([fromNoteId, toNoteId, type])
  @@index([toNoteId])
}

API endpoint: /api/notes/[id]/links
- GET: return backlinks (notes linking TO this note) + outlinks (this note links TO)
- POST: create link (with auth + ownership check)
- DELETE: remove link
