/* Hello Titou — games pack (21 jeux, déblocage, révision, récompenses). Loaded before the main script. */
(function () {
"use strict";
const G = {};
window.HT_GAMES = G;

/* ---------- Games list (order = unlocking order) ---------- */
const GAMES = [
  { id: "listen",  n: 1,  band: 4, open: 1, emoji: "🎯", fr: "Écoute et touche",     en: "Listen and tap",   intro: "Écoute, et touche la bonne image !" },
  { id: "balloon", n: 2,  band: 4, open: 1, emoji: "🎈", fr: "Le ballon de Titou",   en: "Pop the balloon",  intro: "Écoute bien, et éclate le bon ballon !" },
  { id: "paint",   n: 3,  band: 4, emoji: "🎨", fr: "Coloriage magique",    en: "Magic colors",     intro: "Écoute la couleur, et touche le bon pot de peinture !" },
  { id: "feed",    n: 4,  band: 4, emoji: "🍎", fr: "Nourris Titou",        en: "Feed Titou",       intro: "Titou a faim ! Donne-lui ce qu'il demande." },
  { id: "plural",  n: 5,  band: 4, emoji: "🍒", fr: "Un ou plusieurs ?",    en: "One or many?",     intro: "Écoute bien : un seul, ou plusieurs ? Touche la bonne image !", kind: "grammar" },
  { id: "sizes",   n: 6,  band: 4, emoji: "🐘", fr: "Grand, petit, sur, sous", en: "Big, small, on, under", intro: "Écoute bien les petits mots : grand ou petit, sur ou sous ? Touche la bonne image !", kind: "grammar" },
  { id: "repeat",  n: 7,  band: 4, emoji: "🦜", fr: "Répète avec Titou",    en: "Say it with Titou", intro: "Écoute Titou, puis répète comme un perroquet !", kind: "speak" },
  { id: "memory",  n: 8,  band: 6, emoji: "🃏", fr: "Mémoire sonore",       en: "Sound memory",     intro: "Trouve les paires ! Écoute bien chaque mot." },
  { id: "dress",   n: 9,  band: 6, emoji: "👕", fr: "Habille Titou",        en: "Dress Titou",      intro: "Habille Titou ! Écoute bien la couleur et le vêtement." },
  { id: "simon",   n: 10, band: 6, emoji: "🙌", fr: "Jacques a dit",        en: "Simon says",       intro: "Jacques a dit ! Touche la bonne image, puis fais-le pour de vrai !" },
  { id: "count",   n: 11, band: 6, emoji: "🔢", fr: "Compte avec Titou",    en: "Count with Titou", intro: "Compte avec Titou ! Touche le groupe qui a le bon nombre." },
  { id: "phrases", n: 12, band: 6, emoji: "👍", fr: "Les petites phrases",  en: "Little sentences", intro: "Écoute bien la petite phrase de Titou, et touche la bonne image !", kind: "grammar" },
  { id: "who",     n: 13, band: 6, emoji: "👧", fr: "Qui fait quoi ?",      en: "Who is doing what?", intro: "Écoute bien : c'est une fille ou un garçon ? Et qu'est-ce qu'il fait ? Touche la bonne image !", kind: "grammar" },
  { id: "answer",  n: 14, band: 6, emoji: "💬", fr: "Réponds à Titou",      en: "Answer Titou",     intro: "Titou te pose une question. Touche ta réponse, puis dis-la en anglais !", kind: "speak" },
  { id: "build",   n: 15, band: 7, emoji: "🧩", fr: "Construis la phrase",  en: "Build the phrase", intro: "Écoute, puis touche les images dans le bon ordre !" },
  { id: "where",   n: 16, band: 7, emoji: "📍", fr: "Où est Titou ?",       en: "Where is Titou?",  intro: "Où est Titou ? Écoute, et touche la bonne image." },
  { id: "story",   n: 17, band: 7, emoji: "📖", fr: "Écoute l'histoire",    en: "Story time",       intro: "Écoute bien l'histoire, puis réponds aux questions !" },
  { id: "shop",    n: 18, band: 7, emoji: "🛒", fr: "Le magasin de Titou",  en: "Titou's shop",     intro: "Bienvenue au magasin ! Mets dans le panier ce qu'on te demande, puis touche le bouton vert." },
  { id: "speak",   n: 19, band: 7, emoji: "🎤", fr: "À toi de parler",      en: "Your turn to speak", intro: "À toi de parler ! Écoute Titou, puis répète." },
  { id: "gap",     n: 20, band: 7, emoji: "✏️", fr: "Le bon petit mot",     en: "The right word",   intro: "Écoute la phrase. Il manque un petit mot : touche le bon !", kind: "grammar" },
  { id: "talk",    n: 21, band: 7, emoji: "🎭", fr: "Joue avec Titou",      en: "Talk with Titou",  intro: "On joue une petite scène ! Écoute Titou, choisis ta réponse, puis dis-la.", kind: "speak" }
];
const GAME = {}; GAMES.forEach(function (g) { GAME[g.id] = g; });
const BAND_LABEL = { 4: "4–5 ans", 6: "6 ans", 7: "7–8 ans" };

/* French instructions + English feedback (all pre-generated audio) */
const FR = {
  hub: "Choisis un jeu !",
  locked: "Réussis le jeu d'avant pour débloquer !",
  unlocked: "Bravo ! Un nouveau jeu est débloqué !",
  reward: "Tu as gagné un cadeau pour Titou !",
  wardrobe: "Choisis un accessoire pour Titou !",
  review: "C'est l'heure de la révision surprise !",
  noReview: "Rien à réviser aujourd'hui. Reviens demain !",
  mic: "Appuie sur le micro, et parle !",
  selfCheck: "Répète à voix haute, puis touche le pouce !",
  move: "Fais-le pour de vrai !",
  basket: "Touche le bouton vert quand tu as fini !",
  order: "D'abord : grand ou petit ?",
  story: "Maintenant, les questions !",
  drag: "Fais glisser, ou touche !",
  lockedAcc: "Gagne des étoiles pour avoir ce cadeau !",
  choose: "Tu peux choisir ce que tu veux !",
  sayIt: "À toi ! Dis-le en anglais.",
  sayName: "À toi ! Dis : My name is… et ton prénom !"
};
const EN = {
  yes: ["Well done!", "Great job!", "Yes!", "Awesome!", "You did it!"],
  again: "Try again!",
  yum: "Yum yum! Thank you!",
  noThanks: "No, thank you!",
  nowYou: "Now you do it!",
  greatTry: "Great try! Listen again.",
  goodTry: "Good try! Well done!",
  yourTurn: "Your turn!",
  hereYouAre: "Here you are!",
  countAgain: "Let's count again!",
  story: "Listen to the story.",
  look: "Look at Titou!",
  pop: "Pop!"
};

/* ---------- Content ---------- */
const PAINT = { red: "#ff3b30", blue: "#0a84ff", yellow: "#ffd60a", green: "#34c759", orange: "#ff9f0a", purple: "#af52de", pink: "#ff6fae", brown: "#a2724a" };
const BALLOON_WORDS = [
  ["banana", "🍌"], ["apple", "🍎"], ["cat", "🐱"], ["dog", "🐶"], ["duck", "🦆"], ["fish", "🐟"], ["star", "⭐"], ["car", "🚗"],
  ["ball", "⚽"], ["strawberry", "🍓"], ["pig", "🐷"], ["cow", "🐮"], ["frog", "🐸"], ["sun", "☀️"], ["teddy bear", "🧸"], ["flower", "🌸"],
  ["cake", "🎂"], ["bus", "🚌"]
];
const FOODS = [
  ["an apple", "🍎"], ["a banana", "🍌"], ["a carrot", "🥕"], ["some cheese", "🧀"], ["a cookie", "🍪"], ["a strawberry", "🍓"],
  ["some pizza", "🍕"], ["some grapes", "🍇"], ["an ice cream", "🍦"], ["some cake", "🍰"], ["some bread", "🍞"], ["an egg", "🥚"],
  ["a pear", "🍐"], ["some watermelon", "🍉"], ["a croissant", "🥐"], ["some corn", "🌽"]
];
const DRESS_COLORS = ["red", "blue", "green", "yellow", "pink", "purple", "orange"];
const DRESS_ITEMS = [
  { id: "hat", one: true }, { id: "t-shirt", one: true }, { id: "scarf", one: true }, { id: "shoes", one: false }, { id: "gloves", one: false }
];
function dressPhrase(color, item) { return (item.one ? "A " + color + " " : color.charAt(0).toUpperCase() + color.slice(1) + " ") + item.id + "!"; }
const SIMON = [
  ["jump", "🦘"], ["clap your hands", "👏"], ["touch your nose", "👃"], ["turn around", "🔄"], ["sit down", "🪑"], ["stand up", "🧍"],
  ["wave hello", "👋"], ["stomp your feet", "🦶"], ["hop like a bunny", "🐇"], ["run", "🏃"], ["dance", "💃"], ["sleep", "😴"],
  ["touch your head", "🙆"], ["raise your arms", "🙌"], ["swim", "🏊"], ["fly like a bird", "🐦"]
];
function simonPhrase(a) { return "Simon says: " + a + "!"; }
const NUMW = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen", "sixteen", "seventeen", "eighteen", "nineteen", "twenty"];
const COUNT_OBJ = [["cat", "cats", "🐱"], ["dog", "dogs", "🐶"], ["apple", "apples", "🍎"], ["star", "stars", "⭐"], ["ball", "balls", "⚽"], ["duck", "ducks", "🦆"]];
const COUNT_BIG = ["apple", "star", "ball"];
function countPhrase(n, o) { const w = NUMW[n]; return w.charAt(0).toUpperCase() + w.slice(1) + " " + (n === 1 ? o[0] : o[1]) + "!"; }
const BUILD_COLORS = ["red", "blue", "green", "yellow", "pink", "purple"];
const BUILD_NOUNS = ["ball", "star", "heart", "fish", "car", "balloon"];
function buildPhrase(size, color, noun) { return "The " + size + " " + color + " " + noun + "."; }
const WHERE = {
  box:   { label: "box",   preps: ["in", "on", "behind", "next to", "in front of"] },
  table: { label: "table", preps: ["on", "under", "next to", "behind"] },
  tree:  { label: "tree",  preps: ["behind", "next to", "in front of"] },
  car:   { label: "car",   preps: ["on", "behind", "next to", "in front of"] },
  house: { label: "house", preps: ["on", "behind", "next to", "in front of"] }
};
function wherePhrase(prep, obj) { return "Titou is " + prep + " the " + obj + "."; }
const SHOP = [["apple", "apples", "🍎"], ["banana", "bananas", "🍌"], ["carrot", "carrots", "🥕"], ["tomato", "tomatoes", "🍅"],
  ["egg", "eggs", "🥚"], ["lemon", "lemons", "🍋"], ["cookie", "cookies", "🍪"], ["strawberry", "strawberries", "🍓"]];
function shopPhrase(n, o) { return "Can I have " + NUMW[n] + " " + (n === 1 ? o[0] : o[1]) + ", please?"; }
const SPEAK_WORDS = [["apple", "🍎"], ["banana", "🍌"], ["cat", "🐱"], ["dog", "🐶"], ["fish", "🐟"], ["ball", "⚽"], ["star", "⭐"], ["sun", "☀️"],
  ["bird", "🐦"], ["tree", "🌳"], ["book", "📖"], ["frog", "🐸"]];
const SPEAK_PHRASES = [["Hello!", "👋"], ["Thank you!", "🙏"], ["Good morning!", "🌅"], ["Good night!", "🌙"], ["I like apples.", "🍎"],
  ["I love my dog.", "🐶"], ["How are you?", "🙂"], ["I am happy.", "😊"], ["It is sunny.", "☀️"], ["Look, a rainbow!", "🌈"],
  ["I can jump.", "🦘"], ["My cat is black.", "🐈‍⬛"], ["See you later!", "👋"], ["I am six.", "6️⃣"], ["I like pizza.", "🍕"]];

/* Stories: 3 pictures + 3 sentences + 3 questions (answer first). "T" = Titou. */
const STORIES = [
  { t: "Tom the cat", p: [["🐱", "This is Tom. Tom is a little cat."], ["🐱🍳", "Tom is in the kitchen. He is hungry."], ["👩🐟🐱", "Mom gives Tom a fish. Yum!"]],
    q: [["Who is hungry?", ["🐱", "🐶", "🐰"]], ["Where is Tom?", ["🍳", "🛏️", "🌳"]], ["What does Tom eat?", ["🐟", "🍎", "🍕"]]] },
  { t: "A rainy day", p: [["🌧️", "It is raining today."], ["👧☂️", "Lily takes her red umbrella."], ["👧💦", "She jumps in the puddles. Splash!"]],
    q: [["What is the weather like?", ["🌧️", "☀️", "❄️"]], ["What does Lily take?", ["☂️", "🎒", "🧸"]], ["Who jumps in the puddles?", ["👧", "👴", "🐶"]]] },
  { t: "The lost ball", p: [["👦⚽", "Max has a ball."], ["⚽🛏️", "Oh no! The ball is under the bed."], ["🐶⚽", "His dog finds the ball. Good dog!"]],
    q: [["What does Max have?", ["⚽", "🪁", "🚗"]], ["Where is the ball?", ["🛏️", "🌳", "🚗"]], ["Who finds the ball?", ["🐶", "🐱", "🐦"]]] },
  { t: "Happy birthday", p: [["👧🎂", "Today is Emma's birthday."], ["🎂🕯️", "She has a big cake with six candles."], ["👫🎶", "Her friends sing Happy Birthday!"]],
    q: [["Who has a birthday?", ["👧", "👦", "👵"]], ["What does Emma have?", ["🎂", "🍕", "🍦"]], ["How many candles are there?", ["6️⃣", "3️⃣", "9️⃣"]]] },
  { t: "At the farm", p: [["👦🚜", "Ben goes to the farm."], ["🐮🐷", "He sees a cow and a pig."], ["🐷😴", "The pig is very tired. It sleeps in the hay."]],
    q: [["Where does Ben go?", ["🚜", "🏫", "🏖️"]], ["What animal does Ben see?", ["🐮", "🦁", "🐧"]], ["What does the pig do?", ["😴", "🏊", "💃"]]] },
  { t: "At the beach", p: [["☀️🏖️", "It is sunny. Sam is at the beach."], ["👦🏰", "He builds a big sandcastle."], ["🦀", "A little crab walks on the sand."]],
    q: [["Where is Sam?", ["🏖️", "🏫", "🏔️"]], ["What does Sam build?", ["🏰", "🚗", "⛄"]], ["Who walks on the sand?", ["🦀", "🐘", "🐔"]]] },
  { t: "The snowman", p: [["❄️", "It is winter. It is snowing."], ["👧👦⛄", "Mia and Leo make a snowman."], ["⛄🥕", "The snowman has a carrot nose."]],
    q: [["What is the weather like?", ["❄️", "☀️", "🌧️"]], ["What do Mia and Leo make?", ["⛄", "🏰", "🎂"]], ["What is the snowman's nose?", ["🥕", "🍌", "🍎"]]] },
  { t: "Good night, Titou", p: [["🌙", "It is night. The moon is in the sky."], ["T📖", "Titou reads a book with Dad."], ["T🛏️", "Then he goes to bed. Good night, Titou!"]],
    q: [["What is in the sky?", ["🌙", "🌈", "✈️"]], ["What does Titou read?", ["📖", "📺", "🎨"]], ["Where does Titou go?", ["🛏️", "🏫", "🏖️"]]] },
  { t: "The picnic", p: [["👵👧🧺", "Grandma and Zoe have a picnic in the park."], ["🥪🍎", "They eat sandwiches and apples."], ["🐦🍞", "A little bird wants some bread."]],
    q: [["Who has a picnic with Zoe?", ["👵", "👮", "🤖"]], ["What do they eat?", ["🥪", "🍝", "🍣"]], ["Who wants some bread?", ["🐦", "🐶", "🐸"]]] },
  { t: "The race", p: [["🐰🐢", "Rabbit and Turtle have a race."], ["🐰😴", "Rabbit is very fast, but he stops to sleep."], ["🐢🏆", "Turtle is slow, but Turtle wins!"]],
    q: [["Who is fast?", ["🐰", "🐢", "🐌"]], ["What does Rabbit do?", ["😴", "🍽️", "🏊"]], ["Who wins the race?", ["🐢", "🐰", "🦊"]]] },
  { t: "The sunflower", p: [["👨🌱", "Dad plants a little seed."], ["☀️🌧️", "The sun shines and the rain falls."], ["🌻", "Look! A big yellow sunflower!"]],
    q: [["Who plants the seed?", ["👨", "👧", "🐶"]], ["What falls from the sky?", ["🌧️", "🍎", "⭐"]], ["What grows?", ["🌻", "🌵", "🍄"]]] },
  { t: "The yellow bus", p: [["👦🚌", "Every morning, Noah takes the yellow bus."], ["👦👧", "He sits next to his friend Ava."], ["🏫", "They go to school together."]],
    q: [["What does Noah take?", ["🚌", "🚲", "✈️"]], ["Who sits next to Noah?", ["👧", "👵", "👮"]], ["Where do they go?", ["🏫", "🏖️", "🏥"]]] },
  { t: "Lucy is sick", p: [["👧🤧", "Lucy is sick. She has a cold."], ["👧👩‍⚕️", "She goes to the doctor."], ["🍵😊", "She drinks hot tea. Now she is better!"]],
    q: [["Who is sick?", ["👧", "👴", "🐶"]], ["Who does Lucy see?", ["👩‍⚕️", "👨‍🍳", "👮"]], ["What does Lucy drink?", ["🍵", "🥤", "🧃"]]] },
  { t: "At the zoo", p: [["🦁🦒", "Today we go to the zoo."], ["🐒🍌", "The monkey eats a banana."], ["🐘💦", "The elephant takes a shower with its trunk!"]],
    q: [["Who eats a banana?", ["🐒", "🐘", "🦁"]], ["What does the monkey eat?", ["🍌", "🥕", "🐟"]], ["Who takes a shower?", ["🐘", "🦒", "🐒"]]] },
  { t: "The magic hat", p: [["T🎩", "Titou finds a magic hat."], ["T✨", "He says: Abracadabra!"], ["🐇🎩", "A white rabbit jumps out of the hat!"]],
    q: [["Who finds the hat?", ["T", "🐶", "👧"]], ["What does Titou find?", ["🎩", "👟", "🧤"]], ["Who jumps out of the hat?", ["🐇", "🐸", "🐱"]]] },
  { t: "Sunday pancakes", p: [["👩🥞", "On Sunday, Mom makes pancakes."], ["👦🍯", "Leo puts honey on his pancake."], ["🐱🥞", "The cat wants some too!"]],
    q: [["Who makes pancakes?", ["👩", "👨‍🚒", "🐱"]], ["What does Leo put on his pancake?", ["🍯", "🧂", "🥕"]], ["Who wants some too?", ["🐱", "🐶", "🐦"]]] },
  { t: "The green kite", p: [["🌬️", "It is windy today."], ["👧🪁", "Ella flies her green kite in the park."], ["🪁🌳", "Oh no! The kite is in the tree!"]],
    q: [["What is the weather like?", ["🌬️", "❄️", "🌧️"]], ["What does Ella fly?", ["🪁", "✈️", "🎈"]], ["Where is the kite?", ["🌳", "🏠", "🌊"]]] },
  { t: "Three little fish", p: [["🐠🐠🐠", "Jack has three little fish."], ["🐠", "The fish are orange."], ["🐠💦", "They swim and swim all day!"]],
    q: [["How many fish does Jack have?", ["3️⃣", "5️⃣", "1️⃣"]], ["What color are the fish?", ["🟠", "🔵", "🟢"]], ["What do the fish do?", ["🏊", "😴", "🍽️"]]] }
];

/* Rewards: accessories for Titou (slot + SVG in Titou's 200x220 space) */
const ACC = [
  { id: "cap", slot: "head", fr: "Casquette", em: "🧢", svg: '<path d="M60 78 C62 38 138 38 140 78 Z" fill="#0a84ff" stroke="#0060c0" stroke-width="3"/><path d="M118 74 Q150 72 166 80 Q150 88 118 82 Z" fill="#0060c0"/><circle cx="100" cy="42" r="5" fill="#0060c0"/>' },
  { id: "glasses", slot: "face", fr: "Lunettes", em: "👓", svg: '<circle cx="80" cy="110" r="15" fill="rgba(255,255,255,0.18)" stroke="#1d1d1f" stroke-width="4"/><circle cx="120" cy="110" r="15" fill="rgba(255,255,255,0.18)" stroke="#1d1d1f" stroke-width="4"/><path d="M95 108 Q100 104 105 108" fill="none" stroke="#1d1d1f" stroke-width="4"/>' },
  { id: "bowtie", slot: "neck", fr: "Nœud papillon", em: "🎀", svg: '<path d="M100 168 L78 156 L78 180 Z M100 168 L122 156 L122 180 Z" fill="#ff3b30" stroke="#c0221a" stroke-width="2" stroke-linejoin="round"/><circle cx="100" cy="168" r="6" fill="#c0221a"/>' },
  { id: "cape", slot: "back", fr: "Cape de héros", em: "🦸", back: true, svg: '<path d="M46 116 Q100 92 154 116 L176 206 Q100 222 24 206 Z" fill="#ff3b30" stroke="#c0221a" stroke-width="3" stroke-linejoin="round"/>' },
  { id: "crown", slot: "head", fr: "Couronne", em: "👑", svg: '<path d="M68 70 L72 36 L88 54 L100 30 L112 54 L128 36 L132 70 Z" fill="#ffd60a" stroke="#e5a800" stroke-width="3" stroke-linejoin="round"/><circle cx="100" cy="58" r="5" fill="#ff3b30"/><circle cx="82" cy="62" r="4" fill="#0a84ff"/><circle cx="118" cy="62" r="4" fill="#34c759"/>' },
  { id: "scarf", slot: "neck", fr: "Écharpe", em: "🧣", svg: '<path d="M56 158 Q100 178 144 158 L144 172 Q100 192 56 172 Z" fill="#ff9f0a" stroke="#d07800" stroke-width="2"/><path d="M118 172 L132 172 L130 204 L116 202 Z" fill="#ff9f0a" stroke="#d07800" stroke-width="2"/>' },
  { id: "partyhat", slot: "head", fr: "Chapeau de fête", em: "🥳", svg: '<path d="M80 72 L100 16 L120 72 Z" fill="#af52de" stroke="#7d2fa8" stroke-width="3" stroke-linejoin="round"/><path d="M88 50 L112 50 M84 62 L116 62" stroke="#ffd60a" stroke-width="5"/><circle cx="100" cy="16" r="8" fill="#ffd60a"/>' },
  { id: "wand", slot: "hand", fr: "Baguette magique", em: "🪄", svg: '<path d="M168 152 L182 108" stroke="#1d1d1f" stroke-width="5" stroke-linecap="round"/><path d="M184 82 L188 92 L198 92 L190 98 L193 108 L184 102 L175 108 L178 98 L170 92 L180 92 Z" fill="#ffd60a" stroke="#e5a800" stroke-width="2"/>' },
  { id: "sunglasses", slot: "face", fr: "Lunettes de soleil", em: "🕶️", svg: '<rect x="62" y="100" width="34" height="22" rx="9" fill="#1d1d1f"/><rect x="104" y="100" width="34" height="22" rx="9" fill="#1d1d1f"/><path d="M96 106 L104 106" stroke="#1d1d1f" stroke-width="4"/><path d="M68 104 L78 104" stroke="#fff" stroke-width="2" opacity="0.6"/>' },
  { id: "headphones", slot: "head", fr: "Casque audio", em: "🎧", svg: '<path d="M48 112 Q48 42 100 42 Q152 42 152 112" fill="none" stroke="#3a3a3c" stroke-width="8" stroke-linecap="round"/><rect x="36" y="98" width="20" height="32" rx="8" fill="#36d3be" stroke="#1f9e8c" stroke-width="2"/><rect x="144" y="98" width="20" height="32" rx="8" fill="#36d3be" stroke="#1f9e8c" stroke-width="2"/>' },
  { id: "balloon", slot: "hand", fr: "Ballon", em: "🎈", svg: '<path d="M172 152 Q178 120 186 86" fill="none" stroke="#6e6e73" stroke-width="2"/><ellipse cx="186" cy="64" rx="14" ry="18" fill="#ff3b30"/><path d="M182 82 L190 82 L186 88 Z" fill="#ff3b30"/>' },
  { id: "mask", slot: "face", fr: "Masque de héros", em: "🦹", svg: '<path fill-rule="evenodd" d="M56 100 Q100 86 144 100 L144 120 Q122 128 100 116 Q78 128 56 120 Z M70 110 a10 9 0 1 0 20 0 a10 9 0 1 0 -20 0 Z M110 110 a10 9 0 1 0 20 0 a10 9 0 1 0 -20 0 Z" fill="#af52de"/>' },
  { id: "flower", slot: "hand", fr: "Fleur", em: "🌻", svg: '<path d="M170 152 L180 108" stroke="#34c759" stroke-width="4" stroke-linecap="round"/><g fill="#ffd60a"><circle cx="180" cy="88" r="7"/><circle cx="190" cy="98" r="7"/><circle cx="180" cy="108" r="7"/><circle cx="170" cy="98" r="7"/></g><circle cx="180" cy="98" r="7" fill="#a2724a"/>' },
  { id: "tophat", slot: "head", fr: "Chapeau magique", em: "🎩", svg: '<rect x="74" y="24" width="52" height="46" rx="4" fill="#1d1d1f"/><rect x="74" y="56" width="52" height="8" fill="#ff3b30"/><ellipse cx="100" cy="72" rx="42" ry="8" fill="#1d1d1f"/>' }
];
const ACC_BY = {}; ACC.forEach(function (a) { ACC_BY[a.id] = a; });
const SLOTS = ["back", "head", "face", "neck", "hand"];
