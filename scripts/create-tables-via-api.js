#!/usr/bin/env node

/**
 * Script pour créer les tables NextAuth directement via l'API Supabase
 * Utilise la service_role_key pour créer les tables via des requêtes REST
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error('❌ Erreur: Variables d\'environnement manquantes');
  process.exit(1);
}

// Créer un client avec service_role pour avoir les permissions complètes
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  },
  db: {
    schema: 'public'
  }
});

async function createTables() {
  console.log('\n🔧 Création des tables NextAuth dans Supabase...\n');

  try {
    // Créer le schéma next_auth
    console.log('📝 Création du schéma next_auth...');
    const { error: schemaError } = await supabase.rpc('exec_sql', {
      query: 'CREATE SCHEMA IF NOT EXISTS next_auth'
    });

    if (schemaError && !schemaError.message.includes('already exists')) {
      // Si la fonction RPC n'existe pas, on doit utiliser une autre méthode
      console.log('⚠️  La fonction RPC n\'existe pas, utilisation d\'une méthode alternative...');
    }

    // Malheureusement, Supabase ne permet pas d'exécuter du SQL arbitraire via REST
    // sans utiliser l'API Management ou psql
    
    // Solution: Utiliser l'API REST pour créer les tables une par une
    // Mais Supabase ne permet pas non plus de créer des tables via REST...
    
    // La seule vraie solution est d'utiliser psql ou le SQL Editor
    
    console.log('');
    console.log('❌ Supabase ne permet pas d\'exécuter du SQL arbitraire via REST API');
    console.log('');
    console.log('✅ Solution: Utilisez le SQL Editor dans Supabase Dashboard');
    console.log('');
    console.log('📋 Instructions:');
    console.log('   1. Allez dans Supabase Dashboard → SQL Editor');
    console.log('   2. Créez une nouvelle query');
    console.log('   3. Copiez-collez le SQL ci-dessous');
    console.log('   4. Exécutez (Cmd/Ctrl + Enter)');
    console.log('');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📄 SQL à exécuter:');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    
    const fs = require('fs');
    const path = require('path');
    const sqlFile = path.join(__dirname, '../supabase/migrations/001_nextauth_schema.sql');
    const sql = fs.readFileSync(sqlFile, 'utf8');
    console.log(sql);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('');
    
    // Essayer d'ouvrir le SQL Editor automatiquement
    const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];
    if (projectRef) {
      const sqlEditorUrl = `https://app.supabase.com/project/${projectRef}/sql/new`;
      console.log(`🔗 Ou ouvrez directement: ${sqlEditorUrl}`);
      console.log('');
      
      // Ouvrir dans le navigateur
      const { execSync } = require('child_process');
      try {
        const platform = process.platform;
        if (platform === 'darwin') {
          execSync(`open "${sqlEditorUrl}"`, { stdio: 'ignore' });
          console.log('✅ SQL Editor ouvert dans votre navigateur');
        }
      } catch (e) {
        // Ignorer les erreurs d'ouverture du navigateur
      }
    }

  } catch (error) {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  }
}

createTables();
