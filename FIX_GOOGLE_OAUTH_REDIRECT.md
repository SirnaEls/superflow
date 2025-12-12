# 🔧 Correction de l'erreur Google OAuth "redirect_uri_mismatch"

## 🐛 Problème

Erreur : **`Error 400 : redirect_uri_mismatch`**

Cela signifie que le callback URL configuré dans Google Cloud Console ne correspond pas à celui utilisé par Supabase.

## ✅ Solution

### 1. Vérifier le callback URL Supabase

Le callback URL Supabase est :
```
https://utfmpkirvxguhqtmufnz.supabase.co/auth/v1/callback
```

### 2. Configurer dans Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Cliquez sur votre OAuth Client ID (`YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com`)
4. Dans **Authorized redirect URIs**, vous devez avoir **EXACTEMENT** :
   ```
   https://utfmpkirvxguhqtmufnz.supabase.co/auth/v1/callback
   ```
5. **Supprimez** tous les autres callback URLs (comme `http://localhost:3002/api/auth/callback/google`)
6. Cliquez sur **Save**

### 3. Vérifier dans Supabase Dashboard

1. Allez dans **Authentication** → **Providers** → **Google**
2. Vérifiez que le **Callback URL** affiché est :
   ```
   https://utfmpkirvxguhqtmufnz.supabase.co/auth/v1/callback
   ```
3. Si différent, copiez exactement celui affiché dans Supabase et ajoutez-le dans Google Cloud Console

### 4. Vérifier les URLs autorisées dans Supabase

Dans **Authentication** → **URL Configuration**, ajoutez :
- `http://localhost:3002` (pour le développement)
- `http://localhost:3002/**`
- Votre domaine de production (si applicable)

### 5. Redémarrer le serveur

```bash
npm run dev
```

## 🔍 Vérification

1. ✅ Le callback URL dans Google Cloud Console correspond **exactement** à celui de Supabase
2. ✅ Aucun espace ou caractère supplémentaire
3. ✅ Le protocole est `https://` (pas `http://`)
4. ✅ Le callback URL dans Supabase Dashboard correspond

## 🆘 Si ça ne fonctionne toujours pas

1. **Attendez quelques minutes** : Les changements dans Google Cloud Console peuvent prendre quelques minutes à se propager
2. **Vérifiez les logs Supabase** : **Logs** → **Auth Logs** pour voir les erreurs détaillées
3. **Vérifiez que Google OAuth est activé** dans Supabase Dashboard
4. **Vérifiez les credentials** : Client ID et Secret doivent correspondre entre Google Cloud Console et Supabase

## 📝 Notes importantes

- ⚠️ Le callback URL doit être **exactement** le même dans Google Cloud Console et Supabase
- ⚠️ Ne pas utiliser le callback NextAuth (`/api/auth/callback/google`) car on utilise maintenant Supabase Auth directement
- ⚠️ Le callback Supabase gère automatiquement la redirection vers votre app après authentification
