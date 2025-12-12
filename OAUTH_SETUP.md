# 🔐 Configuration OAuth (Google & Apple)

## 📋 Vue d'ensemble

FlowForge utilise maintenant uniquement l'authentification OAuth avec Google et Apple. Plus besoin de créer des comptes avec email/mot de passe !

## 🔵 Configuration Google OAuth

### Étape 1 : Créer un projet Google Cloud

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un nouveau projet ou sélectionnez un projet existant
3. Activez l'API "Google+ API" pour votre projet

### Étape 2 : Créer les identifiants OAuth

1. Dans Google Cloud Console, allez dans **APIs & Services** → **Credentials**
2. Cliquez sur **Create Credentials** → **OAuth client ID**
3. Si c'est la première fois, configurez l'écran de consentement OAuth :
   - Choisissez **External** (pour les tests)
   - Remplissez les informations requises
   - Ajoutez votre email comme test user
4. Créez l'OAuth client ID :
   - **Application type** : Web application
   - **Name** : FlowForge (ou votre nom)
   - **Authorized redirect URIs** :
     - `http://localhost:3000/api/auth/callback/google` (développement)
     - `https://votredomaine.com/api/auth/callback/google` (production)
5. Cliquez sur **Create**
6. **Copiez le Client ID et le Client Secret**

### Étape 3 : Ajouter au fichier `.env`

```env
GOOGLE_CLIENT_ID=votre_client_id_google.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre_client_secret_google
```

## 🍎 Configuration Apple OAuth

### Étape 1 : Créer un Services ID

1. Allez sur [Apple Developer Portal](https://developer.apple.com/account/resources/identifiers/list)
2. Cliquez sur le **+** pour créer un nouvel identifiant
3. Sélectionnez **Services IDs** et cliquez sur **Continue**
4. Remplissez :
   - **Description** : FlowForge
   - **Identifier** : `com.votredomaine.flowforge` (doit être unique)
5. Cliquez sur **Continue** puis **Register**

### Étape 2 : Configurer Sign in with Apple

1. Dans la liste des Services IDs, cliquez sur celui que vous venez de créer
2. Cochez **Sign in with Apple**
3. Cliquez sur **Configure**
4. **Primary App ID** : Sélectionnez votre App ID principal
5. **Website URLs** :
   - **Domains and Subdomains** : `votredomaine.com`
   - **Return URLs** :
     - `https://votredomaine.com/api/auth/callback/apple` (production)
     - `http://localhost:3000/api/auth/callback/apple` (développement - optionnel)
6. Cliquez sur **Save** puis **Continue** puis **Register**

### Étape 3 : Créer une Key pour Sign in with Apple

1. Allez dans [Keys](https://developer.apple.com/account/resources/authkeys/list)
2. Cliquez sur le **+** pour créer une nouvelle clé
3. Remplissez :
   - **Key Name** : FlowForge Sign in with Apple
   - Cochez **Sign in with Apple**
4. Cliquez sur **Configure** et sélectionnez votre App ID principal
5. Cliquez sur **Save** puis **Continue** puis **Register**
6. **Téléchargez la clé** (fichier `.p8`) - vous ne pourrez la télécharger qu'une seule fois !
7. Notez le **Key ID** affiché

### Étape 4 : Créer le Client Secret

Apple nécessite un JWT (JSON Web Token) comme secret. Créez-le avec cette commande Node.js :

```bash
npm install jsonwebtoken
node -e "
const jwt = require('jsonwebtoken');
const fs = require('fs');

const teamId = 'VOTRE_TEAM_ID'; // Trouvez-le dans https://developer.apple.com/account
const keyId = 'VOTRE_KEY_ID'; // Le Key ID de l'étape 3
const privateKey = fs.readFileSync('./AuthKey_XXXXXXXXXX.p8'); // Le fichier .p8 téléchargé

const token = jwt.sign(
  { iss: teamId, iat: Math.floor(Date.now() / 1000) },
  privateKey,
  { algorithm: 'ES256', expiresIn: '180d', keyid: keyId }
);

console.log('APPLE_SECRET=' + token);
"
```

Ou utilisez un outil en ligne comme [Apple JWT Generator](https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens)

### Étape 5 : Ajouter au fichier `.env`

```env
APPLE_ID=com.votredomaine.flowforge
APPLE_SECRET=eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...
```

## ⚙️ Mettre à jour votre `.env`

Ajoutez ces variables à votre fichier `.env` :

```env
# Google OAuth
GOOGLE_CLIENT_ID=votre_client_id_google.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre_client_secret_google

# Apple OAuth
APPLE_ID=com.votredomaine.flowforge
APPLE_SECRET=votre_jwt_token_apple
```

## 🧪 Tester l'authentification

1. Redémarrez votre serveur :
   ```bash
   npm run dev
   ```

2. Allez sur `/login` ou `/register`
3. Cliquez sur "Continuer avec Google" ou "Continuer avec Apple"
4. Autorisez l'application
5. Vous devriez être redirigé vers la page d'accueil connecté

## 📝 Notes importantes

### Pour le développement local

- **Google** : Fonctionne directement avec `localhost:3000`
- **Apple** : Nécessite un domaine HTTPS en production. Pour le développement local, vous pouvez utiliser un service comme [ngrok](https://ngrok.com/) pour créer un tunnel HTTPS.

### Pour la production

- Assurez-vous d'ajouter vos URLs de production dans les configurations OAuth
- Google : Ajoutez `https://votredomaine.com/api/auth/callback/google`
- Apple : Ajoutez `https://votredomaine.com/api/auth/callback/apple`

## 🆘 Problèmes courants

### "redirect_uri_mismatch" (Google)
- Vérifiez que l'URL de redirection dans Google Cloud Console correspond exactement à celle utilisée
- Les URLs doivent correspondre exactement (pas de trailing slash, etc.)

### "Invalid client" (Apple)
- Vérifiez que votre Services ID est correctement configuré
- Assurez-vous que "Sign in with Apple" est activé
- Vérifiez que le JWT secret est valide (il expire après 180 jours)

### Le bouton ne fonctionne pas
- Vérifiez que les variables d'environnement sont bien définies
- Redémarrez le serveur après avoir modifié `.env`
- Vérifiez la console du navigateur pour les erreurs

## ✅ Checklist

- [ ] Projet Google Cloud créé
- [ ] OAuth Client ID créé dans Google Cloud
- [ ] Redirect URIs configurées pour Google
- [ ] Services ID créé dans Apple Developer
- [ ] Sign in with Apple configuré
- [ ] Key créée et téléchargée (fichier .p8)
- [ ] JWT secret généré pour Apple
- [ ] Variables ajoutées au fichier `.env`
- [ ] Serveur redémarré
- [ ] Test de connexion Google réussi
- [ ] Test de connexion Apple réussi (si configuré)
