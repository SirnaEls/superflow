#!/usr/bin/env node

/**
 * Script pour vérifier la configuration OAuth Google/Supabase
 */

require('dotenv').config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL non trouvé dans .env');
  process.exit(1);
}

// Extraire le PROJECT_ID
const match = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/);
const projectId = match ? match[1] : null;

if (!projectId) {
  console.error('❌ Format d\'URL Supabase invalide');
  process.exit(1);
}

const expectedCallbackUrl = `${supabaseUrl}/auth/v1/callback`;

console.log('\n🔍 Configuration OAuth Google/Supabase\n');
console.log('📋 Informations de configuration :\n');
console.log(`✅ Supabase URL: ${supabaseUrl}`);
console.log(`✅ Project ID: ${projectId}`);
console.log(`✅ Callback URL attendu: ${expectedCallbackUrl}\n`);

console.log('📝 Vérifications à faire dans Google Cloud Console :\n');
console.log('1. Allez sur https://console.cloud.google.com/');
console.log('2. APIs & Services → Credentials');
console.log('3. Cliquez sur votre OAuth Client ID');
console.log(`4. Vérifiez que dans "Authorized redirect URIs" vous avez EXACTEMENT :`);
console.log(`   ${expectedCallbackUrl}\n`);
console.log('5. Si ce n\'est pas le cas, ajoutez cette URL et sauvegardez\n');

console.log('📝 Vérifications à faire dans Supabase Dashboard :\n');
console.log('1. Allez dans Authentication → Providers → Google');
console.log(`2. Vérifiez que le "Callback URL" affiché est :`);
console.log(`   ${expectedCallbackUrl}\n`);
console.log('3. Si différent, copiez exactement celui affiché et ajoutez-le dans Google Cloud Console\n');

console.log('⚠️  IMPORTANT :');
console.log('   - Le callback URL doit être EXACTEMENT le même dans les deux endroits');
console.log('   - Pas d\'espaces, pas de caractères supplémentaires');
console.log('   - Le protocole doit être https:// (pas http://)');
console.log('   - Attendez 1-2 minutes après modification dans Google Cloud Console\n');
