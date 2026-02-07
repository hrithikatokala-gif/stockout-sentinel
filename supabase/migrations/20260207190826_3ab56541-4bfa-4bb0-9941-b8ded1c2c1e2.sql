
-- Fix: Deny all direct client SELECT on company_users (password hashes exposed)
DROP POLICY IF EXISTS "Anyone can check company_id existence" ON public.company_users;
CREATE POLICY "No direct access to company_users"
  ON public.company_users FOR SELECT
  USING (false);

-- Fix: Deny all direct client SELECT on user_sessions (tokens exposed)
DROP POLICY IF EXISTS "Sessions can be read" ON public.user_sessions;
CREATE POLICY "No direct access to user_sessions"
  ON public.user_sessions FOR SELECT
  USING (false);
