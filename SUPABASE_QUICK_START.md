# 🚀 Configuration Supabase - Guide Rapide

## ✅ Ce qui a été fait

- ✅ Supabase installé et configuré
- ✅ NextAuth configuré avec Supabase adapter
- ✅ Pages login/register prêtes à utiliser Supabase Auth

## 📝 Ce qu'il vous reste à faire

### 1. Créer un projet Supabase (5 minutes)

1. Allez sur [https://supabase.com](https://supabase.com)
2. Créez un compte (gratuit)
3. Créez un nouveau projet :
   - Nom : FlowForge
   - Mot de passe DB : Choisissez-en un fort
   - Région : La plus proche de vous
4. Attendez que le projet soit créé (~2 minutes)

### 2. Récupérer les clés Supabase

1. Dans votre projet Supabase, allez dans **Settings** → **API**
2. Copiez ces 3 valeurs :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ (gardez-la secrète !)

### 3. Activer Google OAuth dans Supabase

1. Allez dans **Authentication** → **Providers**
2. Activez **Google**
3. **Option simple** : Cliquez sur "Use Supabase OAuth credentials"
   - Supabase gère tout pour vous !
   - Pas besoin de configurer Google Cloud Console
4. **Option avancée** : Si vous avez déjà des credentials Google, vous pouvez les utiliser

### 4. Activer Apple OAuth (Optionnel)

1. Dans **Authentication** → **Providers**, activez **Apple**
2. Configurez avec vos credentials Apple Developer

### 5. Configurer les URLs autorisées

Dans **Authentication** → **URL Configuration**, ajoutez :
- `http://localhost:3000`
- `http://localhost:3000/**`
- `https://votredomaine.com` (pour la production)
- `https://votredomaine.com/**`

### 6. Mettre à jour votre `.env`

Ouvrez votre fichier `.env` et remplacez :

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 7. Redémarrer le serveur

```bash
npm run dev
```

## 🎯 Tester

1. Allez sur `/login`
2. Cliquez sur "Continuer avec Google"
3. Vous serez redirigé vers Supabase Auth
4. Après connexion, vous serez redirigé vers votre app

## ✨ Avantages de Supabase

- ✅ **Plus simple** : Pas besoin de configurer Google Cloud Console
- ✅ **Dashboard** : Voyez tous vos utilisateurs dans Supabase
- ✅ **Base de données** : PostgreSQL intégrée
- ✅ **Gratuit** : Plan gratuit généreux pour commencer

## 📚 Documentation complète

Consultez `SUPABASE_SETUP.md` pour plus de détails.
