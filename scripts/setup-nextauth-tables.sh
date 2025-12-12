#!/bin/bash

# Script pour créer les tables NextAuth dans Supabase via psql
# Usage: ./scripts/setup-nextauth-tables.sh [DB_PASSWORD]

set -e

# Charger les variables d'environnement
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"
DB_PASSWORD="${1:-}"

if [ -z "$SUPABASE_URL" ]; then
  echo "❌ Erreur: NEXT_PUBLIC_SUPABASE_URL non trouvé dans .env"
  exit 1
fi

# Extraire le projet ID de l'URL Supabase
# Format: https://xxxxx.supabase.co
PROJECT_ID=$(echo "$SUPABASE_URL" | sed -E 's|https://([^.]+)\.supabase\.co|\1|')

if [ -z "$PROJECT_ID" ]; then
  echo "❌ Erreur: Impossible d'extraire le PROJECT_ID de l'URL Supabase"
  exit 1
fi

# Construire la connection string PostgreSQL
DB_HOST="db.${PROJECT_ID}.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"

if [ -z "$DB_PASSWORD" ]; then
  echo "🔐 Mot de passe de la base de données Supabase requis"
  echo "   Vous pouvez le trouver dans Supabase Dashboard → Settings → Database → Database password"
  echo ""
  read -sp "Entrez le mot de passe de la DB: " DB_PASSWORD
  echo ""
fi

CONNECTION_STRING="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"

echo "🔧 Création des tables NextAuth dans Supabase..."
echo "   Host: ${DB_HOST}"
echo ""

# Vérifier si psql est installé
if ! command -v psql &> /dev/null; then
  echo "❌ psql n'est pas installé"
  echo ""
  echo "💡 Installation:"
  echo "   macOS: brew install postgresql"
  echo "   Ubuntu: sudo apt-get install postgresql-client"
  echo ""
  echo "📝 Alternative: Utilisez le SQL Editor dans Supabase Dashboard"
  echo "   1. Allez dans Supabase Dashboard → SQL Editor"
  echo "   2. Copiez le contenu de supabase/migrations/001_nextauth_schema.sql"
  echo "   3. Collez et exécutez"
  exit 1
fi

# Exécuter le script SQL
psql "$CONNECTION_STRING" -f supabase/migrations/001_nextauth_schema.sql

if [ $? -eq 0 ]; then
  echo ""
  echo "✅ Tables NextAuth créées avec succès !"
  echo ""
  echo "📋 Tables créées :"
  echo "   - next_auth.users"
  echo "   - next_auth.accounts"
  echo "   - next_auth.sessions"
  echo "   - next_auth.verification_tokens"
  echo ""
  echo "💡 Redémarrez votre serveur et testez la connexion Google OAuth"
else
  echo ""
  echo "❌ Erreur lors de la création des tables"
  exit 1
fi
