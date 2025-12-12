#!/usr/bin/env node

/**
 * Script pour créer les tables NextAuth dans Supabase
 * Usage: node scripts/setup-nextauth-tables.js [DB_PASSWORD]
 */

require('dotenv').config();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const dbPassword = process.argv[2];

if (!supabaseUrl) {
  console.error('❌ Erreur: NEXT_PUBLIC_SUPABASE_URL non trouvé dans .env');
  process.exit(1);
}

// Extraire le projet ID
const projectId = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectId) {
  console.error('❌ Erreur: Impossible d\'extraire le PROJECT_ID de l\'URL Supabase');
  process.exit(1);
}

const dbHost = `db.${projectId}.supabase.co`;
const dbPort = '5432';
const dbName = 'postgres';
const dbUser = 'postgres';

const sqlFile = path.join(__dirname, '../supabase/migrations/001_nextauth_schema.sql');

if (!fs.existsSync(sqlFile)) {
  console.error(`❌ Erreur: Fichier SQL non trouvé: ${sqlFile}`);
  process.exit(1);
}

// Vérifier si psql est disponible
function checkPsql() {
  try {
    execSync('which psql', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

async function setupTables() {
  console.log('\n🔧 Configuration des tables NextAuth dans Supabase...\n');

  if (!checkPsql()) {
    console.log('⚠️  psql n\'est pas installé');
    console.log('');
    console.log('💡 Option 1: Installer psql');
    console.log('   macOS: brew install postgresql');
    console.log('   Ubuntu: sudo apt-get install postgresql-client');
    console.log('');
    console.log('💡 Option 2: Utiliser le SQL Editor dans Supabase Dashboard');
    console.log('   1. Allez dans Supabase Dashboard → SQL Editor');
    console.log('   2. Créez une nouvelle query');
    console.log(`   3. Copiez le contenu de: ${sqlFile}`);
    console.log('   4. Collez et exécutez (Cmd/Ctrl + Enter)');
    console.log('');
    process.exit(1);
  }

  let password = dbPassword;
  
  if (!password) {
    console.log('🔐 Mot de passe de la base de données Supabase requis');
    console.log('   Vous pouvez le trouver dans:');
    console.log('   Supabase Dashboard → Settings → Database → Database password');
    console.log('');
    
    // Essayer de lire depuis stdin (non-interactif)
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    password = await new Promise((resolve) => {
      rl.question('Entrez le mot de passe de la DB: ', (answer) => {
        rl.close();
        resolve(answer);
      });
    });
  }

  if (!password) {
    console.error('❌ Mot de passe requis');
    process.exit(1);
  }

  const connectionString = `postgresql://${dbUser}:${password}@${dbHost}:${dbPort}/${dbName}`;

  console.log(`📡 Connexion à ${dbHost}...`);
  console.log('');

  try {
    // Exécuter le script SQL
    execSync(`psql "${connectionString}" -f "${sqlFile}"`, {
      stdio: 'inherit',
      env: { ...process.env, PGPASSWORD: password }
    });

    console.log('');
    console.log('✅ Tables NextAuth créées avec succès !');
    console.log('');
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
    console.error('');
    console.error('❌ Erreur lors de la création des tables');
    console.error('');
    console.error('💡 Vérifiez :');
    console.error('   1. Que le mot de passe est correct');
    console.error('   2. Que votre IP est autorisée dans Supabase (Settings → Database → Connection pooling)');
    console.error('   3. Ou utilisez le SQL Editor dans Supabase Dashboard');
    console.error('');
    process.exit(1);
  }
}

setupTables();
