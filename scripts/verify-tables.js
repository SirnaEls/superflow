#!/usr/bin/env node

/**
 * Script pour vérifier si les tables NextAuth existent dans Supabase
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Erreur: Variables d\'environnement manquantes');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function verifyTables() {
  console.log('\n🔍 Vérification des tables NextAuth...\n');

  try {
    // Vérifier si le schéma existe
    const { data: schemas, error: schemaError } = await supabase
      .from('information_schema.schemata')
      .select('schema_name')
      .eq('schema_name', 'next_auth');

    if (schemaError) {
      // Essayer une autre méthode
      console.log('⚠️  Impossible de vérifier via information_schema, utilisation d\'une autre méthode...\n');
    }

    // Vérifier les tables directement
    const tables = ['users', 'accounts', 'sessions', 'verification_tokens'];
    const results = {};

    for (const table of tables) {
      try {
        // Essayer de compter les lignes dans chaque table
        const { count, error } = await supabase
          .from(`next_auth.${table}`)
          .select('*', { count: 'exact', head: true });

        if (error) {
          if (error.message.includes('does not exist') || error.code === '42P01') {
            results[table] = '❌ N\'existe pas';
          } else {
            results[table] = `⚠️  Erreur: ${error.message}`;
          }
        } else {
          results[table] = `✅ Existe (${count || 0} lignes)`;
        }
      } catch (err) {
        results[table] = `❌ Erreur: ${err.message}`;
      }
    }

    console.log('📋 Résultats:');
    console.log('');
    for (const [table, status] of Object.entries(results)) {
      console.log(`   ${table}: ${status}`);
    }
    console.log('');

    // Vérifier dans Table Editor
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    console.log('💡 Pour voir les tables dans Table Editor:');
    console.log(`   1. Allez dans: https://app.supabase.com/project/${projectRef}/editor`);
    console.log('   2. Dans le sélecteur de schéma (en haut à gauche), sélectionnez "next_auth"');
    console.log('   3. Vous devriez voir les 4 tables');
    console.log('');

    // Si toutes les tables existent
    const allExist = Object.values(results).every(r => r.includes('✅'));
    
    if (allExist) {
      console.log('✅ Toutes les tables existent !');
      console.log('💡 Redémarrez votre serveur: npm run dev');
      console.log('   Puis testez la connexion Google OAuth');
    } else {
      console.log('❌ Certaines tables manquent');
      console.log('');
      console.log('📝 Ré-exécutez le SQL dans le SQL Editor');
      console.log(`   https://app.supabase.com/project/${projectRef}/sql/new`);
    }
    console.log('');

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

verifyTables();
