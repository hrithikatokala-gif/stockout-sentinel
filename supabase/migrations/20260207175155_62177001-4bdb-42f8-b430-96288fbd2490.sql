-- Drop the trigger first since it references auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();

-- Drop profiles table as we're moving to custom auth
DROP TABLE IF EXISTS public.profiles;

-- Create company_users table for custom auth
CREATE TABLE public.company_users (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  full_name TEXT,
  restaurant_chain TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for faster lookups
CREATE INDEX idx_company_users_company_id ON public.company_users(company_id);

-- Enable RLS
ALTER TABLE public.company_users ENABLE ROW LEVEL SECURITY;

-- Allow anyone to check if company_id exists (for signup validation)
CREATE POLICY "Anyone can check company_id existence"
ON public.company_users
FOR SELECT
USING (true);

-- Create sessions table for managing auth
CREATE TABLE public.user_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.company_users(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index for token lookups
CREATE INDEX idx_user_sessions_token ON public.user_sessions(token);

-- Enable RLS
ALTER TABLE public.user_sessions ENABLE ROW LEVEL SECURITY;

-- Allow reading sessions (validated by token in edge function)
CREATE POLICY "Sessions can be read"
ON public.user_sessions
FOR SELECT
USING (true);

-- Trigger for updated_at
CREATE TRIGGER update_company_users_updated_at
BEFORE UPDATE ON public.company_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();