#!/usr/bin/env node

/**
 * Script pour exécuter le SQL directement via psql
 * Nécessite que psql soit installé et le mot de passe de la DB
 */

require('dotenv').config();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const dbPassword = process.argv[2];

if (!supabaseUrl) {
  console.error('❌ Erreur: NEXT_PUBLIC_SUPABASE_URL non trouvé');
  process.exit(1);
}

const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
if (!projectRef) {
  console.error('❌ Impossible d\'extraire le project ref');
  process.exit(1);
}

const dbHost = `db.${projectRef}.supabase.co`;
const dbPort = '5432';
const dbName = 'postgres';
const dbUser = 'postgres';

const sqlFile = path.join(__dirname, '../supabase/migrations/001_nextauth_schema.sql');

if (!fs.existsSync(sqlFile)) {
  console.error(`❌ Fichier SQL non trouvé: ${sqlFile}`);
  process.exit(1);
}

async function executeSQL() {
  console.log('\n🔧 Création des tables NextAuth...\n');

  // Vérifier psql
  let psqlPath;
  try {
    psqlPath = execSync('which psql', { encoding: 'utf8' }).trim();
  } catch {
    // Chercher dans les chemins Homebrew
    const homebrewPaths = [
      '/opt/homebrew/opt/postgresql@14/bin/psql',
      '/opt/homebrew/opt/postgresql/bin/psql',
      '/usr/local/bin/psql'
    ];
    
    for (const p of homebrewPaths) {
      if (fs.existsSync(p)) {
        psqlPath = p;
        break;
      }
    }
  }

  if (!psqlPath) {
    console.error('❌ psql n\'est pas installé');
    console.error('');
    console.error('💡 Installez PostgreSQL:');
    console.error('   brew install postgresql');
    console.error('');
    console.error('📝 Ou utilisez le SQL Editor:');
    console.error(`   https://app.supabase.com/project/${projectRef}/sql/new`);
    process.exit(1);
  }

  let password = dbPassword;
  
  if (!password) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    console.log('🔐 Mot de passe de la base de données Supabase requis');
    console.log('   Trouvez-le dans: Supabase Dashboard → Settings → Database → Database password');
    console.log('');
    
    password = await new Promise((resolve) => {
      rl.question('Entrez le mot de passe: ', (answer) => {
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
  console.log('📝 Exécution du script SQL...\n');

  try {
    execSync(`${psqlPath} "${connectionString}" -f "${sqlFile}"`, {
      stdio: 'inherit',
      env: { ...process.env, PGPASSWORD: password }
    });

    console.log('\n✅ Tables NextAuth créées avec succès !\n');
    console.log('📋 Tables créées :');
    console.log('   - next_auth.users');
    console.log('   - next_auth.accounts');
    console.log('   - next_auth.sessions');
    console.log('   - next_auth.verification_tokens\n');
    console.log('💡 Redémarrez votre serveur: npm run dev\n');

  } catch (error) {
    console.error('\n❌ Erreur lors de la création des tables');
    console.error('');
    console.error('💡 Vérifiez :');
    console.error('   1. Que le mot de passe est correct');
    console.error('   2. Que votre IP est autorisée dans Supabase');
    console.error('      Settings → Database → Connection pooling → Allowed IPs');
    console.error('   3. Ou utilisez le SQL Editor:');
    console.error(`      https://app.supabase.com/project/${projectRef}/sql/new`);
    console.error('');
    process.exit(1);
  }
}

executeSQL();
