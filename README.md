# Hello Titou

Petit jeu web pour aider les enfants de 4 à 8 ans à **entendre et apprendre l’anglais** en s’amusant, avec Titou.

L’enfant choisit un avatar, un âge, puis une **catégorie** et un **thème** : plus de 330 thèmes répartis en 28 catégories (animaux, forêt, petites bêtes, mer, légumes, métiers, secours, contes, voyages…). Trois mini-jeux :

- **Découvrir** — on touche une image et on écoute le mot
- **Trouve** — on écoute un mot ou une petite phrase, puis on touche la bonne image
- **Memory** — on retrouve les paires

### Les jeux de Titou

Bouton **🎮 Jeux** : 21 petits jeux, pensés comme une séance avec une maîtresse d’anglais (manches très courtes, voix immédiate, encouragements, consigne en français + petite main qui montre).

- **4–5 ans** (aucune lecture) : Écoute et touche · Le ballon de Titou · Coloriage magique · Nourris Titou · Un ou plusieurs ? · Grand, petit, sur, sous · Répète avec Titou
- **6 ans** : Mémoire sonore · Habille Titou · Jacques a dit (on bouge pour de vrai !) · Compte avec Titou · Les petites phrases · Qui fait quoi ? · Réponds à Titou
- **7–8 ans** : Construis la phrase · Où est Titou ? · Écoute l’histoire (18 histoires) · Le magasin de Titou · À toi de parler (micro, jamais bloquant) · Le bon petit mot · Joue avec Titou

**Grammaire et expression** : la grammaire reste implicite (on écoute une petite phrase et on touche la bonne image). Chaque jeu a 3 niveaux : l'enfant monte d'un niveau après 3 étoiles, les plus grands commencent plus haut, et une séance va du plus facile au plus dur. Les phrases ne reviennent pas avant d'avoir fait le tour de la réserve (environ 2 000 phrases audio) : un / plusieurs (jusqu'à cinq, -es, pluriels irréguliers), grand / petit, couleur + nom, in / on / under / next to / behind / in front of, I like / I don't like, this / these, can / can't, he / she / they + …ing, am / is / are, has / have, a / an, there is / there are, his / her, do / does, passé simple, comparatifs, mots interrogatifs (what / where / who…), Is / Are …ing ?. Les jeux d'expression (environ 100 phrases à répéter, des questions et des petits dialogues) font choisir une réponse, écouter le modèle, puis le dire (micro si disponible, sinon « J'ai dit ! »).

Chaque jeu se débloque avec **2 étoiles sur 3** au jeu d’avant (les jeux des âges plus petits restent ouverts). Un parent peut tout débloquer (petite question). Une **Révision surprise** repropose les mots appris après 1, 3 puis 7 jours, et Titou gagne des **accessoires** (casquette, lunettes, cape, couronne…) à porter dans sa garde-robe.

### Progression par âge

- **4–5 ans** : des mots simples avec une image, peu de choix.
- **6 ans** : plus de mots, et de petits groupes de mots (« a red apple »).
- **7–8 ans** : des phrases utiles (« I like carrots. », « Where is the frog? »), des verbes, plus de choix.

Dans chaque thème, les mots vont du plus facile au plus difficile : l’âge de l’enfant (et son niveau) débloque les mots suivants.

La voix est en **anglais américain**. Une consigne en français peut précéder les questions. Le jeu est **réservé aux comptes parents validés**. Les progrès (étoiles, mots appris) sont synchronisés entre les appareils du compte ; d’éventuels progrès déjà enregistrés en local sont conservés et peuvent être repris après connexion.

## Jouer

Version en ligne : [https://hellotitou.fr](https://hellotitou.fr)

Ou ouvrir le fichier `index.html` dans un navigateur (Chrome, Safari, Edge…), avec `content.js` et `games.js` à côté. Les sons se chargent en ligne.

## Parents

En haut à droite : **Se connecter** (e-mail + mot de passe) si votre accès a déjà été validé, ou **Accès anticipé gratuit** pour déposer une demande (bêta testeur). Sans compte validé, le jeu n’est pas accessible. Une fois le parent connecté, les enfants n’ont plus rien à taper : ils choisissent juste leur avatar. La zone parents (profils, remise à zéro) est protégée par une petite question.

Des offres d’abonnement (19 € / mois ou 399 € à vie) sont présentées dans la page **Abonnements**. Les paiements ne sont pas encore ouverts. Un accès anticipé gratuit est proposé aux bêta testeurs, sur demande et après validation (voir `tools/early_access.md`).

## Technique

Application statique : `index.html` (jeu), `content.js` (catégories, thèmes, mots et phrases) et `games.js` (les 21 jeux, la révision et les accessoires). L’audio est hébergé sur un bucket public Supabase. Les pages publiques (accueil, blog, aide, mentions) restent accessibles sans compte. Le jeu lui-même exige un compte parent validé ; le navigateur peut encore conserver des progrès locaux (`localStorage`) pour les reprendre après connexion.

## Nom de domaine

Le site est servi sur **hellotitou.fr** (fichier `CNAME`), via GitHub Pages.
