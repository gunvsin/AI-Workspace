-- Postgres RLS policy for Note table
-- Requires Prisma schema @@RLS + application-level user context
ALTER TABLE "Note" ENABLE ROW LEVEL SECURITY;
CREATE POLICY note_isolation ON "Note"
  FOR ALL TO brain
  USING ("userId" = current_setting('app.current_user_id')::text);
