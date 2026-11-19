# Hello Titou

Petit jeu web pour aider les enfants de 4 à 8 ans à **entendre et apprendre l’anglais** en s’amusant, avec Titou.

L’enfant choisit un avatar, un âge, puis des thèmes (animaux, couleurs, maison, secours…). Trois mini-jeux :

- **Découvrir** — on touche une image et on écoute le mot
- **Trouve** — on écoute un mot ou une petite phrase, puis on touche la bonne image
- **Memory** — on retrouve les paires

La voix est en **anglais américain**. Une consigne en français peut précéder les questions. Les progrès (étoiles, mots appris) restent sur l’appareil, et un **compte parent** permet de les synchroniser entre plusieurs appareils.

## Jouer

Version en ligne : [https://aurelienbringard.github.io/hello-titou/](https://aurelienbringard.github.io/hello-titou/)

Ou ouvrir simplement le fichier `index.html` dans un navigateur (Chrome, Safari, Edge…). Un seul fichier suffit : les sons se chargent en ligne.

## Parents

En haut à droite : **Se connecter** pour créer un compte (e-mail + mot de passe). Une fois le parent connecté, les enfants n’ont plus rien à taper : ils choisissent juste leur avatar. La zone parents (profils, remise à zéro) est protégée par une petite question.

Des offres d’abonnement (19 € / mois ou 399 € à vie) sont présentées dans la page **Abonnements**. Les paiements ne sont pas encore ouverts : tout le jeu reste gratuit pour le moment.

## Technique

Application statique en un seul `index.html`. L’audio est hébergé sur un bucket public Supabase. Sans compte, tout reste en local (`localStorage`).

## Nom de domaine (plus tard)

Quand le nom de domaine **hellotitou.fr** sera prêt, il suffira d’ajouter un fichier `CNAME` à la racine de ce dépôt (une seule ligne contenant `hellotitou.fr`) et de pointer le DNS vers GitHub Pages. Ce fichier n’est pas encore ajouté, pour ne pas casser l’adresse actuelle en `github.io`.
