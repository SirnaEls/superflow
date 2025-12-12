#!/usr/bin/env node

/**
 * Script pour créer les tables NextAuth dans Supabase via l'API REST
 * Usage: node scripts/create-nextauth-tables.js
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Erreur: Variables d\'environnement manquantes');
  console.error('   NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies');
  process.exit(1);
}

// Créer un client avec service_role pour avoir les permissions complètes
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Les commandes SQL à exécuter
const sqlCommands = [
  'CREATE SCHEMA IF NOT EXISTS next_auth',
  'CREATE EXTENSION IF NOT EXISTS "uuid-ossp"',
  `CREATE TABLE IF NOT EXISTS next_auth.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT,
    email TEXT UNIQUE,
    "emailVerified" TIMESTAMPTZ,
    image TEXT,
    CONSTRAINT users_email_unique UNIQUE (email)
  )`,
  `CREATE TABLE IF NOT EXISTS next_auth.accounts (
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
  )`,
  `CREATE TABLE IF NOT EXISTS next_auth.sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    "userId" UUID NOT NULL REFERENCES next_auth.users(id) ON DELETE CASCADE,
    expires TIMESTAMPTZ NOT NULL,
    "sessionToken" TEXT UNIQUE NOT NULL,
    CONSTRAINT sessions_sessionToken_unique UNIQUE ("sessionToken")
  )`,
  `CREATE TABLE IF NOT EXISTS next_auth.verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL,
    expires TIMESTAMPTZ NOT NULL,
    CONSTRAINT verification_tokens_token_unique UNIQUE (token),
    CONSTRAINT verification_tokens_identifier_token_unique UNIQUE (identifier, token)
  )`,
  'CREATE INDEX IF NOT EXISTS accounts_userId_idx ON next_auth.accounts("userId")',
  'CREATE INDEX IF NOT EXISTS sessions_userId_idx ON next_auth.sessions("userId")',
  'ALTER TABLE next_auth.users ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE next_auth.accounts ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE next_auth.sessions ENABLE ROW LEVEL SECURITY',
  'ALTER TABLE next_auth.verification_tokens ENABLE ROW LEVEL SECURITY',
  `DROP POLICY IF EXISTS "Service role can do everything on users" ON next_auth.users`,
  `DROP POLICY IF EXISTS "Service role can do everything on accounts" ON next_auth.accounts`,
  `DROP POLICY IF EXISTS "Service role can do everything on sessions" ON next_auth.sessions`,
  `DROP POLICY IF EXISTS "Service role can do everything on verification_tokens" ON next_auth.verification_tokens`,
  `CREATE POLICY "Service role can do everything on users"
    ON next_auth.users FOR ALL TO service_role USING (true) WITH CHECK (true)`,
  `CREATE POLICY "Service role can do everything on accounts"
    ON next_auth.accounts FOR ALL TO service_role USING (true) WITH CHECK (true)`,
  `CREATE POLICY "Service role can do everything on sessions"
    ON next_auth.sessions FOR ALL TO service_role USING (true) WITH CHECK (true)`,
  `CREATE POLICY "Service role can do everything on verification_tokens"
    ON next_auth.verification_tokens FOR ALL TO service_role USING (true) WITH CHECK (true)`
];

async function executeSQL(sql) {
  // Utiliser l'endpoint REST pour exécuter le SQL
  // Note: Supabase ne permet pas d'exécuter du SQL arbitraire via REST
  // On doit utiliser l'API Management ou psql
  // Ici, on va utiliser une approche différente : créer les tables via des requêtes REST individuelles
  
  try {
    // Pour créer les tables, on peut utiliser l'API REST directement
    // Mais Supabase ne permet pas ça facilement
    // La meilleure approche est d'utiliser l'endpoint SQL via fetch
    
    const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceRoleKey,
        'Authorization': `Bearer ${supabaseServiceRoleKey}`
      },
      body: JSON.stringify({ query: sql })
    });

    if (!response.ok) {
      // Si l'endpoint RPC n'existe pas, on essaie une autre méthode
      throw new Error(`HTTP ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    // Fallback: utiliser l'API Management de Supabase
    // Mais ça nécessite l'API Management key, pas la service_role_key
    throw error;
  }
}

async function createTables() {
  console.log('\n🔧 Création des tables NextAuth dans Supabase...\n');

  // Utiliser l'API REST de Supabase pour créer les tables
  // Malheureusement, Supabase ne permet pas d'exécuter du SQL arbitraire via REST
  // On doit utiliser psql ou le SQL Editor
  
  // Alternative: utiliser l'API Management de Supabase si disponible
  // Ou créer les tables une par une via des requêtes REST
  
  console.log('⚠️  Supabase ne permet pas d\'exécuter du SQL arbitraire via REST API');
  console.log('');
  console.log('💡 Solution: Utiliser le SQL Editor dans Supabase Dashboard');
  console.log('');
  console.log('📝 Instructions:');
  console.log('   1. Allez dans Supabase Dashboard → SQL Editor');
  console.log('   2. Créez une nouvelle query');
  console.log('   3. Copiez le contenu du fichier: supabase/migrations/001_nextauth_schema.sql');
  console.log('   4. Collez dans le SQL Editor');
  console.log('   5. Exécutez (Cmd/Ctrl + Enter)');
  console.log('');
  console.log('🔗 Ou utilisez psql si installé:');
  console.log('   npm run setup:nextauth');
  console.log('');
  
  // Essayer quand même d'utiliser l'API Supabase pour créer les tables
  // via des requêtes REST individuelles (création de tables)
  
  try {
    // Créer le schéma via une requête REST
    // Note: Ceci ne fonctionnera probablement pas car Supabase ne permet pas
    // d'exécuter du SQL arbitraire via REST
    
    console.log('🔄 Tentative de création via API...');
    
    // On ne peut pas vraiment créer des tables via REST dans Supabase
    // sans utiliser l'API Management ou psql
    
    console.log('❌ Impossible d\'exécuter du SQL via REST API');
    console.log('');
    console.log('✅ Utilisez le SQL Editor dans Supabase Dashboard (voir instructions ci-dessus)');
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

createTables();
