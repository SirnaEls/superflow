#!/usr/bin/env node

/**
 * Script pour vérifier et corriger la configuration Google OAuth
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
const googleClientId = process.env.GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com';

console.log('\n🔍 Vérification de la configuration Google OAuth\n');
console.log('═'.repeat(60));
console.log('\n📋 Configuration actuelle :\n');
console.log(`✅ Supabase URL: ${supabaseUrl}`);
console.log(`✅ Project ID: ${projectId}`);
console.log(`✅ Callback URL Supabase: ${expectedCallbackUrl}`);
console.log(`✅ Google Client ID: ${googleClientId}\n`);

console.log('═'.repeat(60));
console.log('\n🔧 ÉTAPES DE CORRECTION (À FAIRE MAINTENANT) :\n');

console.log('1️⃣  GOOGLE CLOUD CONSOLE :\n');
console.log('   a) Allez sur : https://console.cloud.google.com/apis/credentials');
console.log(`   b) Cliquez sur votre OAuth Client ID : ${googleClientId}`);
console.log('   c) Dans la section "Authorized redirect URIs",');
console.log('      VÉRIFIEZ que cette URL est présente (copiez-collez exactement) :\n');
console.log(`      ${expectedCallbackUrl}\n`);
console.log('   d) Si elle n\'y est PAS, ajoutez-la et cliquez sur "SAVE"\n');
console.log('   e) Supprimez TOUS les autres callback URLs (surtout ceux avec localhost)\n');

console.log('═'.repeat(60));
console.log('\n2️⃣  SUPABASE DASHBOARD :\n');
console.log('   a) Allez sur : https://supabase.com/dashboard/project/' + projectId + '/auth/providers');
console.log('   b) Cliquez sur "Google" dans la liste des providers');
console.log('   c) VÉRIFIEZ que le "Callback URL" affiché est :\n');
console.log(`      ${expectedCallbackUrl}\n`);
console.log('   d) Si différent, notez-le et ajoutez-le dans Google Cloud Console\n');
console.log('   e) Vérifiez que "Client ID" et "Client Secret" sont remplis\n');
console.log('   f) Cliquez sur "Save"\n');

console.log('═'.repeat(60));
console.log('\n3️⃣  VÉRIFICATIONS FINALES :\n');
console.log('   ✅ Le callback URL dans Google Cloud Console = celui dans Supabase Dashboard');
console.log('   ✅ Aucun espace avant/après l\'URL');
console.log('   ✅ Le protocole est https:// (pas http://)');
console.log('   ✅ Pas de caractères supplémentaires\n');

console.log('═'.repeat(60));
console.log('\n⏱️  IMPORTANT :\n');
console.log('   - Attendez 1-2 minutes après avoir sauvegardé dans Google Cloud Console');
console.log('   - Les changements peuvent prendre quelques minutes à se propager\n');

console.log('═'.repeat(60));
console.log('\n🧪 TEST :\n');
console.log('   1. Redémarrez votre serveur : npm run dev');
console.log('   2. Allez sur http://localhost:3002/login');
console.log('   3. Cliquez sur "Se connecter avec Google"');
console.log('   4. Si vous voyez encore l\'erreur, vérifiez les logs Supabase :');
console.log(`      https://supabase.com/dashboard/project/${projectId}/logs/explorer\n`);

console.log('═'.repeat(60));
console.log('\n📝 URL À COPIER-COLLER DANS GOOGLE CLOUD CONSOLE :\n');
console.log(expectedCallbackUrl);
console.log('\n');
