#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Spoken French for Découvrir: article + natural child-friendly wording."""
from __future__ import annotations
import json, re, unicodedata, collections
from pathlib import Path

ROOT = Path(__file__).resolve().parent
CONTENT = json.load(open(ROOT / "content.json"))

def words(s: str) -> set[str]:
    return {w for w in s.split() if w}

def lower(s: str) -> str:
    return (s or "").strip().casefold()

def fold(s: str) -> str:
    s = unicodedata.normalize("NFD", (s or "").casefold())
    return "".join(c for c in s if not ("\u0300" <= c <= "\u036f"))

def first_token(s: str) -> str:
    s = (s or "").strip()
    return re.split(r"[\s'’]+", s, maxsplit=1)[0]

def slug(text: str, lang: str) -> str:
    s = str(text or "").strip().lower()
    s = unicodedata.normalize("NFD", s)
    s = "".join(c for c in s if not ("\u0300" <= c <= "\u036f"))
    s = re.sub(r"[^a-z0-9]+", "-", s).strip("-")[:80]
    return ("fr" if lang.startswith("fr") else "en") + "-" + s + ".mp3"

H_ASPIRE = words("hamster haricot harfang hérisson héros hibou hockey hamburger hall hangar harpe hasard haut hauteur handicap hanche harnais harpon hobby homard honte hoquet houx huit husky hache halloween haka")

# --- word classes ---
VERBS = words("""
aller allumer appeler apprendre arroser avoir avancer arriver amerrir
baigner bailler bâiller boire bouger brosser boutonner
cacher cahoter caresser chanter charger chasser chercher cligner colorier compter
construire courir couvrir crier cuire cuisiner câliner casser commander coller coudre creuser cueillir
danser demander dessiner devoir diriger dormir donner dépenser dépêcher
écouter écrire embrasser essuyer encourager emprunter envoyer économiser éclabousser éplucher éternuer éteindre
faire fermer filmer flotter frapper frotter finir foncer fondre freiner
gagner garder goûter grandir grimper
habiller
inviter
jeter jouer jardiner
laver lire
manger marcher montrer mélanger mettre monter
nager nettoyer nourrir nouer
ouvrir
partir parler passer payer peigner peindre penser perdre peser plaisanter pleurer
plonger porter poser pousser prendre préparer prêter planter partager pédaler presser promener
raconter ramasser ranger regarder rentrer répéter rester retourner rêver rire rouler
ramper rappeler rendre renverser
sauter sauver serrer skier souffler souhaiter sourire suivre sortir secouer saluer
téléphoner tenir tirer tomber tourner tousser travailler trouver taper tartiner traire
venir verser visiter voler voir voyager virevolter
se-dandiner
surfer plier
""")

NOUN_LIKE_INF = words("panier cahier papier sourire plaisir goûter dîner déjeuner souvenir pourboire danger clocher grenier escalier sentier métier quartier calendrier anniversaire fer cintre thermomètre monstre cratère cadre navire ogre peintre arbitre maître-nageur lampadaire laboratoire vétérinaire bibliothécaire caissière montgolfière portière armoire bouilloire balançoire baignoire barrière poussière piqûre huître pieuvre loutre ancre paire tirelire septembre octobre novembre décembre gingembre tonnerre extraterrestre équilibre plâtre sphère vitre")

IMPERATIVE_FIRST = words("ouvre ferme mets prend prends viens va allez regarde écoute touche respire levez asseyez arrête attends attrape cache donne fais dis lève pose range viens cours saute chante danse mange bois dors")

