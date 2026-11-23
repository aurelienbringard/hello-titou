// Run with: node tools/test_balloon.mjs (no dependencies or real child accounts).
import assert from 'node:assert/strict';
import fs from 'node:fs';
import vm from 'node:vm';

const root = new URL('../', import.meta.url);
const source = fs.readFileSync(new URL('games.js', root), 'utf8');
const content = fs.readFileSync(new URL('content.js', root), 'utf8');
const pause = ms => new Promise(resolve => setTimeout(resolve, ms));

function fixture(age, words = {}) {
  const timers = new Set();
  const document = {
    getElementById: () => null, querySelector: () => null, querySelectorAll: () => [],
    createElement: () => ({ classList: { add() {}, remove() {} } }),
    head: { appendChild() {} }, body: { appendChild() {} }
  };
  const context = vm.createContext({
    window: {}, document, console,
    setTimeout: (fn, ms) => { const id = setTimeout(fn, ms); timers.add(id); return id; },
    clearTimeout, setInterval: (fn, ms) => { const id = setInterval(fn, ms); timers.add(id); return id; },
    clearInterval
  });
  vm.runInContext(content, context);
  vm.runInContext(source, context);
  const G = context.window.HT_GAMES;
  const themes = Object.fromEntries(context.window.HT_CONTENT.themes.map(t => [t.id, t]));
  const p = { words, stars: {}, games: {} };
  let screen = 'games', overlay = null, pending = null;
  const speech = [], correct = [];
  G.init({
    profile: () => p, band: () => age, frenchOn: () => true,
    THEMES: themes, THEME_ORDER: Object.keys(themes),
    shuffle: a => a.sort(() => Math.random() - .5),
    esc: s => s.replaceAll('&', '&amp;').replaceAll('"', '&quot;').replaceAll('<', '&lt;'),
    visual: it => `<div class="em">${it.emoji}</div>`,
    go: name => { screen = name; }, screen: () => screen,
    render() {}, stop() {}, sfx() {}, burst() {}, touch() {}, save() {},
    topbar: () => '', accountMenu: () => '', titouSVG: () => '<svg></svg>',
    setReturn() {}, setOverlay: o => { overlay = o; },
    markCorrect: ids => correct.push(...ids),
    speak: (text, lang) => { speech.push({ text, lang }); return pending || Promise.resolve(); }
  });
  return {
    G, p, speech, correct, themes,
    overlay: () => overlay,
    hold: () => { let resolve; pending = new Promise(r => { resolve = r; }); return () => { pending = null; resolve(); }; },
    cleanup: () => { for (const id of timers) { clearTimeout(id); clearInterval(id); } }
  };
}

async function ready(f) {
  for (let i = 0; i < 100; i++) {
    if (f.G.debug.cur() && !f.G.debug.cur().locked) return;
    await pause(10);
  }
  throw new Error('Game did not unlock after its instruction');
}

function element() {
  const classes = new Set();
  return { classList: { add: c => classes.add(c), remove: c => classes.delete(c), contains: c => classes.has(c) } };
}

function tap(f, ok) {
  const s = f.G.debug.cur();
  const id = s.balloons.findIndex(b => b.ok === ok);
  const el = element();
  f.G.act('g:pop', String(id), el);
  return el;
}

for (const words of [{}, { dog: { seen: 1 } }, { dog: { seen: 0 }, cat: { correct: 0 } },
  { removed: { seen: 9 }, dog: { seen: 1 } }]) {
  const f = fixture(4, words);
  try {
    assert.equal(f.G.debug.start('balloon'), false, 'Needs two encountered pictures');
    f.p.gamesAll = true;
    assert.equal(f.G.debug.start('balloon'), false, 'Parent unlock must not introduce unfamiliar pictures');
    f.p.stars.pets = 100; f.p.games.listen = 3;
    assert.equal(f.G.debug.start('balloon'), false, 'Stars alone do not identify encountered pictures');
    assert.match(f.G.render('games'), /Découvre au moins 2 images/);
  } finally { f.cleanup(); }
}

