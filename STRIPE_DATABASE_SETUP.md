# 🔗 Configuration Stripe → Base de données

Ce document explique comment connecter Stripe à Supabase pour gérer automatiquement les abonnements.

## 📋 Prérequis

1. ✅ Stripe configuré avec les clés API
2. ✅ Supabase configuré avec les clés d'accès
3. ✅ Webhook Stripe configuré (voir ci-dessous)

## 🗄️ Étape 1 : Créer la table subscriptions

Exécutez la migration SQL dans Supabase :

1. Allez dans **Supabase Dashboard** → **SQL Editor**
2. Cliquez sur **New query**
3. Copiez-collez le contenu du fichier `supabase/migrations/002_subscriptions_schema.sql`
4. Cliquez sur **Run** (Cmd/Ctrl + Enter)

Cette migration crée :
- ✅ Table `public.subscriptions` pour stocker les abonnements
- ✅ Index pour des recherches rapides
- ✅ Row Level Security (RLS) policies
- ✅ Trigger pour mettre à jour automatiquement `updated_at`

## 🔧 Étape 2 : Configurer les variables d'environnement

Ajoutez ces variables dans votre `.env.local` :

```env
# Stripe Price IDs (obtenez-les depuis Stripe Dashboard → Products)
NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER=price_xxxxx  # ID du prix Starter (4.99€)
NEXT_PUBLIC_STRIPE_PRICE_ID_PRO=price_xxxxx      # ID du prix Pro (9.99€)

# Supabase (déjà configuré normalement)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key  # ⚠️ Important pour le webhook

# Stripe (déjà configuré normalement)
STRIPE_SECRET_KEY=sk_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx  # ⚠️ Important pour vérifier les webhooks
```

### Comment obtenir les Price IDs depuis Stripe :

1. Allez dans **Stripe Dashboard** → **Products**
2. Cliquez sur votre produit (Starter ou Pro)
3. Copiez le **Price ID** (commence par `price_`)

## 🔔 Étape 3 : Configurer le webhook Stripe

1. Allez dans **Stripe Dashboard** → **Developers** → **Webhooks**
2. Cliquez sur **Add endpoint**
3. Entrez l'URL : `https://votre-domaine.com/api/stripe/webhook`
   - Pour le développement local, utilisez [Stripe CLI](https://stripe.com/docs/stripe-cli) :
     ```bash
     stripe listen --forward-to localhost:3000/api/stripe/webhook
     ```
4. Sélectionnez les événements à écouter :
   - ✅ `checkout.session.completed`
   - ✅ `customer.subscription.created`
   - ✅ `customer.subscription.updated`
   - ✅ `customer.subscription.deleted`
   - ✅ `invoice.payment_succeeded`
   - ✅ `invoice.payment_failed`
5. Copiez le **Signing secret** (commence par `whsec_`) et ajoutez-le à `.env.local` comme `STRIPE_WEBHOOK_SECRET`

## ✅ Vérification

Après configuration, testez le flux complet :

1. **Créer un abonnement** :
   - Allez sur `/upgrade`
   - Cliquez sur "Subscribe" pour un plan
   - Complétez le checkout Stripe

2. **Vérifier dans Supabase** :
   - Allez dans **Supabase Dashboard** → **Table Editor**
   - Ouvrez la table `public.subscriptions`
   - Vous devriez voir votre abonnement avec :
     - `user_email` : votre email
     - `plan_type` : `starter` ou `pro`
     - `status` : `active`
     - `stripe_subscription_id` : l'ID de l'abonnement Stripe

3. **Vérifier dans l'app** :
   - Allez sur `/account`
   - Votre plan devrait être affiché correctement
   - Les limites devraient être appliquées selon votre plan

## 🔄 Fonctionnement

### Flux d'abonnement :

1. **Utilisateur clique sur "Subscribe"** :
   - `CheckoutButton` appelle `/api/stripe/checkout` avec l'email de l'utilisateur
   - Stripe crée une session de checkout

2. **Utilisateur complète le paiement** :
   - Stripe envoie un webhook `checkout.session.completed`
   - Le webhook récupère les détails de l'abonnement
   - L'abonnement est sauvegardé dans `public.subscriptions`

3. **Mise à jour du plan** :
   - `usePlan()` hook appelle `/api/user/plan?email=...`
   - L'API récupère le plan depuis `public.subscriptions`
   - Le plan est affiché dans l'UI

### Gestion des événements Stripe :

- **`customer.subscription.updated`** : Met à jour le plan si l'utilisateur change de plan
- **`customer.subscription.deleted`** : Marque l'abonnement comme `canceled`
- **`invoice.payment_failed`** : Marque l'abonnement comme `past_due`

## 🐛 Dépannage

### Le plan ne se met pas à jour après le paiement

1. Vérifiez les logs du webhook dans Stripe Dashboard → **Developers** → **Webhooks** → **Logs**
2. Vérifiez les logs de votre serveur pour voir les erreurs
3. Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct
4. Vérifiez que la table `subscriptions` existe dans Supabase

### Erreur "Price ID not found"

1. Vérifiez que `NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER` et `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO` sont corrects
2. Les Price IDs doivent correspondre exactement à ceux dans Stripe Dashboard

### L'utilisateur n'est pas trouvé

- Le système utilise l'email comme identifiant principal
- Si l'utilisateur n'existe pas dans `next_auth.users`, le `user_id` sera `null` mais l'abonnement fonctionnera quand même avec l'email

## 📚 Fichiers modifiés

- ✅ `supabase/migrations/002_subscriptions_schema.sql` : Migration SQL
- ✅ `lib/supabase-server.ts` : Client Supabase pour serveur
- ✅ `app/api/stripe/webhook/route.ts` : Gestion des webhooks Stripe
- ✅ `app/api/stripe/checkout/route.ts` : Création de sessions checkout avec email
- ✅ `app/api/user/plan/route.ts` : API pour récupérer le plan utilisateur
- ✅ `lib/plans.ts` : Fonction `getUserPlan()` mise à jour pour utiliser l'API
- ✅ `hooks/use-plan.ts` : Hook mis à jour pour récupérer le plan depuis la DB
- ✅ `lib/stripe.ts` : `createCheckoutSession()` accepte maintenant l'email
- ✅ `components/payment/checkout-button.tsx` : Passe l'email de l'utilisateur au checkout

