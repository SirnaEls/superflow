# 🔧 Solution définitive : Erreur redirect_uri_mismatch

## 🎯 Cause du problème

L'erreur `redirect_uri_mismatch` signifie que le callback URL que Supabase envoie à Google n'est **pas** dans la liste des "Authorized redirect URIs" dans Google Cloud Console.

## ✅ Solution étape par étape

### Étape 1 : Vérifier le callback URL dans Supabase

1. Allez sur : https://supabase.com/dashboard/project/utfmpkirvxguhqtmufnz/auth/providers
2. Cliquez sur **Google**
3. Notez le **Callback URL** affiché (il devrait être : `https://utfmpkirvxguhqtmufnz.supabase.co/auth/v1/callback`)

### Étape 2 : Ajouter ce callback URL dans Google Cloud Console

1. Allez sur : https://console.cloud.google.com/apis/credentials
2. Cliquez sur votre OAuth Client ID : `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`
3. Faites défiler jusqu'à **"Authorized redirect URIs"**
4. Cliquez sur **"+ ADD URI"**
5. **Copiez-collez EXACTEMENT** le callback URL de Supabase :
   ```
   https://utfmpkirvxguhqtmufnz.supabase.co/auth/v1/callback
   ```
6. **IMPORTANT** : Vérifiez qu'il n'y a pas d'espaces avant/après
7. Cliquez sur **SAVE**

### Étape 3 : Supprimer les anciens callback URLs (optionnel mais recommandé)

Dans la même section "Authorized redirect URIs", supprimez :
- `http://localhost:3002/api/auth/callback/google` (si présent)
- Tous les autres callback URLs qui ne sont pas le callback Supabase

### Étape 4 : Attendre la propagation

- Attendez **1-2 minutes** après avoir sauvegardé
- Les changements dans Google Cloud Console peuvent prendre quelques minutes à se propager

### Étape 5 : Tester

1. Redémarrez votre serveur : `npm run dev`
2. Allez sur : `http://localhost:3002/login`
3. Cliquez sur "Se connecter avec Google"
4. Vous devriez être redirigé vers Google sans erreur

## 🔍 Vérification alternative : Utiliser les credentials Supabase

Si vous continuez à avoir des problèmes, vous pouvez utiliser les credentials OAuth de Supabase (plus simple) :

1. Dans Supabase Dashboard → **Authentication** → **Providers** → **Google**
2. Cherchez un bouton **"Use Supabase OAuth credentials"** ou **"Use default credentials"**
3. Cliquez dessus - Supabase remplira automatiquement les champs
4. Sauvegardez
5. **Note** : Avec cette option, vous n'avez pas besoin de configurer Google Cloud Console

## 🆘 Si ça ne fonctionne toujours pas

1. **Vérifiez les logs Supabase** :
   - https://supabase.com/dashboard/project/utfmpkirvxguhqtmufnz/logs/explorer
   - Filtrez par "Auth Logs" pour voir les erreurs détaillées

2. **Vérifiez que les credentials sont corrects** :
   - Dans Supabase Dashboard → Google provider
   - Vérifiez que Client ID et Client Secret correspondent à ceux dans Google Cloud Console

3. **Vérifiez les URLs autorisées dans Supabase** :
   - Authentication → URL Configuration
   - Assurez-vous que `http://localhost:3002` est dans la liste

4. **Essayez en navigation privée** :
   - Parfois les cookies/cache peuvent causer des problèmes

## 📝 Checklist finale

- [ ] Callback URL ajouté dans Google Cloud Console
- [ ] Callback URL correspond exactement à celui dans Supabase Dashboard
- [ ] Aucun espace avant/après l'URL
- [ ] Protocole `https://` (pas `http://`)
- [ ] Attendu 1-2 minutes après sauvegarde
- [ ] Serveur redémarré
- [ ] Testé la connexion Google
