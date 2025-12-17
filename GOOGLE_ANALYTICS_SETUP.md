# 📊 Configuration Google Analytics

Guide pour configurer Google Analytics dans FlowForge.

## 📋 Prérequis

1. ✅ Compte Google Analytics (gratuit sur [analytics.google.com](https://analytics.google.com))
2. ✅ Propriété GA4 créée dans Google Analytics

## 🔧 Étape 1 : Créer une propriété Google Analytics

1. Allez sur [Google Analytics](https://analytics.google.com)
2. Cliquez sur **"Admin"** (icône d'engrenage en bas à gauche)
3. Dans la colonne **"Property"**, cliquez sur **"Create Property"**
4. Remplissez les informations :
   - **Property name** : FlowForge (ou votre nom)
   - **Reporting time zone** : Votre fuseau horaire
   - **Currency** : EUR (ou votre devise)
5. Cliquez sur **"Next"** puis **"Create"**

## 🔑 Étape 2 : Obtenir le Measurement ID

1. Dans votre propriété Google Analytics, allez dans **"Admin"**
2. Dans la colonne **"Property"**, cliquez sur **"Data Streams"**
3. Cliquez sur votre stream web (ou créez-en un si nécessaire)
4. Copiez le **Measurement ID** (commence par `G-`, par exemple `G-XXXXXXXXXX`)

## ⚙️ Étape 3 : Configurer la variable d'environnement

Ajoutez le Measurement ID dans votre fichier `.env.local` :

```env
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

**Important** : 
- Remplacez `G-XXXXXXXXXX` par votre vrai Measurement ID
- Le préfixe `NEXT_PUBLIC_` est nécessaire pour que la variable soit accessible côté client
- Ne commitez jamais votre fichier `.env.local` (il est déjà dans `.gitignore`)

## 🌐 Étape 4 : Configurer pour Netlify (Production)

1. Allez dans **Netlify Dashboard** → Votre site → **Site settings** → **Environment variables**
2. Ajoutez la variable :
   - **Key** : `NEXT_PUBLIC_GA_MEASUREMENT_ID`
   - **Value** : `G-XXXXXXXXXX` (votre Measurement ID)
3. Cliquez sur **"Save"**
4. Redéployez votre site pour que les changements prennent effet

## ✅ Vérification

1. Déployez votre application
2. Visitez votre site
3. Allez dans **Google Analytics** → **Reports** → **Realtime**
4. Vous devriez voir votre visite en temps réel

## 📈 Fonctionnalités

Le composant Google Analytics est automatiquement intégré et :
- ✅ Charge le script Google Analytics sur toutes les pages
- ✅ Track automatiquement les changements de page (App Router)
- ✅ Fonctionne avec Next.js 14 App Router
- ✅ Ne charge que si `NEXT_PUBLIC_GA_MEASUREMENT_ID` est défini

## 🔍 Événements personnalisés (Optionnel)

Pour tracker des événements personnalisés, utilisez :

```typescript
if (typeof window !== 'undefined' && (window as any).gtag) {
  (window as any).gtag('event', 'event_name', {
    event_category: 'category',
    event_label: 'label',
    value: 1,
  });
}
```

## 📚 Ressources

- [Documentation Google Analytics](https://developers.google.com/analytics/devguides/collection/ga4)
- [Guide GA4 pour Next.js](https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries#google-analytics)

