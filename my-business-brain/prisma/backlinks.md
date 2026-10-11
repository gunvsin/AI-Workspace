-- Postgresql RLS policy for Note table (apply after extension setup)
-- Note: this requires enabling RLS at table level in Prisma schema too
ALTER TABLE "Note" ENABLE ROW LEVEL SECURITY;
CREATE POLICY note_isolation ON "Note" FOR ALL TO brain USING ("userId" = current_setting('app.current_user_id')::text);
