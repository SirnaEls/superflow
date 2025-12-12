# 🚀 Configuration Stripe - Guide Rapide

## 📍 Où mettre les clés Stripe ?

**Réponse courte** : Dans un fichier `.env` à la racine du projet.

## 🎯 Étapes rapides

### 1. Créer le fichier `.env`

```bash
# À la racine du projet (même niveau que package.json)
cp .env.example .env
```

### 2. Ouvrir le fichier `.env` et remplir les valeurs

Ouvrez le fichier `.env` avec votre éditeur et remplacez les valeurs suivantes :

```env
# ⬇️ Remplacez ces valeurs par vos vraies clés Stripe ⬇️

STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE_ICI
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_VOTRE_CLE_PUBLIQUE_ICI
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_SECRET_WEBHOOK_ICI
NEXT_PUBLIC_STRIPE_PRICE_ID=price_VOTRE_PRICE_ID_ICI
NEXT_PUBLIC_APP_URL=http://localhost:3000
AUTH_SECRET=votre_secret_aleatoire_ici
```

### 3. Où trouver ces valeurs ?

#### 🔑 Clés API (STRIPE_SECRET_KEY et NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)

1. Allez sur [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
2. Vous verrez :
   - **Publishable key** → Copiez dans `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** → Cliquez sur "Reveal test key" → Copiez dans `STRIPE_SECRET_KEY`

#### 💳 Price ID (NEXT_PUBLIC_STRIPE_PRICE_ID)

1. Allez sur [https://dashboard.stripe.com/products](https://dashboard.stripe.com/products)
2. Cliquez sur "Add product"
3. Créez un produit avec un prix récurrent
4. Copiez le **Price ID** (commence par `price_`)

#### 🔔 Webhook Secret (STRIPE_WEBHOOK_SECRET)

**Pour le développement local** (recommandé) :

1. Installez Stripe CLI :
   ```bash
   brew install stripe/stripe-cli/stripe
   ```

2. Connectez-vous :
   ```bash
   stripe login
   ```

3. Démarrez le forwarding :
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. **Copiez le secret** affiché dans le terminal (commence par `whsec_`)

#### 🔐 AUTH_SECRET

Générez un secret aléatoire :

```bash
openssl rand -base64 32
```

Ou utilisez : [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

### 4. Vérifier la configuration

```bash
npm run check:stripe
```

Ce script vérifie que toutes les variables sont correctement configurées.

### 5. Redémarrer le serveur

Après avoir modifié `.env`, redémarrez toujours le serveur :

```bash
npm run dev
```

## 📝 Exemple de fichier `.env` complet

```env
# Anthropic API Key
ANTHROPIC_API_KEY=sk-ant-api03-...

# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdefghijklmnopqrstuvwxyz
NEXT_PUBLIC_STRIPE_PRICE_ID=price_1234567890abcdefghijklmnop
NEXT_PUBLIC_APP_URL=http://localhost:3000

# NextAuth
AUTH_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
NEXTAUTH_SECRET=abc123def456ghi789jkl012mno345pqr678stu901vwx234yz
```

## ⚠️ Important

- ✅ Le fichier `.env` est déjà dans `.gitignore` (ne sera pas commité)
- ✅ Utilisez les clés **TEST** pour le développement (`sk_test_` et `pk_test_`)
- ✅ Utilisez les clés **LIVE** uniquement en production
- ✅ Ne partagez jamais vos clés secrètes publiquement

## 🆘 Besoin d'aide ?

Consultez le guide complet : [STRIPE_CONFIGURATION.md](./STRIPE_CONFIGURATION.md)

## ✅ Checklist

- [ ] Fichier `.env` créé
- [ ] Clés API Stripe ajoutées
- [ ] Produit et prix créés dans Stripe
- [ ] Price ID copié
- [ ] Webhook configuré (Stripe CLI)
- [ ] Webhook secret copié
- [ ] AUTH_SECRET généré
- [ ] Configuration vérifiée avec `npm run check:stripe`
- [ ] Serveur redémarré
