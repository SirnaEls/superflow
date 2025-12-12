#!/usr/bin/env node

/**
 * Script pour ouvrir le SQL Editor de Supabase avec le SQL pré-rempli
 * Usage: node scripts/open-sql-editor.js
 */

require('dotenv').config();
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!supabaseUrl) {
  console.error('❌ Erreur: NEXT_PUBLIC_SUPABASE_URL non trouvé dans .env');
  process.exit(1);
}

const projectRef = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1];

if (!projectRef) {
  console.error('❌ Impossible d\'extraire le project ref');
  process.exit(1);
}

const sqlFile = path.join(__dirname, '../supabase/migrations/001_nextauth_schema.sql');

if (!fs.existsSync(sqlFile)) {
  console.error(`❌ Fichier SQL non trouvé: ${sqlFile}`);
  process.exit(1);
}

const sql = fs.readFileSync(sqlFile, 'utf8');

// URL du SQL Editor
const sqlEditorUrl = `https://app.supabase.com/project/${projectRef}/sql/new`;

console.log('\n🔧 Configuration des tables NextAuth\n');
console.log('📋 Instructions:');
console.log('   1. Le SQL Editor va s\'ouvrir dans votre navigateur');
console.log('   2. Copiez le SQL ci-dessous');
console.log('   3. Collez dans l\'éditeur');
console.log('   4. Cliquez sur "Run" (Cmd/Ctrl + Enter)');
console.log('');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📄 SQL à exécuter:');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log(sql);
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('');

// Ouvrir le navigateur
try {
  const platform = process.platform;
  let command;
  
  if (platform === 'darwin') {
    command = `open "${sqlEditorUrl}"`;
  } else if (platform === 'win32') {
    command = `start "${sqlEditorUrl}"`;
  } else {
    command = `xdg-open "${sqlEditorUrl}"`;
  }
  
  execSync(command, { stdio: 'ignore' });
  console.log('✅ SQL Editor ouvert dans votre navigateur');
  console.log('');
} catch (error) {
  console.log(`💡 Ouvrez manuellement: ${sqlEditorUrl}`);
  console.log('');
}
