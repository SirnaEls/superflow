#!/usr/bin/env node

/**
 * Script pour créer les tables NextAuth dans Supabase
 * Utilise l'API Supabase Management pour exécuter le SQL directement
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Erreur: Variables d\'environnement manquantes');
  console.error('   NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY doivent être définies');
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
  console.log('\n🔧 Création des tables NextAuth dans Supabase...\n');
  console.log(`📡 Connexion à ${projectRef}.supabase.co...\n`);

  try {
    // Utiliser l'API Management de Supabase
    // Note: L'API Management nécessite une clé API Management, pas la service_role_key
    // Mais on peut essayer d'utiliser l'endpoint SQL directement
    
    // Diviser le SQL en commandes individuelles
    const commands = sql
      .split(';')
      .map(cmd => cmd.trim())
      .filter(cmd => cmd.length > 0 && !cmd.startsWith('--'));

    console.log(`📝 Exécution de ${commands.length} commandes SQL...\n`);

    // Malheureusement, Supabase ne permet pas d'exécuter du SQL arbitraire via REST
    // sans utiliser l'API Management (qui nécessite une clé différente)
    // ou psql
    
    // Solution: Utiliser le SQL Editor ou psql
    console.log('⚠️  Supabase ne permet pas d\'exécuter du SQL arbitraire via REST API');
    console.log('');
    console.log('💡 Solution recommandée: Utiliser le SQL Editor');
    console.log('');
    console.log('📋 Instructions rapides:');
    console.log('   1. Ouvrez: https://app.supabase.com/project/' + projectRef + '/sql/new');
    console.log('   2. Copiez le contenu de: ' + sqlFile);
    console.log('   3. Collez dans l\'éditeur');
    console.log('   4. Cliquez sur "Run" (Cmd/Ctrl + Enter)');
    console.log('');
    console.log('🔗 Ou utilisez psql:');
    console.log('   brew install postgresql');
    console.log('   npm run setup:nextauth');
    console.log('');
    
    // Afficher le SQL pour faciliter le copier-coller
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📄 SQL à exécuter (copiez-collez dans le SQL Editor):');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(sql);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

executeSQL();
