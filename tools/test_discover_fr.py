"""Découvrir French audio + default-unlock screenshots (desktop + mobile)."""
import os, time, re
from playwright.sync_api import sync_playwright

BASE = os.environ.get("BASE", "http://127.0.0.1:8765/index.html")
SHOTS = "/workspace/appli-enfant/screenshots/"
errors, bad_audio = [], []

EXPECTED = {
    4: "listen:1,balloon:1,paint:0,feed:0,plural:0,sizes:0,repeat:0",
    6: "listen:1,balloon:1,paint:0,feed:0,plural:0,sizes:0,repeat:0,memory:0,dress:0,simon:0,count:0,phrases:0,who:0,answer:0",
    8: "listen:1,balloon:1,paint:0,feed:0,plural:0,sizes:0,repeat:0,memory:0,dress:0,simon:0,count:0,phrases:0,who:0,answer:0,build:0,where:0,story:0,shop:0,speak:0,gap:0,talk:0",
}

def hook_audio(pg):
    pg.evaluate("""() => {
      window.__plays = [];
      if (window.__playHooked) return;
      window.__playHooked = true;
      const orig = Audio.prototype.play;
      Audio.prototype.play = function () {
        const src = this.currentSrc || this.src || "";
        const name = src.split("/").pop();
        if (name) window.__plays.push(name);
        return orig.apply(this, arguments);
      };
    }""")

def plays(pg):
    return pg.evaluate("() => (window.__plays || []).slice()")

def reset_plays(pg):
    pg.evaluate("() => { window.__plays = []; }")

def open_fresh(pg, age=5):
    pg.evaluate("() => localStorage.clear()")
    pg.reload(wait_until="networkidle")
    pg.wait_for_timeout(400)
    pg.mouse.click(5, 5)
    pg.evaluate("() => { if (window.__englishStars) __englishStars.unlockAudio(); }")
    hook_audio(pg)

