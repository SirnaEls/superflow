# 🚀 Déploiement sur Netlify

Guide pour déployer FlowForge sur Netlify.

## 📋 Prérequis

1. ✅ Compte Netlify (gratuit sur [netlify.com](https://netlify.com))
2. ✅ Repository Git (GitHub, GitLab, ou Bitbucket)
3. ✅ Variables d'environnement configurées

## 🔧 Étape 1 : Préparer le repository

1. **Pousser votre code sur Git** :
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

## 🌐 Étape 2 : Déployer sur Netlify

### Option A : Via Netlify Dashboard (Recommandé)

1. Allez sur [app.netlify.com](https://app.netlify.com)
2. Cliquez sur **"Add new site"** → **"Import an existing project"**
3. Connectez votre repository Git (GitHub/GitLab/Bitbucket)
4. Sélectionnez votre repository `flowforge`
5. Netlify détectera automatiquement Next.js
6. Configurez les paramètres :
   - **Build command** : `npm run build`
   - **Publish directory** : `.next` (Netlify le gère automatiquement avec le plugin Next.js)
7. Cliquez sur **"Deploy site"**

### Option B : Via Netlify CLI

1. **Installer Netlify CLI** :
   ```bash
   npm install -g netlify-cli
   ```

2. **Se connecter** :
   ```bash
   netlify login
   ```

3. **Initialiser le site** :
   ```bash
   netlify init
   ```
   - Choisissez "Create & configure a new site"
   - Sélectionnez votre équipe
   - Donnez un nom au site (ou laissez Netlify en générer un)

4. **Déployer** :
   ```bash
   netlify deploy --prod
   ```

## 🔐 Étape 3 : Configurer les variables d'environnement

Dans Netlify Dashboard :

1. Allez dans **Site settings** → **Environment variables**
2. Ajoutez toutes vos variables d'environnement :

### Variables Supabase
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Variables Stripe
```
STRIPE_SECRET_KEY=sk_live_xxxxx  # ⚠️ Utilisez les clés LIVE en production
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # Secret du webhook de production
NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER=price_xxxxx
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_xxxxx
```

### Variables Anthropic (AI)
```
ANTHROPIC_API_KEY=sk-ant-api03-xxxxx
```

### Variables NextAuth
```
AUTH_SECRET=your_auth_secret
NEXTAUTH_SECRET=your_nextauth_secret
```

### URL de l'application
```
NEXT_PUBLIC_APP_URL=https://votre-site.netlify.app
```

## 🔔 Étape 4 : Configurer le webhook Stripe en production

1. Allez dans **Stripe Dashboard** → **Developers** → **Webhooks**
2. Cliquez sur **Add endpoint**
3. Entrez l'URL : `https://votre-site.netlify.app/api/stripe/webhook`
4. Sélectionnez les événements :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copiez le **Signing secret** (`whsec_...`)
6. Ajoutez-le dans Netlify comme `STRIPE_WEBHOOK_SECRET`

## 🔄 Étape 5 : Configurer les redirects Supabase

Dans **Supabase Dashboard** → **Authentication** → **URL Configuration** :

1. Ajoutez votre URL Netlify dans **Redirect URLs** :
   ```
   https://votre-site.netlify.app/auth/callback
   https://votre-site.netlify.app/auth/supabase-callback
   ```

2. Mettez à jour **Site URL** :
   ```
   https://votre-site.netlify.app
   ```

## ✅ Vérification

Après le déploiement :

1. **Testez l'authentification** :
   - Allez sur `https://votre-site.netlify.app/login`
   - Connectez-vous avec Google

2. **Testez le paiement** :
   - Allez sur `https://votre-site.netlify.app/upgrade`
   - Testez un checkout (utilisez les cartes de test Stripe)

3. **Vérifiez les webhooks** :
   - Dans Stripe Dashboard → **Webhooks** → **Logs**
   - Vérifiez que les événements sont bien reçus

## 🐛 Dépannage

### Le build échoue

- Vérifiez les logs dans Netlify Dashboard → **Deploys**
- Assurez-vous que toutes les variables d'environnement sont configurées
- Vérifiez que `NODE_VERSION` est bien défini (20)

### Les webhooks ne fonctionnent pas

- Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct
- Vérifiez que l'URL du webhook dans Stripe correspond à votre URL Netlify
- Vérifiez les logs dans Netlify Dashboard → **Functions** → **Logs**

### L'authentification ne fonctionne pas

- Vérifiez que les URLs de redirection sont bien configurées dans Supabase
- Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont corrects

## 📚 Ressources

- [Documentation Netlify Next.js](https://docs.netlify.com/integrations/frameworks/next-js/)
- [Netlify Environment Variables](https://docs.netlify.com/environment-variables/overview/)