NO_ART = words("""
oui non stop bravo merci bonjour salut allô allez encore super
chaud froid grand petit gros grosse grande petite long longue court courte
rapide lent lente fort forte faible lourd lourde léger légère
plein pleine vide propre sale mou mouillé mouillée sec sèche
nouveau nouvelle vieux vieille jeune joli jolie beau belle
heureux heureuse triste fatigué fatiguée malade content contente
effrayé effrayée calme bruyant bruyante costaud mignon mignonne piquant piquante
doux douce sucré sucrée salé salée amer amère
rond ronde carré carrée ovale triangulaire
premier première deuxième second seconde troisième dernier dernière
haut bas dessus dessous devant derrière entre dans sur sous près loin
ici là dedans dehors autour gauche droite
après avant pendant maintenant aujourd'hui demain hier tôt tard
beaucoup peu plus moins trop assez
moi toi lui elle nous vous ils elles
mon ma mes ton ta tes son sa ses notre votre leur
avec sans pour contre chez vers par
ouvert ouverte fermé fermée allumé allumée éteint éteinte
pareil différent différente
rouge bleu bleue vert verte jaune orange rose violet violette
blanc blanche noir noire brun brune gris grise turquoise magenta beige marron doré dorée argenté argentée
un deux trois quatre cinq six sept huit neuf dix onze douze treize quatorze quinze seize
janvier février mars avril mai juin juillet août septembre octobre novembre décembre
aimé aimée fier fière surpris surprise prêt prête
respire
in out up down on off yes no
énorme énorme
""")

KEEP = {
    "au revoir", "au secours", "après toi", "à plus tard", "à bientôt", "à demain",
    "s'il te plaît", "s'il vous plaît", "de rien", "je t'en prie",
    "bonne nuit", "bon appétit", "bonne année", "joyeux noël", "joyeux anniversaire",
    "hou hou", "cui cui", "coin coin",
    "on y va", "on y va !", "c'est près", "c'est loin",
    "va tout droit", "tourne à gauche", "tourne à droite", "traverse la rue",
    "où est ?", "où est le parc ?", "où habites-tu ?", "où sont les toilettes ?",
    "comment tu t'appelles ?", "d'où viens-tu ?", "autre chose ?",
    "je peux aider ?", "je peux avoir ?", "je peux essayer ?", "je peux jouer ?",
    "je peux regarder la télé ?", "je peux venir ?", "je peux y aller ?",
    "on est bientôt arrivés ?", "parlez-vous français ?", "pouvez-vous répéter ?",
    "qu'est-ce qu'on mange ?", "combien ça coûte ?", "combien ça coûte",
    "aujourd'hui", "demain", "hier",
    "allô", "allez", "encore", "super", "bravo", "merci",
    "pas d'air dans l'espace",
    "aide les autres",
}

PROPER = {
    "france", "angleterre", "espagne", "italie", "allemagne", "chine", "japon",
    "inde", "brésil", "égypte", "australie", "canada", "mexique", "grèce",
    "états-unis", "etats-unis", "afrique", "asie", "europe", "amérique",
    "antarctique", "océanie",
    "big ben", "golden gate", "grand canyon", "grande muraille",
    "jack et le haricot magique", "petit chaperon rouge", "père noël",
    "nouvel an chinois", "voie lactée", "jupiter", "saturne",
    "t-rex",
}

COLOR_THEMES = {"colours", "colors-2", "mixing-colors"}
ACTION_THEMES = {
    "actions", "actions-home", "actions-feelings", "sports-actions",
    "classroom-verbs", "animal-actions", "pet-care", "holiday-activities",
    "directions",
}
SOUND_THEMES = {"animal-sounds"}
OPPOSITE_THEMES = {"opposites", "opposites-2", "opposites-3", "positions"}
ALPHA_NUM_THEMES = {
    "alphabet", "alphabet-2",
    "numbers1", "numbers2", "numbers-21-30", "numbers-31-60", "numbers-61-100",
}

ART_RE = re.compile(
    r"^(le |la |les |l'|l’|un |une |des |du |de la |de l'|de l’|au |aux )",
    re.I,
)

SENT_VERB = {
    "est", "sont", "a", "ont", "fait", "font", "va", "vont",
    "tourne", "tournent", "chante", "chantent", "flotte", "flottent",
    "travaille", "travaillent", "pondent", "pond",
}
SENT_PLURAL_VERB = {
    "sont", "ont", "font", "vont", "chantent", "flottent", "travaillent", "pondent", "tournent",
}

