-- Script SQL pour vérifier si les tables NextAuth existent
-- Exécutez ceci dans le SQL Editor de Supabase

-- Vérifier le schéma
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name = 'next_auth';

-- Vérifier les tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'next_auth'
ORDER BY table_name;

-- Compter les lignes dans chaque table
SELECT 
  'users' as table_name, 
  COUNT(*) as row_count 
FROM next_auth.users
UNION ALL
SELECT 
  'accounts' as table_name, 
  COUNT(*) as row_count 
FROM next_auth.accounts
UNION ALL
SELECT 
  'sessions' as table_name, 
  COUNT(*) as row_count 
FROM next_auth.sessions
UNION ALL
SELECT 
  'verification_tokens' as table_name, 
  COUNT(*) as row_count 
FROM next_auth.verification_tokens;
