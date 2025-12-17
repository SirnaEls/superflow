# 🔐 Configuration des variables d'environnement dans Netlify

Guide pour importer les variables d'environnement dans Netlify.

## 📋 Fichier préparé

Le fichier `netlify-env-vars.txt` contient toutes vos variables d'environnement propres et organisées, prêtes à être importées dans Netlify.

## 🚀 Méthode 1 : Import manuel (Recommandé)

### Étape 1 : Ouvrir Netlify Dashboard

1. Allez sur [app.netlify.com](https://app.netlify.com)
2. Sélectionnez votre site
3. Allez dans **Site settings** → **Environment variables**

### Étape 2 : Ajouter les variables

Pour chaque variable dans `netlify-env-vars.txt` :

1. Cliquez sur **Add a variable**
2. **Key** : Le nom de la variable (ex: `STRIPE_SECRET_KEY`)
3. **Value** : La valeur correspondante
4. **Scopes** : Laissez "All scopes" (ou sélectionnez "Production" si vous voulez)
5. Cliquez sur **Save**

Répétez pour toutes les variables.

### Étape 3 : Vérification

Vérifiez que toutes les variables sont présentes :
- ✅ Stripe (5 variables)
- ✅ Supabase (3 variables)
- ✅ Application (2 variables)
- ✅ API Keys (1 variable)
- ✅ Auth (2 variables)

**Total : 13 variables**

## 🔄 Méthode 2 : Import via Netlify CLI

Si vous préférez utiliser la ligne de commande :

```bash
# Installer Netlify CLI si ce n'est pas déjà fait
npm install -g netlify-cli

# Se connecter
netlify login

# Lier le site (si pas déjà fait)
netlify link

# Importer les variables depuis le fichier
netlify env:import netlify-env-vars.txt
```

## ✅ Vérification après import

1. Dans Netlify Dashboard → **Site settings** → **Environment variables**
2. Vérifiez que toutes les variables sont présentes
3. Vérifiez que les valeurs sont correctes (sans espaces avant/après)

## 🔄 Redéployer le site

Après avoir ajouté toutes les variables :

1. Allez dans **Deploys**
2. Cliquez sur **Trigger deploy** → **Deploy site**
3. Attendez que le déploiement se termine

## 🔒 Sécurité

⚠️ **Important** :
- Ne partagez jamais le fichier `netlify-env-vars.txt` publiquement
- Ne le commitez pas dans Git (il est déjà dans `.gitignore`)
- Supprimez-le après avoir importé les variables dans Netlify

## 📝 Liste des variables à importer

### Stripe (5)
- `STRIPE_SECRET_KEY`
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `NEXT_PUBLIC_STRIPE_PRICE_ID_STARTER`
- `NEXT_PUBLIC_STRIPE_PRICE_ID_PRO`

### Supabase (3)
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`

### Application (2)
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_GA_MEASUREMENT_ID`

### API Keys (1)
- `ANTHROPIC_API_KEY`

### Auth (2)
- `AUTH_SECRET`
- `NEXTAUTH_SECRET`

## 🐛 Dépannage

### Les variables ne sont pas prises en compte

- Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs
- Redéployez le site après avoir ajouté les variables
- Vérifiez que les variables sont dans le bon scope (Production)

### Erreur lors de l'import CLI

- Vérifiez que vous êtes connecté : `netlify status`
- Vérifiez que le site est lié : `netlify link`
- Vérifiez le format du fichier (une variable par ligne, format `KEY=VALUE`)

