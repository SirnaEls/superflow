# 🔐 Configuration Google OAuth avec Supabase Callback

## ✅ Ce qui a été configuré

1. ✅ Google OAuth utilise maintenant le callback Supabase directement
2. ✅ Callback URL : `https://utfmpkirvxguhqtmufnz.supabase.co/auth/v1/callback`
3. ✅ Synchronisation automatique avec NextAuth après connexion Supabase

## 📝 Configuration dans Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Cliquez sur votre OAuth Client ID (`YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`)
4. Dans **Authorized redirect URIs**, ajoutez/modifiez :
   ```
   https://utfmpkirvxguhqtmufnz.supabase.co/auth/v1/callback
   ```
5. **Supprimez** l'ancien callback NextAuth (`http://localhost:3002/api/auth/callback/google`)
6. Sauvegardez

## 📝 Configuration dans Supabase Dashboard

1. Allez dans **Authentication** → **Providers** → **Google**
2. Activez Google si ce n'est pas déjà fait
3. Configurez :
   - **Client ID** : `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`
   - **Client Secret** : `YOUR_GOOGLE_CLIENT_SECRET`
   - **Callback URL** : `https://utfmpkirvxguhqtmufnz.supabase.co/auth/v1/callback` (déjà pré-rempli)
4. Sauvegardez

## 🔄 Flux d'authentification

1. L'utilisateur clique sur "Continuer avec Google"
2. Redirection vers Google OAuth
3. Après autorisation, Google redirige vers : `https://utfmpkirvxguhqtmufnz.supabase.co/auth/v1/callback`
4. Supabase échange le code contre une session
5. Redirection vers : `/api/auth/callback/supabase?callbackUrl=...`
6. Notre route échange le code Supabase contre une session
7. Redirection vers : `/auth/supabase-callback`
8. Synchronisation avec NextAuth (création dans `next_auth.users` et `next_auth.accounts`)
9. Redirection vers la page demandée

## ✅ Vérification

1. Redémarrez votre serveur : `npm run dev`
2. Allez sur `/login`
3. Cliquez sur "Continuer avec Google"
4. Vous devriez être redirigé vers Google, puis Supabase, puis votre app

## 🐛 Dépannage

### Erreur "Configuration" 500
- ✅ Vérifiez que le callback URL dans Google Cloud Console correspond exactement à Supabase
- ✅ Vérifiez que Google OAuth est activé dans Supabase Dashboard
- ✅ Vérifiez que les credentials Google sont corrects dans Supabase

### Erreur "no_code" ou "oauth_error"
- Vérifiez que le callback URL dans Google Cloud Console est correct
- Vérifiez les logs Supabase dans **Logs** → **Auth Logs**

### Session non créée dans NextAuth
- Vérifiez que les tables `next_auth.users` et `next_auth.accounts` existent
- Vérifiez les logs du serveur pour voir les erreurs de synchronisation