ADJ_PREFIX = words("gros grosse grand grande petit petite long longue court courte jeune vieux vieille nouveau nouvelle joli jolie beau bel belle bon bonne haut haute bas bas chaud froid mignon mignonne fort forte rapide lent gentil gentille méchant méchante autre même tout toute premier première dernier dernière")

PLURAL = words("dents ailes graines noisettes chaussures baskets chaussettes gants lunettes ciseaux céréales photos chips pancakes skis œufs oeufs pâtes vacances fêtes parents grands-parents toilettes croquettes applaudissements algues amis étoiles arts")

SING_S = words("bus nez prix temps corps ours os mois pays repas bras fils vis parcours puits tas sens héros")

# Feminine and masculine head nouns (singular)
FEM = words("""
vache poule chèvre dinde girafe grenouille souris tortue chouette
chauve-souris mouffette baleine otarie méduse orque raie crevette
abeille fourmi coccinelle libellule araignée chenille chrysalide
mouche guêpe mite punaise tique sangsue
fougère fleur rose tulipe marguerite orchidée violette pensée
feuille herbe plante mousse algue liane
lune étoile planète terre mer vague plage île crique
neige glace pluie averse grêle rosée
maison ferme cabane hutte tente
pièce cuisine chambre salle cour école crèche bibliothèque
table chaise étagère commode lampe lumière bougie
fenêtre porte clé serrure
voiture fusée moto trottinette
cuillère fourchette assiette tasse carafe bouteille casserole poêle
serviette nappe éponge brosse
robe jupe chemise veste écharpe cravate chaussette
chaussure botte sandale pantoufle casquette couronne baguette
fille sœur soeur mère maman tante cousine grand-mère mamie dame
princesses princesse fée sorcière reine
infirmière boulangère maîtresse institutrice danseuse
dent bouche lèvre langue joue oreille tête main paume
jambe cuisse cheville hanche peau
faim soif peur joie colère tristesse surprise
couleur forme ligne tache ombre
nuit journée après-midi matinée soirée
année semaine heure minute seconde
forêt jungle savane montagne colline vallée rivière rive mare
banane pomme poire fraise cerise pêche prune myrtille framboise
pastèque orange mandarine clémentine goyave papaye
carotte tomate laitue salade pomme-de-terre patate aubergine
courgette betterave oignon échalote citrouille courge olive
viande soupe omelette crêpe gaufre tarte pizza
compote confiture crème eau limonade orangeade fontaine
photo affiche carte lettre enveloppe
télé télévision radio musique chanson danse flûte guitare batterie trompette harpe
histoire légende fable
classe leçon matière récré récréation
règle gomme trousse ardoise craie
valise affaire
route rue avenue autoroute piste
gare station
statue tour cathédrale église chapelle
boussole
paella fondue hyène
image page cage nage rage
fin fois vis auto dynamo
loutre pieuvre ruche grange toile grotte coquille patte balle licorne
coupe huître barrière piqûre armoire bouilloire balançoire poussière
paire baignoire caissière montgolfière portière vitre sphère tirelire
ancre ampoule alarme antenne épaule crème part librairie hôtesse
giraffe girafe
famille équipe
tasse
crème
porte
""")