def run(pw, name, vp, mobile):
    browser = pw.chromium.launch(channel="chrome", args=["--autoplay-policy=no-user-gesture-required"])
    ctx = browser.new_context(viewport=vp, is_mobile=mobile, has_touch=mobile, device_scale_factor=2 if mobile else 1)
    pg = ctx.new_page()
    pg.on("console", lambda m: m.type == "error" and errors.append("%s console: %s" % (name, m.text)))
    pg.on("pageerror", lambda e: errors.append("%s pageerror: %s" % (name, e)))
    def on_resp(r):
        if "/storage/v1/object/public/audio/" in r.url and r.status not in (200, 206, 304):
            bad_audio.append((r.status, r.url.rsplit("/", 1)[-1]))
    pg.on("response", on_resp)

    pg.goto(BASE, wait_until="networkidle")
    open_fresh(pg, 5)

    # --- Discover ---
    reset_plays(pg)
    pg.evaluate("() => __englishStars.openDiscover('pets', 5)")
    pg.wait_for_selector(".fr-flag-btn")
    # Wait for intro + EN + FR + EN (intro is a long sentence).
    deadline = time.time() + 14
    first_plays = []
    while time.time() < deadline:
        first_plays = plays(pg)
        frs = [x for x in first_plays if x.startswith("fr-") and "appuie-sur-l-image" not in x]
        ens = [x for x in first_plays if x.startswith("en-")]
        if frs and len(ens) >= 2:
            break
        pg.wait_for_timeout(300)
    geo = pg.evaluate("""() => {
      const wrap = document.querySelector('.big-card-wrap');
      const btn = document.querySelector('.fr-flag-btn');
      const card = document.querySelector('.big-card');
      const wr = wrap.getBoundingClientRect(), br = btn.getBoundingClientRect();
      const overflow = br.right > wr.right + 2 || br.left < wr.left - 2 || br.top < wr.top - 2 || br.bottom > wr.bottom + 2;
      const offscreen = br.right > window.innerWidth + 1 || br.left < -1 || br.bottom > window.innerHeight + 1 || br.top < -1;
      return {
        aria: btn.getAttribute('aria-label'),
        overflow, offscreen,
        btn: {w: Math.round(br.width), h: Math.round(br.height), top: Math.round(br.top), right: Math.round(window.innerWidth-br.right)},
        fr: document.querySelector('.word-fr') && document.querySelector('.word-fr').textContent,
        en: document.querySelector('.big-card .word') && document.querySelector('.big-card .word').textContent,
        spoken: __englishStars.discoverFr(window.__englishStars.getState && null) || null
      };
    }""")
    # discoverFr of current item
    geo["spoken"] = pg.evaluate("() => { const s = __englishStars; return s.discoverFr ? s.discoverFr : null; }")
    item = pg.evaluate("""() => {
      const h = __englishStars;
      // reopen is messy; read DOM + helper via current theme pets first item after openDiscover
      const frLabel = document.querySelector('.word-fr') && document.querySelector('.word-fr').textContent;
      return {en: document.querySelector('.big-card .word').textContent, fr: frLabel, aria: document.querySelector('.fr-flag-btn').getAttribute('aria-label')};
    }""")
    pg.screenshot(path=SHOTS + "discover-fr-%s.png" % name)
    print(name, "discover item", item, "geo", {k: geo[k] for k in ("aria","overflow","offscreen","btn","fr","en")})
    print(name, "first plays", first_plays)

    # Flag click: French only, must not start English of the word as a new chain
    reset_plays(pg)
    pg.locator(".fr-flag-btn").click()
    pg.wait_for_timeout(1800)
    flag_plays = plays(pg)
    pg.screenshot(path=SHOTS + "discover-fr-%s-flag.png" % name)
    print(name, "flag plays", flag_plays)

    # Later tap on the card: English only (no French, except if phrase)
    reset_plays(pg)
    pg.locator(".big-card").click()
    pg.wait_for_timeout(1800)
    later = plays(pg)
    print(name, "later card plays", later)

    # overflow / aria assertions
    assert item["aria"] == "Écouter le mot en français", item
    assert geo["overflow"] is False, geo
    assert geo["offscreen"] is False, geo
    assert geo["btn"]["w"] >= 44 and geo["btn"]["h"] >= 44, geo
    assert item["fr"] and item["fr"] != item["en"]

    # first sequence should include a French clip and English
    def is_fr(n): return n.startswith("fr-")
    def is_en(n): return n.startswith("en-")
    frs = [x for x in first_plays if is_fr(x)]
    ens = [x for x in first_plays if is_en(x)]
    assert frs, "expected French audio on first show, got %s" % first_plays
    assert ens, "expected English audio on first show, got %s" % first_plays
    # last content word should be English (intro is first French; then EN FR EN)
    # The last play should be English (word or phrase)
    assert is_en(first_plays[-1]), "last first-play clip should be English: %s" % first_plays

    # flag: only French (maybe one clip)
    assert flag_plays, "flag should play French audio"
    assert all(is_fr(x) for x in flag_plays), "flag triggered non-French audio: %s" % flag_plays

    # later tap: English only
    assert later, "later tap should play English"
    assert all(is_en(x) for x in later), "later tap played French: %s" % later

    # --- Unlock hubs ---
    for age in (4, 6, 8):
        pg.evaluate("""(age) => {
          const h = __englishStars;
          h.seedDemo(1, age);
          const p = h.getState().store.profiles[0];
          p.age = age; p.games = {}; p.acc = []; p.wear = {}; p.review = {}; p.mil = [];
          p.gPlays = 0; p.revN = 0; p.gamesAll = false; p.gLvl = {}; p.gSeen = {};
          h.go('games');
        }""", age)
        pg.wait_for_timeout(600)
        got = pg.evaluate("() => __englishStars.games().unlocked()")
        print(name, "age", age, "unlocked:", got)
        assert got == EXPECTED[age], "age %s expected %s got %s" % (age, EXPECTED[age], got)
        open_n = pg.evaluate("() => document.querySelectorAll('.g-tile:not(.locked)').length")
        locked_n = pg.evaluate("() => document.querySelectorAll('.g-tile.locked').length")
        print(name, "age", age, "tiles open", open_n, "locked", locked_n)
        pg.screenshot(path=SHOTS + "unlock-%s-age%s.png" % (name, age))

    ctx.close(); browser.close()

def main():
    os.makedirs(SHOTS, exist_ok=True)
    with sync_playwright() as pw:
        run(pw, "desktop", {"width": 1366, "height": 860}, False)
        run(pw, "mobile", {"width": 390, "height": 844}, True)
    print("bad audio", bad_audio[:15], "count", len(bad_audio))
    print("errors", errors[:20], "count", len(errors))
    if errors or bad_audio:
        raise SystemExit(1)
    print("ALL OK")

if __name__ == "__main__":
    main()
