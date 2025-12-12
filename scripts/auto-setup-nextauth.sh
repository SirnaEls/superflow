#!/bin/bash

# Script automatique pour créer les tables NextAuth
# Installe psql si nécessaire et exécute le SQL

set -e

echo "🔧 Configuration automatique des tables NextAuth"
echo ""

# Charger les variables d'environnement
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
fi

SUPABASE_URL="${NEXT_PUBLIC_SUPABASE_URL}"

if [ -z "$SUPABASE_URL" ]; then
  echo "❌ Erreur: NEXT_PUBLIC_SUPABASE_URL non trouvé dans .env"
  exit 1
fi

# Extraire le projet ID
PROJECT_ID=$(echo "$SUPABASE_URL" | sed -E 's|https://([^.]+)\.supabase\.co|\1|')

if [ -z "$PROJECT_ID" ]; then
  echo "❌ Erreur: Impossible d'extraire le PROJECT_ID"
  exit 1
fi

DB_HOST="db.${PROJECT_ID}.supabase.co"
DB_PORT="5432"
DB_NAME="postgres"
DB_USER="postgres"

# Vérifier si psql est installé
if ! command -v psql &> /dev/null; then
  echo "📦 Installation de PostgreSQL (psql)..."
  echo ""
  
  if command -v brew &> /dev/null; then
    brew install postgresql@14 || brew install postgresql
    # Ajouter psql au PATH si nécessaire
    export PATH="/opt/homebrew/opt/postgresql@14/bin:$PATH" || export PATH="/opt/homebrew/opt/postgresql/bin:$PATH"
  else
    echo "❌ Homebrew n'est pas installé"
    echo "   Installez psql manuellement ou utilisez le SQL Editor"
    echo "   npm run setup:nextauth"
    exit 1
  fi
fi

echo "🔐 Mot de passe de la base de données Supabase requis"
echo "   Trouvez-le dans: Supabase Dashboard → Settings → Database → Database password"
echo ""
read -sp "Entrez le mot de passe: " DB_PASSWORD
echo ""
echo ""

if [ -z "$DB_PASSWORD" ]; then
  echo "❌ Mot de passe requis"
  exit 1
fi

CONNECTION_STRING="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
SQL_FILE="supabase/migrations/001_nextauth_schema.sql"

if [ ! -f "$SQL_FILE" ]; then
  echo "❌ Fichier SQL non trouvé: $SQL_FILE"
  exit 1
fi

echo "📡 Connexion à ${DB_HOST}..."
echo "📝 Exécution du script SQL..."
echo ""

# Exécuter le SQL
export PGPASSWORD="${DB_PASSWORD}"
psql "$CONNECTION_STRING" -f "$SQL_FILE"

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
  echo "💡 Redémarrez votre serveur: npm run dev"
  echo "   Puis testez la connexion Google OAuth"
  echo ""
else
  echo ""
  echo "❌ Erreur lors de la création des tables"
  echo ""
  echo "💡 Vérifiez :"
  echo "   1. Que le mot de passe est correct"
  echo "   2. Que votre IP est autorisée dans Supabase"
  echo "   3. Ou utilisez le SQL Editor: npm run setup:nextauth"
  exit 1
fi
