# 🔍 Instructions de Debug

## Problème identifié

L'erreur `redirect_uri_mismatch` signifie que le callback URL envoyé par Supabase à Google ne correspond pas à celui configuré dans Google Cloud Console.

## Ce qu'il faut vérifier

Quand vous cliquez sur "Se connecter avec Google", regardez dans la **console du navigateur** (F12 → Console). Vous devriez voir des logs `[DEBUG]` qui affichent :

1. L'URL de redirection construite dans votre code
2. L'URL complète renvoyée par Supabase (qui contient le callback URL envoyé à Google)
3. Le paramètre `redirect_uri` extrait de l'URL Google OAuth

## Action requise

1. Ouvrez la console du navigateur (F12 → Console)
2. Cliquez sur "Se connecter avec Google"
3. Regardez les logs `[DEBUG]` dans la console
4. Notez particulièrement :
   - `[DEBUG] Google OAuth URL redirect_uri parameter:` - C'est le callback URL que Supabase envoie à Google
   - `[DEBUG] Expected Supabase callback:` - C'est ce qui devrait être configuré

5. Copiez la valeur du `redirect_uri` et vérifiez qu'elle correspond EXACTEMENT à celle dans Google Cloud Console

## Solution probable

Le callback URL dans Google Cloud Console doit être EXACTEMENT :
```
https://utfmpkirvxguhqtmufnz.supabase.co/auth/v1/callback
```

Sans espaces, sans caractères supplémentaires, avec `https://` (pas `http://`).
