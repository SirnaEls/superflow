# 🔐 Configuration Google OAuth dans Supabase

## Option 1 : Utiliser les credentials Supabase (Recommandé - Plus simple)

1. Dans Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. Cherchez un bouton ou lien "Use Supabase OAuth credentials" ou "Use default credentials"
3. Cliquez dessus - Supabase remplira automatiquement les champs
4. Sauvegardez

**Avantages :**
- ✅ Pas besoin de créer un projet Google Cloud
- ✅ Configuration automatique
- ✅ Fonctionne immédiatement

## Option 2 : Utiliser vos propres credentials Google

### Étape 1 : Créer un OAuth Client ID dans Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un projet ou sélectionnez-en un existant
3. Activez l'API "Google+ API" :
   - **APIs & Services** → **Library**
   - Recherchez "Google+ API"
   - Cliquez sur **Enable**
4. Créez les identifiants OAuth :
   - **APIs & Services** → **Credentials**
   - Cliquez sur **Create Credentials** → **OAuth client ID**
   - Si c'est la première fois, configurez l'écran de consentement OAuth
   - **Application type** : Web application
   - **Name** : FlowForge
   - **Authorized redirect URIs** : 
     ```
     https://utfmpkirvxguhqtmufnz.supabase.co/auth/v1/callback
     ```
     (Remplacez par votre URL Supabase si différente)
   - Cliquez sur **Create**
5. **Copiez le Client ID et le Client Secret**

### Étape 2 : Remplir les champs dans Supabase

Dans Supabase Dashboard → **Authentication** → **Providers** → **Google** :

1. **Client IDs** : Collez votre Client ID (commence par `xxxxx.apps.googleusercontent.com`)
2. **Client Secret** : Collez votre Client Secret
3. **Callback URL** : `https://utfmpkirvxguhqtmufnz.supabase.co/auth/v1/callback`
   (Cette URL devrait déjà être pré-remplie, vérifiez qu'elle correspond)
4. Cliquez sur **Save**

### Étape 3 : Mettre à jour votre `.env` (Optionnel)

Si vous utilisez vos propres credentials, vous pouvez aussi les ajouter dans `.env` :

```env
GOOGLE_CLIENT_ID=votre_client_id_google.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre_client_secret_google
```

**Note :** Avec Supabase, ces variables ne sont pas obligatoires car Supabase gère l'OAuth directement.

## ✅ Vérification

1. Sauvegardez la configuration dans Supabase
2. Allez dans **Authentication** → **URL Configuration**
3. Ajoutez ces URLs autorisées :
   - `http://localhost:3000`
   - `http://localhost:3000/**`
4. Testez dans votre app :
   ```bash
   npm run dev
   ```
   - Allez sur `/login`
   - Cliquez sur "Continuer avec Google"
   - Vous devriez être redirigé vers Google pour vous connecter

## 🆘 Problèmes courants

### "At least one Client ID is required"
- Vous devez soit utiliser les credentials Supabase, soit fournir vos propres credentials
- Vérifiez que le Client ID est bien collé dans le champ

### "Redirect URI mismatch"
- Vérifiez que le Callback URL dans Supabase correspond exactement à celui configuré dans Google Cloud Console
- Le format doit être : `https://votre-projet.supabase.co/auth/v1/callback`

### Les boutons OAuth ne fonctionnent pas
- Vérifiez que Google est bien activé dans Supabase
- Redémarrez votre serveur après modification
- Vérifiez les URLs autorisées dans Supabase → Authentication → URL Configuration
