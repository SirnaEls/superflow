#!/usr/bin/env node

/**
 * Script pour générer DATABASE_URL depuis les variables Supabase
 * Usage: node scripts/setup-database-url.js [DB_PASSWORD]
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function setupDatabaseUrl() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  if (!supabaseUrl) {
    console.error('❌ NEXT_PUBLIC_SUPABASE_URL non trouvé dans .env');
    process.exit(1);
  }

  // Extraire le PROJECT_ID de l'URL Supabase
  // Format: https://xxxxx.supabase.co
  const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
  if (!match) {
    console.error('❌ Format d\'URL Supabase invalide');
    process.exit(1);
  }

  const projectId = match[1];
  const dbPassword = process.argv[2];

  let password = dbPassword;
  
  if (!password) {
    console.log('\n🔐 Mot de passe de la base de données Supabase requis');
    console.log('   Vous pouvez le trouver dans Supabase Dashboard → Settings → Database → Database password');
    console.log('');
    password = await question('Entrez le mot de passe de la DB: ');
  }

  // Construire la DATABASE_URL
  const databaseUrl = `postgresql://postgres:${password}@db.${projectId}.supabase.co:5432/postgres?schema=next_auth`;

  // Lire le fichier .env
  const envPath = path.join(process.cwd(), '.env');
  let envContent = '';

  if (fs.existsSync(envPath)) {
    envContent = fs.readFileSync(envPath, 'utf8');
  }

  // Vérifier si DATABASE_URL existe déjà
  if (envContent.includes('DATABASE_URL=')) {
    // Remplacer la ligne existante
    envContent = envContent.replace(
      /DATABASE_URL=.*/g,
      `DATABASE_URL="${databaseUrl}"`
    );
  } else {
    // Ajouter à la fin
    envContent += `\n# Prisma Database URL\nDATABASE_URL="${databaseUrl}"\n`;
  }

  // Écrire le fichier .env
  fs.writeFileSync(envPath, envContent);

  console.log('\n✅ DATABASE_URL ajouté dans .env');
  console.log('\n💡 Prochaines étapes :');
  console.log('   1. npm run db:generate');
  console.log('   2. npm run db:migrate (ou exécutez le SQL dans Supabase)');
  console.log('   3. npm run dev');
  console.log('');

  rl.close();
}

setupDatabaseUrl().catch(error => {
  console.error('❌ Erreur:', error);
  rl.close();
  process.exit(1);
});
