# 🔧 Correction de l'erreur "Configuration" 500

## 🐛 Problème

Erreur : **`GET /api/auth/error?error=Configuration 500`**

Cela indique un problème de configuration dans NextAuth.

## ✅ Solutions

### 1. Vérifier le Callback URL dans Google Cloud Console

L'erreur peut venir d'un redirect URI incorrect dans Google Cloud Console.

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Cliquez sur votre OAuth Client ID
4. Vérifiez les **Authorized redirect URIs** :
   ```
   http://localhost:3002/api/auth/callback/google
   ```
   (Notez le port **3002**, pas 3000 !)
5. Si vous utilisez un autre port, ajoutez-le aussi
6. Sauvegardez

### 2. Redémarrer le serveur

Après avoir modifié la configuration :

```bash
# Arrêtez le serveur (Ctrl+C)
# Puis redémarrez
npm run dev
```

### 3. Vérifier les variables d'environnement

Exécutez :

```bash
node scripts/check-auth-config.js
```

Toutes les variables doivent être ✅.

### 4. Vérifier les logs du serveur

Regardez les logs dans votre terminal pour voir l'erreur exacte. L'erreur "Configuration" peut être causée par :

- ❌ EmailProvider configuré sans SMTP (corrigé - EmailProvider retiré)
- ❌ Callback URL incorrect dans Google Cloud Console
- ❌ Variables d'environnement manquantes
- ❌ Tables NextAuth manquantes (mais vérifiées ✅)

### 5. Vérifier le port

Si votre serveur tourne sur le port **3002** au lieu de 3000, assurez-vous que :

1. Le callback URL dans Google Cloud Console correspond au bon port
2. `NEXT_PUBLIC_APP_URL` dans `.env` correspond aussi (si utilisé)

## 🔍 Debug

Pour voir l'erreur exacte, regardez les logs du serveur dans votre terminal. L'erreur "Configuration" est générique - les détails sont dans les logs.

## ✅ Vérification finale

1. ✅ Tables NextAuth créées (vérifié)
2. ✅ Variables d'environnement configurées (vérifié)
3. ⚠️  Callback URL dans Google Cloud Console à vérifier
4. ⚠️  Redémarrer le serveur après modifications