MASC = words("""
chien chat lapin hamster oiseau lézard serpent cochon cheval canard coq
poussin lion tigre éléphant singe zèbre gorille léopard rhinocéros
hippopotame dinosaure volcan os palmier météorite rocher chameau buffle
crocodile mammouth manchot phoque renard loup traîneau renne harfang
poisson raton hérisson hibou bison dingo kangourou
koala wombat wallaby dromadaire scorpion cafard scarabée papillon
escargot ver cloporte hanneton grillon criquet
moustique bourdon frelon caneton têtard
nid terrier étang océan récif requin dauphin cachalot
narval morse crabe homard oursin
jardin parc potager verger champ pré sentier chemin
arbre buisson cactus champignon tronc rameau pétale pistil pollen nectar
soleil ciel nuage arc-en-ciel éclair orage vent brouillard
frigo four évier placard tiroir canapé fauteuil tabouret bureau lit matelas
oreiller plaid tapis rideau tableau poster miroir
ordinateur clavier écran téléphone
hélicoptère avion bateau voilier sous-marin train tram tramway métro bus
camion tracteur vélo trottinette scooter skateboard
casque sac cartable
stylo crayon feutre marqueur pinceau tube pot
livre cahier classeur
ballon jouet puzzle dé yo-yo cerf-volant robot
chapeau bonnet béret casque
manteau blouson pull sweat t-shirt tee-shirt tee
pantalon short jean caleçon pyjama maillot bikini
sandwich hamburger steak taco burrito bagel bacon cookie
smoothie milkshake soda jus café thé chocolat lait yaourt
gâteau cupcake muffin brownie donut éclair
riz pain fromage beurre miel sucre sel poivre
poulet tofu
bol plat verre pichet vase seau
couteau
cœur nez œil oeil front menton cou bras poignet doigt pouce ventre dos
genou pied orteil poumon estomac cerveau muscle sang
père papa frère fils oncle cousin garçon bébé enfant copain ami
docteur médecin dentiste fermier boulanger pompier policier facteur
pilote capitaine professeur instituteur maître
roi prince chevalier dragon château donjon pont fossé
trésor coffre canon pistolet sabre bouclier
feu réchaud
voyage billet ticket passeport visa
hôtel motel aéroport terminal quai
monde continent pays état désert canyon glacier
camping pique-nique barbecue
jeu film dessin
côté moment jour mois an
lundi mardi mercredi jeudi vendredi samedi dimanche
matin midi soir
printemps été automne hiver
nord sud est ouest
cercle carré rectangle triangle ovale losange cube cylindre cône
chiffre nombre zéro
alphabet mot son bruit cri
goût parfum
cadeau paquet nœud noeud vœu voeu
magasin marché supermarché restaurant
cinéma théâtre cirque zoo musée
stade gymnase
drapeau blason
igloo totem
curling ski snowboard luge patin hockey
sport match but score
ninja pirate clown vampire samouraï
curry sushi falafel
melon kiwi cactus lotus bouquet village secret garage
radio poster ticket trident surf
pollen pigeon dodo
week-end weekend yoga yacht yak
ananas avocat abricot citron pamplemousse litchi
concombre poivron brocoli céleri radis maïs
ail
mouton cerf lama sable fennec vautour surfeur castor cygne chaton bocal
cow-boy cowboy accordéon acteur agriculteur aigle aimant amour
anglais animal anniversaire appel apiculteur arbitre arrêt artiste
alpiniste acrobate
cadre navire ogre monstre cratère thermomètre cintre
fer pourboire souvenir déjeuner dîner coucher lever
tonnerre extraterrestre équilibre lampadaire
plâtre peintre vétérinaire laboratoire bibliothécaire
geste texte rêve fleuve siège piège manège collège
meuble câble peuple rôle symbole article obstacle miracle
spectacle véhicule ongle temple exemple
service exercice légume
groupe musée lycée cimetière silence
chêne signe linge peigne
blaireau dromadaire
gâteau
bus scolaire
""")

MASC_E = words("""
père frère arbre livre beurre poivre légume groupe musée lycée cimetière silence
sable câble meuble peuple rôle symbole article obstacle miracle spectacle véhicule
cercle muscle ongle temple exemple service exercice
cygne chêne signe linge peigne rêve fleuve siège piège manège collège
monstre cratère thermomètre cintre cadre navire ogre
anniversaire accordéon équilibre plâtre
téléphone problème système diplôme typo squelette
pré côté été pâté comté
incendie génie parapluie sosie
magazine capitaine
dîner déjeuner souvenir pourboire
peintre arbitre
laboratoire
extraterrestre
gingembre
tonnerre
lycée musée
nombre chiffre
timbre coffre score genre centre ministre filtre
lièvre
linge
""")

