# 📧 Configuration Email/Password et Magic Link

## ✅ Ce qui a été configuré

- ✅ Formulaire email/password sur les pages login et register
- ✅ Magic link (lien magique) pour connexion sans mot de passe
- ✅ Intégration avec Supabase Auth
- ✅ Synchronisation avec NextAuth pour Google OAuth

## 🔧 Configuration Supabase

### 1. Activer Email/Password dans Supabase

1. Allez dans Supabase Dashboard → **Authentication** → **Providers**
2. Vérifiez que **Email** est activé (activé par défaut)
3. Configurez les options si nécessaire :
   - **Enable email confirmations** : Recommandé pour la sécurité
   - **Secure email change** : Recommandé

### 2. Configurer les emails (Magic Link)

Supabase envoie automatiquement les emails de magic link. Pour personnaliser :

1. Allez dans **Authentication** → **Email Templates**
2. Personnalisez le template "Magic Link" si vous le souhaitez
3. Configurez votre SMTP personnalisé (optionnel) :
   - **Settings** → **Auth** → **SMTP Settings**

### 3. URLs de redirection

Dans **Authentication** → **URL Configuration**, assurez-vous que ces URLs sont autorisées :

- `http://localhost:3000` (développement)
- `http://localhost:3000/**` (développement)
- `https://votredomaine.com` (production)
- `https://votredomaine.com/**` (production)

Et pour les redirects après magic link :
- `http://localhost:3000/api/auth/callback/email` (développement)
- `https://votredomaine.com/api/auth/callback/email` (production)

## 📝 Variables d'environnement

Aucune variable supplémentaire n'est nécessaire pour email/password et magic link avec Supabase. Les variables existantes suffisent :

```env
NEXT_PUBLIC_SUPABASE_URL=https://votre-projet.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_anon_key
SUPABASE_SERVICE_ROLE_KEY=votre_service_role_key
```

**Note :** Si vous souhaitez utiliser NextAuth EmailProvider (au lieu de Supabase directement), vous devrez configurer SMTP :

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=votre@email.com
SMTP_PASSWORD=votre_mot_de_passe_app
SMTP_FROM=noreply@flowforge.com
```

## 🎯 Utilisation

### Connexion avec Email/Password

1. Allez sur `/login`
2. Entrez votre email et mot de passe
3. Cliquez sur "Se connecter"

### Inscription avec Email/Password

1. Allez sur `/register`
2. Entrez votre nom (optionnel), email et mot de passe
3. Cliquez sur "Créer mon compte"
4. Vous serez automatiquement connecté après inscription

### Connexion avec Magic Link

1. Allez sur `/login` ou `/register`
2. Entrez votre email
3. Cliquez sur "Envoyer un lien magique"
4. Vérifiez votre boîte mail
5. Cliquez sur le lien reçu
6. Vous serez automatiquement connecté

## 🔒 Sécurité

- ✅ Les mots de passe sont hashés avec bcrypt par Supabase
- ✅ Les magic links expirent après 1 heure (configurable dans Supabase)
- ✅ Les emails de confirmation peuvent être activés pour plus de sécurité
- ✅ Rate limiting automatique par Supabase pour éviter les abus

## 🆘 Problèmes courants

### "Email rate limit exceeded"
- Supabase limite le nombre d'emails envoyés par heure
- Attendez un peu avant de réessayer
- Vérifiez vos paramètres de rate limiting dans Supabase

### "Invalid email"
- Vérifiez le format de l'email
- Assurez-vous que l'email n'est pas déjà utilisé (pour l'inscription)

### Magic link ne fonctionne pas
- Vérifiez votre boîte mail (spam aussi)
- Vérifiez que l'URL de redirection est correctement configurée dans Supabase
- Vérifiez les logs Supabase pour voir les erreurs

### "Password too short"
- Le mot de passe doit contenir au moins 6 caractères
- Configurez des règles plus strictes dans Supabase si nécessaire

## 📚 Documentation

- [Supabase Auth Documentation](https://supabase.com/docs/guides/auth)
- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