for (const age of [4, 6, 8]) {
  for (const count of [2, 6]) {
    // Includes words outside the old fixed balloon vocabulary, and legacy correct-only records.
    const ids = ['dog', 'cat', 'rabbit', 'hamster', 'turtle', 'parrot'].slice(0, count);
    const words = Object.fromEntries(ids.map((id, i) => [id, i === 0 ? { correct: 1 } : { seen: 1 }]));
    words.apple = { seen: 0, correct: 0 };
    const f = fixture(age, words);
    try {
      assert.equal(f.G.debug.start('balloon'), true);
      assert.equal(f.G.debug.cur().locked, true, 'Wait for the spoken instruction');
      await ready(f);
      const targets = [];
      for (let round = 0; round < 5; round++) {
        const s = f.G.debug.cur();
        assert.equal(s.q, round);
        assert.equal(s.balloons.length, Math.min(count, age <= 5 ? 3 : 4));
        assert.equal(s.balloons.filter(b => b.ok).length, 1);
        assert.equal(new Set(s.balloons.map(b => b.w.emoji)).size, s.balloons.length);
        for (const b of s.balloons) {
          assert.ok(ids.includes(b.w.id), 'No unseen target or distractor');
          const canonical = f.themes.pets.items.find(it => it.id === b.w.id);
          assert.equal(b.w.emoji, canonical.emoji, 'Use the previously encountered picture');
        }
        const target = s.target.id;
        if (targets.length) assert.notEqual(target, targets.at(-1), 'Avoid immediate repeated targets');
        targets.push(target);
        const last = f.speech.length;
        f.G.act('g:again');
        assert.equal(f.speech[last].text, s.target.en, 'Replay the exact familiar word');
        if (round === 0) {
          const el = tap(f, false);
          assert.equal(el.classList.contains('g-popped'), false, 'Incorrect balloons stay available');
          assert.equal(s.q, 0); assert.equal(s.first, 0);
          await pause(5);
        }
        const release = f.hold();
        const el = tap(f, true);
        assert.equal(el.classList.contains('g-popped'), true);
        assert.equal(s.locked, true);
        const awarded = s.first;
        tap(f, true);
        assert.equal(s.first, awarded, 'Double taps cannot award twice');
        release();
        await pause(5);
      }
      assert.equal(f.p.games.balloon, 3, 'Four first-try successes earn three stars');
      assert.equal(f.p.gPlays, 1, 'Complete the session once');
      assert.equal(f.correct.length, 5);
      assert.equal(f.overlay().type, 'celebrate');
      if (count >= 5) assert.equal(new Set(targets).size, 5, 'Five distinct targets when available');
      f.G.act('g:replay'); await ready(f);
      assert.equal(f.G.debug.cur().q, 0, 'Replay starts a new session');
      const release = f.hold(); tap(f, true); f.G.act('games'); release();
      await pause(5);
      assert.equal(f.G.debug.cur(), null, 'Leaving cancels pending round transitions');
    } finally { f.cleanup(); }
  }
}

// Two IDs with the same picture do not provide a meaningful listening choice.
const duplicate = fixture(4);
try {
  const items = Object.values(duplicate.themes).flatMap(t => t.items);
  const pair = items.find(a => items.some(b => b.id !== a.id && b.emoji === a.emoji && b.en === a.en));
  assert.ok(pair);
  const other = items.find(b => b.id !== pair.id && b.emoji === pair.emoji && b.en === pair.en);
  duplicate.p.words[pair.id] = { seen: 1 }; duplicate.p.words[other.id] = { seen: 1 };
  assert.equal(duplicate.G.debug.start('balloon'), false, 'Duplicate pictures must not unlock the game');
} finally { duplicate.cleanup(); }

console.log('Balloon regressions passed: locking, per-child vocabulary, familiar artwork/audio, retries, scoring, replay and cancellation.');
