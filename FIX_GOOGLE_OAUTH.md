# 🔧 Correction de l'erreur Google OAuth "invalid_client"

## 🐛 Problème

Erreur : **"The OAuth client was not found"** / **"Erreur 401 : invalid_client"**

Cela signifie que les credentials Google OAuth dans votre `.env` ne sont pas corrects ou que le Client ID n'existe pas dans Google Cloud Console.

## ✅ Solution

### Option 1 : Utiliser les credentials Supabase (Recommandé - Plus simple)

**Cette option ne nécessite PAS de configurer Google Cloud Console !**

1. Allez dans **Supabase Dashboard** → **Authentication** → **Providers** → **Google**
2. Activez Google si ce n'est pas déjà fait
3. Cherchez l'option **"Use Supabase OAuth credentials"** ou **"Use default credentials"**
4. Cliquez dessus - Supabase remplira automatiquement les champs
5. **Sauvegardez**

**Important :** Avec cette option, vous pouvez **supprimer** `GOOGLE_CLIENT_ID` et `GOOGLE_CLIENT_SECRET` de votre `.env` car Supabase gère tout.

### Option 2 : Utiliser vos propres credentials Google

Si vous préférez utiliser vos propres credentials :

#### Étape 1 : Créer un OAuth Client ID dans Google Cloud Console

1. Allez sur [Google Cloud Console](https://console.cloud.google.com/)
2. Créez un projet ou sélectionnez-en un existant
3. Activez l'API :
   - **APIs & Services** → **Library**
   - Recherchez **"Google+ API"** ou **"Google Identity"**
   - Cliquez sur **Enable**
4. Créez les identifiants OAuth :
   - **APIs & Services** → **Credentials**
   - Cliquez sur **Create Credentials** → **OAuth client ID**
   - Si c'est la première fois, configurez l'écran de consentement OAuth :
     - Choisissez **External**
     - Remplissez les informations requises
     - Ajoutez votre email comme test user
   - **Application type** : Web application
   - **Name** : FlowForge
   - **Authorized redirect URIs** : 
     ```
     http://localhost:3000/api/auth/callback/google
     ```
     (Pour la production, ajoutez aussi : `https://votredomaine.com/api/auth/callback/google`)
   - Cliquez sur **Create**
5. **Copiez le Client ID et le Client Secret**

#### Étape 2 : Mettre à jour votre `.env`

Ouvrez votre fichier `.env` et ajoutez/modifiez :

```env
GOOGLE_CLIENT_ID=votre_client_id_ici.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=votre_client_secret_ici
```

**Important :**
- Le Client ID doit commencer par quelque chose comme `123456789-xxxxx.apps.googleusercontent.com`
- Le Client Secret est une longue chaîne de caractères
- Ne mettez PAS d'espaces ou de guillemets autour des valeurs

#### Étape 3 : Redémarrer le serveur

```bash
npm run dev
```

## 🔍 Vérification

1. Vérifiez que les variables sont bien définies :
   ```bash
   # Dans votre terminal
   echo $GOOGLE_CLIENT_ID
   echo $GOOGLE_CLIENT_SECRET
   ```

2. Si vous utilisez vos propres credentials, vérifiez dans Google Cloud Console :
   - Que le Client ID existe bien
   - Que le redirect URI correspond exactement : `http://localhost:3000/api/auth/callback/google`

3. Testez la connexion :
   - Allez sur `/login`
   - Cliquez sur "Continuer avec Google"
   - Vous devriez être redirigé vers Google (pas d'erreur 401)

## ⚠️ Erreurs courantes

### "invalid_client" persiste après configuration
- Vérifiez que vous avez bien redémarré le serveur (`npm run dev`)
- Vérifiez que les variables dans `.env` n'ont pas d'espaces avant/après
- Vérifiez que le Client ID existe bien dans Google Cloud Console

### "Redirect URI mismatch"
- Le redirect URI dans Google Cloud Console doit être EXACTEMENT : `http://localhost:3000/api/auth/callback/google`
- Pas de trailing slash, pas de majuscules/minuscules différentes

### Les credentials Supabase ne fonctionnent pas
- Assurez-vous d'avoir activé Google dans Supabase Dashboard
- Vérifiez que vous avez bien cliqué sur "Use Supabase OAuth credentials"
- Redémarrez le serveur après modification dans Supabase

## 💡 Recommandation

**Utilisez l'Option 1 (credentials Supabase)** - C'est beaucoup plus simple et vous n'avez pas besoin de gérer Google Cloud Console !