MASC |= MASC_E

OVERRIDES = {
    "abeilles font du miel": "les abeilles font du miel",
    "araignées ont huit pattes": "les araignées ont huit pattes",
    "astronautes flottent": "les astronautes flottent",
    "baleines chantent": "les baleines chantent",
    "banane est un fruit": "la banane est un fruit",
    "fourmis travaillent ensemble": "les fourmis travaillent ensemble",
    "Lune tourne autour de la Terre": "la Lune tourne autour de la Terre",
    "Soleil est une étoile": "le Soleil est une étoile",
    "Terre tourne autour du Soleil": "la Terre tourne autour du Soleil",
    "Mars est rouge": "Mars est rouge",
    "Jupiter est la plus grosse": "Jupiter est la plus grosse",
    "Saturne a des anneaux": "Saturne a des anneaux",
    "arc et la flèche": "l'arc et la flèche",
    "lapin et la carotte": "le lapin et la carotte",
    "singe et la banane": "le singe et la banane",
    "chien et l'os": "le chien et l'os",
    "chat et le poisson": "le chat et le poisson",
    "oiseau et les graines": "l'oiseau et les graines",
    "ours et le miel": "l'ours et le miel",
    "panda et le bambou": "le panda et le bambou",
    "souris et le fromage": "la souris et le fromage",
    "vache et l'herbe": "la vache et l'herbe",
    "écureuil et les noisettes": "l'écureuil et les noisettes",
    "cheval et la pomme": "le cheval et la pomme",
    "grenouille et la mouche": "la grenouille et la mouche",
    "sucre": "le sucre",
    "sucré": "sucré",
    "marche": "la marche",
    "marché": "le marché",
    "ferme": "la ferme",
    "fermé": "fermé",
    "œil": "l'œil",
    "œuf": "l'œuf",
    "os": "l'os",
    "ours": "l'ours",
    "eau": "l'eau",
    "air": "l'air",
    "or": "l'or",
    "argent": "l'argent",
    "huile": "l'huile",
    "herbe": "l'herbe",
    "hiver": "l'hiver",
    "hôtel": "l'hôtel",
    "hôpital": "l'hôpital",
    "école": "l'école",
    "église": "l'église",
    "île": "l'île",
    "orange": "l'orange",
    "rose": "la rose",
    "glace": "la glace",
    "neige": "la neige",
    "mer": "la mer",
    "lune": "la lune",
    "Lune": "la Lune",
    "soleil": "le soleil",
    "Soleil": "le Soleil",
    "nuit": "la nuit",
    "cœur": "le cœur",
    "sœur": "la sœur",
    "nœud": "le nœud",
    "vœu": "le vœu",
    "hamster": "le hamster",
    "hibou": "le hibou",
    "hérisson": "le hérisson",
    "homard": "le homard",
    "haricot": "le haricot",
    "harfang": "le harfang",
    "hamburger": "le hamburger",
    "hippopotame": "l'hippopotame",
    "hélicoptère": "l'hélicoptère",
    "hyène": "l'hyène",
    "homme": "l'homme",
    "habit": "l'habit",
    "horloge": "l'horloge",
    "mars": "mars",
    "Mars": "la planète Mars",
    "il": "il",
    "arts plastiques": "les arts plastiques",
    "applaudissements": "les applaudissements",
    "croquettes": "les croquettes",
    "coucher de soleil": "le coucher de soleil",
    "coucher du soleil": "le coucher du soleil",
    "lever de soleil": "le lever de soleil",
    "lever du soleil": "le lever du soleil",
    "air frais": "l'air frais",
    "part triangulaire": "la part triangulaire",
    "hôtel": "l'hôtel",
    "hôtesse de l'air": "l'hôtesse de l'air",
    "gâteau d'anniversaire": "le gâteau d'anniversaire",
    "pas d'air dans l'espace": "pas d'air dans l'espace",
    "marche sur la Lune": "la marche sur la Lune",
    "saxophone": "le saxophone",
    "belle au bois dormant": "la belle au bois dormant",
    "fier": "fier",
    "fier de moi": "fier de moi",
    "plier": "plier",
    "surpris": "surpris",
    "prêt": "prêt",
    "content parce que": "content parce que",
    "triste parce que": "triste parce que",
    "en colère": "en colère",
    "en désordre": "en désordre",
    "en haut": "en haut",
    "en bas": "en bas",
    "en haut dans le ciel": "en haut dans le ciel",
    "en bas dans le trou": "en bas dans le trou",
    "en voiture": "en voiture",
    "en face de": "en face de",
    "heureux pour toujours": "heureux pour toujours",
}

