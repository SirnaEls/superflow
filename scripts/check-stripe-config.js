#!/usr/bin/env node

/**
 * Script de vérification de la configuration Stripe
 * Usage: node scripts/check-stripe-config.js
 */

const fs = require('fs');
const path = require('path');

const envPath = path.join(process.cwd(), '.env');
const envExamplePath = path.join(process.cwd(), '.env.example');

console.log('🔍 Vérification de la configuration Stripe...\n');

// Vérifier si .env existe
if (!fs.existsSync(envPath)) {
  console.log('❌ Le fichier .env n\'existe pas!\n');
  console.log('📝 Création du fichier .env à partir de .env.example...\n');
  
  if (fs.existsSync(envExamplePath)) {
    const exampleContent = fs.readFileSync(envExamplePath, 'utf-8');
    fs.writeFileSync(envPath, exampleContent);
    console.log('✅ Fichier .env créé!\n');
    console.log('⚠️  IMPORTANT: Modifiez le fichier .env avec vos vraies clés Stripe!\n');
  } else {
    console.log('❌ Le fichier .env.example n\'existe pas non plus!\n');
    process.exit(1);
  }
}

// Lire le fichier .env
const envContent = fs.readFileSync(envPath, 'utf-8');
const envVars = {};

envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key && valueParts.length > 0) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

// Variables Stripe requises
const requiredVars = {
  'STRIPE_SECRET_KEY': {
    pattern: /^sk_(test|live)_/,
    description: 'Clé secrète Stripe (commence par sk_test_ ou sk_live_)'
  },
  'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY': {
    pattern: /^pk_(test|live)_/,
    description: 'Clé publique Stripe (commence par pk_test_ ou pk_live_)'
  },
  'STRIPE_WEBHOOK_SECRET': {
    pattern: /^whsec_/,
    description: 'Secret du webhook Stripe (commence par whsec_)'
  },
  'NEXT_PUBLIC_STRIPE_PRICE_ID': {
    pattern: /^price_/,
    description: 'ID du prix Stripe (commence par price_)'
  },
  'NEXT_PUBLIC_APP_URL': {
    pattern: /^https?:\/\//,
    description: 'URL de l\'application (commence par http:// ou https://)'
  },
  'AUTH_SECRET': {
    pattern: /.+/,
    description: 'Secret NextAuth (peut être n\'importe quelle chaîne)'
  }
};

let allValid = true;
const results = [];

console.log('📋 Vérification des variables d\'environnement:\n');

Object.entries(requiredVars).forEach(([key, config]) => {
  const value = envVars[key];
  
  if (!value || value.includes('your_') || value.includes('_here')) {
    console.log(`❌ ${key}`);
    console.log(`   Manquant ou non configuré`);
    console.log(`   ${config.description}\n`);
    allValid = false;
    results.push({ key, status: 'missing', value });
  } else if (config.pattern && !config.pattern.test(value)) {
    console.log(`⚠️  ${key}`);
    console.log(`   Format invalide: ${value.substring(0, 20)}...`);
    console.log(`   ${config.description}\n`);
    allValid = false;
    results.push({ key, status: 'invalid', value });
  } else {
    console.log(`✅ ${key}`);
    console.log(`   Configuré correctement\n`);
    results.push({ key, status: 'ok', value: value.substring(0, 20) + '...' });
  }
});

console.log('\n' + '='.repeat(50) + '\n');

if (allValid) {
  console.log('✅ Toutes les variables Stripe sont configurées correctement!\n');
  console.log('🚀 Vous pouvez maintenant démarrer votre serveur avec: npm run dev\n');
} else {
  console.log('❌ Certaines variables ne sont pas correctement configurées.\n');
  console.log('📖 Consultez STRIPE_CONFIGURATION.md pour plus d\'informations.\n');
  console.log('💡 Étapes rapides:');
  console.log('   1. Allez sur https://dashboard.stripe.com/apikeys');
  console.log('   2. Copiez vos clés API');
  console.log('   3. Créez un produit et récupérez le Price ID');
  console.log('   4. Configurez le webhook avec Stripe CLI');
  console.log('   5. Mettez à jour votre fichier .env\n');
  process.exit(1);
}
