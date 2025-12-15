-- Create next_auth schema
CREATE SCHEMA IF NOT EXISTS next_auth;

-- Enable UUID extension (if not already enabled)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_extension WHERE extname = 'uuid-ossp') THEN
    CREATE EXTENSION "uuid-ossp";
  END IF;
END $$;

-- Users table
CREATE TABLE IF NOT EXISTS next_auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  CONSTRAINT users_email_unique UNIQUE (email)
);

-- Accounts table
CREATE TABLE IF NOT EXISTS next_auth.accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  provider TEXT NOT NULL,
  "providerAccountId" TEXT NOT NULL,
  refresh_token TEXT,
  access_token TEXT,
  expires_at BIGINT,
  token_type TEXT,
  scope TEXT,
  id_token TEXT,
  session_state TEXT,
  CONSTRAINT accounts_provider_unique UNIQUE (provider, "providerAccountId")
);

-- Sessions table
CREATE TABLE IF NOT EXISTS next_auth.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "userId" UUID NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE,
  expires TIMESTAMPTZ NOT NULL,
  "sessionToken" TEXT UNIQUE NOT NULL,
  CONSTRAINT sessions_sessionToken_unique UNIQUE ("sessionToken")
);

-- Verification tokens table
CREATE TABLE IF NOT EXISTS next_auth.verification_tokens (
  identifier TEXT NOT NULL,
  token TEXT NOT NULL,
  expires TIMESTAMPTZ NOT NULL,
  CONSTRAINT verification_tokens_token_unique UNIQUE (token),
  CONSTRAINT verification_tokens_identifier_token_unique UNIQUE (identifier, token)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS accounts_userId_idx ON next_auth.accounts("userId");
CREATE INDEX IF NOT EXISTS sessions_userId_idx ON next_auth.sessions("userId");

-- Enable Row Level Security (RLS) - Allow service role to access everything
ALTER TABLE next_auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_auth.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_auth.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_auth.verification_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies to allow service role full access
CREATE POLICY "Service role can do everything on users"
  ON next_auth.users
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on accounts"
  ON next_auth.accounts
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on sessions"
  ON next_auth.sessions
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role can do everything on verification_tokens"
  ON next_auth.verification_tokens
  FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);
