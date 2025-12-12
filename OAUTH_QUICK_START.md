# 🚀 Configuration OAuth - Guide Rapide

## ✅ Ce qui a été fait

- ✅ Authentification OAuth avec Google et Apple configurée
- ✅ Pages login/register mises à jour (plus de formulaire email/password)
- ✅ Protection de la page upgrade (redirection si non connecté)

## 📝 Ce qu'il vous reste à faire

### 1. Configurer Google OAuth

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un projet ou sélectionnez-en un
3. Activez l'API "Google+ API"
4. Allez dans **APIs & Services** → **Credentials**
5. Créez un **OAuth client ID** (type: Web application)
6. Ajoutez ces redirect URIs :
   - `http://localhost:3000/api/auth/callback/google` (dev)
   - `https://votredomaine.com/api/auth/callback/google` (prod)
7. Copiez le **Client ID** et **Client Secret**

### 2. Configurer Apple OAuth (Optionnel mais recommandé)

Apple est plus complexe. Consultez le guide complet : `OAUTH_SETUP.md`

### 3. Ajouter les variables au `.env`

Ouvrez votre fichier `.env` et ajoutez :

```env
# Google OAuth
GOOGLE_CLIENT_ID=votre_client_id_google.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre_client_secret_google

# Apple OAuth (optionnel)
APPLE_ID=com.votredomaine.flowforge
APPLE_SECRET=votre_jwt_token_apple
```

### 4. Redémarrer le serveur

```bash
npm run dev
```

## 🎯 Test rapide

1. Allez sur `/login`
2. Cliquez sur "Continuer avec Google"
3. Autorisez l'application
4. Vous serez redirigé vers la page d'accueil connecté
5. Allez sur `/upgrade` pour voir les plans

## ⚠️ Important

- **Pour le développement** : Google fonctionne avec `localhost:3000`
- **Pour Apple** : Nécessite HTTPS en production (utilisez ngrok pour tester en local)
- **Sans OAuth configuré** : Les boutons ne fonctionneront pas, mais l'app ne plantera pas

## 📚 Documentation complète

Consultez `OAUTH_SETUP.md` pour un guide détaillé avec toutes les étapes.
