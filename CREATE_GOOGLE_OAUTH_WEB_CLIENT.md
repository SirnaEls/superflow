# 🔧 Créer un client OAuth "Web application" pour Supabase

## 🐛 Problème

Votre client OAuth actuel est de type **"Desktop computer"** (Ordinateur de bureau), ce qui ne permet pas de configurer les "Authorized redirect URIs" nécessaires pour Supabase.

## ✅ Solution : Créer un nouveau client OAuth "Web application"

### Étape 1 : Créer un nouveau client OAuth

1. Dans Google Cloud Console, allez sur : https://console.cloud.google.com/apis/credentials
2. En haut de la page, cliquez sur **"+ CREATE CREDENTIALS"**
3. Sélectionnez **"OAuth client ID"**

### Étape 2 : Configurer le nouveau client

Si c'est la première fois, Google vous demandera de configurer l'écran de consentement OAuth :
- **User Type** : External (ou Internal si vous avez Google Workspace)
- Cliquez sur **CREATE**
- Remplissez les informations de base (nom de l'app, email de support, etc.)
- Cliquez sur **SAVE AND CONTINUE** jusqu'à la fin

### Étape 3 : Créer le client OAuth

1. **Application type** : Sélectionnez **"Web application"** (⚠️ IMPORTANT : pas "Desktop computer")
2. **Name** : `FlowForge Web` (ou un nom de votre choix)
3. **Authorized redirect URIs** : Cliquez sur **"+ ADD URI"** et ajoutez :
   ```
   https://utfmpkirvxguhqtmufnz.supabase.co/auth/v1/callback
   ```
4. Cliquez sur **CREATE**

### Étape 4 : Copier les credentials

Google vous affichera :
- **Client ID** : `xxxxx-xxxxx.apps.googleusercontent.com`
- **Client Secret** : `GOCSPX-xxxxx`

**Copiez ces deux valeurs !**

### Étape 5 : Configurer dans Supabase

1. Allez sur : https://supabase.com/dashboard/project/utfmpkirvxguhqtmufnz/auth/providers
2. Cliquez sur **Google**
3. Remplissez :
   - **Client ID** : Collez le Client ID du nouveau client OAuth
   - **Client Secret** : Collez le Client Secret du nouveau client OAuth
4. Vérifiez que le **Callback URL** est : `https://utfmpkirvxguhqtmufnz.supabase.co/auth/v1/callback`
5. Cliquez sur **SAVE**

### Étape 6 : Mettre à jour votre .env (optionnel)

Si vous utilisez les credentials dans votre code, mettez à jour `.env` :

```env
GOOGLE_CLIENT_ID=votre_nouveau_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre_nouveau_client_secret
```

### Étape 7 : Tester

1. Redémarrez votre serveur : `npm run dev`
2. Allez sur : `http://localhost:3002/login`
3. Cliquez sur "Se connecter avec Google"
4. Ça devrait fonctionner maintenant ! 🎉

## 🔍 Vérification

Après avoir créé le nouveau client "Web application", vous devriez voir :
- Une section **"Authorized redirect URIs"** avec votre callback URL Supabase
- Une section **"Authorized JavaScript origins"** (optionnelle)

## ⚠️ Note importante

Vous pouvez garder l'ancien client "Desktop computer" ou le supprimer - il ne sera plus utilisé une fois que vous aurez configuré le nouveau client "Web application" dans Supabase.