ID_OVERRIDES = {
    "orange-col": "orange",
    "pink": "rose",
    "purple": "violet",
    "colors-2.violet": "violet",
    "colors-2.turquoise": "turquoise",
}

def starts_with_vowel_sound(word: str) -> bool:
    w = (word or "").strip().casefold()
    w = re.sub(r"^[^0-9a-zàâäéèêëïîôùûüçœæ]+", "", w)
    if not w:
        return False
    base = first_token(w)
    folded_h = {fold(x) for x in H_ASPIRE}
    if lower(base) in H_ASPIRE or fold(base) in folded_h:
        return False
    if base[0] in "aeiouàâäéèêëïîôùûüœæ":
        return True
    if base[0] in "yY" and len(base) > 1 and base[1] in "aàâoôuù":
        return False
    if base[0] in "yY":
        return True
    if base[0] == "h":
        return True
    return False

def gender_of(noun: str) -> str:
    n = lower(noun).rstrip("!?.,;:")
    fem_f = {fold(x) for x in FEM}
    masc_f = {fold(x) for x in MASC}
    if n in FEM or fold(n) in fem_f:
        return "f"
    if n in MASC or fold(n) in masc_f:
        return "m"
    if n.endswith(("tion", "sion", "xion", "aison", "té", "tié", "ude", "ade", "ée", "ette", "elle", "esse", "ance", "ence", "euse", "ante", "trice", "ie")):
        if n not in words("incendie génie parapluie silence commerce musée lycée"):
            return "f"
    if n.endswith(("age", "ment", "isme", "eau", "isme")):
        if n not in words("image plage cage nage page rage neige"):
            return "m"
    if n.endswith("e"):
        if n in MASC_E or fold(n) in {fold(x) for x in MASC_E}:
            return "m"
        return "f"
    return "m"

def is_plural_word(w: str) -> bool:
    n = lower(w)
    if n in PLURAL:
        return True
    if n in SING_S:
        return False
    if n.endswith("s") and lower(n[:-1]) in FEM | MASC | PLURAL:
        return True
    if n.endswith("s") and n[:-1] and gender_of(n[:-1]) in {"f", "m"} and n not in SING_S and len(n) > 3:
        # only if the singular is a known noun or ends like a noun we classified
        if lower(n[:-1]) in FEM | MASC:
            return True
    return False

def head_noun(fr: str) -> tuple[str, str, bool]:
    parts = fr.strip().split()
    if not parts:
        return "", "", False
    first = parts[0]
    if lower(first) in ADJ_PREFIX and len(parts) >= 2:
        head = parts[1]
        pl = is_plural_word(head)
        return head, first, pl
    return first, first, is_plural_word(first)

def article_for(head: str, first_word: str, plural: bool) -> str:
    if plural:
        return "les "
    if starts_with_vowel_sound(first_word):
        return "l'"
    if gender_of(head) == "f":
        return "la "
    return "le "

