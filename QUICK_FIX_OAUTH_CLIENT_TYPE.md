# ⚡ Solution rapide : Changer le type de client OAuth

## 🎯 Le problème

Votre client OAuth est de type **"Desktop computer"** alors qu'il doit être **"Web application"** pour fonctionner avec Supabase.

## ✅ Solution en 3 étapes

### 1. Créer un nouveau client OAuth "Web application"

1. Allez sur : https://console.cloud.google.com/apis/credentials
2. Cliquez sur **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
3. **Application type** : **"Web application"** ⚠️ (pas Desktop!)
4. **Name** : `FlowForge Web`
5. **Authorized redirect URIs** : Ajoutez :
   ```
   https://utfmpkirvxguhqtmufnz.supabase.co/auth/v1/callback
   ```
6. Cliquez sur **CREATE**
7. **Copiez le Client ID et Client Secret**

### 2. Configurer dans Supabase

1. Allez sur : https://supabase.com/dashboard/project/utfmpkirvxguhqtmufnz/auth/providers
2. Cliquez sur **Google**
3. Collez le **nouveau Client ID** et **nouveau Client Secret**
4. Cliquez sur **SAVE**

### 3. Tester

```bash
npm run dev
```

Puis testez la connexion Google. Ça devrait fonctionner ! ✅

## 📝 Pourquoi ça ne marche pas avec "Desktop computer" ?

Les applications "Desktop computer" utilisent un flux OAuth différent (PKCE) et n'ont pas besoin de redirect URIs. Supabase nécessite un client "Web application" avec un redirect URI configuré.
