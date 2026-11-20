# Hello Titou

Petit jeu web pour aider les enfants de 4 à 8 ans à **entendre et apprendre l’anglais** en s’amusant, avec Titou.

L’enfant choisit un avatar, un âge, puis une **catégorie** et un **thème** : plus de 330 thèmes répartis en 28 catégories (animaux, forêt, petites bêtes, mer, légumes, métiers, secours, contes, voyages…). Trois mini-jeux :

- **Découvrir** — on touche une image et on écoute le mot
- **Trouve** — on écoute un mot ou une petite phrase, puis on touche la bonne image
- **Memory** — on retrouve les paires

### Progression par âge

- **4–5 ans** : des mots simples avec une image, peu de choix.
- **6 ans** : plus de mots, et de petits groupes de mots (« a red apple »).
- **7–8 ans** : des phrases utiles (« I like carrots. », « Where is the frog? »), des verbes, plus de choix.

Dans chaque thème, les mots vont du plus facile au plus difficile : l’âge de l’enfant (et son niveau) débloque les mots suivants.

La voix est en **anglais américain**. Une consigne en français peut précéder les questions. Les progrès (étoiles, mots appris) restent sur l’appareil, et un **compte parent** permet de les synchroniser entre plusieurs appareils.

## Jouer

Version en ligne : [https://hellotitou.fr](https://hellotitou.fr)

Ou ouvrir le fichier `index.html` dans un navigateur (Chrome, Safari, Edge…), avec `content.js` à côté. Les sons se chargent en ligne.

## Parents

En haut à droite : **Se connecter** pour créer un compte (e-mail + mot de passe). Une fois le parent connecté, les enfants n’ont plus rien à taper : ils choisissent juste leur avatar. La zone parents (profils, remise à zéro) est protégée par une petite question.

Des offres d’abonnement (19 € / mois ou 399 € à vie) sont présentées dans la page **Abonnements**. Les paiements ne sont pas encore ouverts : tout le jeu reste gratuit pour le moment.

## Technique

Application statique : `index.html` (jeu) et `content.js` (catégories, thèmes, mots et phrases). L’audio est hébergé sur un bucket public Supabase. Sans compte, tout reste en local (`localStorage`).

## Nom de domaine

Le site est servi sur **hellotitou.fr** (fichier `CNAME`), via GitHub Pages.
