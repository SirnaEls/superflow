# 🚀 Configuration Stripe pour la Production

Guide complet pour configurer Stripe en mode production sur Netlify.

## 📋 Checklist avant de commencer

- [ ] Compte Stripe actif avec accès au mode Live
- [ ] Site déployé sur Netlify avec URL de production
- [ ] Accès au Dashboard Netlify pour les variables d'environnement
- [ ] Accès au Dashboard Stripe

## 🔑 Étape 1 : Activer le mode Live dans Stripe

1. Allez sur [Stripe Dashboard](https://dashboard.stripe.com)
2. Assurez-vous d'être en mode **Live** (basculez en haut à droite si vous êtes en mode Test)
3. ⚠️ **Important** : En mode Live, tous les paiements sont réels !

## 💳 Étape 2 : Créer les produits en mode Live

### Créer le produit Starter (4.99€/mois)

1. Allez dans **Products** → **Add product**
2. Remplissez :
   - **Name** : FlowForge Starter
   - **Description** : Starter plan - 50 generations per month
3. Dans **Pricing** :
   - **Recurring** : Monthly
   - **Price** : 4.99 EUR
4. Cliquez sur **Save product**
5. **Copiez le Price ID** (commence par `price_...`) → C'est votre `NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER`

### Créer le produit Pro (9.99€/mois)

1. Allez dans **Products** → **Add product**
2. Remplissez :
   - **Name** : FlowForge Pro
   - **Description** : Pro plan - Unlimited generations
3. Dans **Pricing** :
   - **Recurring** : Monthly
   - **Price** : 9.99 EUR
4. Cliquez sur **Save product**
5. **Copiez le Price ID** (commence par `price_...`) → C'est votre `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO`

## 🔐 Étape 3 : Récupérer les clés API Live

1. Dans Stripe Dashboard, allez dans **Developers** → **API keys**
2. Assurez-vous d'être en mode **Live** (pas Test)
3. Copiez :
   - **Publishable key** (commence par `pk_live_...`) → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - **Secret key** (commence par `sk_live_...`) → Cliquez sur "Reveal live key" → `STRIPE_SECRET_KEY`

⚠️ **Sécurité** : Ne partagez jamais votre Secret key ! Elle ne doit être que dans les variables d'environnement.

## 🔔 Étape 4 : Configurer le webhook en production

1. Dans Stripe Dashboard (mode Live), allez dans **Developers** → **Webhooks**
2. Cliquez sur **Add endpoint**
3. **Endpoint URL** : `https://votre-site.netlify.app/api/stripe/webhook`
   - Remplacez `votre-site.netlify.app` par votre vraie URL Netlify
4. **Description** : FlowForge Production Webhook
5. Sélectionnez les événements à écouter :
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
6. Cliquez sur **Add endpoint**
7. **Copiez le Signing secret** (commence par `whsec_...`) → C'est votre `STRIPE_WEBHOOK_SECRET`

⚠️ **Important** : Ce secret est différent de celui du mode Test. Utilisez celui du mode Live.

## ⚙️ Étape 5 : Configurer les variables dans Netlify

1. Allez dans **Netlify Dashboard** → Votre site → **Site settings** → **Environment variables**
2. Ajoutez/modifiez ces variables :

### Variables Stripe (Production)

```
STRIPE_SECRET_KEY=sk_live_YOUR_SECRET_KEY_HERE
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_YOUR_PUBLISHABLE_KEY_HERE
STRIPE_WEBHOOK_SECRET=whsec_YOUR_WEBHOOK_SECRET_HERE
NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER=price_YOUR_STARTER_PRICE_ID_HERE
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_YOUR_PRO_PRICE_ID_HERE
```

⚠️ **Remplacez** `YOUR_*_HERE` par vos vraies valeurs depuis Stripe Dashboard.

### Variables autres (à vérifier)

```
NEXT_PUBLIC_APP_URL=https://votre-site.netlify.app
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-YOUR_GA_MEASUREMENT_ID_HERE
```

3. Cliquez sur **Save** pour chaque variable

## 🔄 Étape 6 : Redéployer le site

Après avoir ajouté toutes les variables :

1. Dans Netlify Dashboard, allez dans **Deploys**
2. Cliquez sur **Trigger deploy** → **Deploy site**
3. Attendez que le déploiement se termine

## ✅ Étape 7 : Vérification

### 1. Vérifier les variables d'environnement

Dans Netlify Dashboard → **Site settings** → **Environment variables**, vérifiez que :
- ✅ Toutes les clés commencent par `sk_live_`, `pk_live_`, `whsec_` (pas `test`)
- ✅ Les Price IDs correspondent à ceux créés en mode Live
- ✅ `NEXT_PUBLIC_APP_URL` pointe vers votre URL Netlify

### 2. Tester le checkout

1. Allez sur `https://votre-site.netlify.app/upgrade`
2. Cliquez sur "Upgrade to Starter" ou "Upgrade to Pro"
3. Utilisez une carte de test Stripe en mode Live :
   - **Carte valide** : `4242 4242 4242 4242`
   - **Date** : N'importe quelle date future (ex: 12/25)
   - **CVC** : N'importe quel 3 chiffres (ex: 123)
   - **Code postal** : N'importe quel code postal (ex: 12345)

⚠️ **Attention** : En mode Live, les paiements sont réels ! Utilisez des cartes de test uniquement.

### 3. Vérifier le webhook

1. Après un paiement de test, allez dans **Stripe Dashboard** → **Developers** → **Webhooks**
2. Cliquez sur votre endpoint de production
3. Allez dans l'onglet **Logs**
4. Vérifiez que les événements sont bien reçus (statut 200)

### 4. Vérifier dans Supabase

1. Allez dans **Supabase Dashboard** → **Table Editor**
2. Ouvrez la table `public.subscriptions`
3. Vérifiez qu'un nouvel abonnement a été créé avec :
   - `plan_type` : `starter` ou `pro`
   - `status` : `active`
   - `stripe_subscription_id` : présent

### 5. Vérifier dans l'app

1. Allez sur `https://votre-site.netlify.app/account`
2. Vérifiez que votre plan est affiché correctement
3. Vérifiez que les limites sont appliquées selon votre plan

## 🐛 Dépannage

### Le checkout ne fonctionne pas

- Vérifiez que `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` est bien une clé Live (`pk_live_...`)
- Vérifiez que les Price IDs sont corrects
- Vérifiez les logs dans Netlify Dashboard → **Functions** → **Logs**

### Les webhooks ne fonctionnent pas

- Vérifiez que `STRIPE_WEBHOOK_SECRET` est le secret du webhook de production
- Vérifiez que l'URL du webhook dans Stripe correspond à votre URL Netlify
- Vérifiez les logs dans Stripe Dashboard → **Webhooks** → **Logs**

### Le plan ne se met pas à jour après le paiement

- Vérifiez que `SUPABASE_SERVICE_ROLE_KEY` est correct
- Vérifiez que la table `subscriptions` existe dans Supabase
- Vérifiez les logs du webhook dans Stripe

### Erreur "Price ID not found"

- Vérifiez que les Price IDs sont ceux créés en mode Live (pas Test)
- Vérifiez que `NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER` et `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO` sont corrects

## 🔒 Sécurité

- ✅ Ne commitez jamais les clés Stripe dans Git
- ✅ Utilisez uniquement les variables d'environnement
- ✅ Ne partagez jamais votre Secret key
- ✅ Utilisez des cartes de test pour tester en production
- ✅ Activez la 2FA sur votre compte Stripe

## 📚 Ressources

- [Documentation Stripe Live Mode](https://stripe.com/docs/keys)
- [Stripe Test Cards](https://stripe.com/docs/testing)
- [Stripe Webhooks Guide](https://stripe.com/docs/webhooks)

## ✅ Checklist finale

- [ ] Produits créés en mode Live
- [ ] Clés API Live récupérées
- [ ] Webhook configuré avec l'URL de production
- [ ] Toutes les variables configurées dans Netlify
- [ ] Site redéployé
- [ ] Checkout testé avec succès
- [ ] Webhook reçoit les événements
- [ ] Abonnement créé dans Supabase
- [ ] Plan affiché correctement dans l'app

🎉 **Félicitations !** Votre configuration Stripe en production est terminée !

