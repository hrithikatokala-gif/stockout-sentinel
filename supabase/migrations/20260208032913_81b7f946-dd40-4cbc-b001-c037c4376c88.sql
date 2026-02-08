
-- Add defensive deny-all policies for INSERT, UPDATE, DELETE on company_users
CREATE POLICY "Block all inserts on company_users"
ON public.company_users FOR INSERT
WITH CHECK (false);

CREATE POLICY "Block all updates on company_users"
ON public.company_users FOR UPDATE
USING (false);

CREATE POLICY "Block all deletes on company_users"
ON public.company_users FOR DELETE
USING (false);

-- Add defensive deny-all policies for INSERT, UPDATE, DELETE on user_sessions
CREATE POLICY "Block all inserts on user_sessions"
ON public.user_sessions FOR INSERT
WITH CHECK (false);

CREATE POLICY "Block all updates on user_sessions"
ON public.user_sessions FOR UPDATE
USING (false);

CREATE POLICY "Block all deletes on user_sessions"
ON public.user_sessions FOR DELETE
USING (false);

-- Create rate limiting table for auth attempts
CREATE TABLE public.auth_rate_limits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  identifier text NOT NULL,
  attempt_type text NOT NULL,
  attempt_count integer DEFAULT 1,
  window_start timestamp with time zone DEFAULT now(),
  UNIQUE (identifier, attempt_type)
);

-- Enable RLS on rate limits table (service role only)
ALTER TABLE public.auth_rate_limits ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Block all access to auth_rate_limits"
ON public.auth_rate_limits FOR ALL
USING (false);
