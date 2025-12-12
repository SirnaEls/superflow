# 🔄 Guide de Migration vers Prisma

## ✅ Ce qui a été fait

1. ✅ Schéma Prisma créé (`prisma/schema.prisma`)
2. ✅ Client Prisma configuré (`lib/prisma.ts`)
3. ✅ `SupabaseAdapter` remplacé par `PrismaAdapter` dans `auth.ts`
4. ✅ Routes API mises à jour pour utiliser Prisma
5. ✅ Scripts npm ajoutés pour gérer Prisma

## 📝 Étapes de migration

### 1. Configurer DATABASE_URL

Exécutez le script pour générer automatiquement `DATABASE_URL` :

```bash
npm run db:setup
```

Le script vous demandera le mot de passe de la base de données Supabase.

**Ou manuellement dans `.env` :**

```env
DATABASE_URL="postgresql://postgres:[VOTRE_MOT_DE_PASSE]@db.utfmpkirvxguhqtmufnz.supabase.co:5432/postgres?schema=next_auth"
```

### 2. Générer le client Prisma

```bash
npm run db:generate
```

Cela génère les types TypeScript à partir du schéma Prisma.

### 3. Créer les tables (si elles n'existent pas déjà)

Si vous avez déjà exécuté le script SQL pour créer les tables NextAuth, vous pouvez passer cette étape.

Sinon, vous avez deux options :

#### Option A : Via Prisma Migrate

```bash
npm run db:migrate
```

Cela créera une migration et appliquera les changements.

#### Option B : Via SQL Editor (Recommandé si tables déjà créées)

Si les tables existent déjà via le script SQL précédent, Prisma les reconnaîtra automatiquement.

### 4. Vérifier que tout fonctionne

```bash
# Ouvrir Prisma Studio pour voir vos données
npm run db:studio

# Redémarrer le serveur
npm run dev
```

## 🎯 Avantages de Prisma

### Avant (SupabaseAdapter)
```typescript
// Requêtes SQL brutes ou via Supabase client
const { data } = await supabaseAdmin
  .from('next_auth.users')
  .select('*')
  .eq('email', email)
  .single();
```

### Après (Prisma)
```typescript
// Type-safe avec autocomplétion
const user = await prisma.user.findUnique({
  where: { email },
  include: { accounts: true },
});
```

## 🔍 Vérification

1. ✅ Vérifiez que `DATABASE_URL` est dans `.env`
2. ✅ Exécutez `npm run db:generate`
3. ✅ Vérifiez dans Prisma Studio : `npm run db:studio`
4. ✅ Testez la connexion Google OAuth

## 🆘 Dépannage

### Erreur "Can't reach database server"

- Vérifiez que `DATABASE_URL` est correct
- Vérifiez le mot de passe DB dans Supabase Dashboard
- Vérifiez que le PROJECT_ID est correct

### Erreur "Schema 'next_auth' does not exist"

Les tables doivent être créées dans le schéma `next_auth`. Exécutez le script SQL :

```bash
npm run setup:nextauth:editor
```

Puis copiez-collez le SQL dans Supabase SQL Editor.

### Erreur Prisma Client non généré

```bash
npm run db:generate
```

### Les types TypeScript ne sont pas à jour

```bash
npm run db:generate
```

Puis redémarrez votre IDE/TypeScript server.

## 📚 Commandes utiles

```bash
# Configurer DATABASE_URL
npm run db:setup

# Générer le client Prisma
npm run db:generate

# Créer une migration
npm run db:migrate

# Pousser le schema vers la DB (sans migration)
npm run db:push

# Ouvrir Prisma Studio
npm run db:studio
```

## ✅ Prochaines étapes

Une fois Prisma configuré, vous pouvez :

1. Ajouter vos propres modèles dans `prisma/schema.prisma`
2. Utiliser Prisma pour toutes vos requêtes DB
3. Bénéficier du type-safety dans tout votre code
4. Utiliser Prisma Studio pour gérer vos données visuellement
