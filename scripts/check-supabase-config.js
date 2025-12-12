#!/usr/bin/env node

/**
 * Script de vérification des clés Supabase
 * Usage: node scripts/check-supabase-config.js
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');

// Lire le fichier .env
let envContent = '';
try {
  envContent = fs.readFileSync(envPath, 'utf8');
} catch (error) {
  console.error('❌ Erreur: Impossible de lire le fichier .env');
  process.exit(1);
}

// Extraire les variables
const getEnvVar = (name) => {
  const match = envContent.match(new RegExp(`^${name}=(.+)$`, 'm'));
  return match ? match[1].trim() : null;
};

const supabaseUrl = getEnvVar('NEXT_PUBLIC_SUPABASE_URL');
const supabaseAnonKey = getEnvVar('NEXT_PUBLIC_SUPABASE_ANON_KEY');
const supabaseServiceRoleKey = getEnvVar('SUPABASE_SERVICE_ROLE_KEY');

console.log('\n🔍 Vérification des clés Supabase...\n');

let hasErrors = false;

// Vérifier NEXT_PUBLIC_SUPABASE_URL
if (!supabaseUrl) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL: Manquante');
  hasErrors = true;
} else if (supabaseUrl.startsWith('postgresql://')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL: Format incorrect !');
  console.error('   Vous avez mis une URL PostgreSQL au lieu de l\'URL HTTPS de l\'API');
  console.error(`   Valeur actuelle: ${supabaseUrl.substring(0, 50)}...`);
  console.error('   Format attendu: https://xxxxxxxxxxxxx.supabase.co');
  console.error('   Où trouver: Supabase Dashboard → Settings → API → Project URL');
  hasErrors = true;
} else if (!supabaseUrl.startsWith('https://')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL: Doit commencer par https://');
  console.error(`   Valeur actuelle: ${supabaseUrl}`);
  hasErrors = true;
} else if (!supabaseUrl.includes('.supabase.co')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL: Format suspect');
  console.error(`   Valeur actuelle: ${supabaseUrl}`);
  console.error('   Format attendu: https://xxxxxxxxxxxxx.supabase.co');
  hasErrors = true;
} else {
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL: Format correct');
  console.log(`   ${supabaseUrl}`);
}

// Vérifier NEXT_PUBLIC_SUPABASE_ANON_KEY
if (!supabaseAnonKey) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY: Manquante');
  hasErrors = true;
} else if (!supabaseAnonKey.startsWith('eyJ')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY: Format incorrect');
  console.error('   Format attendu: JWT token commençant par eyJ...');
  console.error(`   Valeur actuelle: ${supabaseAnonKey.substring(0, 30)}...`);
  hasErrors = true;
} else {
  console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY: Format correct');
  console.log(`   ${supabaseAnonKey.substring(0, 30)}...`);
}

// Vérifier SUPABASE_SERVICE_ROLE_KEY
if (!supabaseServiceRoleKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY: Manquante');
  hasErrors = true;
} else if (!supabaseServiceRoleKey.startsWith('eyJ')) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY: Format incorrect');
  console.error('   Format attendu: JWT token commençant par eyJ...');
  console.error(`   Valeur actuelle: ${supabaseServiceRoleKey.substring(0, 30)}...`);
  hasErrors = true;
} else {
  console.log('✅ SUPABASE_SERVICE_ROLE_KEY: Format correct');
  console.log(`   ${supabaseServiceRoleKey.substring(0, 30)}...`);
}

console.log('\n' + '='.repeat(60));

if (hasErrors) {
  console.log('\n❌ Des erreurs ont été détectées !');
  console.log('\n📝 Comment corriger :');
  console.log('1. Allez dans Supabase Dashboard → Settings → API');
  console.log('2. Copiez la "Project URL" (commence par https://)');
  console.log('3. Remplacez NEXT_PUBLIC_SUPABASE_URL dans votre .env');
  console.log('4. Assurez-vous que les autres clés sont correctes\n');
  process.exit(1);
} else {
  console.log('\n✅ Toutes les clés Supabase sont correctement configurées !');
  console.log('\n💡 Prochaines étapes :');
  console.log('1. Activez Google OAuth dans Supabase Dashboard → Authentication → Providers');
  console.log('2. Configurez les URLs autorisées dans Authentication → URL Configuration');
  console.log('3. Redémarrez votre serveur: npm run dev\n');
  process.exit(0);
}
