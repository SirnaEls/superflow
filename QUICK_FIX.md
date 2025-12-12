# 🚀 Corrections rapides

## 1. ⚠️ Erreur Prisma : "requires either adapter or accelerateUrl"

### Solution

Installez les packages requis :

```bash
npm install @prisma/adapter-pg pg
```

Puis redémarrez le serveur :

```bash
npm run dev
```

## 2. ⚠️ Erreur Google OAuth : "redirect_uri_mismatch"

### Solution

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Cliquez sur votre OAuth Client ID
4. Dans **Authorized redirect URIs**, ajoutez/modifiez pour avoir **EXACTEMENT** :
   ```
   https://utfmpkirvxguhqtmufnz.supabase.co/auth/v1/callback
   ```
5. **Supprimez** tous les autres callback URLs (comme `http://localhost:3002/api/auth/callback/google`)
6. Cliquez sur **Save**
7. Attendez 1-2 minutes pour la propagation
8. Redémarrez votre serveur : `npm run dev`

## 3. ⚠️ DATABASE_URL manquant

Si vous avez l'erreur "DATABASE_URL is not set" :

```bash
npm run db:setup
```

Le script vous demandera le mot de passe de la base de données Supabase.

## ✅ Vérification finale

1. ✅ Packages Prisma installés (`@prisma/adapter-pg`, `pg`)
2. ✅ `DATABASE_URL` configuré dans `.env`
3. ✅ Callback URL Google configuré correctement
4. ✅ Serveur redémarré

## 📚 Documentation

- `INSTALL_PRISMA_ADAPTER.md` - Détails sur l'installation de l'adapter Prisma
- `FIX_GOOGLE_OAUTH_REDIRECT.md` - Guide complet pour corriger l'erreur OAuth
