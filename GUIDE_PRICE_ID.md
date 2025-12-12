# 🔍 Comment trouver les Price IDs dans Stripe

## ⚠️ Problème
Vous avez 2 produits (Pro et Starter) mais ils semblent avoir le même Price ID. Chaque produit doit avoir son propre Price ID unique.

## 📋 Étapes pour trouver les Price IDs

### Étape 1 : Accéder à vos produits
1. Allez sur [https://dashboard.stripe.com/products](https://dashboard.stripe.com/products)
2. Vous devriez voir vos 2 produits : "Pro" et "Starter"

### Étape 2 : Cliquer sur le produit "Starter"
1. Cliquez sur le produit **"Starter"**
2. Vous verrez la page de détails du produit
3. Dans la section **"Pricing"** ou **"Tarifs"**, vous verrez le prix (4,99€)
4. **Cliquez sur le prix** ou sur le bouton pour voir les détails
5. Vous verrez le **Price ID** qui commence par `price_` (ex: `price_1AbCdEfGhIjKlMnOpQrStUvW`)

### Étape 3 : Cliquer sur le produit "Pro"
1. Retournez à la liste des produits
2. Cliquez sur le produit **"Pro"**
3. Dans la section **"Pricing"**, cliquez sur le prix (9,99€)
4. Copiez le **Price ID** qui commence par `price_`

### Étape 4 : Vérifier que les Price IDs sont différents
- **Starter** devrait avoir un Price ID comme : `price_XXXXXXXXXXXXX`
- **Pro** devrait avoir un Price ID différent comme : `price_YYYYYYYYYYYYY`

## 🔧 Si les deux produits ont le même Price ID

Cela signifie probablement que :
1. Les deux produits utilisent le même prix (ce qui est incorrect)
2. Ou vous regardez le Product ID au lieu du Price ID

### Solution : Créer des prix séparés

Si les deux produits partagent le même prix, vous devez créer un prix séparé pour chaque produit :

#### Pour le produit Starter :
1. Cliquez sur "Starter"
2. Dans la section "Pricing", cliquez sur "Add another price" ou "Ajouter un autre prix"
3. Créez un nouveau prix récurrent à **4,99€/mois**
4. Copiez le nouveau Price ID

#### Pour le produit Pro :
1. Cliquez sur "Pro"
2. Dans la section "Pricing", cliquez sur "Add another price" ou "Ajouter un autre prix"
3. Créez un nouveau prix récurrent à **9,99€/mois**
4. Copiez le nouveau Price ID

## 📝 Mettre à jour votre .env

Une fois que vous avez les deux Price IDs différents, mettez à jour votre fichier `.env` :

```env
# Price ID pour Starter (4,99€)
NEXT_PUBLIC_STRIPE_PRICE_ID=price_VOTRE_PRICE_ID_STARTER_ICI

# Price ID pour Pro (9,99€)
NEXT_PUBLIC_STRIPE_PRICE_ID_2=price_VOTRE_PRICE_ID_PRO_ICI
```

## ⚠️ Important : Product ID vs Price ID

- **Product ID** commence par `prod_` → ❌ Ne pas utiliser
- **Price ID** commence par `price_` → ✅ À utiliser

Dans votre tableau Stripe, vous voyez peut-être le Product ID, mais vous avez besoin du **Price ID** qui se trouve dans les détails de chaque produit.

## 🎯 Résumé

1. Cliquez sur chaque produit dans Stripe
2. Trouvez la section "Pricing" / "Tarifs"
3. Cliquez sur le prix pour voir les détails
4. Copiez le Price ID (commence par `price_`)
5. Assurez-vous que les deux Price IDs sont différents
6. Mettez à jour votre `.env` avec les bons Price IDs
