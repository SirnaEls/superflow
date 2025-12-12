# ✅ Redirection après connexion Google

## 🔄 Flux de redirection

Après une connexion réussie avec Google, voici ce qui se passe :

1. **Google OAuth** → L'utilisateur autorise l'application
2. **Supabase Callback** → `/api/auth/callback/supabase` reçoit le code
3. **Échange du code** → Supabase échange le code contre une session
4. **Synchronisation Prisma** → `/api/auth/supabase-signin` crée l'utilisateur dans `next_auth.users` et `next_auth.accounts`
5. **Création session NextAuth** → `signIn('credentials')` crée la session NextAuth avec le token Supabase
6. **Redirection** → L'utilisateur est redirigé vers la page demandée (par défaut `/`)

## 📍 Pages de redirection

- **Par défaut** : `/` (page d'accueil)
- **Si callbackUrl spécifié** : La page demandée (ex: `/upgrade`, `/account`, etc.)

## ✅ Vérification que ça fonctionne

Après la connexion, vous devriez voir :

1. **Sidebar** : Votre nom et email affichés en bas de la sidebar
2. **Menu utilisateur** : Un menu déroulant avec vos options (Profil, Paramètres, Déconnexion)
3. **Page d'accueil** : Vous êtes sur la page principale avec accès à toutes les fonctionnalités

## 🔍 Si la redirection ne fonctionne pas

1. Vérifiez la console du navigateur pour les erreurs
2. Vérifiez que la session NextAuth est créée : Ouvrez les DevTools → Application → Cookies → Cherchez `next-auth.session-token`
3. Vérifiez dans Prisma Studio : `npm run db:studio` → Vérifiez que l'utilisateur existe dans `next_auth.users`

## 🐛 Dépannage

### L'utilisateur n'est pas redirigé

- Vérifiez que `callbackUrl` est bien passé dans l'URL
- Vérifiez les logs du serveur pour voir les erreurs

### La session n'est pas créée

- Vérifiez que `/api/auth/supabase-signin` retourne `success: true`
- Vérifiez que `signIn('credentials')` ne retourne pas d'erreur
- Vérifiez que le CredentialsProvider accepte le token Supabase

### L'utilisateur est redirigé mais pas connecté

- Vérifiez que les cookies NextAuth sont bien créés
- Vérifiez que `useSession()` dans le Sidebar détecte la session
- Essayez de rafraîchir la page manuellement
