# games task progress
- [x] backup Fri Nov 20 17:27:27 CET 2026
## Plan (games task, started 17:27 Paris time)
- games.js (new file, loaded before the main script) = HT_GAMES with data, engine, 11 new games, review, rewards, CSS injected
- index.html hooks: init(core API), render/announce/onAct "games"/"g:*" delegation, homeBanner, settings sync (child_profiles.settings jsonb: games, review, acc, wear, gamesAll, revN), markCorrect -> onCorrect, quiz first-try + memory misses -> finishCore
- audio: node tools/games_audio.js -> games_manifest.json -> gen/upload/check (same pipeline)
- tests: tools/test_games.py -> screenshots/games-*.png
Status:
- [x] 01_data.js written (games list, content, 18 stories, 14 accessories)
- [x] 02_engine.js (unlock, rewards, review, hint, drag, titou dressed)
- [x] 03_session.js (framework, hub, home banner, wardrobe, review)
- [x] 04_games.js (11 new games)
- [x] 05_css_api.js; games.js assembled (cat 01..05 > games.js)
- [ ] audio: manifest merged (+448), gen running -> tools/gen_games.log (MISSING=games_missing.json)
- [x] index.html patched (tools/patch_games.py; backup backup/index-before-games-20261120-1727.html)
- [x] audio generated 448/448 (audio_out/)
- [x] temp policy created 17:47 and DROPPED after uploading 448 clips (bucket: 12758 files, 192.8 MB)
## URGENT (17:48): emoji-word audit of content.js + hotfix deploy BEFORE games (deploy content.js + live index (backup/index-before-games) with bumped v)
- 17:58 emoji audit: 190 items fixed (tools/emoji_fixes.txt), 252 new clips uploaded, policy dropped. content.js v=202611201754. NEXT: hotfix deploy content.js + /tmp/hotfix/index.html
- 18:05 HOTFIX deployed main 8c48e43 / gh-pages 48088408. verify live next, then games.
- 18:30 fixed say() hang (interrupted clip never resolved) + quiz chip; rerunning test_games
- 18:50 layout fixes (where scenes, story/dress grids, scarf), README updated; waiting test then rebuild games.js + rerun
- deployed games main bf28022 / gh-pages 857e36f
## 22:44 Découvrir instruction-once fix
- 22:55 index patched, clip uploaded, policy dropped; testing
- 23:00 deployed main 68b0766 / gh-pages 78a76eb; verifying live
- 23:02 live verified OK (desktop+mobile)
## 23:21 grammar+expression games: backup done (20261120-2321)
- 23:45 04b_grammar.js written (8 games), games.js built
- 23:55 164 clips generated (grammar_todo.json), uploading
- 00:00 uploaded 164, policy dropped, index v bumped; writing tools/test_grammar.py
- 00:12 test_grammar ALL OK (desktop+mobile). next: visual review, README, deploy
- 00:20 class-conflict fix, README; deploying
- deployed main 77ea807 / gh-pages 8978c01; verifying live
- 00:30 live verified; all games audio checked. DONE
## 23:45 x10 grammar/expression content: backup 20261120-2346
- 23:58 04b_gdata.js pools written + emoji fixes; next 04c engine
- 00:45 games.js built (2571 clips, 1705 new) -> x10_todo.json; generating
- 01:15 1705 clips uploaded, policy DROPPED (only public_read_audio). answer round bug fixed. verifying+testing
- 00:56 DEPLOYED main b42aed5 / gh-pages 4dff028 (index = remote SEO copy + v bump). verifying live
- 00:58 live verified (games.js md5 ok, SEO/blog/contact 200, live mobile game 0 errors). DONE

## 10:25 Découvrir French word + more default games (AE-6 / AE-7)
- backup index/games/games_src 20261121-1025
- AE-6: French audio for every Découvrir word (2354 unique spoken forms; 1736 new clips generated, 618 already in bucket; 1736 uploaded, 0 errors). Temp policy temp_anon_upload_audio_discover_fr DROPPED (only public_read_audio remains).
- Spoken forms use a definite article on nouns (le chien, l'eau, l'œil) when natural; verbs, adjectives, colours, numbers, months, greetings and phrases stay bare. Notable fixes: la banane est un fruit (and similar missing-article sentences), l'arc et la flèche, le lapin et la carotte (and the other "X et le/la Y" eating pairs), la marche sur la Lune, le saxophone, la belle au bois dormant, la planète Mars (vs month "mars"). Colour senses stay without article (#pink rose, #orange-col orange).
- Playback: instruction once at the start of the theme; first time a card is heard in that visit: EN → FR → EN (then the English phrase/sentence for older children). Later taps: English only. 🇫🇷 button on the card replays French only (stopPropagation, aria-label, 64px, no overflow on mobile).
- AE-7: starter `open: 1` games — 4–5: listen, balloon, paint, repeat (3 locked: feed, plural, sizes). 6: all band-4 + memory, dress, simon (locked: count, phrases, who, answer). 7–8: all lower bands + where, story, speak (locked: build, shop, gap, talk). First locked game in the band opens after 2 stars on any game in that band; then the locked chain continues. Accessory rewards unchanged.
- tests: tools/test_discover_fr.py ALL OK (desktop+mobile). screenshots/discover-fr-* and screenshots/unlock-*.
- next: deploy main + gh-pages (index.html, games.js, discover-fr.js)

## 10:45 AE-7 clarification: exactly 5 default games
- User: default unlock = Découvrir + Trouve + Mémoire + 2 Titou games, for every new profile (and existing profiles get at least those 5).
- Starters kept: Écoute et touche (listen) and Le ballon de Titou (balloon) — the two simplest listening games, suitable for 4–5. Removed open flags from paint, repeat, memory, dress, simon, where, story, speak.
- Lower age-bands are no longer auto-unlocked for older children. Progression: 2 stars on any open Titou game unlocks the next locked game in list order (paint, then feed, …). Accessory rewards unchanged.
- tests retaken: ALL OK. 4/6/8 all start with listen+balloon only in the hub (plus the 3 theme modes). screenshots/unlock-* updated.
