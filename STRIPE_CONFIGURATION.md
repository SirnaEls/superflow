# 🔑 Configuration Stripe - Guide Rapide

## 📋 Étape 1 : Créer un compte Stripe

1. Allez sur [https://stripe.com](https://stripe.com)
2. Créez un compte (gratuit)
3. Connectez-vous au [Dashboard Stripe](https://dashboard.stripe.com)

## 🔐 Étape 2 : Récupérer vos clés API

1. Dans le Dashboard Stripe, allez dans **Developers** → **API keys**
2. Vous verrez deux clés :
   - **Publishable key** (commence par `pk_test_` ou `pk_live_`)
   - **Secret key** (commence par `sk_test_` ou `sk_live_`)
3. **Important** : Utilisez les clés de **test** pour le développement
4. Cliquez sur **Reveal test key** pour voir votre clé secrète

## 💳 Étape 3 : Créer un produit et un prix

1. Dans le Dashboard Stripe, allez dans **Products**
2. Cliquez sur **Add product**
3. Remplissez les informations :
   - **Name** : FlowForge Pro (ou le nom que vous voulez)
   - **Description** : Abonnement Pro pour FlowForge
4. Dans la section **Pricing**, choisissez :
   - **Recurring** (abonnement récurrent)
   - **Billing period** : Monthly ou Yearly
   - **Price** : Le montant (ex: 9.99 pour 9,99€)
5. Cliquez sur **Save product**
6. **Copiez le Price ID** (commence par `price_...`)

## 🔔 Étape 4 : Configurer le Webhook (pour le développement local)

### Option A : Utiliser Stripe CLI (Recommandé pour le développement)

1. **Installer Stripe CLI** :
   ```bash
   # macOS
   brew install stripe/stripe-cli/stripe
   
   # Ou téléchargez depuis: https://stripe.com/docs/stripe-cli
   ```

2. **Se connecter** :
   ```bash
   stripe login
   ```

3. **Démarrer le forwarding des webhooks** :
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. **Copier le webhook secret** affiché dans le terminal (commence par `whsec_...`)

### Option B : Configurer dans le Dashboard (pour la production)

1. Dans le Dashboard Stripe, allez dans **Developers** → **Webhooks**
2. Cliquez sur **Add endpoint**
3. URL de l'endpoint :
   - **Production** : `https://votredomaine.com/api/stripe/webhook`
   - **Local** : Utilisez Stripe CLI (Option A)
4. Sélectionnez les événements :
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Cliquez sur **Add endpoint**
6. **Copiez le Signing secret** (commence par `whsec_...`)

## ⚙️ Étape 5 : Configurer le fichier .env

1. **Créez un fichier `.env`** à la racine du projet (à côté de `.env.example`)

2. **Copiez le contenu de `.env.example`** dans `.env`

3. **Remplissez les valeurs Stripe** :

```env
# Stripe Secret Key (votre clé secrète)
STRIPE_SECRET_KEY=sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890

# Stripe Publishable Key (votre clé publique)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890

# Stripe Webhook Secret (depuis Stripe CLI ou Dashboard)
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdefghijklmnopqrstuvwxyz

# Stripe Price ID (depuis votre produit créé)
NEXT_PUBLIC_STRIPE_PRICE_ID=price_1234567890abcdefghijklmnop

# URL de l'application
NEXT_PUBLIC_APP_URL=http://localhost:3000

# NextAuth Secret (générez-en un nouveau)
AUTH_SECRET=votre_secret_aleatoire_ici
NEXTAUTH_SECRET=votre_secret_aleatoire_ici
```

## 🎯 Étape 6 : Générer un secret NextAuth

Générez un secret aléatoire pour NextAuth :

```bash
# Option 1 : Avec OpenSSL
openssl rand -base64 32

# Option 2 : En ligne
# Allez sur: https://generate-secret.vercel.app/32
```

Copiez le résultat dans `AUTH_SECRET` et `NEXTAUTH_SECRET` dans votre fichier `.env`.

## ✅ Étape 7 : Vérifier la configuration

1. **Redémarrez votre serveur de développement** :
   ```bash
   npm run dev
   ```

2. **Vérifiez que tout fonctionne** :
   - Allez sur la page de compte (`/account`)
   - Cliquez sur l'onglet "Subscription"
   - Le bouton "Upgrade to Pro" devrait être visible

## 🧪 Tester avec une carte de test

Stripe fournit des cartes de test pour tester les paiements :

- **Carte réussie** : `4242 4242 4242 4242`
- **Date d'expiration** : N'importe quelle date future (ex: 12/34)
- **CVC** : N'importe quel code à 3 chiffres (ex: 123)
- **Code postal** : N'importe quel code postal (ex: 12345)

## 📝 Checklist de configuration

- [ ] Compte Stripe créé
- [ ] Clés API récupérées (Publishable et Secret)
- [ ] Produit et prix créés dans Stripe
- [ ] Price ID copié
- [ ] Webhook configuré (Stripe CLI pour dev)
- [ ] Webhook secret copié
- [ ] Fichier `.env` créé avec toutes les variables
- [ ] Secret NextAuth généré
- [ ] Serveur redémarré
- [ ] Test effectué avec une carte de test

## 🚀 Pour la production

Quand vous déployez en production :

1. **Basculez vers les clés LIVE** dans votre `.env` de production
2. **Mettez à jour** `NEXT_PUBLIC_APP_URL` avec votre domaine
3. **Configurez le webhook** dans le Dashboard Stripe avec votre URL de production
4. **Testez** avec de petits montants réels d'abord

## 🆘 Problèmes courants

### "Stripe not configured"
- Vérifiez que toutes les variables sont dans votre `.env`
- Redémarrez le serveur après avoir modifié `.env`

### "Webhook signature verification failed"
- Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct
- Si vous utilisez Stripe CLI, utilisez le secret affiché dans le terminal

### "Price ID not found"
- Vérifiez que `NEXT_PUBLIC_STRIPE_PRICE_ID` commence par `price_`
- Assurez-vous que le prix existe dans votre compte Stripe

## 📚 Ressources

- [Documentation Stripe](https://stripe.com/docs)
- [Stripe Dashboard](https://dashboard.stripe.com)
- [Stripe CLI Documentation](https://stripe.com/docs/stripe-cli)