def is_verb_like(fr: str, en: str, theme_id: str) -> bool:
    f = lower(fr)
    first = first_token(f)
    if f.startswith(("se ", "s'", "s’")):
        return True
    if first in VERBS or fold(first) in {fold(x) for x in VERBS}:
        return True
    if theme_id in ACTION_THEMES and first.endswith(("er", "ir", "re")) and first not in NOUN_LIKE_INF and first not in FEM | MASC:
        return True
    if first.endswith("er") and first not in NOUN_LIKE_INF and first not in FEM | MASC and first not in MASC_E:
        if not first.endswith(("ier", "oyer", "oir")) and len(first) > 4:
            # treat as infinitive unless clearly a noun ending
            if first.endswith(("oire", "ière", "iere", "ètre", "etre", "aire")):
                return False
            return True
    return False

def speak_fr(fr: str, en: str, theme_id: str, item_id: str) -> tuple[str, str]:
    raw = (fr or "").strip()
    if not raw:
        return raw, "empty"
    low = lower(raw)
    first = first_token(raw)

    if item_id in ID_OVERRIDES:
        return ID_OVERRIDES[item_id], "id-override"
    if raw in OVERRIDES:
        return OVERRIDES[raw], "override"

    if low in {lower(x) for x in KEEP} or raw in KEEP:
        return raw, "keep"
    if theme_id in ALPHA_NUM_THEMES:
        return raw, "alnum"
    if theme_id in COLOR_THEMES:
        return raw, "color"
    if theme_id in SOUND_THEMES:
        return raw, "sound"

    if low.startswith((
        "en ",
        "je ", "j'", "j’", "tu ", "il ", "elle ", "on ", "nous ", "vous ",
        "ils ", "elles ", "ce ", "c'est", "c’est", "ça ", "c'est ",
        "pas ", "pas d", "il y a", "s'il", "s’il",
        "mon ", "ma ", "mes ", "ton ", "ta ", "tes ", "son ", "sa ", "ses ",
        "notre ", "votre ", "leur ",
    )):
        return raw, "sentence"
    if first in {"je", "tu", "il", "elle", "on", "nous", "vous", "ils", "elles",
                 "mon", "ma", "mes", "ton", "ta", "tes", "son", "sa", "ses",
                 "notre", "votre", "leur", "ce", "ça", "ceci", "cela"}:
        return raw, "pronoun"
    if raw.endswith(("-moi", "-toi", "-vous", "-nous", "-lui")) or first.endswith(("-moi", "-toi", "-vous", "-nous", "-lui")):
        return raw, "imperative"
    if first in IMPERATIVE_FIRST:
        return raw, "imperative"

    MONTHS = words("janvier février fevrier mars avril mai juin juillet août aout septembre octobre novembre décembre decembre")
    if low in MONTHS or first in MONTHS:
        return raw, "month"
    if first in words("un une deux trois quatre cinq six sept huit neuf dix onze douze treize quatorze quinze seize vingt trente quarante cinquante soixante"):
        return raw, "number-phrase"

    if theme_id in OPPOSITE_THEMES and " " not in raw:
        return raw, "opposite"
    if ART_RE.match(raw):
        return raw, "has-art"
    if low in PROPER or raw in PROPER:
        return raw, "proper"
    if raw[0].isupper() and " " in raw and lower(raw.split()[0]) not in FEM | MASC:
        if low not in {lower(x) for x in KEEP}:
            return raw, "proper-cap"

    if is_verb_like(raw, en, theme_id):
        return raw, "verb"
    if low in NO_ART or first in NO_ART:
        parts = raw.split()
        PREP = {"de","des","du","d","parce","pour","avec","en","à","a","sans","sur","sous","dans","par","comme"}
        if len(parts) == 1 or (len(parts) > 1 and lower(parts[1]) in PREP):
            return raw, "no-art"

    parts = raw.split()
    if len(parts) >= 2 and lower(parts[1]) in SENT_VERB:
        pl = lower(parts[1]) in SENT_PLURAL_VERB or is_plural_word(parts[0])
        if pl:
            art = "les "
        else:
            art = article_for(parts[0], parts[0], False)
        return art + raw, "sentence-art"

    head, firstw, pl = head_noun(raw)
    g = gender_of(head or firstw)
    art = article_for(head or firstw, firstw, pl)
    reason = "noun-f" if g == "f" else "noun-m"
    if head not in FEM and head not in MASC and lower(head) not in FEM and lower(head) not in MASC:
        reason = "noun-guess-" + g
    return art + raw, reason

