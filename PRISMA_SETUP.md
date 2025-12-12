# 🚀 Configuration Prisma avec Supabase

## ✅ Avantages de Prisma

- ✅ **Type-safety** : Types TypeScript générés automatiquement
- ✅ **ORM moderne** : Requêtes type-safe et intuitives
- ✅ **Migrations** : Gestion automatique des schémas
- ✅ **IntelliSense** : Autocomplétion dans votre IDE
- ✅ **Prisma Studio** : Interface graphique pour gérer les données

## 📝 Configuration

### 1. Ajouter DATABASE_URL dans `.env`

Ajoutez la connexion PostgreSQL de Supabase :

```env
# Supabase PostgreSQL Connection String
# Format: postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres
DATABASE_URL="postgresql://postgres:[VOTRE_MOT_DE_PASSE]@db.utfmpkirvxguhqtmufnz.supabase.co:5432/postgres?schema=next_auth"
```

**Où trouver les informations :**
- **PROJECT_ID** : Dans votre URL Supabase (`utfmpkirvxguhqtmufnz`)
- **PASSWORD** : Dans Supabase Dashboard → Settings → Database → Database password

### 2. Générer le client Prisma

```bash
npm run db:generate
```

### 3. Créer les tables dans Supabase

Vous avez deux options :

#### Option A : Via Prisma Migrate (Recommandé)

```bash
npm run db:migrate
```

Cela créera les tables automatiquement dans Supabase.

#### Option B : Via SQL Editor (Si migrate ne fonctionne pas)

1. Allez dans Supabase Dashboard → SQL Editor
2. Exécutez le script SQL existant : `supabase/migrations/001_nextauth_schema.sql`

### 4. Vérifier la connexion

```bash
npm run db:studio
```

Cela ouvrira Prisma Studio où vous pourrez voir vos tables.

## 🔄 Migration depuis SupabaseAdapter

✅ **Déjà fait !** 

- ✅ `SupabaseAdapter` remplacé par `PrismaAdapter`
- ✅ Schéma Prisma créé pour les tables NextAuth
- ✅ Client Prisma configuré
- ✅ Routes API mises à jour pour utiliser Prisma

## 📚 Commandes Prisma utiles

```bash
# Générer le client Prisma après modification du schema
npm run db:generate

# Pousser les changements du schema vers la DB (sans migration)
npm run db:push

# Créer une migration
npm run db:migrate

# Ouvrir Prisma Studio (interface graphique)
npm run db:studio
```

## 🎯 Utilisation dans le code

```typescript
import { prisma } from '@/lib/prisma';

// Créer un utilisateur
const user = await prisma.user.create({
  data: {
    email: 'user@example.com',
    name: 'John Doe',
  },
});

// Trouver un utilisateur
const user = await prisma.user.findUnique({
  where: { email: 'user@example.com' },
  include: { accounts: true },
});

// Mettre à jour un utilisateur
const user = await prisma.user.update({
  where: { id: userId },
  data: { name: 'Jane Doe' },
});
```

## 🔒 Sécurité

- ✅ `DATABASE_URL` contient le mot de passe DB - **ne jamais commiter dans Git**
- ✅ Utilisez `.env` (déjà dans `.gitignore`)
- ✅ En production, utilisez les variables d'environnement de votre hébergeur

## 🆘 Dépannage

### Erreur "Can't reach database server"

- Vérifiez que `DATABASE_URL` est correct dans `.env`
- Vérifiez que le mot de passe DB est correct
- Vérifiez que le PROJECT_ID est correct

### Erreur "Schema does not exist"

- Assurez-vous d'avoir exécuté les migrations ou le script SQL
- Vérifiez que le schéma `next_auth` existe dans Supabase

### Erreur "Table does not exist"

- Exécutez `npm run db:migrate` ou le script SQL
- Vérifiez dans Prisma Studio : `npm run db:studio`
