# 🚀 Configuration rapide des tables NextAuth

## Option 1 : Via ligne de commande (si psql est installé)

```bash
npm run setup:nextauth
```

Le script vous demandera le mot de passe de la base de données Supabase.

**Où trouver le mot de passe :**
- Supabase Dashboard → Settings → Database → Database password

## Option 2 : Installer psql d'abord

Si `psql` n'est pas installé :

```bash
# macOS
brew install postgresql

# Ubuntu/Debian
sudo apt-get install postgresql-client

# Puis
npm run setup:nextauth
```

## Option 3 : Via SQL Editor (sans psql)

1. Allez dans **Supabase Dashboard** → **SQL Editor**
2. Cliquez sur **New query**
3. Ouvrez le fichier `supabase/migrations/001_nextauth_schema.sql`
4. Copiez tout le contenu
5. Collez dans le SQL Editor
6. Cliquez sur **Run** (ou `Cmd/Ctrl + Enter`)

## ✅ Vérification

Après avoir exécuté le script ou le SQL :

1. Allez dans **Table Editor** dans Supabase Dashboard
2. Vous devriez voir le schéma `next_auth` avec 4 tables
3. Redémarrez votre serveur : `npm run dev`
4. Testez la connexion Google OAuth

## 🆘 Problèmes

### "psql: command not found"
- Installez PostgreSQL : `brew install postgresql` (macOS)

### "password authentication failed"
- Vérifiez que le mot de passe est correct
- Le mot de passe se trouve dans Supabase Dashboard → Settings → Database

### "Connection refused" ou timeout
- Vérifiez que votre IP est autorisée dans Supabase
- Settings → Database → Connection pooling → Allowed IPs
- Ou utilisez l'option 3 (SQL Editor) qui fonctionne toujours
