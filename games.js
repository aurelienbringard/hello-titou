/* Hello Titou — games pack (21 jeux, déblocage, révision, récompenses). Loaded before the main script. */
(function () {
"use strict";
const G = {};
window.HT_GAMES = G;

/* ---------- Games list (order = unlocking order) ---------- */
const GAMES = [
  { id: "listen",  n: 1,  band: 4, emoji: "🎯", fr: "Écoute et touche",     en: "Listen and tap",   intro: "Écoute, et touche la bonne image !" },
  { id: "balloon", n: 2,  band: 4, emoji: "🎈", fr: "Le ballon de Titou",   en: "Pop the balloon",  intro: "Écoute bien, et éclate le bon ballon !" },
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

/* ---------- Engine ---------- */
let C = null;          /* core API given by index.html */
let cur = null;        /* current game session */
let suppressTap = 0;
let hintTimer = 0;
let toastTimer = 0;
const DAY = 86400000;
const REVIEW_GAP = { 1: 1, 2: 3, 3: 7, 4: 30 };

function rnd(n) { return Math.floor(Math.random() * n); }
function pick(arr) { return arr[rnd(arr.length)]; }
function shuffle(a) { return C.shuffle(a.slice()); }
function esc(s) { return C.esc(String(s == null ? "" : s)); }
function prof() { return C.profile(); }
function band() { return C.band(); }
function group(b) { return b <= 5 ? 4 : (b === 6 ? 6 : 7); }
function frOn() { return C.frenchOn(); }
/* C.speak() never settles when a clip is interrupted (stopSound pauses it), so every game line goes
   through say(): it settles when the clip ends, when another game line starts, or after a time cap. */
let sayGen = 0;
function say(t, lang) {
  if (!t) return Promise.resolve();
  const gen = ++sayGen;
  const cap = Math.min(15000, 3500 + String(t).length * 110);
  return new Promise(function (resolve) {
    let done = false;
    const fin = function () { if (!done) { done = true; clearInterval(iv); clearTimeout(to); resolve(); } };
    const iv = setInterval(function () { if (sayGen !== gen) fin(); }, 200);
    const to = setTimeout(fin, cap);
    Promise.resolve(C.speak(t, lang)).then(fin, fin);
  });
}
function sayFr(t) { return frOn() && t ? say(t, "fr-FR") : Promise.resolve(); }
function sayEn(t) { return say(t, "en-US"); }
function praise() { return pick(EN.yes); }
function live(tok) { return cur && cur.tok === tok && C.screen() === "game"; }

function ensure(p) {
  if (!p) return p;
  if (!p.games || typeof p.games !== "object") p.games = {};
  if (!p.review || typeof p.review !== "object") p.review = {};
  if (!Array.isArray(p.acc)) p.acc = [];
  if (!p.wear || typeof p.wear !== "object") p.wear = {};
  if (!p.mil || !Array.isArray(p.mil)) p.mil = [];
  p.revN = p.revN || 0; p.gPlays = p.gPlays || 0;
  return p;
}

/* ----- Unlocking ----- */
function visibleGames() { const gb = group(band()); return GAMES.filter(function (g) { return g.band <= gb; }); }
function isUnlocked(p, g) {
  ensure(p);
  if (p.gamesAll) return true;
  const gb = group(band());
  if (g.band < gb) return true;
  const list = GAMES.filter(function (x) { return x.band === g.band; });
  const i = list.indexOf(g);
  if (i <= 0) return true;
  return (p.games[list[i - 1].id] || 0) >= 2;
}
function prevGame(g) { const list = GAMES.filter(function (x) { return x.band === g.band; }); const i = list.indexOf(g); return i > 0 ? list[i - 1] : null; }
function unlockedSet(p) { const s = {}; visibleGames().forEach(function (g) { if (isUnlocked(p, g)) s[g.id] = 1; }); return s; }
function totalGameStars(p) { ensure(p); return Object.keys(p.games).reduce(function (s, k) { return s + (GAME[k] ? (p.games[k] || 0) : 0); }, 0); }

/* ----- Rewards ----- */
function grant(p) {
  const a = ACC.find(function (x) { return p.acc.indexOf(x.id) < 0; });
  if (!a) return null;
  p.acc.push(a.id); p.wear[a.slot] = a.id;
  return a;
}
function record(gameId, stars) {
  const p = ensure(prof()); if (!p) return { newly: [], rewards: [] };
  const before = unlockedSet(p);
  p.games[gameId] = Math.max(p.games[gameId] || 0, stars);
  p.gPlays += 1;
  const after = unlockedSet(p);
  const newly = Object.keys(after).filter(function (k) { return !before[k]; }).map(function (k) { return GAME[k]; });
  const rewards = [];
  if (p.gPlays === 1) { const a = grant(p); if (a) rewards.push(a); }
  if (!p.gamesAll) newly.forEach(function () { const a = grant(p); if (a) rewards.push(a); });
  [10, 20, 30].forEach(function (m) {
    if (totalGameStars(p) >= m && p.mil.indexOf("s" + m) < 0) { p.mil.push("s" + m); const a = grant(p); if (a) rewards.push(a); }
  });
  C.touch(p); C.save();
  return { newly: newly, rewards: rewards };
}
function starsFor(first, total) { const r = total ? first / total : 1; return r >= 0.8 ? 3 : (r >= 0.5 ? 2 : 1); }
function starRow(n) { let s = ""; for (let i = 0; i < 3; i++) s += '<span class="g-st' + (i < n ? " on" : "") + '">★</span>'; return '<span class="g-stars">' + s + "</span>"; }

/* Celebrate a finished round (used by the 11 new games, the quiz, memory and review) */
function finish(gameId, stars, replayAct, backAct) {
  const res = gameId ? record(gameId, stars) : { newly: [], rewards: [] };
  return celebrate(stars, res, replayAct, backAct);
}
function celebrate(stars, res, replayAct, backAct) {
  clearHint();
  let text = starRow(stars);
  res.newly.forEach(function (g) { text += '<span class="g-cel-line">🔓 Nouveau jeu : <b>' + esc(g.emoji + " " + g.fr) + "</b></span>"; });
  res.rewards.forEach(function (a) { text += '<span class="g-cel-line">🎁 Cadeau pour Titou : <b>' + esc(a.em + " " + a.fr) + "</b></span>"; });
  const back = backAct || "games";
  C.burst(110); C.sfx("fanfare");
  C.setOverlay({
    type: "celebrate", titou: "happy", title: "Bravo !", text: text,
    actions: '<button class="pill no" data-act="' + back + '">' + (back === "games" ? "🎮 Jeux" : "Accueil") + "</button>" +
      (replayAct ? '<button class="pill ok" data-act="' + replayAct + '">↻ Rejouer</button>' : "") +
      (res.rewards.length ? '<button class="pill gold" data-act="g:wardrobe">👕 Garde-robe</button>' : "")
  });
  sayEn("You did it!").then(function () { if (res.newly.length) return sayFr(FR.unlocked); })
    .then(function () { if (res.rewards.length) return sayFr(FR.reward); });
}

/* ----- Spaced repetition ----- */
let ITEM_IX = null;
function itemIndex() {
  if (ITEM_IX) return ITEM_IX;
  ITEM_IX = {};
  C.THEME_ORDER.forEach(function (tid) { (C.THEMES[tid].items || []).forEach(function (it) { if (!ITEM_IX[it.id]) ITEM_IX[it.id] = { item: it, theme: C.THEMES[tid] }; }); });
  return ITEM_IX;
}
function onCorrect(ids) {
  const p = ensure(prof()); if (!p) return;
  const now = Date.now();
  (ids || []).forEach(function (id) { if (id && itemIndex()[id] && !p.review[id]) p.review[id] = { b: 1, d: now + DAY }; });
}
function backfill(p) {
  ensure(p);
  const now = Date.now(); let n = 0;
  Object.keys(p.words || {}).forEach(function (id) {
    const w = p.words[id];
    if (w && w.correct > 0 && !p.review[id] && itemIndex()[id]) { p.review[id] = { b: 1, d: now + DAY }; n++; }
  });
  return n;
}
function dueList(p) {
  ensure(p);
  const now = Date.now();
  return Object.keys(p.review).filter(function (id) { const r = p.review[id]; return r && r.b < 4 && r.d <= now && itemIndex()[id]; })
    .sort(function (a, b) { return p.review[a].d - p.review[b].d; });
}
function nextDue(p) {
  ensure(p); let m = Infinity;
  Object.keys(p.review).forEach(function (id) { const r = p.review[id]; if (r && r.b < 4 && r.d < m) m = r.d; });
  return m;
}

/* ----- Hint hand / glow ("visual demo") ----- */
function clearHint() {
  clearTimeout(hintTimer); hintTimer = 0;
  document.querySelectorAll(".g-hand").forEach(function (h) { h.remove(); });
  document.querySelectorAll(".g-glow").forEach(function (h) { h.classList.remove("g-glow"); });
}
function showHint() {
  clearHint();
  const ok = document.querySelector('.g-body [data-ok="1"]');
  if (!ok) return;
  ok.classList.add("g-glow");
  if (ok.classList.contains("g-balloon")) return;
  const r = ok.getBoundingClientRect();
  const h = document.createElement("div");
  h.className = "g-hand"; h.textContent = "👆";
  h.style.left = (r.left + r.width / 2 - 22) + "px"; h.style.top = (r.top + r.height / 2 - 6) + "px";
  document.body.appendChild(h);
  setTimeout(function () { h.remove(); }, 2600);
}
function armHint(ms) {
  clearTimeout(hintTimer);
  const tok = cur && cur.tok;
  hintTimer = setTimeout(function () { if (cur && cur.tok === tok && !cur.locked) showHint(); }, ms || (band() <= 5 ? 6500 : 9000));
}

/* ----- Toast (Titou's hint bubble) ----- */
function toast(html) {
  clearTimeout(toastTimer);
  let t = document.querySelector(".g-toast");
  if (!t) { t = document.createElement("div"); t.className = "g-toast"; document.body.appendChild(t); }
  t.innerHTML = titou("try", "g-toast-titou") + "<span>" + html + "</span>";
  t.classList.add("show");
  toastTimer = setTimeout(function () { t.classList.remove("show"); }, 3200);
}

/* ----- Drag (or tap) helper: dropping on [data-drop] == tapping the element ----- */
function bindDrag(root) {
  root.querySelectorAll("[data-drag]").forEach(function (el) {
    el.addEventListener("pointerdown", function (e) {
      if (!cur || cur.locked || (e.pointerType === "mouse" && e.button !== 0)) return;
      const sx = e.clientX, sy = e.clientY; let ghost = null, moved = false;
      const move = function (ev) {
        const dx = ev.clientX - sx, dy = ev.clientY - sy;
        if (!moved && Math.hypot(dx, dy) > 12) {
          moved = true;
          const r = el.getBoundingClientRect();
          ghost = el.cloneNode(true); ghost.classList.add("g-ghost");
          ghost.style.width = r.width + "px"; ghost.style.height = r.height + "px";
          ghost.style.left = r.left + "px"; ghost.style.top = r.top + "px";
          document.body.appendChild(ghost); el.classList.add("g-dragging");
          document.querySelectorAll("[data-drop]").forEach(function (d) { d.classList.add("g-drop-on"); });
        }
        if (moved) { ev.preventDefault(); ghost.style.transform = "translate(" + dx + "px," + dy + "px) scale(1.08)"; }
      };
      const up = function (ev) {
        window.removeEventListener("pointermove", move); window.removeEventListener("pointerup", up); window.removeEventListener("pointercancel", up);
        if (!moved) return;
        suppressTap = Date.now();
        if (ghost) ghost.remove();
        el.classList.remove("g-dragging");
        document.querySelectorAll("[data-drop]").forEach(function (d) { d.classList.remove("g-drop-on"); });
        const under = document.elementFromPoint(ev.clientX, ev.clientY);
        if (under && under.closest("[data-drop]")) tapAct(el.getAttribute("data-act").slice(2), el.getAttribute("data-id"), el, true);
      };
      window.addEventListener("pointermove", move, { passive: false }); window.addEventListener("pointerup", up); window.addEventListener("pointercancel", up);
    });
  });
}

/* ----- Titou with accessories (and optional clothes from "Habille Titou") ----- */
function accSvg(wear) {
  let back = "", front = "";
  SLOTS.forEach(function (s) { const a = ACC_BY[wear && wear[s]]; if (!a) return; if (a.back) back += a.svg; else front += a.svg; });
  return { back: back, front: front };
}
function titou(mood, cls, opt) {
  let svg = C.titouSVG(mood, cls);
  const p = prof();
  const wear = (opt && opt.wear) || (opt && opt.bare ? {} : ((p && p.wear) || {}));
  const a = accSvg(wear);
  const front = ((opt && opt.clothes) || "") + a.front;
  if (a.back) svg = svg.replace('<g class="titou-ear-l">', '<g class="t-acc-back">' + a.back + '</g><g class="titou-ear-l">');
  if (front) svg = svg.replace(/<\/svg>$/, '<g class="t-acc">' + front + "</g></svg>");
  return svg;
}

/* ---------- Session framework ---------- */
const IMPL = {};
function pickTheme() {
  const p = prof();
  const ids = C.visibleThemes(null);
  const started = ids.filter(function (id) { return p && p.stars && p.stars[id] > 0; });
  if (started.length && Math.random() < 0.5) return pick(started);
  return pick(ids);
}
function lockedTap(g, el) {
  C.sfx("no");
  if (el) { el.classList.remove("g-wrong"); void el.offsetWidth; el.classList.add("g-wrong"); }
  const pg = prevGame(g);
  toast("Réussis <b>" + esc(pg ? pg.emoji + " " + pg.fr : "le jeu d'avant") + "</b> pour débloquer !<br><small>(2 étoiles ⭐⭐)</small>");
  sayFr(FR.locked);
}
function startGame(id, el) {
  const g = GAME[id]; const p = ensure(prof());
  if (!g || !p) return;
  if (!isUnlocked(p, g)) { lockedTap(g, el); return; }
  clearHint(); C.stop();
  if (id === "listen" || id === "memory") {
    cur = null;
    C.setTheme(pickTheme()); C.setReturn("games");
    if (id === "listen") C.startQuiz(); else C.startMemory();
    return;
  }
  beginSession(id);
}
function beginSession(id) {
  const p = ensure(prof());
  cur = { id: id, tok: Math.random(), q: 0, first: 0, total: 5, wrongs: 0, qWrong: false, locked: true, firstPlay: !(p.games[id] > 0) };
  IMPL[id].start(cur);
  IMPL[id].next(cur);
  C.go("game");
  const tok = cur.tok;
  const intro = GAME[id] ? GAME[id].intro : FR.review;
  setTimeout(function () {
    if (!live(tok)) return;
    sayFr(intro).then(function () {
      if (live(tok) && id === "feed" && cur.firstPlay) return sayFr(FR.drag);
    }).then(function () {
      if (!live(tok)) return;
      cur.locked = false; ask(false);
    });
  }, 250);
}
function ask(isRepeat) {
  if (!cur) return;
  const tok = cur.tok; const impl = IMPL[cur.id];
  clearHint();
  const pr = impl.ask ? impl.ask(cur, tok, isRepeat) : sayEn(impl.prompt(cur));
  Promise.resolve(pr).then(function () {
    if (!live(tok) || cur.locked) return;
    if (!isRepeat && cur.q === 0 && band() <= 5 && cur.firstPlay) showHint();
    armHint();
  });
}
function good(el, after) {
  if (!cur || cur.locked) return;
  cur.locked = true; clearHint();
  if (!cur.qWrong) cur.first++;
  C.sfx("ok"); C.burst(60);
  if (el) el.classList.add("g-correct");
  const chip = document.querySelector(".g-head .round-chip");
  if (chip) chip.innerHTML = (GAME[cur.id] ? GAME[cur.id].emoji : "✨") + " ⭐ " + cur.first + " · " + Math.min(cur.q + 1, cur.total) + " / " + cur.total;
  const tok = cur.tok;
  Promise.resolve(after ? after(tok) : sayEn(praise())).then(function () { if (live(tok)) advance(); });
}
function bad(el, msg, noReplay) {
  if (!cur || cur.locked) return;
  cur.qWrong = true; cur.wrongs++;
  C.sfx("no"); clearHint();
  if (el) { el.classList.remove("g-wrong"); void el.offsetWidth; el.classList.add("g-wrong"); setTimeout(function () { el.classList.remove("g-wrong"); }, 700); }
  const tok = cur.tok;
  sayEn(msg || EN.again).then(function () {
    if (!live(tok) || cur.locked || noReplay) return;
    const impl = IMPL[cur.id];
    return impl.ask ? impl.ask(cur, tok, true) : sayEn(impl.prompt(cur));
  }).then(function () { if (live(tok) && !cur.locked) { if (cur.wrongs >= 2) showHint(); else armHint(); } });
}
function advance() {
  cur.q++; cur.qWrong = false; cur.wrongs = 0;
  const impl = IMPL[cur.id];
  if (cur.q >= cur.total) {
    cur.locked = true;
    const st = starsFor(cur.first, cur.total);
    if (impl.done) impl.done(cur, st); else finish(cur.id, st, "g:replay", "games");
    return;
  }
  impl.next(cur); cur.locked = false; C.render();
  const tok = cur.tok;
  setTimeout(function () { if (live(tok)) ask(false); }, 250);
}

/* ---------- Hub + home banner ---------- */
function renderHub() {
  const p = ensure(prof());
  if (!p) return "";
  backfill(p);
  const due = dueList(p).length;
  let h = '<div class="screen" data-screen="games">' + C.topbar({ back: "home", progress: true, settings: true }) +
    '<div class="g-hub-head"><button class="g-hub-titou" data-act="g:wardrobe" aria-label="Garde-robe de Titou">' + titou("wave", "g-hub-titou-svg") + "</button>" +
    '<div class="g-hub-txt"><h1>Les jeux de Titou</h1><p>Titou\'s games</p>' +
    '<button class="pill gold g-wr-btn" data-act="g:wardrobe">👕 Garde-robe · ' + p.acc.length + " / " + ACC.length + "</button></div></div>" +
    '<div class="scroll g-hub-scroll">';
  h += '<button class="tile g-review-tile' + (due ? " hot" : "") + '" data-act="g:review"><div class="em">' + (due ? "✨" : "🌙") + "</div>" +
    '<div class="txt"><b>Révision surprise</b><span>' + (due ? due + " mot" + (due > 1 ? "s" : "") + " à revoir" : "Rien à réviser aujourd'hui") + "</span></div>" +
    (due ? '<span class="g-badge">' + due + "</span>" : "") + "</button>";
  const gb = group(band());
  [4, 6, 7].filter(function (b) { return b <= gb; }).forEach(function (b) {
    h += '<h3 class="g-band">' + BAND_LABEL[b] + '</h3><div class="grid g-games">';
    GAMES.filter(function (g) { return g.band === b; }).forEach(function (g) {
      const open = isUnlocked(p, g); const st = p.games[g.id] || 0;
      h += '<button class="tile g-tile' + (open ? "" : " locked") + '" data-act="g:open" data-id="' + g.id + '">' +
        '<span class="g-num">' + g.n + "</span>" + (open ? "" : '<span class="g-lock">🔒</span>') +
        '<div class="em">' + g.emoji + '</div><div class="lbl">' + esc(g.fr) + '<span class="en">' + esc(g.en) + "</span></div>" + starRow(st) + "</button>";
    });
    h += "</div>";
  });
  h += '<button class="g-parent" data-act="g:bypass">' + (p.gamesAll ? "🔒 Parents : remettre les cadenas" : "🔓 Parents : tout débloquer") + "</button>";
  h += "</div>" + C.accountMenu() + "</div>";
  return h;
}
function homeBanner() {
  const p = ensure(prof()); if (!p) return "";
  backfill(p);
  const due = dueList(p).length;
  const vis = visibleGames(); const open = vis.filter(function (g) { return isUnlocked(p, g); }).length;
  return '<div class="g-home-row">' +
    '<button class="tile g-home-games" data-act="games">' + titou("wave", "g-home-titou") +
    '<div class="lbl">🎮 Les jeux de Titou<span class="en">' + open + " / " + vis.length + " jeux ouverts</span></div></button>" +
    '<button class="tile g-home-review' + (due ? " hot" : "") + '" data-act="g:review"><div class="em">' + (due ? "✨" : "🌙") + "</div>" +
    '<div class="lbl">Révision<span class="en">' + (due ? due + " mot" + (due > 1 ? "s" : "") + " à revoir" : "À demain !") + "</span></div>" +
    (due ? '<span class="g-badge">' + due + "</span>" : "") + "</button></div>";
}
function renderGame() {
  if (!cur || !IMPL[cur.id]) return renderHub();
  const g = GAME[cur.id] || { emoji: "✨", fr: "Révision" };
  return '<div class="screen" data-screen="game">' + C.topbar({ back: "games" }) +
    '<div class="g-head"><button type="button" class="g-speaker" data-act="g:again" aria-label="Écouter encore">🔊</button>' +
    '<div class="round-chip">' + g.emoji + " ⭐ " + cur.first + " · " + Math.min(cur.q + 1, cur.total) + " / " + cur.total + "</div></div>" +
    '<div class="g-body g-' + cur.id + '">' + IMPL[cur.id].html(cur) + "</div>" + C.accountMenu() + "</div>";
}

/* ---------- Wardrobe ---------- */
function wardrobeHTML() {
  const p = ensure(prof());
  let grid = "";
  ACC.forEach(function (a) {
    const has = p.acc.indexOf(a.id) >= 0; const on = has && p.wear[a.slot] === a.id;
    grid += '<button class="g-acc' + (has ? "" : " locked") + (on ? " on" : "") + '" data-act="g:wear" data-id="' + a.id + '">' +
      '<span class="g-acc-em">' + (has ? a.em : "🔒") + '</span><span class="g-acc-lbl">' + esc(has ? a.fr : "Surprise") + "</span></button>";
  });
  return '<div class="overlay center"><div class="modal g-wardrobe">' + titou("wave", "g-wr-titou") +
    "<h2>La garde-robe de Titou</h2><p>" + p.acc.length + " / " + ACC.length + " cadeaux · Gagne des étoiles et débloque des jeux pour en avoir d'autres !</p>" +
    '<div class="g-acc-grid">' + grid + '</div><button class="pill ok" data-act="close-overlay">OK</button></div></div>';
}
function toggleWear(id) {
  const p = ensure(prof()); const a = ACC_BY[id];
  if (!a) return;
  if (p.acc.indexOf(id) < 0) { C.sfx("no"); sayFr(FR.lockedAcc); return; }
  if (p.wear[a.slot] === id) delete p.wear[a.slot]; else p.wear[a.slot] = id;
  C.sfx("star"); C.touch(p); C.save();
  C.setOverlay({ type: "g-wardrobe" });
}

/* ---------- Action dispatch (from the core click handler) ---------- */
function tapAct(a, id, el, dropped) {
  if (!dropped && Date.now() - suppressTap < 350) return;
  if (a === "open") { startGame(id, el); return; }
  if (a === "replay") {
    if (cur && cur.id === "review") { startReview(); return; }
    startGame(cur ? cur.id : id); return;
  }
  if (a === "again") { if (cur && !cur.locked) ask(true); else if (cur && IMPL[cur.id].again) IMPL[cur.id].again(cur); return; }
  if (a === "wardrobe") { C.setOverlay({ type: "g-wardrobe" }); sayFr(FR.wardrobe); return; }
  if (a === "wear") { toggleWear(id); return; }
  if (a === "review") { startReview(); return; }
  if (a === "bypass") {
    const p = prof();
    C.askParent(function () { ensure(p); p.gamesAll = !p.gamesAll; C.touch(p); C.save(); C.go("games"); });
    return;
  }
  if (cur && IMPL[cur.id] && IMPL[cur.id].tap) IMPL[cur.id].tap(cur, a, id, el, dropped);
}

/* ---------- Révision surprise (spaced repetition) ---------- */
function startReview() {
  const p = ensure(prof()); if (!p) return;
  backfill(p);
  const due = dueList(p);
  if (!due.length) {
    const nd = nextDue(p);
    toast(nd < Infinity ? "Rien à réviser aujourd'hui 🌙<br><small>Prochaine révision : " + new Date(nd).toLocaleDateString("fr-FR", { weekday: "long" }) + "</small>" : "Joue d'abord aux jeux pour apprendre des mots !");
    sayFr(FR.noReview);
    return;
  }
  cur = null; C.setReturn(null);
  beginSession("review");
}
IMPL.review = {
  start: function (s) {
    const p = prof();
    s.words = dueList(p).slice(0, 6);
    s.total = s.words.length;
    s.n = band() <= 4 ? 2 : (band() <= 6 ? 3 : 4);
  },
  next: function (s) {
    const ix = itemIndex();
    const e = ix[s.words[s.q]]; s.item = e.item;
    const used = {}; used[e.item.emoji] = 1;
    const others = shuffle(C.poolFor(e.theme).concat(e.theme.items)).filter(function (it) {
      if (used[it.emoji] || it.id === e.item.id) return false; used[it.emoji] = 1; return true;
    }).slice(0, s.n - 1);
    s.choices = shuffle([e.item].concat(others));
  },
  prompt: function (s) { return s.item.en; },
  html: function (s) {
    const cls = s.choices.length <= 2 ? "choices-2" : s.choices.length <= 3 ? "choices-3" : "choices-4";
    let h = '<p class="g-sub">✨ Révision surprise</p><div class="grid ' + cls + ' g-grid">';
    s.choices.forEach(function (it, i) {
      h += '<button class="choice" data-act="g:pick" data-id="' + i + '"' + (it.id === s.item.id ? ' data-ok="1"' : "") + ">" + C.visual(it, false) + "</button>";
    });
    return h + "</div>";
  },
  tap: function (s, a, id, el) {
    if (a !== "pick" || s.locked) return;
    const it = s.choices[Number(id)]; if (!it) return;
    const p = ensure(prof()); const r = p.review[s.item.id];
    if (it.id === s.item.id) {
      if (r) {
        if (!s.qWrong) { r.b = Math.min(4, r.b + 1); } else { r.b = 1; }
        r.d = Date.now() + REVIEW_GAP[r.b] * DAY;
      }
      C.markCorrect([s.item.id]);
      good(el);
    } else bad(el);
  },
  done: function (s, st) {
    const p = ensure(prof());
    p.revN += 1;
    const rewards = [];
    if (p.revN === 1 || p.revN === 5) { const a = grant(p); if (a) rewards.push(a); }
    C.touch(p); C.save();
    celebrate(st, { newly: [], rewards: rewards }, null, "games");
  }
};

/* ---------- Helpers shared by games ---------- */
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function wait(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }
function okAttr(b) { return b ? ' data-ok="1"' : ""; }
function gridCls(n) { return n <= 2 ? "choices-2" : n <= 3 ? "choices-3" : n <= 4 ? "choices-4" : "choices-6"; }
let rot = { paint: rnd(6), story: rnd(STORIES.length) };

/* ===== 2. Le ballon de Titou ===== */
IMPL.balloon = {
  start: function (s) { s.total = 5; s.n = band() <= 5 ? 3 : 4; s.last = null; },
  next: function (s) {
    const t = pick(BALLOON_WORDS.filter(function (w) { return w[0] !== s.last; })); s.last = t[0]; s.target = t;
    const others = shuffle(BALLOON_WORDS.filter(function (w) { return w !== t; })).slice(0, s.n - 1);
    const cols = shuffle(Object.keys(PAINT).filter(function (c) { return c !== "brown"; }));
    const dur = band() <= 4 ? 15 : (band() <= 5 ? 13 : 11);
    s.balloons = shuffle([t].concat(others)).map(function (w, i) {
      return { w: w, ok: w === t, color: PAINT[cols[i % cols.length]], left: (100 / s.n) * i + 2 + rnd(3), dur: dur + rnd(3), delay: -((i + 0.6) * dur / s.n) - Math.random() };
    });
  },
  prompt: function (s) { return "Pop the " + s.target[0] + "!"; },
  html: function (s) {
    let h = '<div class="g-sky" style="--n:' + s.n + '">';
    s.balloons.forEach(function (b, i) {
      h += '<button class="g-balloon" data-act="g:pop" data-id="' + i + '"' + okAttr(b.ok) + ' style="left:' + b.left + "%;--c:" + b.color +
        ";animation-duration:" + b.dur + "s;animation-delay:" + b.delay.toFixed(2) + 's" aria-label="' + esc(b.w[0]) + '">' +
        '<span class="g-bal-body"><span class="g-bal-em">' + b.w[1] + '</span></span><span class="g-bal-str"></span></button>';
    });
    return h + "</div>";
  },
  tap: function (s, a, id, el) {
    if (a !== "pop" || s.locked) return;
    const b = s.balloons[Number(id)]; if (!b) return;
    if (b.ok) { el.classList.add("g-popped"); good(null, function (tok) { return sayEn(EN.pop).then(function () { if (live(tok)) return sayEn(praise()); }); }); }
    else bad(el);
  }
};

/* ===== 3. Coloriage magique ===== */
const ANY = ["red", "blue", "yellow", "green", "orange", "purple", "pink"];
const DRAWINGS = [
  { id: "house", regions: [
    { s: '<rect x="48" y="92" width="104" height="84" rx="4"/>', p: ANY },
    { s: '<path d="M34 92 L100 38 L166 92 Z"/>', p: ["red", "brown", "orange", "purple", "blue"] },
    { s: '<rect x="88" y="128" width="26" height="48" rx="4"/>', p: ["brown", "blue", "green", "red"] },
    { s: '<rect x="60" y="106" width="22" height="22" rx="3"/><rect x="120" y="106" width="22" height="22" rx="3"/>', p: ["blue", "yellow"] },
    { s: '<circle cx="168" cy="34" r="18"/>', p: ["yellow", "orange"] }] },
  { id: "flower", regions: [
    { s: '<circle cx="130" cy="72" r="20"/><circle cx="115" cy="98" r="20"/><circle cx="85" cy="98" r="20"/><circle cx="70" cy="72" r="20"/><circle cx="85" cy="46" r="20"/><circle cx="115" cy="46" r="20"/>', p: ["pink", "red", "purple", "orange", "blue"] },
    { s: '<circle cx="100" cy="72" r="16"/>', p: ["yellow", "orange", "brown"] },
    { s: '<path d="M96 116 L104 116 L104 160 L96 160 Z"/><path d="M104 140 Q132 116 148 132 Q128 152 104 148 Z"/>', p: ["green"] },
    { s: '<path d="M66 158 L134 158 L124 194 L76 194 Z"/>', p: ["brown", "orange", "red", "blue", "purple"] }] },
  { id: "fish", regions: [
    { s: '<ellipse cx="92" cy="104" rx="58" ry="38"/>', p: ["orange", "blue", "yellow", "pink", "purple", "red"] },
    { s: '<path d="M146 104 L186 70 L186 138 Z"/>', p: ANY },
    { s: '<path d="M74 72 Q96 38 120 70 Z"/>', p: ANY },
    { s: '<circle cx="34" cy="52" r="9"/><circle cx="20" cy="30" r="6"/><circle cx="42" cy="20" r="5"/>', p: ["blue"] }],
    extra: '<circle cx="62" cy="96" r="7" fill="#1d1d1f"/><circle cx="64" cy="94" r="2" fill="#fff"/>' },
  { id: "car", regions: [
    { s: '<rect x="26" y="102" width="150" height="46" rx="14"/>', p: ["red", "blue", "yellow", "green", "orange", "purple", "pink"] },
    { s: '<path d="M58 104 L76 70 L132 70 L150 104 Z"/>', p: ANY },
    { s: '<path d="M74 100 L84 78 L100 78 L100 100 Z"/><path d="M108 100 L108 78 L126 78 L138 100 Z"/>', p: ["blue"] },
    { s: '<circle cx="64" cy="150" r="18"/><circle cx="140" cy="150" r="18"/>', p: ["brown", "purple", "blue"] }] },
  { id: "rainbow", regions: [
    { s: '<path d="M16 160 A84 84 0 0 1 184 160"/>', p: ["red"], stroke: true },
    { s: '<path d="M30 160 A70 70 0 0 1 170 160"/>', p: ["orange"], stroke: true },
    { s: '<path d="M44 160 A56 56 0 0 1 156 160"/>', p: ["yellow"], stroke: true },
    { s: '<path d="M58 160 A42 42 0 0 1 142 160"/>', p: ["green"], stroke: true },
    { s: '<ellipse cx="34" cy="166" rx="30" ry="16"/><ellipse cx="166" cy="166" rx="30" ry="16"/>', p: ["blue", "pink", "purple"] }] },
  { id: "butterfly", regions: [
    { s: '<ellipse cx="66" cy="78" rx="34" ry="30"/><ellipse cx="72" cy="132" rx="26" ry="24"/>', p: ["blue", "purple", "pink", "orange", "yellow"] },
    { s: '<ellipse cx="134" cy="78" rx="34" ry="30"/><ellipse cx="128" cy="132" rx="26" ry="24"/>', p: ["blue", "purple", "pink", "orange", "yellow"] },
    { s: '<rect x="92" y="56" width="16" height="104" rx="8"/>', p: ["brown", "purple"] },
    { s: '<circle cx="62" cy="76" r="9"/><circle cx="138" cy="76" r="9"/><circle cx="72" cy="134" r="7"/><circle cx="128" cy="134" r="7"/>', p: ["yellow", "pink", "orange", "red"] }],
    extra: '<path d="M96 58 Q84 30 76 26 M104 58 Q116 30 124 26" fill="none" stroke="var(--text2)" stroke-width="3" stroke-linecap="round"/>' }
];
IMPL.paint = {
  start: function (s) { rot.paint = (rot.paint + 1) % DRAWINGS.length; s.d = DRAWINGS[rot.paint]; s.total = s.d.regions.length; s.fill = []; s.np = band() <= 4 ? 3 : (band() <= 5 ? 4 : 6); },
  next: function (s) {
    const r = s.d.regions[s.q];
    let opts = r.p.filter(function (c) { return s.fill.indexOf(c) < 0; }); if (!opts.length) opts = r.p;
    s.color = pick(opts);
    s.pots = shuffle([s.color].concat(shuffle(Object.keys(PAINT).filter(function (c) { return c !== s.color; })).slice(0, s.np - 1)));
  },
  prompt: function (s) { return band() <= 4 ? cap(s.color) + "!" : "Paint it " + s.color + "!"; },
  html: function (s) {
    let svg = '<svg class="g-drawing" viewBox="0 0 200 200" aria-hidden="true">';
    s.d.regions.forEach(function (r, i) {
      const col = i < s.q ? PAINT[s.fill[i]] : null;
      const cls = "g-reg" + (r.stroke ? " g-reg-s" : "") + (i === s.q ? " g-cur" : "") + (col ? " g-painted" : "");
      svg += '<g class="' + cls + '" style="' + (col ? (r.stroke ? "stroke:" : "fill:") + col : "") + '">' + r.s + "</g>";
    });
    svg += (s.d.extra || "") + "</svg>";
    let pots = '<div class="g-pots">';
    s.pots.forEach(function (c) {
      pots += '<button class="g-pot" data-act="g:pot" data-id="' + c + '"' + okAttr(c === s.color) + ' aria-label="' + c + '"><span class="g-paint-blob" style="background:' + PAINT[c] + '"></span></button>';
    });
    return '<div class="g-paint-wrap">' + svg + "</div>" + pots + "</div>";
  },
  tap: function (s, a, id, el) {
    if (a !== "pot" || s.locked) return;
    if (id === s.color) {
      s.fill[s.q] = s.color;
      const reg = document.querySelectorAll(".g-drawing .g-reg")[s.q];
      if (reg) { reg.classList.remove("g-cur"); reg.classList.add("g-painted"); if (s.d.regions[s.q].stroke) reg.style.stroke = PAINT[s.color]; else reg.style.fill = PAINT[s.color]; }
      good(el, function (tok) { return sayEn(cap(s.color) + "!").then(function () { if (live(tok)) return sayEn(praise()); }); });
    } else bad(el);
  }
};

/* ===== 4. Nourris Titou ===== */
function setMood(wrap, mood, cls) {
  if (!wrap) return;
  const svg = wrap.querySelector("svg.titou");
  if (svg) { const d = document.createElement("div"); d.innerHTML = titou(mood, cls); svg.replaceWith(d.firstChild); }
}
function flyTo(el, target) {
  if (!el || !target) return;
  const a = el.getBoundingClientRect(), b = target.getBoundingClientRect();
  el.style.transition = "transform .6s cubic-bezier(.22,1,.36,1), opacity .6s";
  el.style.transform = "translate(" + (b.left + b.width / 2 - (a.left + a.width / 2)) + "px," + (b.top + b.height * 0.5 - (a.top + a.height / 2)) + "px) scale(.35)";
  el.style.opacity = "0";
}
IMPL.feed = {
  start: function (s) { s.total = 5; s.n = band() <= 4 ? 2 : (band() <= 5 ? 3 : 4); s.last = null; },
  next: function (s) {
    const t = pick(FOODS.filter(function (f) { return f !== s.last; })); s.last = t; s.target = t;
    s.foods = shuffle([t].concat(shuffle(FOODS.filter(function (f) { return f !== t; })).slice(0, s.n - 1)));
  },
  prompt: function (s) { return "Titou wants " + s.target[0] + "!"; },
  html: function (s) {
    let h = '<div class="g-foods">';
    s.foods.forEach(function (f, i) {
      h += '<button class="g-food" data-act="g:food" data-id="' + i + '" data-drag="1"' + okAttr(f === s.target) + ' aria-label="' + esc(f[0]) + '"><span>' + f[1] + "</span></button>";
    });
    return h + '</div><div class="g-feed-titou" data-drop="1">' + titou("idle", "g-feed-svg") + "</div>";
  },
  tap: function (s, a, id, el) {
    if (a !== "food" || s.locked) return;
    const f = s.foods[Number(id)]; const tw = document.querySelector(".g-feed-titou");
    if (f === s.target) { flyTo(el, tw); good(null, function () { setMood(tw, "happy", "g-feed-svg"); return sayEn(EN.yum); }); }
    else { setMood(tw, "try", "g-feed-svg"); bad(el, EN.noThanks); }
  }
};

/* ===== 6. Habille Titou ===== */
const CLOTH_ICON = {
  hat: '<ellipse cx="50" cy="72" rx="42" ry="10"/><path d="M28 72 L32 34 Q50 22 68 34 L72 72 Z"/><rect x="31" y="58" width="38" height="7" fill="rgba(0,0,0,.22)" stroke="none"/>',
  "t-shirt": '<path d="M34 16 L44 10 Q50 20 56 10 L66 16 L90 32 L80 48 L70 42 L70 90 L30 90 L30 42 L20 48 L10 32 Z"/>',
  scarf: '<path d="M14 26 Q50 42 86 26 L86 42 Q50 58 14 42 Z"/><path d="M52 50 L66 48 L72 88 L56 90 Z"/><path d="M38 50 L50 52 L44 90 L30 86 Z"/><path d="M30 86 L28 94 M37 88 L36 96 M44 90 L44 97 M56 90 L56 97 M64 89 L65 97 M72 88 L74 95" stroke-linecap="round"/>',
  shoes: '<path d="M6 72 Q6 52 20 52 L30 54 Q34 64 46 66 L46 82 L6 82 Z"/><path d="M54 72 Q54 52 68 52 L78 54 Q82 64 94 66 L94 82 L54 82 Z"/>',
  gloves: '<path d="M10 84 L10 46 Q10 32 21 32 Q32 32 32 46 L32 54 L38 46 Q42 42 44 48 L40 62 L40 84 Z"/><path d="M58 84 L58 46 Q58 32 69 32 Q80 32 80 46 L80 54 L86 46 Q90 42 92 48 L88 62 L88 84 Z"/>'
};
const CLOTH_ON = {
  "t-shirt": '<path d="M50 164 Q100 152 150 164 L152 186 Q100 204 48 186 Z"/>',
  scarf: '<path d="M58 150 Q100 168 142 150 L142 162 Q100 180 58 162 Z"/><path d="M116 162 L128 162 L126 188 L114 186 Z"/>',
  shoes: '<ellipse cx="76" cy="195" rx="20" ry="11"/><ellipse cx="124" cy="195" rx="20" ry="11"/>',
  gloves: '<circle cx="27" cy="148" r="12"/><circle cx="173" cy="148" r="12"/>',
  hat: '<ellipse cx="100" cy="68" rx="46" ry="9"/><path d="M72 68 L76 30 Q100 18 124 30 L128 68 Z"/>'
};
const CLOTH_ORDER = ["t-shirt", "scarf", "shoes", "gloves", "hat"];
function clothSvg(id, color) {
  return '<svg class="g-cloth" viewBox="0 0 100 100" aria-hidden="true"><g fill="' + PAINT[color] + '" stroke="rgba(0,0,0,.3)" stroke-width="2.5" stroke-linejoin="round">' + CLOTH_ICON[id] + "</g></svg>";
}
function clothesOn(worn) {
  return worn.slice().sort(function (a, b) { return CLOTH_ORDER.indexOf(a.i) - CLOTH_ORDER.indexOf(b.i); }).map(function (w) {
    return '<g fill="' + PAINT[w.c] + '" stroke="rgba(0,0,0,.25)" stroke-width="2.5" stroke-linejoin="round">' + CLOTH_ON[w.i] + "</g>";
  }).join("");
}
IMPL.dress = {
  start: function (s) { s.order = shuffle(DRESS_ITEMS); s.total = 5; s.worn = []; s.n = 4; },
  next: function (s) {
    const item = s.order[s.q]; const col = pick(DRESS_COLORS); s.item = item; s.color = col;
    const oc = pick(DRESS_COLORS.filter(function (c) { return c !== col; }));
    const oi = pick(DRESS_ITEMS.filter(function (x) { return x !== item; }));
    const ch = [{ i: item.id, c: col, ok: 1 }, { i: item.id, c: oc }, { i: oi.id, c: col }];
    let guard = 0;
    while (ch.length < s.n && guard++ < 60) {
      const x = { i: pick(DRESS_ITEMS).id, c: pick(DRESS_COLORS) };
      if (!ch.some(function (y) { return y.i === x.i && y.c === x.c; })) ch.push(x);
    }
    s.choices = shuffle(ch);
  },
  prompt: function (s) { return dressPhrase(s.color, s.item); },
  html: function (s) {
    let h = '<div class="g-dress-wrap"><div class="g-dress-titou">' + titou("idle", "g-dress-svg", { bare: true, clothes: clothesOn(s.worn) }) + '</div><div class="grid choices-4 g-grid">';
    s.choices.forEach(function (c, i) { h += '<button class="choice" data-act="g:cloth" data-id="' + i + '"' + okAttr(c.ok) + ">" + clothSvg(c.i, c.c) + "</button>"; });
    return h + "</div></div>";
  },
  tap: function (s, a, id, el) {
    if (a !== "cloth" || s.locked) return;
    const c = s.choices[Number(id)]; if (!c) return;
    if (c.ok) {
      s.worn.push({ i: c.i, c: c.c });
      const w = document.querySelector(".g-dress-titou");
      if (w) w.innerHTML = titou("happy", "g-dress-svg", { bare: true, clothes: clothesOn(s.worn) });
      good(el, function (tok) { return sayEn(dressPhrase(s.color, s.item)).then(function () { if (live(tok)) return sayEn(praise()); }); });
    } else bad(el);
  }
};

/* ===== 7. Jacques a dit / Simon says ===== */
IMPL.simon = {
  start: function (s) { s.total = 5; s.n = band() <= 6 ? 3 : 4; s.last = null; },
  next: function (s) {
    const t = pick(SIMON.filter(function (x) { return x !== s.last; })); s.last = t; s.target = t;
    s.choices = shuffle([t].concat(shuffle(SIMON.filter(function (x) { return x !== t; })).slice(0, s.n - 1)));
  },
  prompt: function (s) { return simonPhrase(s.target[0]); },
  html: function (s) {
    let h = '<div class="grid ' + gridCls(s.n) + ' g-grid">';
    s.choices.forEach(function (c, i) { h += '<button class="choice" data-act="g:do" data-id="' + i + '"' + okAttr(c === s.target) + ' aria-label="' + esc(c[0]) + '"><div class="em">' + c[1] + "</div></button>"; });
    return h + "</div>";
  },
  tap: function (s, a, id, el) {
    if (a !== "do" || s.locked) return;
    const c = s.choices[Number(id)]; if (!c) return;
    if (c === s.target) {
      good(el, function (tok) {
        const body = document.querySelector(".g-body");
        const m = document.createElement("div"); m.className = "g-move";
        m.innerHTML = '<div class="g-move-em">' + c[1] + '</div><div class="g-move-lbl">À toi, bouge ! 🕺</div>';
        if (body) body.appendChild(m);
        return sayEn(EN.nowYou).then(function () { return wait(2200); }).then(function () { m.remove(); if (live(tok)) return sayEn(praise()); });
      });
    } else bad(el);
  }
};

/* ===== 8. Compte avec Titou ===== */
IMPL.count = {
  start: function (s) { s.total = 5; s.n = band() <= 6 ? 3 : 4; s.max = band() <= 6 ? 10 : 20; },
  next: function (s) {
    let n = 1 + rnd(s.max); if (s.max > 10 && Math.random() < 0.4) n = 1 + rnd(10);
    const objs = n > 10 ? COUNT_OBJ.filter(function (o) { return COUNT_BIG.indexOf(o[0]) >= 0; }) : COUNT_OBJ;
    s.obj = pick(objs); s.target = n;
    const set = [n];
    shuffle([-2, -1, 1, 2, 3, -3]).forEach(function (d) { const m = n + d; if (set.length < s.n && m >= 1 && m <= s.max && set.indexOf(m) < 0) set.push(m); });
    for (let m = 1; set.length < s.n && m <= s.max; m++) if (set.indexOf(m) < 0) set.push(m);
    s.choices = shuffle(set);
  },
  prompt: function (s) { return countPhrase(s.target, s.obj); },
  html: function (s) {
    let h = '<div class="grid ' + gridCls(s.n) + ' g-grid">';
    s.choices.forEach(function (n, i) {
      let em = ""; for (let k = 0; k < n; k++) em += "<span>" + s.obj[2] + "</span>";
      const sz = n <= 3 ? "g-c-l" : n <= 6 ? "g-c-m" : n <= 10 ? "g-c-s" : "g-c-xs";
      h += '<button class="choice g-group" data-act="g:n" data-id="' + i + '"' + okAttr(n === s.target) + '><div class="g-dots ' + sz + '">' + em + "</div></button>";
    });
    return h + "</div>";
  },
  tap: function (s, a, id, el) {
    if (a !== "n" || s.locked) return;
    const n = s.choices[Number(id)];
    if (n === s.target) good(el, function (tok) { return sayEn(countPhrase(n, s.obj)).then(function () { if (live(tok)) return sayEn(praise()); }); });
    else bad(el);
  }
};

/* ===== 9. Construis la phrase ===== */
const NOUN_SVG = {
  ball: '<circle cx="50" cy="50" r="38"/><path d="M14 44 Q50 64 86 44" fill="none" stroke="rgba(255,255,255,.75)" stroke-width="5"/>',
  star: '<path d="M50 8 L61 38 L94 38 L67 57 L77 90 L50 70 L23 90 L33 57 L6 38 L39 38 Z"/>',
  heart: '<path d="M50 88 C10 62 6 34 26 22 C38 15 48 22 50 30 C52 22 62 15 74 22 C94 34 90 62 50 88 Z"/>',
  fish: '<ellipse cx="44" cy="50" rx="34" ry="22"/><path d="M74 50 L96 30 L96 70 Z"/><circle cx="30" cy="45" r="4" fill="#1d1d1f" stroke="none"/>',
  car: '<path d="M22 54 L32 34 L68 34 L80 54 Z"/><rect x="8" y="52" width="84" height="24" rx="8"/><circle cx="28" cy="78" r="9" fill="#3a3a3c"/><circle cx="72" cy="78" r="9" fill="#3a3a3c"/>',
  balloon: '<ellipse cx="50" cy="40" rx="28" ry="33"/><path d="M45 73 L55 73 L50 79 Z"/><path d="M50 79 Q44 88 52 97" fill="none" stroke="#9ca3b4" stroke-width="2"/>'
};
function nounSvg(noun, color, cls) {
  return '<svg class="' + (cls || "g-ticon") + '" viewBox="0 0 100 100" aria-hidden="true"><g fill="' + (color ? PAINT[color] : "var(--surface2)") +
    '" stroke="' + (color ? "rgba(0,0,0,.25)" : "var(--text2)") + '" stroke-width="3" stroke-linejoin="round">' + NOUN_SVG[noun] + "</g></svg>";
}
function tileInner(k) {
  const v = k.slice(2);
  if (k[0] === "s") return '<svg class="g-ticon" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="' + (v === "big" ? 44 : 17) + '" fill="var(--text2)"/></svg><b>' + v + "</b>";
  if (k[0] === "c") return '<span class="g-swatch" style="background:' + PAINT[v] + '"></span><b>' + v + "</b>";
  return nounSvg(v, null) + "<b>" + v + "</b>";
}
IMPL.build = {
  start: function (s) { s.total = 4; },
  next: function (s) {
    s.size = pick(["big", "small"]); s.color = pick(BUILD_COLORS); s.noun = pick(BUILD_NOUNS);
    s.step = 0; s.picked = [];
    s.rows = [
      ["s:big", "s:small"],
      shuffle([s.color].concat(shuffle(BUILD_COLORS.filter(function (c) { return c !== s.color; })).slice(0, 2))).map(function (v) { return "c:" + v; }),
      shuffle([s.noun].concat(shuffle(BUILD_NOUNS.filter(function (c) { return c !== s.noun; })).slice(0, 2))).map(function (v) { return "n:" + v; })
    ];
  },
  expected: function (s) { return ["s:" + s.size, "c:" + s.color, "n:" + s.noun][s.step]; },
  prompt: function (s) { return buildPhrase(s.size, s.color, s.noun); },
  html: function (s) {
    let h = '<div class="g-slots" data-drop="1">';
    for (let i = 0; i < 3; i++) {
      const k = s.picked[i];
      h += '<div class="g-slot' + (k ? " full" : "") + (i === s.step ? " next" : "") + '">' + (k ? tileInner(k) : '<span class="g-slot-n">' + (i + 1) + "</span>") + "</div>";
    }
    h += "</div>";
    if (s.step >= 3) h += '<div class="g-result">' + nounSvg(s.noun, s.color, "g-noun-res " + s.size) + "</div>";
    else {
      const exp = IMPL.build.expected(s);
      h += '<div class="g-rows">';
      s.rows.forEach(function (r, ri) {
        h += '<div class="g-row' + (ri === s.step ? " active" : "") + '">';
        r.forEach(function (k) {
          const used = s.picked.indexOf(k) >= 0;
          h += '<button class="g-wtile' + (used ? " used" : "") + '" data-act="g:tile" data-id="' + k + '" data-drag="1"' + okAttr(k === exp) + ">" + tileInner(k) + "</button>";
        });
        h += "</div>";
      });
      h += "</div>";
    }
    return h;
  },
  tap: function (s, a, id, el) {
    if (a !== "tile" || s.locked || s.step >= 3) return;
    const exp = IMPL.build.expected(s);
    if (id === exp) {
      s.picked.push(id); s.step++; C.sfx("tap");
      C.render();
      if (s.step >= 3) good(null, function (tok) { return sayEn(buildPhrase(s.size, s.color, s.noun)).then(function () { if (live(tok)) return sayEn(praise()); }); });
      else { sayEn(id.slice(2)); armHint(); }
    } else {
      bad(el);
      const row = document.querySelector(".g-row.active");
      if (row) { row.classList.remove("g-glow"); void row.offsetWidth; row.classList.add("g-glow"); }
    }
  }
};

/* ===== 10. Où est Titou ? ===== */
function miniTitou(x, y, w) { return C.titouSVG("logo", "").replace("<svg ", '<svg x="' + x + '" y="' + y + '" width="' + w + '" height="' + (w * 1.1).toFixed(1) + '" '); }
const OBJ_SVG = {
  boxBack: '<path d="M30 62 L37 53 L77 53 L70 62 Z" fill="#8a5a2b"/><path d="M70 62 L77 53 L77 80 L70 88 Z" fill="#b87b40"/>',
  boxFront: '<rect x="30" y="62" width="40" height="26" fill="#d9a066" stroke="#a8743f" stroke-width="1.5"/><path d="M42 62 L42 88 M58 62 L58 88" stroke="#c48a50" stroke-width="1"/>',
  table: '<rect x="18" y="52" width="64" height="7" rx="2" fill="#a2724a"/><rect x="22" y="58" width="5" height="30" fill="#8a5a2b"/><rect x="73" y="58" width="5" height="30" fill="#8a5a2b"/>',
  tree: '<text x="50" y="91" font-size="62" text-anchor="middle">🌳</text>',
  car: '<text x="50" y="92" font-size="52" text-anchor="middle">🚗</text>',
  house: '<text x="50" y="93" font-size="60" text-anchor="middle">🏠</text>'
};
const WHERE_POS = {
  box:   { "in": [36, 38, 30, "mid"], on: [36, 25, 30, "front"], behind: [52, 27, 32, "back"], "next to": [64, 55, 30, "front"], "in front of": [33, 52, 34, "front"] },
  table: { on: [36, 21, 28, "front"], under: [37, 59, 26, "front"], behind: [36, 28, 30, "back"], "next to": [68, 55, 30, "front"] },
  tree:  { behind: [62, 30, 32, "back"], "next to": [66, 55, 30, "front"], "in front of": [34, 52, 34, "front"] },
  car:   { on: [37, 41, 26, "front"], behind: [46, 47, 30, "back"], "next to": [66, 56, 30, "front"], "in front of": [33, 54, 34, "front"] },
  house: { on: [38, 32, 24, "front"], behind: [54, 38, 30, "back"], "next to": [66, 56, 30, "front"], "in front of": [33, 54, 34, "front"] }
};
function sceneSvg(obj, prep) {
  const pos = WHERE_POS[obj][prep];
  const t = miniTitou(pos[0], pos[1], pos[2]);
  const shift = prep === "next to" ? -18 : 0;
  let o, inner = "";
  if (obj === "box") o = OBJ_SVG.boxBack + (pos[3] === "mid" ? t : "") + OBJ_SVG.boxFront; else o = OBJ_SVG[obj];
  inner += '<path d="M4 90 L96 90" stroke="var(--line)" stroke-width="1.5"/>';
  if (pos[3] === "back") inner += t;
  inner += '<g transform="translate(' + shift + ',0)">' + o + "</g>";
  if (pos[3] === "front") inner += t;
  return '<svg class="g-scene" viewBox="0 0 100 100" aria-hidden="true">' + inner + "</svg>";
}
IMPL.where = {
  start: function (s) { s.total = 5; s.n = band() <= 7 ? 3 : 4; s.lastP = null; },
  next: function (s) {
    const objs = Object.keys(WHERE).filter(function (o) { return WHERE[o].preps.length >= s.n; });
    const o = pick(objs); const preps = WHERE[o].preps;
    let t = pick(preps.filter(function (p) { return p !== s.lastP; })) || pick(preps); s.lastP = t;
    s.obj = o; s.prep = t;
    s.choices = shuffle([t].concat(shuffle(preps.filter(function (p) { return p !== t; })).slice(0, s.n - 1)));
  },
  prompt: function (s) { return wherePhrase(s.prep, WHERE[s.obj].label); },
  html: function (s) {
    let h = '<div class="grid g-grid g-scenes g-sc' + s.n + '">';
    s.choices.forEach(function (p, i) { h += '<button class="choice g-scene-btn" data-act="g:scene" data-id="' + i + '"' + okAttr(p === s.prep) + ">" + sceneSvg(s.obj, p) + "</button>"; });
    return h + "</div>";
  },
  tap: function (s, a, id, el) {
    if (a !== "scene" || s.locked) return;
    if (s.choices[Number(id)] === s.prep) good(el, function (tok) { return sayEn(wherePhrase(s.prep, WHERE[s.obj].label)).then(function () { if (live(tok)) return sayEn(praise()); }); });
    else bad(el);
  }
};

/* ===== 11. Écoute l'histoire ===== */
function storyEm(x) { return x.indexOf("T") < 0 ? x : x.split("T").join(C.titouSVG("logo", "g-inline-titou")); }
function tellStory(s, tok) {
  if (s.telling) return Promise.resolve();
  s.telling = true; s.phase = "listen";
  let chain = sayEn(EN.story);
  s.st.p.forEach(function (pn, i) {
    chain = chain.then(function () {
      if (!live(tok)) return;
      s.panel = i;
      document.querySelectorAll(".g-panel").forEach(function (el, j) { el.classList.toggle("on", j === i); });
      return sayEn(pn[1]);
    }).then(function () { if (live(tok)) return wait(450); });
  });
  return chain.then(function () { if (live(tok)) return sayFr(FR.story); }).then(function () {
    s.telling = false;
    if (!live(tok)) return;
    s.phase = "q"; C.render();
    return sayEn(s.qq[0]);
  });
}
IMPL.story = {
  start: function (s) { rot.story = (rot.story + 1) % STORIES.length; s.st = STORIES[rot.story]; s.total = 3; s.phase = "listen"; s.panel = -1; s.telling = false; },
  next: function (s) { if (s.q > 0) s.phase = "q"; s.qq = s.st.q[s.q]; s.opts = shuffle(s.qq[1]); },
  ask: function (s, tok, isRepeat) { if (s.phase === "listen") return tellStory(s, tok); return sayEn(s.qq[0]); },
  prompt: function (s) { return s.qq[0]; },
  html: function (s) {
    const q = s.phase === "q";
    let h = '<p class="g-sub">📖 ' + esc(s.st.t) + '</p><div class="g-panels' + (q ? " small" : "") + '">';
    s.st.p.forEach(function (pn, i) {
      h += '<button class="g-panel' + (!q && i === s.panel ? " on" : "") + '" data-act="g:panel" data-id="' + i + '"><span class="g-panel-n">' + (i + 1) + '</span><span class="g-panel-em">' + storyEm(pn[0]) + "</span></button>";
    });
    h += "</div>";
    if (q) {
      h += '<p class="g-question">' + esc(s.qq[0]) + '</p><div class="grid choices-3 g-grid g-story-opts">';
      s.opts.forEach(function (o, i) { h += '<button class="choice" data-act="g:opt" data-id="' + i + '"' + okAttr(o === s.qq[1][0]) + '><div class="em">' + storyEm(o) + "</div></button>"; });
      h += "</div>";
    }
    return h;
  },
  tap: function (s, a, id, el) {
    if (a === "panel") { if (s.telling) return; const pn = s.st.p[Number(id)]; if (pn) sayEn(pn[1]); return; }
    if (a !== "opt" || s.locked || s.phase !== "q") return;
    if (s.opts[Number(id)] === s.qq[1][0]) good(el); else bad(el);
  }
};

/* ===== 12. Le magasin de Titou ===== */
IMPL.shop = {
  start: function (s) { s.total = 4; s.max = band() <= 7 ? 4 : 5; },
  next: function (s) {
    const t = pick(SHOP); s.target = t; s.n = 1 + rnd(s.max);
    s.shelf = shuffle([t].concat(shuffle(SHOP.filter(function (x) { return x !== t; })).slice(0, 3)));
    s.basket = {};
  },
  prompt: function (s) { return shopPhrase(s.n, s.target); },
  html: function (s) {
    let h = '<div class="g-shelf">';
    s.shelf.forEach(function (it, i) { h += '<button class="g-shelf-item" data-act="g:add" data-id="' + i + '" data-drag="1"' + okAttr(it === s.target) + ' aria-label="' + esc(it[1]) + '"><span>' + it[2] + "</span></button>"; });
    h += '</div><div class="g-basket" data-drop="1"><div class="g-basket-in">';
    let any = false;
    s.shelf.forEach(function (it, i) { const c = s.basket[i] || 0; for (let k = 0; k < c; k++) { any = true; h += '<button class="g-bitem" data-act="g:remove" data-id="' + i + '" aria-label="Enlever">' + it[2] + "</button>"; } });
    if (!any) h += '<span class="g-basket-empty">🧺</span>';
    h += '</div></div><button class="pill ok g-check" data-act="g:check">✅ C\'est prêt !</button>';
    return h;
  },
  tap: function (s, a, id, el) {
    if (s.locked) return;
    if (a === "add") {
      const i = Number(id); let tot = 0; Object.keys(s.basket).forEach(function (k) { tot += s.basket[k]; });
      if (tot >= 9) return;
      s.basket[i] = (s.basket[i] || 0) + 1; C.sfx("tap"); C.render();
      sayEn(NUMW[s.basket[i]]); armHint(9000);
      return;
    }
    if (a === "remove") { const i = Number(id); if (s.basket[i]) s.basket[i]--; C.sfx("flip"); C.render(); return; }
    if (a === "check") {
      const ti = s.shelf.indexOf(s.target);
      const wrongItem = Object.keys(s.basket).some(function (k) { return Number(k) !== ti && s.basket[k] > 0; });
      const bk = document.querySelector(".g-basket");
      if (!wrongItem && (s.basket[ti] || 0) === s.n) good(bk, function (tok) { return sayEn(EN.hereYouAre).then(function () { if (live(tok)) return sayEn(praise()); }); });
      else bad(bk, wrongItem ? EN.again : EN.countAgain);
    }
  }
};

/* ===== 13. À toi de parler ===== */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition || null;
function norm(t) { return String(t || "").toLowerCase().replace(/[^a-z0-9' ]+/g, " ").replace(/\s+/g, " ").trim(); }
function lev(a, b) {
  const m = a.length, n = b.length; if (!m) return n; if (!n) return m;
  let prev = []; for (let j = 0; j <= n; j++) prev[j] = j;
  for (let i = 1; i <= m; i++) { const row = [i]; for (let j = 1; j <= n; j++) row[j] = Math.min(prev[j] + 1, row[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); prev = row; }
  return prev[n];
}
function similar(a, b) {
  if (!a || !b) return 0;
  if (a.indexOf(b) >= 0 || b.indexOf(a) >= 0) return 1;
  const wa = a.split(" "), wb = b.split(" ");
  const hit = wb.filter(function (w) { return wa.indexOf(w) >= 0; }).length / wb.length;
  return Math.max(hit, 1 - lev(a, b) / Math.max(a.length, b.length));
}
function updMsg(s) { const m = document.querySelector(".g-say-msg"); if (m) m.textContent = s.msg; }
function setMic(on) { const b = document.querySelector(".g-mic"); if (b) b.classList.toggle("on", !!on); }
function listen(s) {
  if (s.listening || !SR) return;
  let rec;
  try { rec = new SR(); } catch (e) { s.msg = "Le micro n'est pas disponible. Répète, puis touche le pouce 👍"; updMsg(s); sayFr(FR.selfCheck); return; }
  C.stop();
  rec.lang = "en-US"; rec.interimResults = false; rec.maxAlternatives = 5;
  s.listening = true; setMic(true); s.msg = "J'écoute… 👂"; updMsg(s);
  const tok = cur.tok;
  rec.onresult = function (ev) {
    const alts = []; const r = ev.results[0];
    for (let i = 0; i < r.length; i++) alts.push(r[i].transcript);
    judge(s, tok, alts);
  };
  rec.onerror = function (ev) {
    s.listening = false; setMic(false);
    if (!live(tok) || s.locked) return;
    s.msg = ev && ev.error === "no-speech" ? "Je n'ai rien entendu… Réessaie, ou touche le pouce 👍" : "Le micro ne marche pas ici. Répète, puis touche le pouce 👍";
    updMsg(s); sayFr(FR.selfCheck);
  };
  rec.onend = function () { s.listening = false; setMic(false); };
  try { rec.start(); } catch (e) { s.listening = false; setMic(false); }
  setTimeout(function () { try { rec.stop(); } catch (e) { /* ignore */ } }, 6500);
}
function judge(s, tok, alts) {
  if (!live(tok) || s.locked) return;
  const target = norm(s.item[0]);
  if (alts.some(function (a) { return similar(norm(a), target) >= 0.5; })) { good(document.querySelector(".g-mic")); return; }
  s.tries++; s.qWrong = true;
  if (s.tries >= 2) { good(document.querySelector(".g-mic"), function () { return sayEn(EN.goodTry); }); return; }
  s.msg = "Presque ! Écoute encore, et réessaie 🎤"; updMsg(s);
  sayEn(EN.greatTry).then(function () { if (live(tok)) return sayEn(s.item[0]); });
}
IMPL.speak = {
  start: function (s) {
    s.total = 5;
    const w = shuffle(SPEAK_WORDS).slice(0, band() <= 7 ? 2 : 1);
    s.list = w.concat(shuffle(SPEAK_PHRASES).slice(0, 5 - w.length));
  },
  next: function (s) { s.item = s.list[s.q]; s.tries = 0; s.listening = false; s.msg = ""; },
  ask: function (s, tok) {
    return sayEn(s.item[0]).then(function () { if (live(tok)) return sayEn(EN.yourTurn); })
      .then(function () { if (live(tok) && s.q === 0) return sayFr(SR ? FR.mic : FR.selfCheck); });
  },
  prompt: function (s) { return s.item[0]; },
  html: function (s) {
    let h = '<div class="g-say-card"><div class="g-say-em">' + s.item[1] + '</div><div class="g-say-txt">' + esc(s.item[0]) + "</div></div>";
    h += '<div class="g-say-btns">';
    if (SR) h += '<button class="g-mic" data-act="g:mic" aria-label="Parler">🎤</button>';
    h += '<button class="g-thumb" data-act="g:said" data-ok="1" aria-label="Je l\'ai dit">👍<span>Je l\'ai dit !</span></button></div>';
    h += '<p class="g-say-msg">' + esc(s.msg || (SR ? "Touche le micro 🎤 et répète. Ou touche le pouce 👍" : "Répète à voix haute, puis touche le pouce 👍")) + "</p>";
    return h;
  },
  tap: function (s, a, id, el) {
    if (s.locked) return;
    if (a === "said") { good(el); return; }
    if (a === "mic") listen(s);
  }
};

/* =====================================================================
   Grammaire implicite + expression orale (14–21)
   Grammar is taught by sound, patterns and pictures only: the child hears a
   chunk and picks the matching picture. Expression games: choose an answer,
   hear the model, then say it (Web Speech when available, else "Je l'ai dit !").
   ===================================================================== */

/* ---------- small helpers ---------- */
function emCard(inner, cls) { return '<div class="g-pic ' + (cls || "") + '">' + inner + "</div>"; }
function many(em, n) { let h = ""; for (let i = 0; i < n; i++) h += "<span>" + em + "</span>"; return h; }
function article(w) { return /^[aeiou]/i.test(w) ? "an" : "a"; }
function pickGame(cfg) {
  // cfg.next(s) must set s.say (English prompt), s.model (said after success), s.opts [{html, ok, label}]
  return {
    start: function (s) { s.total = 5; s.used = []; if (cfg.start) cfg.start(s); },
    next: function (s) { cfg.next(s); s.used.push(s.key || s.say); },
    ask: cfg.ask,
    prompt: function (s) { return s.say; },
    html: function (s) {
      let h = s.top ? '<div class="g-qtop">' + s.top + "</div>" : "";
      h += '<div class="grid ' + gridCls(s.opts.length) + ' g-grid g-gram' + (s.opts.length === 2 ? " g-two" : "") + '">';
      s.opts.forEach(function (o, i) { h += '<button class="choice g-opt" data-act="g:opt" data-id="' + i + '"' + okAttr(o.ok) + ' aria-label="' + esc(o.label || "") + '">' + o.html + "</button>"; });
      return h + "</div>";
    },
    tap: function (s, a, id, el) {
      if (a !== "opt" || s.locked) return;
      const o = s.opts[Number(id)]; if (!o) return;
      if (o.ok) good(el, function (tok) { return sayEn(s.model || s.say).then(function () { if (live(tok)) return sayEn(praise()); }); });
      else bad(el);
    }
  };
}
function fresh(list, s, keyOf) {
  const f = list.filter(function (x) { return s.used.indexOf(keyOf(x)) < 0; });
  return pick(f.length ? f : list);
}

/* ===== 14. Un ou plusieurs ? (singulier / pluriel, 4–5 ans) ===== */
const PLURAL = [["cat", "cats", "🐱"], ["dog", "dogs", "🐶"], ["apple", "apples", "🍎"], ["ball", "balls", "⚽"], ["car", "cars", "🚗"],
  ["duck", "ducks", "🦆"], ["star", "stars", "⭐"], ["banana", "bananas", "🍌"], ["bird", "birds", "🐦"], ["frog", "frogs", "🐸"], ["flower", "flowers", "🌼"], ["egg", "eggs", "🥚"]];
const PL_N = [[2, "two"], [3, "three"]];
function plSing(w) { return article(w[0]) + " " + w[0]; }
function plMany(w, n) { return n[1] + " " + w[1]; }
IMPL.plural = pickGame({
  next: function (s) {
    const w = fresh(PLURAL, s, function (x) { return x[0]; }); s.key = w[0];
    const n = pick(PL_N); const one = Math.random() < 0.5;
    s.say = one ? plSing(w) : plMany(w, n); s.model = s.say;
    s.opts = shuffle([
      { ok: one, label: plSing(w), html: emCard(many(w[2], 1), "g-pic-1") },
      { ok: !one, label: plMany(w, n), html: emCard(many(w[2], n[0]), "g-pic-n") }
    ]);
  }
});

/* ===== 15. Grand, petit, sur, sous (4–5 ans) ===== */
const SIZE_W = [["dog", "🐶"], ["cat", "🐱"], ["ball", "⚽"], ["apple", "🍎"], ["car", "🚗"], ["star", "⭐"], ["fish", "🐟"], ["house", "🏠"], ["teddy bear", "🧸"]];
const PREP_SETS = [["table", "on", "under"], ["box", "in", "on"], ["table", "under", "on"]];
IMPL.sizes = pickGame({
  next: function (s) {
    if (s.q % 2 === 0) {
      const w = fresh(SIZE_W, s, function (x) { return x[0]; }); s.key = w[0];
      const big = Math.random() < 0.5;
      s.say = (big ? "a big " : "a small ") + w[0]; s.model = s.say;
      s.opts = shuffle([
        { ok: big, label: "big", html: emCard('<span class="g-big">' + w[1] + "</span>") },
        { ok: !big, label: "small", html: emCard('<span class="g-small">' + w[1] + "</span>") }
      ]);
    } else {
      const set = pick(PREP_SETS); const obj = set[0]; const t = set[1 + rnd(2)];
      s.key = obj + t; s.say = wherePhrase(t, WHERE[obj].label); s.model = s.say;
      s.opts = shuffle([set[1], set[2]]).map(function (p) { return { ok: p === t, label: p, html: sceneSvg(obj, p) }; });
    }
  }
});

/* ===== 16 / 18 / 21. Expression engine ===== */
// round: { q: question (EN audio, may be null), top: html shown above, opts: [{em, txt, model, ok}], free: bool, judge: text to recognise }
function speakGame(cfg) {
  return {
    start: function (s) { s.total = 5; s.rounds = cfg.rounds(s); s.freeTold = false; },
    next: function (s) {
      s.r = s.rounds[s.q % s.rounds.length]; s.phase = s.r.opts ? 1 : 2; s.tries = 0; s.listening = false; s.msg = "";
      s.item = s.phase === 2 ? [s.r.model, s.r.em] : null;
    },
    ask: function (s, tok, isRepeat) {
      if (s.phase === 2) {
        const first = s.r.q && !isRepeat && !s.r.opts ? sayEn(s.r.q) : Promise.resolve();
        return first.then(function () { if (live(tok)) return sayEn(s.item[0]); })
          .then(function () { if (live(tok)) return s.r.sayFr && !isRepeat ? sayFr(s.r.sayFr) : sayEn(EN.yourTurn); })
          .then(function () { if (live(tok) && s.q === 0 && !isRepeat && !s.r.sayFr) return sayFr(SR ? FR.mic : FR.selfCheck); });
      }
      return sayEn(s.r.q).then(function () {
        if (live(tok) && s.r.free && !s.freeTold && !isRepeat) { s.freeTold = true; return sayFr(FR.choose); }
      });
    },
    prompt: function (s) { return s.phase === 2 ? s.item[0] : s.r.q; },
    html: function (s) {
      const showTxt = band() >= 7;
      if (s.phase === 1) {
        let h = s.r.top ? '<div class="g-qtop">' + s.r.top + "</div>" : "";
        h += '<div class="grid ' + gridCls(s.r.opts.length) + ' g-grid g-gram' + (s.r.opts.length === 2 ? " g-two" : "") + '">';
        s.r.opts.forEach(function (o, i) {
          h += '<button class="choice g-opt' + (o.txt && showTxt ? " g-opt-txt" : "") + '" data-act="g:ans" data-id="' + i + '"' + okAttr(s.r.free || o.ok) + ' aria-label="' + esc(o.model) + '">' +
            '<div class="em">' + o.em + "</div>" + (o.txt && showTxt ? '<div class="g-otxt">' + esc(o.txt) + "</div>" : "") + "</button>";
        });
        return h + "</div>";
      }
      let h = '<div class="g-say-card">' + (s.r.top && !s.r.opts ? '<div class="g-qtop small">' + s.r.top + "</div>" : "") +
        '<div class="g-say-em">' + s.item[1] + "</div>" + (showTxt || s.r.showTxt ? '<div class="g-say-txt">' + esc(s.item[0]) + "</div>" : "") + "</div>";
      h += '<div class="g-say-btns">';
      if (SR) h += '<button class="g-mic" data-act="g:mic" aria-label="Parler">🎤</button>';
      h += '<button class="g-thumb" data-act="g:said" data-ok="1" aria-label="Je l\'ai dit">👍<span>J\'ai dit !</span></button></div>';
      h += '<p class="g-say-msg">' + esc(s.msg || (SR ? "Touche le micro 🎤 et parle. Ou touche le pouce 👍" : "Dis-le à voix haute, puis touche le pouce 👍")) + "</p>";
      return h;
    },
    tap: function (s, a, id, el) {
      if (s.locked) return;
      if (s.phase === 1 && a === "ans") {
        const o = s.r.opts[Number(id)]; if (!o) return;
        if (!(s.r.free || o.ok)) { bad(el); return; }
        s.locked = true; clearHint(); C.sfx("ok"); el.classList.add("g-correct");
        const tok = s.tok;
        sayEn(o.model).then(function () {
          if (!live(tok)) return;
          s.phase = 2; s.item = [o.model, o.em || s.r.pic || "💬"]; s.locked = false; C.render();
          return sayEn(EN.yourTurn).then(function () { if (live(tok) && s.q === 0) return sayFr(SR ? FR.mic : FR.selfCheck); });
        }).then(function () { if (live(tok)) armHint(); });
        return;
      }
      if (s.phase === 2) {
        if (a === "said") { good(el); return; }
        if (a === "mic") listen(s);
      }
    }
  };
}

/* ===== 16. Répète avec Titou (4–5 ans) : chunks utiles ===== */
const REPEAT_CHUNKS = [["Hello!", "👋"], ["Thank you!", "🎁"], ["Good morning!", "🌅"], ["Good night!", "🌙"], ["I'm happy!", "😀"],
  ["Yummy!", "😋"], ["I love you!", "❤️"], ["Yes, please!", "👍"], ["No, thank you!", "🙅"], ["Let's play!", "🧸"]];
IMPL.repeat = speakGame({
  rounds: function () { return shuffle(REPEAT_CHUNKS).slice(0, 5).map(function (c) { return { model: c[0], em: c[1] }; }); }
});

/* ===== 17. Les petites phrases (6 ans) : I like / I don't like · this / these ===== */
const LIKE_FOOD = [["bananas", "🍌"], ["apples", "🍎"], ["carrots", "🥕"], ["cookies", "🍪"], ["grapes", "🍇"], ["strawberries", "🍓"], ["tomatoes", "🍅"], ["broccoli", "🥦"], ["pizza", "🍕"], ["ice cream", "🍦"]];
const THIS_W = [["apple", "apples", "🍎"], ["banana", "bananas", "🍌"], ["ball", "balls", "⚽"], ["star", "stars", "⭐"], ["car", "cars", "🚗"], ["duck", "ducks", "🦆"], ["egg", "eggs", "🥚"]];
function thisPhrase(w) { return "This is " + article(w[0]) + " " + w[0] + "."; }
function thesePhrase(w) { return "These are " + w[1] + "."; }
IMPL.phrases = pickGame({
  next: function (s) {
    if (s.q % 2 === 0) {
      const f = fresh(LIKE_FOOD, s, function (x) { return x[0]; }); s.key = f[0];
      const like = Math.random() < 0.5;
      s.say = (like ? "I like " : "I don't like ") + f[0] + "."; s.model = s.say;
      s.top = C.titouSVG("idle", "g-qtitou");
      s.opts = shuffle([
        { ok: like, label: "I like", html: emCard('<span class="g-food-em">' + f[1] + '</span><span class="g-thumb-em">👍</span>') },
        { ok: !like, label: "I don't like", html: emCard('<span class="g-food-em">' + f[1] + '</span><span class="g-thumb-em">👎</span>') }
      ]);
    } else {
      const w = fresh(THIS_W, s, function (x) { return x[1]; }); s.key = w[1];
      const one = Math.random() < 0.5; s.top = "";
      s.say = one ? thisPhrase(w) : thesePhrase(w); s.model = s.say;
      s.opts = shuffle([
        { ok: one, label: "this", html: emCard('<span class="g-point">👉</span>' + many(w[2], 1), "g-pic-1") },
        { ok: !one, label: "these", html: emCard('<span class="g-point">👉</span>' + many(w[2], 3), "g-pic-n") }
      ]);
    }
  }
});

/* ===== 18. Qui fait quoi ? (6 ans) : he / she + is …ing ===== */
const ACTIONS = [["reading", "📖"], ["singing", "🎤"], ["painting", "🎨"], ["playing football", "⚽"], ["sleeping", "💤"], ["drinking milk", "🥛"], ["cooking", "🍳"], ["playing the guitar", "🎸"]];
function whoPhrase(g, a) { return (g === "girl" ? "She" : "He") + " is " + a[0] + "."; }
function whoHtml(g, a) { return emCard('<span class="g-kid">' + (g === "girl" ? "👧" : "👦") + '</span><span class="g-act">' + a[1] + "</span>"); }
IMPL.who = pickGame({
  start: function (s) { s.n = band() <= 6 ? 3 : 4; },
  next: function (s) {
    const a = fresh(ACTIONS, s, function (x) { return x[0]; }); s.key = a[0];
    const g = pick(["girl", "boy"]); const og = g === "girl" ? "boy" : "girl";
    const other = shuffle(ACTIONS.filter(function (x) { return x !== a; }));
    const set = [[g, a], [og, a], [g, other[0]]];
    if (s.n > 3) set.push([og, other[1]]);
    s.say = whoPhrase(g, a); s.model = s.say;
    s.opts = shuffle(set).map(function (x) { return { ok: x[0] === g && x[1] === a, label: whoPhrase(x[0], x[1]), html: whoHtml(x[0], x[1]) }; });
  }
});

/* ===== 19. Réponds à Titou (6 ans) : questions du quotidien ===== */
const COLOR_OBJ = [["🍎", "red"], ["🍌", "yellow"], ["🐸", "green"], ["🍊", "orange"], ["🍇", "purple"], ["🐳", "blue"]];
const WANT = [["apple", "🍎"], ["banana", "🍌"], ["cookie", "🍪"], ["orange", "🍊"], ["ice cream", "🍦"], ["strawberry", "🍓"]];
const HAVE = [["ball", "⚽"], ["teddy bear", "🧸"], ["kite", "🪁"], ["balloon", "🎈"], ["drum", "🥁"], ["robot", "🤖"]];
const FEEL = [["I'm happy!", "😀"], ["I'm sad.", "😢"], ["I'm tired.", "😴"], ["I'm hungry!", "🍽️"]];
const AGE_W = { 4: "four", 5: "five", 6: "six", 7: "seven", 8: "eight" };
function swatch(c) { return '<span class="g-swatch big" style="background:' + PAINT[c] + '"></span>'; }
function answerRounds() {
  const p = prof() || {}; const age = Math.min(8, Math.max(4, Number(p.age) || band()));
  const co = pick(COLOR_OBJ);
  const cols = shuffle([co[1]].concat(shuffle(COLOR_OBJ.map(function (x) { return x[1]; }).filter(function (c) { return c !== co[1]; })).slice(0, 2)));
  const ages = shuffle([age].concat(shuffle([4, 5, 6, 7, 8].filter(function (a) { return a !== age; })).slice(0, 2)));
  const R = [
    { q: "What colour is it?", top: '<span class="g-qem">' + co[0] + "</span>", opts: cols.map(function (c) { return { em: swatch(c), model: "It's " + c + ".", ok: c === co[1] }; }) },
    { q: "How old are you?", top: C.titouSVG("wave", "g-qtitou"), opts: ages.map(function (a) { return { em: '<span class="g-num-big">' + a + "</span>", model: "I'm " + AGE_W[a] + ".", ok: a === age }; }) },
    { q: "What do you want?", free: true, top: C.titouSVG("idle", "g-qtitou"), opts: shuffle(WANT).slice(0, 3).map(function (w) { return { em: w[1], model: "I want " + article(w[0]) + " " + w[0] + ", please." }; }) },
    { q: "What do you say?", free: true, top: '<span class="g-qem">🙋</span>', opts: shuffle(HAVE).slice(0, 3).map(function (w) { return { em: w[1], model: "Can I have the " + w[0] + ", please?" }; }) },
    { q: "How are you?", free: true, top: C.titouSVG("wave", "g-qtitou"), opts: shuffle(FEEL).slice(0, 3).map(function (f) { return { em: f[1], model: f[0] }; }) },
    { q: "What's your name?", top: C.titouSVG("wave", "g-qtitou"), model: "My name is Titou. And you?", em: "🙋", sayFr: FR.sayName }
  ];
  return shuffle(R).slice(0, 5);
}
IMPL.answer = speakGame({ rounds: answerRounds });

/* ===== 20. Le bon petit mot (7–8 ans) : am/is/are · has/have · a/an · passé · do/does ===== */
// [sentence with ___, right word, [other words], picture]
const GAP = [
  ["I ___ happy.", "am", ["is", "are"], "😀"], ["The cat ___ black.", "is", ["am", "are"], "🐈‍⬛"], ["They ___ friends.", "are", ["is", "am"], "🧑‍🤝‍🧑"],
  ["He ___ sleeping.", "is", ["are", "am"], "😴"], ["We ___ hungry.", "are", ["is", "am"], "🍽️"],
  ["I ___ a dog.", "have", ["has"], "🐶"], ["She ___ a cat.", "has", ["have"], "🐱"], ["They ___ a big ball.", "have", ["has"], "⚽"], ["Titou ___ a hat.", "has", ["have"], "🎩"],
  ["It's ___ apple.", "an", ["a"], "🍎"], ["It's ___ banana.", "a", ["an"], "🍌"], ["It's ___ elephant.", "an", ["a"], "🐘"], ["It's ___ dog.", "a", ["an"], "🐶"], ["It's ___ egg.", "an", ["a"], "🥚"], ["It's ___ umbrella.", "an", ["a"], "☂️"],
  ["Yesterday, I ___ football.", "played", ["play", "plays"], "⚽"], ["Yesterday, I ___ TV.", "watched", ["watch", "watches"], "📺"],
  ["Yesterday, I ___ to the park.", "went", ["go", "goes"], "🏞️"], ["Yesterday, I ___ a pizza.", "ate", ["eat", "eats"], "🍕"],
  ["___ you like apples?", "Do", ["Does"], "🍎"], ["___ she like cats?", "Does", ["Do"], "🐱"], ["___ they play football?", "Do", ["Does"], "⚽"], ["___ he swim?", "Does", ["Do"], "🏊"]
];
function gapParts(g) { const p = g[0].split("___"); return [p[0].trim(), p[1].trim()]; }
function gapSay(g) { return g[0].replace("___", "…"); }
function gapFull(g) { return g[0].replace("___", g[1]); }
IMPL.gap = pickGame({
  next: function (s) {
    // vary the grammar point each round
    const groups = [[0, 5], [5, 9], [9, 15], [15, 19], [19, 23]];
    const gr = groups[s.q % groups.length];
    const g = fresh(GAP.slice(gr[0], gr[1]), s, function (x) { return x[0]; }); s.key = g[0];
    s.say = gapSay(g); s.model = gapFull(g);
    s.top = '<span class="g-qem">' + g[3] + '</span><span class="g-gap-txt">' + esc(g[0]).replace("___", '<b class="g-blank">?</b>') + "</span>";
    s.parts = gapParts(g);
    s.opts = shuffle([g[1]].concat(g[2])).map(function (w) { return { ok: w === g[1], label: w, html: '<span class="g-word">' + esc(w) + "</span>" }; });
  },
  // the sentence is said in two parts with a little chime where the missing word goes
  ask: function (s, tok) {
    const a = s.parts[0], b = s.parts[1];
    return (a ? sayEn(a) : Promise.resolve()).then(function () { if (!live(tok)) return; C.sfx("star"); return wait(650); })
      .then(function () { if (live(tok) && b) return sayEn(b); });
  }
});

/* ===== 21. Joue avec Titou (7–8 ans) : mini-dialogues + décrire une image ===== */
const WEATHER = [["☀️", "It's sunny."], ["🌧️", "It's raining."], ["❄️", "It's snowing."]];
const SEE = [["🐶", "⚽", "I can see a dog and a ball."], ["🐱", "🚗", "I can see a cat and a car."], ["🐦", "🌳", "I can see a bird and a tree."], ["🐸", "🌼", "I can see a frog and a flower."]];
function talkRounds() {
  const w = pick(WEATHER); const see = shuffle(SEE).slice(0, 3);
  const R = [
    { q: "Hi! How are you?", top: C.titouSVG("wave", "g-qtitou"), opts: shuffle([
      { em: "🙂", txt: "I'm fine, thank you!", model: "I'm fine, thank you!", ok: true }, { em: "7️⃣", txt: "I'm seven.", model: "I'm seven." }, { em: "🔵", txt: "It's blue.", model: "It's blue." }]) },
    { q: "Where do you live?", top: C.titouSVG("idle", "g-qtitou"), opts: shuffle([
      { em: "🇫🇷", txt: "I live in France.", model: "I live in France.", ok: true }, { em: "🍕", txt: "I like pizza.", model: "I like pizza." }, { em: "🐶", txt: "I have a dog.", model: "I have a dog." }]) },
    { q: "Do you like cats?", free: true, top: '<span class="g-qem">🐱</span>', opts: [
      { em: "👍", txt: "Yes, I do!", model: "Yes, I do!" }, { em: "👎", txt: "No, I don't.", model: "No, I don't." }] },
    { q: "Can you swim?", free: true, top: '<span class="g-qem">🏊</span>', opts: [
      { em: "👍", txt: "Yes, I can!", model: "Yes, I can!" }, { em: "👎", txt: "No, I can't.", model: "No, I can't." }] },
    { q: "Hello! What would you like?", free: true, top: '<span class="g-qem">🧑‍🍳</span>', opts: [
      { em: "🍦", txt: "I'd like an ice cream, please.", model: "I'd like an ice cream, please." }, { em: "🧃", txt: "I'd like some juice, please.", model: "I'd like some juice, please." },
      { em: "🥐", txt: "I'd like a croissant, please.", model: "I'd like a croissant, please." }] },
    { q: "What's the weather like?", pic: w[0], top: '<span class="g-qem">' + w[0] + "</span>", opts: shuffle(WEATHER).map(function (x) { return { em: "", txt: x[1], model: x[1], ok: x === w }; }) },
    { q: "Look! What can you see?", pic: see[0][0] + see[0][1], top: '<span class="g-qem">' + see[0][0] + " " + see[0][1] + "</span>", opts: shuffle(see).map(function (x) { return { em: "", txt: x[2], model: x[2], ok: x === see[0] }; }) },
    { q: "What's your favourite colour?", free: true, top: C.titouSVG("happy", "g-qtitou"), opts: shuffle(["red", "blue", "green", "yellow", "pink", "purple"]).slice(0, 3).map(function (c) { return { em: swatch(c), txt: "My favourite colour is " + c + ".", model: "My favourite colour is " + c + "." }; }) }
  ];
  // always one picture description and one weather round
  const fixed = [R[6], R[5]]; const rest = shuffle(R.slice(0, 5).concat([R[7]])).slice(0, 3);
  return shuffle(fixed.concat(rest));
}
IMPL.talk = speakGame({ rounds: talkRounds });

/* ---------- audio needed by these games ---------- */
function grammarAudio(en) {
  PLURAL.forEach(function (w) { en(plSing(w)); PL_N.forEach(function (n) { en(plMany(w, n)); }); });
  SIZE_W.forEach(function (w) { en("a big " + w[0]); en("a small " + w[0]); });
  PREP_SETS.forEach(function (st) { en(wherePhrase(st[1], WHERE[st[0]].label)); en(wherePhrase(st[2], WHERE[st[0]].label)); });
  REPEAT_CHUNKS.forEach(function (c) { en(c[0]); });
  LIKE_FOOD.forEach(function (f) { en("I like " + f[0] + "."); en("I don't like " + f[0] + "."); });
  THIS_W.forEach(function (w) { en(thisPhrase(w)); en(thesePhrase(w)); });
  ACTIONS.forEach(function (a) { en(whoPhrase("girl", a)); en(whoPhrase("boy", a)); });
  ["What colour is it?", "How old are you?", "What do you want?", "What do you say?", "How are you?", "What's your name?", "My name is Titou. And you?"].forEach(en);
  COLOR_OBJ.forEach(function (c) { en("It's " + c[1] + "."); });
  Object.keys(AGE_W).forEach(function (a) { en("I'm " + AGE_W[a] + "."); });
  WANT.forEach(function (w) { en("I want " + article(w[0]) + " " + w[0] + ", please."); });
  HAVE.forEach(function (w) { en("Can I have the " + w[0] + ", please?"); });
  FEEL.forEach(function (f) { en(f[0]); });
  GAP.forEach(function (g) { const p = gapParts(g); if (p[0]) en(p[0]); if (p[1]) en(p[1]); en(gapFull(g)); });
  ["Hi! How are you?", "I'm fine, thank you!", "I'm seven.", "It's blue.", "Where do you live?", "I live in France.", "I like pizza.", "I have a dog.",
    "Do you like cats?", "Yes, I do!", "No, I don't.", "Can you swim?", "Yes, I can!", "No, I can't.", "Hello! What would you like?",
    "I'd like an ice cream, please.", "I'd like some juice, please.", "I'd like a croissant, please.", "What's the weather like?", "Look! What can you see?",
    "What's your favourite colour?"].forEach(en);
  WEATHER.forEach(function (w) { en(w[1]); }); SEE.forEach(function (x) { en(x[2]); });
  ["red", "blue", "green", "yellow", "pink", "purple"].forEach(function (c) { en("My favourite colour is " + c + "."); });
}

/* ---------- Styles (Apple-like, uses the site's Valeo Santé variables) ---------- */
const CSS = `
.g-home-row{display:grid;grid-template-columns:1.6fr 1fr;gap:14px;margin:0 0 14px}
.g-home-games{flex-direction:row;gap:12px;justify-content:flex-start;padding:12px 16px;min-height:112px;text-align:left;
  background:linear-gradient(135deg,var(--accent-soft),transparent 70%),var(--surface)}
.g-home-games .lbl{font-weight:700;font-size:17px;display:flex;flex-direction:column;gap:2px}
.g-home-games .lbl .en,.g-home-review .lbl .en{font-size:13px;color:var(--text2);font-weight:500}
.g-home-titou{width:78px;height:auto;flex:none}
.g-home-review{min-height:112px}
.g-home-review .lbl{font-weight:700;display:flex;flex-direction:column;align-items:center;gap:2px}
.hot{box-shadow:0 0 0 2px var(--gold),var(--shadow)!important;animation:g-hot 2.2s ease-in-out infinite}
.g-badge{position:absolute;top:8px;right:10px;background:var(--gold);color:#1d1d1f;font-weight:800;font-size:13px;border-radius:999px;padding:2px 8px}
.g-hub-head{display:flex;align-items:center;gap:14px;margin:2px 0 10px;justify-content:center}
.g-hub-titou{background:none;padding:0;flex:none}
.g-hub-titou-svg{width:104px;height:auto;display:block}
.g-hub-txt h1{margin:0;font-size:26px;letter-spacing:-.03em}
.g-hub-txt p{margin:2px 0 8px;color:var(--text2);font-weight:500}
.g-wr-btn{font-size:14px;padding:8px 14px}
.g-hub-scroll{padding-bottom:30px}
.g-review-tile{flex-direction:row;justify-content:flex-start;gap:16px;min-height:84px;padding:14px 18px;width:100%;text-align:left}
.g-review-tile .em{font-size:36px}
.g-review-tile .txt b{display:block;font-size:18px;font-weight:700}
.g-review-tile .txt span{font-size:14px;color:var(--text2);font-weight:500}
.g-band{margin:20px 4px 10px;font-size:13px;font-weight:700;color:var(--text2);text-transform:uppercase;letter-spacing:.08em}
.grid.g-games{grid-template-columns:repeat(2,1fr)}
@media (min-width:720px){.grid.g-games{grid-template-columns:repeat(4,1fr)}}
.g-tile{min-height:156px;padding-top:24px}
.g-tile .lbl{text-align:center;font-weight:650;font-size:15px;display:flex;flex-direction:column;gap:2px}
.g-tile .lbl .en{font-size:12px;color:var(--text2);font-weight:500}
.g-num{position:absolute;top:10px;left:12px;font-size:12px;font-weight:700;color:var(--text2);background:var(--surface2);border-radius:999px;min-width:22px;height:22px;display:grid;place-items:center}
.g-lock{position:absolute;top:8px;right:10px;font-size:22px}
.g-tile.locked .em,.g-tile.locked .lbl,.g-tile.locked .g-stars{filter:grayscale(1);opacity:.42}
.g-stars{display:inline-flex;gap:2px}
.g-st{color:var(--line);font-size:18px;line-height:1}
.g-st.on{color:var(--gold)}
.modal .g-stars .g-st{font-size:40px}
.g-cel-line{display:block;margin-top:8px;font-size:15px;color:var(--text)}
.g-parent{display:block;margin:24px auto 8px;font-size:13px;color:var(--text2);padding:8px 14px;border-radius:999px;border:1px dashed var(--line)}
.g-head{display:flex;align-items:center;justify-content:center;gap:12px;margin:2px 0 10px}
.g-speaker{width:64px;height:64px;border-radius:50%;background:var(--accent);color:var(--on-accent);font-size:28px;display:grid;place-items:center;box-shadow:0 8px 20px rgba(54,211,190,.3);transition:transform .2s var(--ease)}
.g-body{flex:1;min-height:0;display:flex;flex-direction:column;gap:12px;position:relative}
.g-sub{text-align:center;margin:0;color:var(--text2);font-weight:600}
.g-correct{box-shadow:0 0 0 4px var(--ok),var(--shadow)!important;animation:bounce .5s var(--ease)}
.g-wrong{animation:shake .4s ease;box-shadow:0 0 0 4px var(--warn),var(--shadow)!important}
.g-glow{animation:g-glow 1s ease-in-out 3}
.g-hand{position:fixed;z-index:90;font-size:46px;pointer-events:none;animation:g-tap .85s ease-in-out 3;filter:drop-shadow(0 6px 10px rgba(0,0,0,.35))}
.g-toast{position:fixed;left:50%;bottom:calc(20px + var(--safe-b));transform:translate(-50%,160%);z-index:95;display:flex;align-items:center;gap:10px;
  background:var(--surface);border:.5px solid var(--line);border-radius:22px;padding:8px 18px 8px 8px;box-shadow:var(--shadow);transition:transform .35s var(--ease);font-weight:600;max-width:92vw}
.g-toast.show{transform:translate(-50%,0)}
.g-toast small{color:var(--text2);font-weight:500}
.g-toast-titou{width:54px;height:auto;flex:none}
[data-drag]{touch-action:none}
.g-ghost{position:fixed!important;z-index:99;pointer-events:none;margin:0!important;opacity:.95}
.g-dragging{opacity:.35}
.g-drop-on{outline:3px dashed var(--accent);outline-offset:4px}
/* balloon */
.g-sky{flex:1;position:relative;overflow:hidden;border-radius:26px;min-height:280px;background:linear-gradient(180deg,rgba(56,203,220,.20),rgba(54,211,190,.04));border:.5px solid var(--line)}
.g-balloon{position:absolute;top:105%;width:calc(100% / var(--n,3) - 5%);max-width:170px;display:flex;flex-direction:column;align-items:center;padding:0;animation-name:g-rise;animation-timing-function:linear;animation-iteration-count:infinite}
.g-bal-body{width:100%;aspect-ratio:.84;border-radius:50% 50% 47% 47%/56% 56% 44% 44%;background:radial-gradient(circle at 30% 26%,rgba(255,255,255,.55),transparent 30%),var(--c);display:grid;place-items:center;box-shadow:inset -8px -12px 0 rgba(0,0,0,.13);animation:g-sway 2.6s ease-in-out infinite alternate;transition:transform .25s,opacity .25s}
.g-bal-em{font-size:clamp(30px,8vw,58px);background:rgba(255,255,255,.88);border-radius:50%;width:66%;aspect-ratio:1;display:grid;place-items:center;line-height:1}
.g-bal-str{width:2px;height:38px;background:var(--text2);opacity:.5}
.g-balloon.g-popped{pointer-events:none}
.g-balloon.g-popped .g-bal-body{transform:scale(1.5);opacity:0}
.g-balloon.g-popped .g-bal-str{opacity:0}
.g-balloon.g-wrong{animation-name:g-rise;box-shadow:none!important}
.g-balloon.g-wrong .g-bal-body{animation:shake .4s ease}
.g-balloon.g-glow .g-bal-body{box-shadow:0 0 0 5px var(--gold),0 0 26px var(--gold)}
/* paint */
.g-paint-wrap{flex:1;min-height:0;display:flex;align-items:center;justify-content:center}
.g-drawing{height:100%;max-height:50dvh;width:100%;max-width:520px}
.g-reg{fill:var(--surface2);stroke:var(--text2);stroke-width:2.5;stroke-linejoin:round;transition:fill .5s,stroke .5s}
.g-reg-s{fill:none!important;stroke-width:13;stroke:var(--surface2);stroke-linecap:round}
.g-reg-s.g-painted{stroke-width:13}
.g-cur{animation:g-blink 1.1s ease-in-out infinite;stroke:var(--accent);stroke-dasharray:7 5}
.g-reg-s.g-cur{stroke:var(--accent-soft);stroke-dasharray:none}
.g-pots{display:flex;gap:12px;justify-content:center;flex-wrap:wrap;padding:4px 0 6px}
.g-pot{width:clamp(66px,20vw,96px);aspect-ratio:1;border-radius:24px;background:var(--surface);box-shadow:var(--shadow);border:.5px solid var(--line);display:grid;place-items:center;transition:transform .2s var(--ease)}
.g-paint-blob{width:64%;aspect-ratio:1;border-radius:50% 50% 44% 56%;box-shadow:inset 0 -6px 0 rgba(0,0,0,.18)}
/* feed */
.g-foods{display:flex;justify-content:center;gap:14px;flex-wrap:wrap}
.g-food{width:clamp(86px,24vw,132px);aspect-ratio:1;border-radius:26px;background:var(--surface);box-shadow:var(--shadow);border:.5px solid var(--line);font-size:clamp(46px,12vw,74px);display:grid;place-items:center;transition:transform .2s var(--ease)}
.g-feed-titou{flex:1;min-height:0;display:flex;justify-content:center;align-items:flex-end;border-radius:28px;padding:6px}
.g-feed-svg{height:100%;max-height:40dvh;width:auto;max-width:100%}
/* dress */
.g-dress-wrap{flex:1;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.4fr);gap:14px}
.g-dress-titou{display:flex;align-items:center;justify-content:center;min-height:0}
.g-dress-svg{height:100%;max-height:52dvh;width:auto;max-width:100%}
.g-cloth{width:74%;height:auto;max-height:100%}
@media (max-width:640px){.g-dress-wrap{grid-template-columns:1fr;grid-template-rows:minmax(0,0.8fr) minmax(0,1.2fr)}.g-dress-svg{max-height:26dvh}}
/* simon */
.g-move{position:absolute;inset:0;z-index:5;border-radius:26px;background:rgba(8,10,18,.86);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;animation:pop .35s var(--ease)}
[data-theme="light"] .g-move{background:rgba(245,245,247,.92)}
.g-move-em{font-size:clamp(90px,26vw,150px);animation:g-dance .45s ease-in-out infinite alternate}
.g-move-lbl{font-size:26px;font-weight:800;color:var(--accent)}
/* count */
.g-dots{display:flex;flex-wrap:wrap;justify-content:center;align-content:center;gap:2px;line-height:1.05;max-width:100%}
.g-c-l span{font-size:clamp(34px,9vw,60px)}.g-c-m span{font-size:clamp(24px,6.5vw,42px)}.g-c-s span{font-size:clamp(17px,4.6vw,30px)}.g-c-xs span{font-size:clamp(12px,3.4vw,22px)}
/* build */
.g-slots{display:flex;gap:10px;justify-content:center;padding:10px;border-radius:22px;background:var(--surface2)}
.g-slot{width:clamp(80px,25vw,124px);min-height:86px;border-radius:18px;border:2px dashed var(--line);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px}
.g-slot.full{border-style:solid;border-color:var(--ok);background:var(--surface)}
.g-slot.next{border-color:var(--accent)}
.g-slot b,.g-wtile b{font-size:16px}
.g-slot-n{font-size:22px;font-weight:700;color:var(--text2)}
.g-result{flex:1;display:flex;align-items:center;justify-content:center;min-height:0}
.g-noun-res{width:auto;height:min(30dvh,200px);animation:pop .4s var(--ease)}
.g-noun-res.small{height:min(12dvh,80px)}
.g-rows{display:flex;flex-direction:column;gap:10px;flex:1;justify-content:center}
.g-row{display:flex;gap:10px;justify-content:center;padding:6px;border-radius:20px;transition:background .3s}
.g-row.active{background:var(--accent-soft)}
.g-wtile{min-width:clamp(86px,26vw,124px);padding:8px 10px;border-radius:18px;background:var(--surface);box-shadow:var(--shadow-sm);border:.5px solid var(--line);display:flex;flex-direction:column;align-items:center;gap:4px;transition:transform .2s var(--ease)}
.g-wtile.used{opacity:.3;pointer-events:none}
.g-ticon{width:44px;height:44px}
/* grammar + expression */
.g-qtop{display:flex;align-items:center;justify-content:center;gap:14px;min-height:0;flex:none}
.g-qtop.small .g-qtitou{height:70px}
.g-qtitou{height:clamp(74px,14dvh,120px);width:auto}
.g-qem{font-size:clamp(56px,11dvh,92px);line-height:1}
.g-gram.g-two{grid-template-columns:repeat(2,minmax(0,1fr));max-width:620px;width:100%;margin-left:auto;margin-right:auto}
.g-opt{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:8px}
.g-opt .em{font-size:clamp(52px,12vw,84px);line-height:1}
.g-opt-txt{aspect-ratio:auto!important;min-height:120px}
.g-otxt{font-size:clamp(15px,3.6vw,19px);font-weight:700;text-align:center;line-height:1.25}
.g-pic{position:relative;display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:4px;width:100%;height:100%;font-size:clamp(46px,10vw,78px);line-height:1}
.g-pic-n{font-size:clamp(34px,7.4vw,56px)}
.g-big{font-size:clamp(96px,20vw,150px)}
.g-small{font-size:clamp(30px,6vw,44px)}
.g-thumb-em{position:absolute;right:10%;bottom:10%;font-size:.62em;filter:drop-shadow(0 3px 6px rgba(0,0,0,.35))}
.g-point{font-size:.6em;margin-right:4px}
.g-kid{font-size:1.15em}
.g-act{position:absolute;right:8%;bottom:8%;font-size:.62em;background:var(--surface2);border-radius:50%;padding:6px;box-shadow:var(--shadow-sm)}
.g-swatch.big{width:clamp(60px,14vw,96px);height:clamp(60px,14vw,96px)}
.g-num-big{font-size:clamp(56px,13vw,96px);font-weight:800;color:var(--accent)}
.g-gap-txt{font-size:clamp(20px,4.8vw,30px);font-weight:700;letter-spacing:-.01em}
.g-blank{display:inline-block;min-width:2.4em;text-align:center;border-bottom:3px dashed var(--accent);color:var(--accent);margin:0 4px}
.g-word{font-size:clamp(26px,6vw,40px);font-weight:800;letter-spacing:-.01em}
@media (max-width:640px){.g-qtop{gap:8px}.g-gap-txt{font-size:19px}.g-opt-txt{min-height:96px}}
.g-swatch{width:42px;height:42px;border-radius:50%;box-shadow:inset 0 -4px 0 rgba(0,0,0,.15)}
/* where */
.g-scenes{flex:0 0 auto;width:100%;max-width:860px;margin:auto;grid-template-columns:repeat(3,1fr);grid-auto-rows:auto;align-content:center}
.g-scenes.g-sc4{grid-template-columns:repeat(2,1fr);max-width:min(640px,66dvh)}
@media (max-width:640px){.g-scenes,.g-scenes.g-sc4{grid-template-columns:repeat(2,1fr)}}
.g-scene{width:100%;height:100%;max-height:100%}
.g-scene-btn{padding:4px;aspect-ratio:1/1;height:auto}
/* story */
.g-panels{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;flex:1;min-height:0;max-height:300px;align-self:stretch;margin:auto 0}
.g-panels.small{flex:none;height:84px}
.g-panel{border-radius:22px;background:var(--surface);box-shadow:var(--shadow);border:.5px solid var(--line);display:grid;place-items:center;position:relative;transition:transform .3s var(--ease),box-shadow .3s;padding:6px}
.g-panel.on{box-shadow:0 0 0 4px var(--accent),var(--shadow);transform:scale(1.03)}
.g-panel-em{font-size:clamp(28px,7.5vw,66px);line-height:1.1;text-align:center;word-break:break-word}
.g-panels.small .g-panel-em{font-size:26px}
.g-panel-n{position:absolute;top:6px;left:9px;font-size:12px;font-weight:700;color:var(--text2)}
.g-question{text-align:center;font-size:clamp(18px,4.6vw,24px);font-weight:700;margin:2px 0}
.g-inline-titou{height:1.05em;width:auto;vertical-align:-0.12em}
.g-story-opts{flex:1}
.g-body .g-grid{align-content:center;align-items:center;grid-auto-rows:auto}
.g-body .g-grid>.choice{height:auto;aspect-ratio:1/1;max-height:32dvh;width:100%;justify-self:center}
.g-body .g-grid.g-story-opts>.choice{max-width:240px}
.g-body .g-scenes>.choice{max-height:46dvh}
.g-dress-wrap .g-grid{grid-template-columns:repeat(2,minmax(0,1fr));max-width:420px;width:100%;margin:auto}
.g-dress-wrap .g-grid>.choice{max-height:22dvh}
/* shop */
.g-shelf{display:grid;grid-template-columns:repeat(4,1fr);gap:10px;padding:10px;background:var(--surface2);border-radius:22px}
.g-shelf-item{aspect-ratio:1;border-radius:18px;background:var(--surface);box-shadow:var(--shadow-sm);border:.5px solid var(--line);font-size:clamp(34px,9vw,60px);display:grid;place-items:center;transition:transform .2s var(--ease)}
.g-basket{flex:1;min-height:120px;border-radius:28px;border:3px dashed var(--line);display:flex;align-items:center;justify-content:center;padding:10px}
.g-basket-in{display:flex;flex-wrap:wrap;gap:6px;justify-content:center}
.g-bitem{font-size:clamp(34px,9vw,54px);animation:pop .3s var(--ease);padding:0}
.g-basket-empty{font-size:64px;opacity:.35}
.g-check{align-self:center;font-size:18px;padding:14px 28px;min-width:220px}
/* speak */
.g-say-card{flex:1;min-height:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px;background:var(--surface);border-radius:32px;box-shadow:var(--shadow);border:.5px solid var(--line);padding:16px}
.g-say-em{font-size:clamp(76px,22vw,140px);line-height:1}
.g-say-txt{font-size:clamp(24px,6vw,38px);font-weight:700;letter-spacing:-.02em;text-align:center}
.g-say-btns{display:flex;gap:18px;justify-content:center;align-items:center}
.g-mic{width:96px;height:96px;border-radius:50%;background:var(--accent);color:var(--on-accent);font-size:42px;display:grid;place-items:center;box-shadow:0 8px 22px rgba(54,211,190,.32);transition:transform .2s var(--ease)}
.g-mic.on{animation:g-rec 1s ease-in-out infinite}
.g-thumb{height:78px;padding:0 22px;border-radius:999px;background:var(--surface);border:.5px solid var(--line);box-shadow:var(--shadow);font-size:34px;display:flex;align-items:center;gap:8px;transition:transform .2s var(--ease)}
.g-thumb span{font-size:16px;font-weight:700}
.g-say-msg{text-align:center;color:var(--text2);font-weight:600;margin:0;min-height:1.3em}
/* wardrobe */
.g-wardrobe{max-width:540px}
.g-wr-titou{width:130px;height:auto;display:block;margin:0 auto 6px}
.g-acc-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(86px,1fr));gap:8px;margin:10px 0 14px;max-height:42dvh;overflow:auto;padding:4px}
.g-acc{border-radius:16px;background:var(--surface2);padding:10px 4px 8px;display:flex;flex-direction:column;align-items:center;gap:4px;transition:transform .2s var(--ease)}
.g-acc.on{box-shadow:0 0 0 3px var(--accent)}
.g-acc.locked{opacity:.5}
.g-acc-em{font-size:30px;line-height:1}
.g-acc-lbl{font-size:11px;font-weight:600;text-align:center;color:var(--text2)}
@media (hover:hover) and (pointer:fine){
  .g-pot:hover,.g-food:hover,.g-wtile:hover,.g-shelf-item:hover,.g-panel:hover,.g-acc:hover,.g-thumb:hover,.g-mic:hover,.g-speaker:hover,.g-parent:hover{transform:translateY(-3px)}
}
@keyframes g-rise{from{top:105%}to{top:-62%}}
@keyframes g-sway{from{transform:translateX(-6px) rotate(-3deg)}to{transform:translateX(6px) rotate(3deg)}}
@keyframes g-glow{0%,100%{box-shadow:0 0 0 0 rgba(250,183,66,0),var(--shadow)}50%{box-shadow:0 0 0 6px rgba(250,183,66,.85),var(--shadow)}}
@keyframes g-hot{0%,100%{box-shadow:0 0 0 2px var(--gold),var(--shadow)}50%{box-shadow:0 0 0 4px var(--gold),0 0 24px rgba(250,183,66,.45)}}
@keyframes g-tap{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(10px) scale(.88)}}
@keyframes g-blink{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes g-dance{from{transform:rotate(-10deg) translateY(0)}to{transform:rotate(10deg) translateY(-14px)}}
@keyframes g-rec{0%,100%{box-shadow:0 0 0 0 rgba(234,103,83,.6)}50%{box-shadow:0 0 0 16px rgba(234,103,83,0)}}
@media (prefers-reduced-motion:reduce){.g-balloon{animation-duration:40s!important}}
`;
function injectCSS() {
  if (document.getElementById("g-style")) return;
  const st = document.createElement("style"); st.id = "g-style"; st.textContent = CSS;
  document.head.appendChild(st);
}

/* ---------- Sync helpers (child_profiles.settings jsonb) ---------- */
function settingsOut(p) {
  ensure(p);
  return { games: p.games, gamesAll: !!p.gamesAll, review: p.review, acc: p.acc, wear: p.wear, mil: p.mil, revN: p.revN, gPlays: p.gPlays };
}
function settingsIn(p, st) {
  st = st || {};
  p.games = st.games || {}; p.gamesAll = !!st.gamesAll; p.review = st.review || {}; p.acc = st.acc || []; p.wear = st.wear || {};
  p.mil = st.mil || []; p.revN = st.revN || 0; p.gPlays = st.gPlays || 0;
  return p;
}
function mergeInto(out, loc, rem, locNewer) {
  ensure(loc); ensure(rem);
  const games = {};
  Object.keys(loc.games).concat(Object.keys(rem.games)).forEach(function (k) { games[k] = Math.max(loc.games[k] || 0, rem.games[k] || 0); });
  const review = {};
  Object.keys(loc.review).concat(Object.keys(rem.review)).forEach(function (k) {
    const a = loc.review[k], b = rem.review[k];
    review[k] = !a ? b : !b ? a : (a.d >= b.d ? a : b);
  });
  const acc = loc.acc.slice(); rem.acc.forEach(function (a) { if (acc.indexOf(a) < 0) acc.push(a); });
  const mil = loc.mil.slice(); rem.mil.forEach(function (a) { if (mil.indexOf(a) < 0) mil.push(a); });
  const newer = locNewer ? loc : rem;
  out.games = games; out.review = review; out.acc = acc; out.mil = mil;
  out.wear = Object.assign({}, newer.wear); out.gamesAll = !!newer.gamesAll;
  out.revN = Math.max(loc.revN, rem.revN); out.gPlays = Math.max(loc.gPlays, rem.gPlays);
  return out;
}

/* ---------- All audio clips the games need ---------- */
function audioList() {
  const L = [];
  const en = function (t) { L.push([t, "en-US"]); }, fr = function (t) { L.push([t, "fr-FR"]); };
  GAMES.forEach(function (g) { fr(g.intro); });
  Object.keys(FR).forEach(function (k) { fr(FR[k]); });
  Object.keys(EN).forEach(function (k) { [].concat(EN[k]).forEach(en); });
  en("You did it!");
  BALLOON_WORDS.forEach(function (w) { en("Pop the " + w[0] + "!"); });
  Object.keys(PAINT).forEach(function (c) { en(cap(c) + "!"); en("Paint it " + c + "!"); });
  FOODS.forEach(function (f) { en("Titou wants " + f[0] + "!"); });
  DRESS_COLORS.forEach(function (c) { DRESS_ITEMS.forEach(function (it) { en(dressPhrase(c, it)); }); });
  SIMON.forEach(function (a) { en(simonPhrase(a[0])); });
  COUNT_OBJ.forEach(function (o) { for (let n = 1; n <= 10; n++) en(countPhrase(n, o)); if (COUNT_BIG.indexOf(o[0]) >= 0) for (let n = 11; n <= 20; n++) en(countPhrase(n, o)); });
  ["big", "small"].forEach(function (sz) { en(sz); BUILD_COLORS.forEach(function (c) { BUILD_NOUNS.forEach(function (n) { en(buildPhrase(sz, c, n)); }); }); });
  BUILD_COLORS.forEach(en); BUILD_NOUNS.forEach(en);
  Object.keys(WHERE).forEach(function (o) { WHERE[o].preps.forEach(function (p) { en(wherePhrase(p, WHERE[o].label)); }); });
  STORIES.forEach(function (st) { st.p.forEach(function (pn) { en(pn[1]); }); st.q.forEach(function (q) { en(q[0]); }); });
  SHOP.forEach(function (o) { for (let n = 1; n <= 5; n++) en(shopPhrase(n, o)); });
  for (let n = 1; n <= 9; n++) en(NUMW[n]);
  SPEAK_WORDS.forEach(function (w) { en(w[0]); }); SPEAK_PHRASES.forEach(function (w) { en(w[0]); });
  grammarAudio(en);
  return L;
}

/* ---------- Public API (used by index.html) ---------- */
G.init = function (core) { C = core; injectCSS(); };
G.handles = function (s) { return s === "games" || s === "game"; };
G.render = function (s) { return s === "games" ? renderHub() : renderGame(); };
G.afterRender = function (s) {
  if (s === "game" && cur) { const b = document.querySelector(".g-body"); if (b) bindDrag(b); }
};
G.announce = function (name) { if (name === "games") { sayFr(FR.hub); return true; } return name === "game"; };
G.act = function (act, id, el) {
  if (act === "games") { if (cur) cur.tok = -1; cur = null; clearHint(); C.stop(); C.setReturn(null); C.go("games"); return; }
  tapAct(act.slice(2), id, el, false);
};
G.homeBanner = homeBanner;
G.titou = titou;
G.overlayHTML = function (o) { return o && o.type === "g-wardrobe" ? wardrobeHTML() : ""; };
G.onCorrect = onCorrect;
G.finishCore = finish;
G.starsFor = starsFor;
G.settingsOut = settingsOut;
G.settingsIn = settingsIn;
G.mergeInto = mergeInto;
G.reset = function (p) { p.games = {}; p.review = {}; p.gamesAll = false; p.acc = []; p.wear = {}; p.mil = []; p.revN = 0; p.gPlays = 0; };
G.audioList = audioList;
G.GAMES = GAMES; G.ACC = ACC; G.STORIES = STORIES;
G.debug = {
  cur: function () { return cur; },
  start: function (id) { const p = ensure(prof()); if (GAME[id] && !isUnlocked(p, GAME[id])) return false; startGame(id); return true; },
  scene: function (o, p) { return sceneSvg(o, p); },
  okSelector: function () { return '.g-body [data-ok="1"]'; },
  unlocked: function () { const p = ensure(prof()); return visibleGames().map(function (g) { return g.id + ":" + (isUnlocked(p, g) ? 1 : 0); }).join(","); },
  forceDue: function () { const p = ensure(prof()); backfill(p); Object.keys(p.review).forEach(function (k) { p.review[k].d = Date.now() - 1000; }); C.save(); return dueList(p).length; },
  due: function () { return dueList(ensure(prof())).length; }
};
})();
