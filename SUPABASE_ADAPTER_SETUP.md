# 🔧 Configuration SupabaseAdapter - Résolution AdapterError

## 🐛 Problème

Erreur : **`AdapterError`** lors de la connexion Google OAuth

Cela signifie que les tables NextAuth nécessaires n'existent pas dans votre base de données Supabase.

## ✅ Solution : Créer les tables NextAuth

Le `SupabaseAdapter` nécessite un schéma `next_auth` avec plusieurs tables. Voici comment les créer :

### Option 1 : Via SQL Editor dans Supabase (Recommandé)

1. Allez dans **Supabase Dashboard** → **SQL Editor**
2. Cliquez sur **New query**
3. Copiez-collez le contenu du fichier `supabase/migrations/001_nextauth_schema.sql`
4. Cliquez sur **Run** (ou `Cmd/Ctrl + Enter`)
5. Vérifiez que les tables sont créées dans **Table Editor**

### Option 2 : Via le fichier SQL fourni

1. Ouvrez le fichier `supabase/migrations/001_nextauth_schema.sql`
2. Copiez tout le contenu
3. Allez dans Supabase Dashboard → **SQL Editor**
4. Collez et exécutez le script

## 📋 Tables créées

Le script crée :
- ✅ `next_auth.users` - Table des utilisateurs
- ✅ `next_auth.accounts` - Table des comptes OAuth (Google, etc.)
- ✅ `next_auth.sessions` - Table des sessions
- ✅ `next_auth.verification_tokens` - Table des tokens de vérification

## 🔒 Sécurité

Les tables sont configurées avec Row Level Security (RLS) et des politiques qui permettent au `service_role` d'accéder à toutes les données. C'est nécessaire pour que NextAuth fonctionne correctement.

## ✅ Vérification

Après avoir exécuté le script :

1. Allez dans **Table Editor** dans Supabase Dashboard
2. Vous devriez voir le schéma `next_auth` avec les 4 tables
3. Redémarrez votre serveur : `npm run dev`
4. Testez la connexion Google OAuth

## 🆘 Si ça ne fonctionne toujours pas

1. Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est correct dans votre `.env`
2. Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` est correct
3. Vérifiez les logs Supabase dans **Logs** → **Postgres Logs**
4. Assurez-vous que le schéma `next_auth` existe bien

## 📚 Documentation

- [NextAuth Supabase Adapter](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
- [NextAuth Database Schema](https://next-auth.js.org/v3/configuration/databases)
