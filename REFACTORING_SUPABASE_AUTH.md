# 🔄 Refactorisation : Migration vers Supabase Auth uniquement

## ✅ Modifications effectuées

### 1. Suppression de NextAuth et Prisma

**Fichiers supprimés :**
- `auth.ts` (configuration NextAuth)
- `lib/prisma.ts` (client Prisma)
- `lib/supabase.ts` (ancien client Supabase)
- `prisma/schema.prisma` (schéma Prisma)
- `prisma.config.ts` (configuration Prisma)
- `app/api/auth/[...nextauth]/route.ts` (route NextAuth)
- `app/api/auth/supabase-signin/route.ts` (synchronisation NextAuth/Prisma)
- `app/api/auth/callback/supabase/route.ts` (callback Supabase)
- `app/api/auth/callback/email/route.ts` (callback email)
- `app/api/auth/register/route.ts` (inscription API)
- `app/auth/supabase-callback/page.tsx` (ancienne page de callback)

**Dépendances supprimées de `package.json` :**
- `next-auth`
- `@auth/prisma-adapter`
- `@auth/supabase-adapter`
- `@prisma/client`
- `prisma`
- `@prisma/adapter-pg`
- `pg`
- `bcryptjs`
- `@types/bcryptjs`

**Scripts supprimés de `package.json` :**
- `db:setup`
- `db:generate`
- `db:push`
- `db:migrate`
- `db:studio`
- `setup:nextauth`
- `setup:nextauth:editor`
- `setup:nextauth:api`

### 2. Nouveaux fichiers créés

**`lib/auth.ts`** - Module d'authentification Supabase unifié
- `signInWithGoogle()` - Connexion avec Google OAuth
- `signOut()` - Déconnexion
- `getSession()` - Récupération de la session
- `getUser()` - Récupération de l'utilisateur
- `mapSupabaseUserToAuthUser()` - Conversion User Supabase → AuthUser
- `onAuthStateChange()` - Écoute des changements d'auth

**`lib/supabase-client.ts`** - Client Supabase unifié
- Client Supabase configuré pour usage côté client
- Gestion automatique de la session et du refresh token

**`hooks/useAuth.ts`** - Hook React pour l'authentification
- Remplace `useSession` de NextAuth
- Retourne `{ user, session, loading, error }`
- Écoute automatiquement les changements d'authentification

### 3. Fichiers mis à jour

**Pages :**
- `app/login/page.tsx` - Utilise `useAuth` et `signInWithGoogle`
- `app/register/page.tsx` - Utilise `signInWithGoogle` et `supabaseClient.auth.signUp`
- `app/auth/callback/page.tsx` - Gère uniquement le callback Supabase OAuth
- `app/account/page.tsx` - Utilise `useAuth` et `signOut`
- `app/upgrade/page.tsx` - Utilise `useAuth`

**Composants :**
- `components/layout/sidebar.tsx` - Utilise `useAuth` et `signOut`
- `components/providers/session-provider.tsx` - Wrapper vide (compatibilité)
- `components/auth/route-guard.tsx` - Utilise `useAuth` au lieu de `useSession`

## 📋 Actions manuelles requises

### 1. Nettoyer la base de données Supabase

Exécutez cette commande SQL dans le SQL Editor de Supabase pour supprimer le schéma `next_auth` :

```sql
DROP SCHEMA IF EXISTS next_auth CASCADE;
```

Cela supprimera toutes les tables suivantes :
- `next_auth.accounts`
- `next_auth.users`
- `next_auth.sessions`
- `next_auth.verification_tokens`

### 2. Mettre à jour les dépendances

Exécutez :

```bash
npm install
```

Cela supprimera automatiquement les dépendances NextAuth et Prisma du `node_modules` et mettra à jour `package-lock.json`.

### 3. Vérifier la configuration Supabase

Assurez-vous que les variables d'environnement suivantes sont configurées dans `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Configurer le Site URL dans Supabase

Dans le Dashboard Supabase → Authentication → URL Configuration :
- **Site URL** : `http://localhost:3001/auth/callback` (ou votre URL de production)
- **Redirect URLs** : Ajoutez `http://localhost:3001/auth/callback` et `http://localhost:3001/auth/callback/**`

## 🔍 Vérifications

### Vérifier que tout fonctionne

1. **Connexion Google** :
   - Aller sur `/login`
   - Cliquer sur "Se connecter avec Google"
   - Vérifier que la redirection fonctionne
   - Vérifier que l'utilisateur apparaît dans Supabase → Authentication → Users

2. **Déconnexion** :
   - Cliquer sur "Déconnexion" dans le sidebar
   - Vérifier que la session est supprimée

3. **Protection des routes** :
   - Essayer d'accéder à `/account` sans être connecté
   - Vérifier la redirection vers `/login`

### Vérifier qu'il n'y a plus de références NextAuth/Prisma

```bash
# Chercher les imports NextAuth
grep -r "next-auth" app/ components/ lib/ --exclude-dir=node_modules

# Chercher les imports Prisma
grep -r "@prisma\|prisma" app/ components/ lib/ --exclude-dir=node_modules
```

Ces commandes ne devraient retourner aucun résultat (sauf dans les commentaires).

## 🎯 Architecture finale

### Flux d'authentification

1. **Connexion Google** :
   ```
   User → /login → signInWithGoogle() → Google OAuth → 
   Supabase callback → /auth/callback → setSession() → 
   Redirection vers / (ou callbackUrl)
   ```

2. **Vérification de session** :
   ```
   Composant → useAuth() → supabaseClient.auth.getSession() → 
   Retourne { user, session, loading, error }
   ```

3. **Déconnexion** :
   ```
   User → signOut() → supabaseClient.auth.signOut() → 
   Session supprimée → Redirection vers /login
   ```

### Tables Supabase utilisées

- **`auth.users`** - Gérée automatiquement par Supabase Auth
- **`auth.sessions`** - Gérée automatiquement par Supabase Auth
- **Aucune table `next_auth.*`** - Plus utilisée

## ⚠️ Notes importantes

1. **Pas de gestion email/password côté serveur** : L'inscription et la connexion email/password se font maintenant directement via `supabaseClient.auth.signUp()` et `supabaseClient.auth.signInWithPassword()` côté client.

2. **Session gérée automatiquement** : Supabase gère automatiquement la persistance de la session dans les cookies du navigateur. Pas besoin de gestion manuelle.

3. **Pas de middleware NextAuth** : Les routes protégées utilisent maintenant `RouteGuard` ou des vérifications directes avec `useAuth()`.

4. **TypeScript** : Tous les types sont maintenant basés sur `@supabase/supabase-js` au lieu de `next-auth`.

## 🐛 Dépannage

### Erreur "Missing Supabase environment variables"
- Vérifiez que `NEXT_PUBLIC_SUPABASE_URL` et `NEXT_PUBLIC_SUPABASE_ANON_KEY` sont définis dans `.env.local`

### Erreur de redirection après Google OAuth
- Vérifiez que le "Site URL" dans Supabase Dashboard pointe vers `/auth/callback`
- Vérifiez que les "Redirect URLs" incluent votre URL de callback

### Session non persistante
- Vérifiez que `persistSession: true` est configuré dans `lib/supabase-client.ts` (déjà fait)

### Build échoue avec des erreurs TypeScript
- Exécutez `npm install` pour mettre à jour les dépendances
- Vérifiez qu'il n'y a plus d'imports vers `next-auth` ou `@prisma/*`
