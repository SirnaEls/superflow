# 🔧 Configuration des Redirect URLs dans Supabase

## ⚠️ Important

Après avoir créé la page `/auth/callback`, vous devez ajouter cette URL dans Supabase Dashboard.

## 📝 Configuration dans Supabase Dashboard

1. Allez sur : https://supabase.com/dashboard/project/utfmpkirvxguhqtmufnz/auth/url-configuration
2. Dans la section **"Redirect URLs"**, ajoutez :
   ```
   http://localhost:3001/auth/callback
   ```
   (Remplacez `3001` par votre port si différent)
3. Pour la production, ajoutez aussi :
   ```
   https://votredomaine.com/auth/callback
   ```
4. Cliquez sur **Save**

## ✅ URLs à ajouter

- `http://localhost:3001/auth/callback` (développement)
- `http://localhost:3001/auth/callback/**` (toutes les sous-routes)
- Votre domaine de production (si applicable)

## 🔍 Pourquoi cette URL ?

Supabase utilise le flux "implicit" qui met les tokens dans le hash de l'URL (`#access_token=...`). Le hash n'est accessible que côté client, donc on a besoin d'une page client-side (`/auth/callback`) pour :
1. Lire le hash
2. Créer la session Supabase
3. Synchroniser avec NextAuth
4. Rediriger vers l'app
