#!/usr/bin/env node

/**
 * Script pour créer les tables NextAuth dans Supabase via l'API Management
 * Nécessite un Personal Access Token (PAT) de Supabase
 * 
 * Pour générer un PAT:
 * 1. Allez sur https://app.supabase.com/account/tokens
 * 2. Cliquez sur "Generate new token"
 * 3. Copiez le token
 * 4. Exécutez: SUPABASE_ACCESS_TOKEN=votre_token node scripts/setup-nextauth-api.js
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const accessToken = process.env.SUPABASE_ACCESS_TOKEN || process.argv[2];

if (!supabaseUrl) {
  console.error('❌ Erreur: NEXT_PUBLIC_SUPABASE_URL non trouvé dans .env');
  process.exit(1);
}

if (!accessToken) {
  console.error('❌ Erreur: SUPABASE_ACCESS_TOKEN requis');
  console.error('');
  console.error('💡 Pour générer un Personal Access Token:');
  console.error('   1. Allez sur https://app.supabase.com/account/tokens');
  console.error('   2. Cliquez sur "Generate new token"');
  console.error('   3. Copiez le token');
  console.error('   4. Exécutez: SUPABASE_ACCESS_TOKEN=votre_token node scripts/setup-nextauth-api.js');
  console.error('   Ou ajoutez SUPABASE_ACCESS_TOKEN=votre_token dans votre .env');
  console.error('');
  process.exit(1);
}

const sqlFile = path.join(__dirname, '../supabase/migrations/001_nextauth_schema.sql');

if (!fs.existsSync(sqlFile)) {
  console.error(`❌ Fichier SQL non trouvé: ${sqlFile}`);
  process.exit(1);
}

const sql = fs.readFileSync(sqlFile, 'utf8');

// Extraire le project ref de l'URL
const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('❌ Impossible d\'extraire le project ref de l\'URL Supabase');
  process.exit(1);
}

async function executeSQL() {
  console.log('\n🔧 Création des tables NextAuth dans Supabase via API Management...\n');
  console.log(`📡 Project: ${projectRef}\n`);

  try {
    // Utiliser l'API Management de Supabase pour exécuter le SQL
    // Endpoint: POST https://api.supabase.com/v1/projects/{ref}/database/query
    const response = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: sql
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`❌ Erreur HTTP ${response.status}:`);
      console.error(errorText);
      
      if (response.status === 401) {
        console.error('');
        console.error('💡 Le token d\'accès est invalide ou expiré');
        console.error('   Générez un nouveau token sur https://app.supabase.com/account/tokens');
      }
      
      process.exit(1);
    }

    const result = await response.json();
    
    console.log('✅ Tables NextAuth créées avec succès !\n');
    console.log('📋 Tables créées :');
    console.log('   - next_auth.users');
    console.log('   - next_auth.accounts');
    console.log('   - next_auth.sessions');
    console.log('   - next_auth.verification_tokens');
    console.log('');
    console.log('💡 Redémarrez votre serveur: npm run dev');
    console.log('   Puis testez la connexion Google OAuth');
    console.log('');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    console.error('');
    console.error('💡 Alternative: Utilisez le SQL Editor');
    console.error(`   https://app.supabase.com/project/${projectRef}/sql/new`);
    console.error('');
    process.exit(1);
  }
}

executeSQL();