def main() -> None:
    mapping = {}
    review = []
    todo = {}
    slug_to_texts = collections.defaultdict(set)
    adjusted = []
    reasons_c = collections.Counter()
    n_items = 0
    used_ids = 0
    for t in CONTENT["themes"]:
        tid = t.get("id") or ""
        tfr = t.get("fr") or t.get("en") or tid
        for it in t["items"]:
            n_items += 1
            fr = (it.get("fr") or "").strip()
            en = it.get("en") or ""
            iid = it.get("id") or ""
            spoken, reason = speak_fr(fr, en, tid, iid)
            reasons_c[reason] += 1
            if iid in ID_OVERRIDES:
                mapping["#" + iid] = spoken
                used_ids += 1
            elif spoken != fr:
                prev = mapping.get(fr)
                if prev and prev != spoken:
                    mapping["#" + iid] = spoken
                    review.append("CONFLICT %r %r vs %r id=%s theme=%s" % (fr, prev, spoken, iid, tfr))
                else:
                    mapping[fr] = spoken
            if spoken != fr:
                adjusted.append((fr, spoken, en, it.get("emoji", ""), tfr, reason, iid))
            if reason.startswith("noun-guess") or reason == "proper-cap":
                review.append("%-16s %r -> %r  en=%r  [%s]" % (reason, fr, spoken, en, tfr))
            sl = slug(spoken, "fr-FR")
            slug_to_texts[sl].add(spoken)
            todo.setdefault(sl, [spoken, "fr-FR"])

    conflicts = {k: v for k, v in slug_to_texts.items() if len(v) > 1}
    print("items", n_items)
    print("mapping", len(mapping), "id keys", used_ids)
    print("unique slugs", len(todo))
    print("adjusted", len(adjusted))
    print("slug collisions", len(conflicts))
    for k, v in conflicts.items():
        print("  SLUG", k, v)
        review.append("SLUG-COLLISION %s %s" % (k, v))
    print("reasons", reasons_c)

    (ROOT / "discover_fr.json").write_text(
        json.dumps({"map": mapping, "count": len(mapping), "slugs": len(todo)}, ensure_ascii=False, indent=0),
        encoding="utf-8",
    )
    js = "/* Hello Titou — spoken French for Découvrir (generated by tools/build_discover_fr.py) */\n"
    js += "window.HT_DISCOVER_FR = " + json.dumps(mapping, ensure_ascii=False, separators=(",", ":")) + ";\n"
    (ROOT / "discover_fr.js").write_text(js, encoding="utf-8")
    Path("/workspace/appli-enfant/discover-fr.js").write_text(js, encoding="utf-8")
    (ROOT / "discover_fr_todo.json").write_text(json.dumps(todo, ensure_ascii=False, indent=0), encoding="utf-8")
    lines = ["adjusted %s mapping %s slugs %s collisions %s\n" % (len(adjusted), len(mapping), len(todo), len(conflicts)), "=== REVIEW ===\n"]
    lines.extend(review)
    lines.append("\n=== ADJUSTED sample ===\n")
    for row in adjusted[:120]:
        lines.append("%-16s %r -> %r  (%s) [%s]" % (row[5], row[0], row[1], row[2], row[4]))
    (ROOT / "discover_fr_review.txt").write_text("\n".join(lines), encoding="utf-8")
    print("wrote files; review lines", len(review))

if __name__ == "__main__":
    main()
