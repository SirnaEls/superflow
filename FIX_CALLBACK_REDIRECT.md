# 🔧 Correction de la redirection après connexion Google

## 🐛 Problème

Supabase redirige vers `/login?error=no_code#access_token=...` au lieu de `/auth/callback`. Le token est dans le hash mais n'est pas traité.

## ✅ Solution

### 1. Ajouter `/auth/callback` dans Supabase Dashboard

1. Allez sur : https://supabase.com/dashboard/project/utfmpkirvxguhqtmufnz/auth/url-configuration
2. Dans **"Redirect URLs"**, ajoutez :
   ```
   http://localhost:3001/auth/callback
   ```
   (Remplacez `3001` par votre port)
3. Cliquez sur **Save**

### 2. Vérifier que le code est correct

Le code a été mis à jour pour :
- ✅ Détecter le hash `#access_token=...` sur la page `/login`
- ✅ Rediriger automatiquement vers `/auth/callback` avec le hash
- ✅ La page `/auth/callback` lit le hash et crée la session

### 3. Tester

1. Redémarrez le serveur : `npm run dev`
2. Allez sur `/login`
3. Cliquez sur "Se connecter avec Google"
4. Après autorisation Google, vous devriez être redirigé vers `/auth/callback`
5. Puis vers `/` (page d'accueil) en mode connecté

## 🔍 Si ça ne fonctionne toujours pas

1. **Vérifiez les Redirect URLs dans Supabase** :
   - `/auth/callback` doit être dans la liste
   - `http://localhost:3001/auth/callback` (avec votre port)

2. **Vérifiez la console du navigateur** :
   - Ouvrez F12 → Console
   - Regardez les logs `[DEBUG]` pour voir ce qui se passe

3. **Vérifiez l'URL après connexion Google** :
   - Si vous voyez `#access_token=...` dans l'URL, c'est bon signe
   - La page `/login` devrait détecter le hash et rediriger
