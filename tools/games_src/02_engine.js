
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
  if (!p.gLvl || typeof p.gLvl !== "object") p.gLvl = {};
  if (!p.gSeen || typeof p.gSeen !== "object") p.gSeen = {};
  return p;
}

/* ----- Unlocking ----- */
function visibleGames() { const gb = group(band()); return GAMES.filter(function (g) { return g.band <= gb; }); }
function isUnlocked(p, g) {
  ensure(p);
  if (g.id === "balloon" && balloonPool(p).length < 2) return false;
  if (p.gamesAll) return true;
  const gb = group(band());
  if (g.band > gb) return false;
  if (g.open) return true;
  /* Visible games in list order, minus the two starters. First locked game
     opens after 2 stars on any already-open game; then the chain continues. */
  const list = GAMES.filter(function (x) { return x.band <= gb; });
  const locked = list.filter(function (x) { return !x.open; });
  const i = locked.indexOf(g);
  if (i < 0) return true;
  if (i === 0) return list.some(function (x) { return (p.games[x.id] || 0) >= 2; });
  return (p.games[locked[i - 1].id] || 0) >= 2;
}
function prevGame(g) {
  const gb = group(band());
  const list = GAMES.filter(function (x) { return x.band <= gb; });
  const locked = list.filter(function (x) { return !x.open; });
  const i = locked.indexOf(g);
  if (i > 0) return locked[i - 1];
  if (i === 0) return list.filter(function (x) { return x.open; })[0] || null;
  const j = list.indexOf(g);
  return j > 0 ? list[j - 1] : null;
}
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
  // grammar/expression games: 3 stars -> next difficulty level (max 3)
  if (GAME[gameId] && GAME[gameId].kind && stars >= 3) p.gLvl[gameId] = Math.min(3, (p.gLvl[gameId] || 1) + 1);
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
// Targets AND distractors must have actually been encountered by this child.
// Stars or an unlocked theme alone do not prove that a particular picture was seen.
function balloonPool(p) {
  const ix = itemIndex(); const usedWords = new Set(); const usedPictures = new Set();
  return Object.keys((p && p.words) || {}).map(function (id) {
    const progress = p.words[id];
    if (!progress || !(progress.seen > 0 || progress.correct > 0) || !ix[id]) return null;
    return ix[id].item;
  }).filter(function (it) {
    if (!it || !it.en || !it.emoji) return false;
    const word = it.en.trim().toLowerCase();
    const picture = it.pup ? "pup:" + it.pup : it.color ? "color:" + it.color : it.count ? "count:" + it.count + ":" + it.emoji : "emoji:" + it.emoji;
    if (usedWords.has(word) || usedPictures.has(picture)) return false;
    usedWords.add(word); usedPictures.add(picture); return true;
  });
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
  if (ok.classList.contains("g-balloon-choice")) return;
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
