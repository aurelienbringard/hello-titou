
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
  if (g.id === "balloon" && balloonPool(prof()).length < 2) {
    toast("Découvre d'abord au moins <b>deux images différentes</b> dans Découvrir, Trouve ou Mémoire, puis reviens jouer avec les ballons !");
    sayFr(FR.hub); return;
  }
  const list = GAMES.filter(function (x) { return x.band === g.band; });
  const locked = list.filter(function (x) { return !x.open; });
  const i = locked.indexOf(g);
  if (i === 0) {
    toast("Gagne <b>2 étoiles ⭐⭐</b> à un jeu déjà ouvert pour débloquer !");
  } else {
    const pg = prevGame(g);
    toast("Réussis <b>" + esc(pg ? pg.emoji + " " + pg.fr : "le jeu d'avant") + "</b> pour débloquer !<br><small>(2 étoiles ⭐⭐)</small>");
  }
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
        '<div class="em">' + g.emoji + '</div><div class="lbl">' + esc(g.fr) + '<span class="en">' + esc(g.en) + "</span>" +
        (g.id === "balloon" && !open ? '<span class="g-lock-note">Découvre au moins 2 images</span>' : "") + "</div>" + starRow(st) + "</button>";
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
