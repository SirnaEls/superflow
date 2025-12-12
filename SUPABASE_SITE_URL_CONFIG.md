# 🔧 Configuration du Site URL dans Supabase

## ⚠️ Problème

Si Supabase redirige vers `/login?error=no_code#access_token=...` au lieu de `/auth/callback`, c'est que le "Site URL" dans Supabase Dashboard n'est pas configuré correctement.

## ✅ Solution

### 1. Configurer le Site URL dans Supabase Dashboard

1. Allez sur : https://supabase.com/dashboard/project/utfmpkirvxguhqtmufnz/auth/url-configuration
2. Dans la section **"Site URL"**, configurez :
   ```
   http://localhost:3001/auth/callback
   ```
   (Remplacez `3001` par votre port si différent)
3. Dans la section **"Redirect URLs"**, ajoutez aussi :
   ```
   http://localhost:3001/auth/callback
   ```
   ```
   http://localhost:3001/auth/callback/**
   ```
4. Cliquez sur **Save**

### 2. Pourquoi `/auth/callback` et pas `/login` ?

- Supabase utilise le flux "implicit" qui met les tokens dans le hash de l'URL (`#access_token=...`)
- Le hash n'est accessible que côté client
- La page `/auth/callback` est une page client-side qui :
  1. Lit le hash
  2. Crée la session Supabase
  3. Synchronise avec NextAuth
  4. Redirige vers l'app

### 3. Alternative : Garder `/login` comme Site URL

Si vous préférez garder `/login` comme Site URL, le code sur `/login` devrait automatiquement détecter le hash et rediriger vers `/auth/callback`. Mais il est plus simple de configurer directement `/auth/callback` comme Site URL.

## 🔍 Vérification

1. ✅ Le "Site URL" dans Supabase Dashboard est : `http://localhost:3001/auth/callback`
2. ✅ Les "Redirect URLs" incluent : `http://localhost:3001/auth/callback` et `http://localhost:3001/auth/callback/**`
3. ✅ Après connexion Google, vous êtes redirigé vers `/auth/callback#access_token=...`
4. ✅ La page `/auth/callback` traite le hash et vous connecte
