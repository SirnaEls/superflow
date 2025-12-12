#!/usr/bin/env node

/**
 * Script pour vérifier la configuration NextAuth
 */

require('dotenv').config();

const requiredVars = {
  'NEXT_PUBLIC_SUPABASE_URL': process.env.NEXT_PUBLIC_SUPABASE_URL,
  'SUPABASE_SERVICE_ROLE_KEY': process.env.SUPABASE_SERVICE_ROLE_KEY,
  'GOOGLE_CLIENT_ID': process.env.GOOGLE_CLIENT_ID,
  'GOOGLE_CLIENT_SECRET': process.env.GOOGLE_CLIENT_SECRET,
  'AUTH_SECRET': process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET,
};

console.log('\n🔍 Vérification de la configuration NextAuth...\n');

let hasErrors = false;

for (const [key, value] of Object.entries(requiredVars)) {
  if (!value || value === 'your-secret-key-change-in-production') {
    console.error(`❌ ${key}: Manquante ou invalide`);
    hasErrors = true;
  } else {
    const displayValue = key.includes('SECRET') || key.includes('KEY') 
      ? `${value.substring(0, 20)}...` 
      : value;
    console.log(`✅ ${key}: ${displayValue}`);
  }
}

console.log('');

if (hasErrors) {
  console.error('❌ Des variables d\'environnement sont manquantes !');
  console.error('');
  console.error('💡 Vérifiez votre fichier .env');
  process.exit(1);
}

// Vérifier le format des URLs
if (requiredVars.NEXT_PUBLIC_SUPABASE_URL && !requiredVars.NEXT_PUBLIC_SUPABASE_URL.startsWith('https://')) {
  console.error('❌ NEXT_PUBLIC_SUPABASE_URL doit commencer par https://');
  hasErrors = true;
}

// Vérifier le format des clés
if (requiredVars.GOOGLE_CLIENT_ID && !requiredVars.GOOGLE_CLIENT_ID.includes('.apps.googleusercontent.com')) {
  console.warn('⚠️  GOOGLE_CLIENT_ID semble avoir un format incorrect');
}

if (requiredVars.GOOGLE_CLIENT_SECRET && !requiredVars.GOOGLE_CLIENT_SECRET.startsWith('GOCSPX-')) {
  console.warn('⚠️  GOOGLE_CLIENT_SECRET semble avoir un format incorrect');
}

if (!hasErrors) {
  console.log('✅ Toutes les variables d\'environnement sont configurées !');
  console.log('');
  console.log('💡 Si vous avez toujours des erreurs :');
  console.log('   1. Redémarrez votre serveur: npm run dev');
  console.log('   2. Vérifiez que les tables NextAuth existent dans Supabase');
  console.log('   3. Vérifiez les logs du serveur pour plus de détails');
  console.log('');
}

process.exit(hasErrors ? 1 : 0);
