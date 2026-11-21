# Accès anticipé gratuit — validation des demandes

Les parents demandent un compte bêta depuis [https://hellotitou.fr/acces-anticipe/](https://hellotitou.fr/acces-anticipe/). **Personne n'obtient d'accès gratuit sans validation.** L'administrateur (compte `bringard.aurelien@gmail.com`) et les comptes déjà en `lifetime` / `lifetime_free` conservent leur accès.

## Commandes pour l'assistant

Projet Supabase : `hyfvwxfgsmuyekfxucot`. Utiliser MCP `execute_sql` (rôle `postgres`), une requête à la fois.

### Lister les demandes en attente

```sql
SELECT * FROM public.admin_list_early_access('pending');
```

Pour tout voir : `SELECT * FROM public.admin_list_early_access('all');`

### Approuver (envoie l'e-mail d'invitation)

```sql
SELECT public.admin_decide_early_access('<uuid>', 'approved');
```

Effet :

1. La demande passe en `approved`.
2. Si un compte parent existe déjà pour cet e-mail, `access_granted` est activé : la personne peut se connecter avec son mot de passe.
3. Sinon, un e-mail d'invitation Supabase Auth part automatiquement (Edge Function `early-access-invite`, redirection vers `https://hellotitou.fr/`). Le parent pose son mot de passe depuis le lien, puis se connecte.

### Refuser

```sql
SELECT public.admin_decide_early_access('<uuid>', 'rejected');
```

Note facultative :

```sql
SELECT public.admin_decide_early_access('<uuid>', 'rejected', 'motif interne');
```

## Script Python (optionnel)

Si une clé `service_role` est disponible en variable d'environnement — **ne jamais la committer** — le même flux tient en une commande :

```bash
export HELLO_TITOU_SERVICE_ROLE_KEY='…'   # ou fichier tools/.env / tools/.service_role (gitignored)
python3 tools/early_access.py list
python3 tools/early_access.py approve <uuid>
python3 tools/early_access.py reject <uuid> --note "motif"
```

Sans cette clé, le script affiche le SQL ci-dessus et sort avec le code 2.

## Modèle d'accès

- L'inscription publique (`Créer un compte`) est fermée dans l'interface. Un appel direct à `signUp` créerait un compte `free` **sans** `access_granted` : l'appli déconnecte la personne et affiche un message d'attente.
- Après validation, le trigger `handle_new_parent_account` pose `access_granted = true` à la création du compte.
- Pour fermer complètement le trou côté Auth (création d'utilisateurs via l'API publique), décocher « Allow new users to sign up » dans Supabase Auth : les invitations continueront de fonctionner.

## Messages affichés aux parents

- Après l'envoi de la demande : « Demande reçue, vous recevrez un email dès validation. »
- Connexion sans validation : « L'inscription est réservée aux bêta testeurs validés. Déposez une demande d'accès anticipé gratuit : vous recevrez un e-mail dès validation. »
