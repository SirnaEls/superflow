# 🚀 Correction rapide de l'erreur AdapterError

## 🐛 Problème

Erreur `AdapterError` lors de la connexion Google OAuth = les tables NextAuth n'existent pas dans Supabase.

## ✅ Solution rapide (2 minutes)

### Option 1 : Via ligne de commande (si vous avez le mot de passe DB)

```bash
npm run setup:nextauth
```

Le script vous demandera le mot de passe de la base de données.

**Où trouver le mot de passe :**
- Supabase Dashboard → Settings → Database → Database password

### Option 2 : Via SQL Editor (sans mot de passe)

1. Allez dans **Supabase Dashboard** → **SQL Editor**
2. Cliquez sur **New query**
3. Copiez-collez le SQL ci-dessous
4. Cliquez sur **Run** (Cmd/Ctrl + Enter)

```sql
-- Create next_auth schema
CREATE SCHEMA IF NOT EXISTS next_auth;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS next_auth.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT,
  email TEXT UNIQUE,
  "emailVerified" TIMESTAMPTZ,
  image TEXT,
  CONSTRAINT users_email_unique UNIQUE (email)
);

-- Accounts table
CREATE TABLE IF NOT EXISTS next_auth.accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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

-- Create indexes
CREATE INDEX IF NOT EXISTS accounts_userId_idx ON next_auth.accounts("userId");
CREATE INDEX IF NOT EXISTS sessions_userId_idx ON next_auth.sessions("userId");

-- Enable RLS
ALTER TABLE next_auth.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_auth.accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_auth.sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE next_auth.verification_tokens ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Service role can do everything on users" ON next_auth.users;
DROP POLICY IF EXISTS "Service role can do everything on accounts" ON next_auth.accounts;
DROP POLICY IF EXISTS "Service role can do everything on sessions" ON next_auth.sessions;
DROP POLICY IF EXISTS "Service role can do everything on verification_tokens" ON next_auth.verification_tokens;

CREATE POLICY "Service role can do everything on users"
  ON next_auth.users FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can do everything on accounts"
  ON next_auth.accounts FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can do everything on sessions"
  ON next_auth.sessions FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE POLICY "Service role can do everything on verification_tokens"
  ON next_auth.verification_tokens FOR ALL TO service_role USING (true) WITH CHECK (true);
```

## ✅ Vérification

Après avoir exécuté le SQL :

1. Allez dans **Table Editor** dans Supabase Dashboard
2. Vous devriez voir le schéma `next_auth` avec 4 tables
3. Redémarrez votre serveur : `npm run dev`
4. Testez la connexion Google OAuth

## 🆘 Si ça ne fonctionne toujours pas

1. Vérifiez que les tables existent dans **Table Editor**
2. Vérifiez les logs Supabase dans **Logs** → **Postgres Logs**
3. Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est correct dans votre `.env`
