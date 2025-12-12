# 🚀 Configuration Supabase - Guide Complet

## 📋 Pourquoi Supabase ?

Supabase simplifie énormément l'authentification :
- ✅ Gestion native de Google et Apple OAuth
- ✅ Base de données PostgreSQL intégrée
- ✅ Gestion automatique des utilisateurs
- ✅ Pas besoin de configurer OAuth manuellement dans Google/Apple
- ✅ Dashboard pour gérer les utilisateurs

## 🎯 Étape 1 : Créer un compte Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Cliquez sur **Start your project** (gratuit)
3. Créez un compte ou connectez-vous avec GitHub
4. Créez un nouveau projet :
   - **Name** : FlowForge (ou votre nom)
   - **Database Password** : Choisissez un mot de passe fort (notez-le !)
   - **Region** : Choisissez la région la plus proche
   - Cliquez sur **Create new project**

## 🔑 Étape 2 : Récupérer les clés Supabase

Une fois votre projet créé :

1. Allez dans **Settings** → **API**
2. Vous verrez plusieurs clés :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ gardez-la secrète !)

## 🔐 Étape 3 : Configurer l'authentification OAuth dans Supabase

### Pour Google :

1. Dans Supabase Dashboard, allez dans **Authentication** → **Providers**
2. Activez **Google**
3. Vous avez deux options :
   
   **Option A : Utiliser les credentials Supabase (Recommandé)**
   - Cliquez sur "Use Supabase OAuth credentials"
   - Supabase gère tout pour vous !
   - Pas besoin de configurer Google Cloud Console
   
   **Option B : Utiliser vos propres credentials**
   - Créez un OAuth Client ID dans [Google Cloud Console](https://console.cloud.google.com/)
   - Ajoutez le redirect URI : `https://votre-projet.supabase.co/auth/v1/callback`
   - Copiez le Client ID et Secret dans Supabase

### Pour Apple :

1. Dans **Authentication** → **Providers**, activez **Apple**
2. Configurez avec vos credentials Apple Developer
3. Redirect URI : `https://votre-projet.supabase.co/auth/v1/callback`

## ⚙️ Étape 4 : Configurer les Redirect URLs

Dans Supabase Dashboard → **Authentication** → **URL Configuration** :

Ajoutez ces URLs autorisées :
- `http://localhost:3000` (développement)
- `http://localhost:3000/**` (développement)
- `https://votredomaine.com` (production)
- `https://votredomaine.com/**` (production)

## 📝 Étape 5 : Mettre à jour votre `.env`

Ajoutez ces variables à votre fichier `.env` :

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key_ici
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key_ici

# OAuth Providers (si vous utilisez vos propres credentials)
# Sinon, Supabase gère tout automatiquement !
GOOGLE_CLIENT_ID=votre_client_id (optionnel si vous utilisez Supabase OAuth)
GOOGLE_CLIENT_SECRET=votre_client_secret (optionnel)
APPLE_ID=votre_apple_id (optionnel)
APPLE_SECRET=votre_apple_secret (optionnel)
```

## 🎨 Étape 6 : Mettre à jour les pages login/register

Les pages utilisent maintenant Supabase Auth directement. Plus besoin de configurer OAuth manuellement !

## ✅ Avantages de Supabase

1. **Simplicité** : Pas besoin de configurer Google Cloud Console ou Apple Developer Portal
2. **Dashboard** : Visualisez tous vos utilisateurs dans Supabase
3. **Base de données** : PostgreSQL intégrée pour stocker les données
4. **Storage** : Stockage de fichiers intégré
5. **Real-time** : Support real-time si besoin plus tard

## 🧪 Tester l'authentification

1. Redémarrez votre serveur :
   ```bash
   npm run dev
   ```

2. Allez sur `/login`
3. Cliquez sur "Continuer avec Google" ou "Continuer avec Apple"
4. Vous serez redirigé vers Supabase Auth
5. Après connexion, vous serez redirigé vers votre app

## 📊 Voir vos utilisateurs

Dans Supabase Dashboard → **Authentication** → **Users**, vous verrez tous les utilisateurs connectés.

## 🔒 Sécurité

- ✅ `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Peut être exposée côté client (sécurisée par RLS)
- ⚠️ `SUPABASE_SERVICE_ROLE_KEY` : **NE JAMAIS** exposer côté client ! Utilisée uniquement côté serveur.

## 🆘 Problèmes courants

### "Invalid API key"
- Vérifiez que vous avez copié les bonnes clés depuis Supabase Dashboard
- Assurez-vous que `NEXT_PUBLIC_SUPABASE_URL` commence par `https://`

### "Redirect URL mismatch"
- Vérifiez les URLs autorisées dans Supabase → Authentication → URL Configuration
- Assurez-vous que l'URL correspond exactement (avec ou sans trailing slash)

### Les boutons OAuth ne fonctionnent pas
- Vérifiez que les providers sont activés dans Supabase Dashboard
- Redémarrez le serveur après avoir modifié `.env`

## 📚 Documentation

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [NextAuth with Supabase](https://supabase.com/docs/guides/auth/auth-helpers/nextjs)
