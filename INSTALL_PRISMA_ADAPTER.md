# 📦 Installation de l'adapter Prisma

## ⚠️ Problème

Prisma 7 nécessite un adapter ou accelerateUrl pour fonctionner. L'installation a échoué à cause d'un problème réseau.

## ✅ Solution

Installez manuellement les packages requis :

```bash
npm install @prisma/adapter-pg pg
```

Ou avec yarn :

```bash
yarn add @prisma/adapter-pg pg
```

## 🔧 Après installation

Une fois les packages installés, le code dans `lib/prisma.ts` utilisera automatiquement l'adapter PostgreSQL.

## 🆘 Alternative : Utiliser Prisma Accelerate

Si vous préférez utiliser Prisma Accelerate (service cloud), vous pouvez :

1. Créer un compte sur [Prisma Accelerate](https://www.prisma.io/data-platform/accelerate)
2. Obtenir votre `ACCELERATE_URL`
3. Ajouter dans `.env` :
   ```env
   PRISMA_ACCELERATE_URL="prisma://..."
   ```
4. Décommenter la ligne `accelerateUrl` dans `lib/prisma.ts`

## 📝 Note

Pour l'instant, le code utilise une assertion de type temporaire (`as any`) pour contourner l'erreur. Une fois l'adapter installé, vous pouvez mettre à jour `lib/prisma.ts` avec le code complet utilisant l'adapter.
