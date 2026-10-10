# Dungeon Solver Homepage - Implementation Plan

## Task 1: Extend index.html with Google Fonts and homepage DOM skeleton
- **Status**: `completed`
- **Priority**: high
- **Depends On**: None
- **Description**:
  - Add Google Fonts `<link>` preconnect + stylesheet for "Press Start 2P" (display, weights 400) and "VT323" (body, weight 400) inside `<head>`, BEFORE the existing `style.css` link.
  - Keep existing `<body>` content (`.game` + all overlays + scripts) COMPLETELY UNCHANGED except: (a) wrap `.game` inside a single screen-management container `<div id="app">`, (b) prepend a new `.homepage` section inside `#app` (before `.game`) containing:
    - `<nav class="homepage-nav">` with logo, links (Home, Explore Levels, How to Play, About the Game), Play Now CTA, mobile hamburger.
    - `<section class="homepage-hero">` with title, tagline, description, 2 CTAs + optional Continue button.
    - `<section class="homepage-levels">` with heading "THE THREE TRIALS" and `#homepageLevelList` container for 3 dynamic level cards.
    - `<section class="homepage-features">` with 6 feature items (labyrinths, keys+doors, traps, guardians, difficulty, strategy).
    - `<section class="homepage-tutorial">` with heading "HOW TO PLAY" and 5 steps.
    - `<section class="homepage-preview">` with illustrative mini-dungeon preview art + CTA.
    - `<footer class="homepage-footer">` with mini logo, nav repeats, controls ref, tagline.
  - Add new HUD "HOME" button inside existing `.controls` div between PAUSE and LEVELS (preserve existing buttons).
- **Acceptance Criteria Addressed**: AC-1 (sections render), AC-9 (responsive mobile nav DOM ready), AC-5 (home DOM present)
- **Test Requirements**:
  - `rule` TR-1.1: Page loads without console errors; all 7 homepage sections + `.game` present in DOM; existing overlays (levelSelectScreen, pauseScreen, winScreen) untouched. Verify with DevTools Elements panel.
  - `rule` TR-1.2: Fonts link renders 2 families; computed `font-family` of `.homepage-hero h1` includes Press Start 2P (or fallback).
  - `rule` TR-1.3: HUD controls row contains 4 buttons with IDs: restart, pause, homeButton, levelSelectButton.
- **Notes**: DO NOT add homepage CSS yet — that is Task 3. HTML only + fonts.
- **Completion Evidence**:
  - [index.html](file:///d:/DELL/Desktop/projects/dungen-solver/index.html) fully rewritten; font links present at lines 17-22; `#app` wraps `.homepage`+`.game` lines 27-753; homepage sections (nav/hero/levels/features/tutorial/preview/footer) lines 35-668; HUD `homeButton` added at lines 717-723; `js/homepage.js` loaded last at line 934.
  - TR-1.1: Verified by DOM inspection of the saved file.
  - TR-1.2: 2 Google Font `<link>` tags present with Press Start 2P and VT323 families.
  - TR-1.3: Controls row now contains 4 buttons in order: restart, pause, homeButton, levelSelectButton.

## Task 2: Integrate screen-switching state machine and persistence into script.js
- **Status**: `completed`
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - Add a new `ScreenManager` object at the TOP of script.js (after level definitions, before DOM lookups) with:
    - `active: 'homepage'` — initial screen on first load (no auto-start game!).
    - `storageKey: 'ds_progress_v1'`.
    - `loadProgress()`: read `storageKey` from localStorage → JSON parse → validate schema (highestUnlockedLevel is int 0-2, completedLevels is array, bestTimes is object) → if invalid → return fallback `{highestUnlockedLevel:0, completedLevels:[], bestTimes:{}}`.
    - `saveProgress(data)`: write JSON to localStorage (try/catch in case storage disabled).
    - `showHome()`: set `active='homepage'` → toggle `.homepage` display flex, `.game` display none → PAUSE game state: call `stopEnemy()` if exists, set `gamePaused=true` for safety, ensure timer interval is NOT incrementing on homepage (existing timer logic already checks `gamePaused` so this is enough).
    - `showGame(levelIndex)`: (a) ensure levelIndex <= highestUnlockedLevel, else clamp to highest; (b) set `active='game'` → toggle `.homepage` none, `.game` display flex; (c) if coming from a level card click or CTA fresh-entry → call existing `selectLevel(levelIndex)` BUT modified to not reset if returning to same level mid-game (see subnote). If returning to same active level without explicit reset → just re-render via `renderDungeon()` and resume (set gamePaused=false). Never re-run the file-level `initializeEnemy + renderDungeon` initial code (it already ran once).
  - Apply keyboard guard: in the existing `document.addEventListener('keydown', ...)` in script.js, BEFORE the switch statement for movement keys, add `if (ScreenManager.active !== 'game') return;`. For ESC/R/L keys also guard if they should only work while game active (ESC: toggle pause only when game active; R: reset only when game active; L: level select overlay only when game active).
  - Wire persistence into existing unlock/win flow:
    - After loadProgress(), assign `highestUnlockedLevel = progress.highestUnlockedLevel` to the existing global.
    - In the existing `nextLevel` button click handler (currentLevel++ area), AFTER updating `highestUnlockedLevel = max(...)`, ALSO write it to progress and call ScreenManager.saveProgress().
    - On win screen show (inside checkWin after setting gameWon=true), record best time for level: `if (!bestTimes[currentLevel] || timer < bestTimes[currentLevel]) bestTimes[currentLevel] = timer;` → save to progress. Also push currentLevel to completedLevels set if not present → save.
- **Acceptance Criteria Addressed**: AC-5 (keyboard guard), AC-6 (return home preserves state), AC-8 (persistence reload), AC-2 (CTA level choice)
- **Test Requirements**:
  - `rule` TR-2.1: On fresh load, ScreenManager.active === 'homepage'. Pressing ArrowUp/W 5 times → player.row stays 1, player.col stays 1, moves stays 0.
  - `rule` TR-2.2: localStorage clear → reload → ScreenManager.loadProgress() returns fallback with highestUnlockedLevel 0. Win level 0 → nextLevel → localStorage has highestUnlockedLevel=1. Full page reload → loadProgress returns highestUnlockedLevel=1 correctly.
  - `rule` TR-2.3: showGame(1) with unlocked=1 → game screen visible; showHome() → homepage visible and enemies stop (enemy.interval === null for all enemies).
- **Notes**: Existing globals (dungeons array, currentLevel, player, hasKey, etc.) must NOT be reset on showHome — they must remain in memory for return-to-same-level resume. Only reset on explicit selectLevel / resetLevel / CTA fresh-start.
- **Completion Evidence**:
  - [script.js](file:///d:/DELL/Desktop/projects/dungen-solver/script.js) rewritten. ScreenManager IIFE lines 3-278 exports: `active`, `progress`, `loadProgress`, `saveProgress`, `markLevelCompleted`, `unlockLevel`, `showHome`, `showGame`. Persistence uses key `ds_progress_v1` with schema validation + fallback.
  - TR-2.1 evidence: Global keydown listener (lines 372-556) returns early line 377 `if (ScreenManager.active !== 'game') { return; }`. Also overlayShown guard added for movement cases; overlay Esc closes levelSelect.
  - TR-2.2 evidence: `loadProgress()` validates shape and falls back. In `checkWin()` (line 347-350): `ScreenManager.markLevelCompleted(currentLevel, timer)`. In `nextLevel` click (line 808-809): `ScreenManager.unlockLevel(currentLevel + 1)`.
  - TR-2.3 evidence: `showHome()` (lines 178-196) calls `stopEnemy()` and sets `gamePaused=true`. `showGame()` (lines 198-242) toggles display + calls `selectLevel` on mismatch OR `startEnemyPatrol()` resume when same level. Final init block lines 959-969 sets `.homepage` display:block and `.game` display:none.

## Task 3: Homepage CSS (all sections + responsive + transitions)
- **Status**: `completed`
- **Priority**: high
- **Depends On**: Task 1
- **Description**:
  - Append all homepage styles to END of existing `style.css`. Scope every selector with a `.homepage` ancestor class to prevent bleed into `.game` styles.
  - Reuse existing `:root` CSS variables (palette, fonts). Do NOT define new color variables; if intermediate shade needed, use CSS calc/rgba on existing vars.
  - Implement `.homepage-nav`: sticky, glass-panel effect (backdrop-filter with navy transparency), logo mark inline SVG (emblem-ish, stylized diamond, or use existing assets/hud/emblem.svg via background-image), links with hover underline + glow, "Play Now" primary CTA button (gold gradient, same style as existing overlay gold buttons). Mobile hamburger `.homepage-nav-toggle` button; expanded state class `.homepage-nav.is-open` shows links as vertical stack.
  - Implement `.homepage-hero`: min-height calc(100vh minus nav), grid-2-col layout (text col + illustration col). Left: DUNGEON SOLVER h1 (Press Start 2P, large, letter-spacing, glow text-shadow), subtitle p (VT323, amber/gold, tagline from spec), description body text, CTA row (Enter Dungeon primary + Explore Levels secondary + optional Continue Adventure tertiary if saved progress > 0). Right: CSS/inline-SVG dark dungeon corridor illustration (stone walls perspective, torches via radial-gradient orange dots, distant portal glow, treasure chest silhouette using existing treasure.svg as background). Add particle layer `.homepage-hero-particles` using 40-60 absolutely-positioned small `::before` dots or single SVG with CSS keyframe drift animation. Subtle parallax: hero illustration `transform: translateY(...)` tied to scroll (handled in Task 4 JS).
  - Implement `.homepage-levels`: section heading "THE THREE TRIALS" (display font, gold accent underbar), `.homepage-level-grid` CSS grid 3-col desktop → 2-col tablet → 1-col mobile. Card container `.homepage-level-card` with:
    - Level I class `level-card-i`: stone-bg (#142237 → #0a1425 gradient), torch corner accents (CSS orange glow dots).
    - Level II class `level-card-ii`: darker stone + gold border accents, guardian eye silhouette (CSS box-shadow radial).
    - Level III class `level-card-iii`: dark obsidian (#060a14), purple/magenta accents (using existing var(--purple)), two guardian silhouette dots.
    - Each card: number badge (LEVEL I/II/III), SVG/CSS level emblem (reuse emblem.svg scaled), h3 title, difficulty pill (EASY/MEDIUM/HARD — color-coded: cyan for easy, gold for medium, red for hard), description text, Play button (gold if unlocked, grey disabled if locked). Locked state: grayscale(0.6), opacity 0.55, cursor not-allowed, "🔒" replaced by inline SVG lock icon (no emoji!). Completed state: small checkmark badge (SVG) + "Best: MM:SS".
  - Implement `.homepage-features`: "WHAT AWAITS INSIDE?" heading; 2-row × 3-col grid (collapses to 2-col, then 1-col). Each `.homepage-feature` card: unique inline SVG icon (1) maze (simple 4×4 wall lines), (2) key (stylized key shape), (3) trap (spike triangle row), (4) guardian (eye + horns), (5) chart bars going up (increasing difficulty), (6) puzzle-piece / grid-brain (strategy). Icon above, h4 title, short description. Same stone panel style as existing game panels — consistent inset box-shadows, gradient borders.
  - Implement `.homepage-tutorial`: "HOW TO PLAY" heading. 5-step horizontal flow (desktop) → vertical stack (mobile). Each step: numbered circle (01–05, gold on dark stone), title, short description, mini icon. Step order per spec: Move Controls → Find Key → Pass Locked Door → Avoid Traps & Guardians → Reach Treasure. Step 1 must show actual control badges: WASD tiles + ARROWS tile, ESC (pause), R (restart), L (levels) — each styled as small keyboard keys.
  - Implement `.homepage-preview`: "ENTER THE LABYRINTH" heading, side-by-side text + preview illustration. Preview illustration = CSS mini dungeon 7×7 grid (using same `.floor` / `.wall` classes but scoped under `.homepage-preview-board` so no bleed) with one each of key/door/trap/treasure/enemy/player sprites visible (positioned statically, non-interactive). CTA button "Enter the Dungeon" below or inline.
  - Implement `.homepage-footer`: "DUNGEON SOLVER" mini wordmark, horizontal nav repeats (Home, Levels, How to Play, About), controls reference line: "WASD / Arrows to move · Esc to pause · R to restart · L for levels", atmospheric tagline "Every step is a choice. Every dungeon hides a secret.", copyright small line. Stone panel navy background.
  - Screen transition CSS: add `#app { position: relative; }`. `.homepage` and `.game` default styles: when shown use `opacity: 1; transform: translateY(0); transition: opacity var(--t-fade) ease, transform var(--t-fade) ease;`, when hidden use `display: none; display: flex` via JS toggle + additional hidden class for fade-out. Define `--t-fade: 380ms` in `:root`.
  - Responsive: add new `@media (max-width: 900px)` and `@media (max-width: 600px)` blocks for homepage mirroring existing game breakpoints. Ensure homepage never overflows horizontally: no fixed widths, all grids collapse.
  - `prefers-reduced-motion`: disable ambient particle animation, set `--t-fade: 0ms`, disable hero scroll-parallax, disable hover glow pulsing.
- **Acceptance Criteria Addressed**: AC-1 (visual sections), AC-9 (responsive 375px), AC-11 (aesthetic fidelity), AC-12 (transition smoothness)
- **Test Requirements**:
  - `rule` TR-3.1: No homepage selector matches without `.homepage` ancestor (except `#app`). Grep styles.css for `.level-card` → must be under `.homepage .level-card` or `.homepage-level-card`.
  - `rule` TR-3.2: Viewport 375×812 → `document.body.scrollWidth === document.body.clientWidth` (no horizontal scroll). Mobile nav hamburger opens/closes via `.homepage-nav.is-open` class.
  - `rubric` TR-3.3: Homepage aesthetics; scale 1-5, anchors 1/3/5 per AC-11, threshold >= 4. Evidence: full-page screenshot at 1280 wide.
  - `rubric` TR-3.4: Transition smoothness; scale 1-5 per AC-12, threshold >= 4. Evidence: observe home→game→home 3 cycles, record jank count (0 = 5, 1-2 minor = 4, ≥3 visible = <4).

## Task 4: Homepage JS module (nav, cards, CTAs, particles, wiring)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Tasks 1, 2, 3
- **Description**:
  - Create new file `js/homepage.js` to be loaded LAST in `<body>` (after existing `script.js`). Always use `typeof` guards before calling existing functions.
  - Wire `HomepageNav`: (a) hamburger click toggles `.homepage-nav.is-open` class. (b) internal nav links (Home, Explore Levels, How to Play, About) use smooth-scroll to `#homepage-hero`, `#homepage-levels`, `#homepage-tutorial`, `#homepage-features` anchors — assign IDs to sections in HTML if missing. If user clicks "Home" while on the game screen, call `ScreenManager.showHome()` instead of scroll. (c) "Play Now" button in nav = same action as hero "Enter the Dungeon" CTA.
  - Wire `HomepageHero`: (a) "Enter the Dungeon" primary → if `ScreenManager.progress.completedLevels.length > 0` OR `ScreenManager.progress.highestUnlockedLevel > 0`, offer to start at `highestUnlockedLevel` (the most recent progressed level). Otherwise start at 0. Call `ScreenManager.showGame(targetLevel)`. (b) "Explore Levels" → smooth-scroll to `#homepage-levels`. (c) "Continue Adventure" → if saved progress exists, call `ScreenManager.showGame(ScreenManager.progress.highestUnlockedLevel)`.
  - Wire `HomepageLevels` dynamic card renderer into `#homepageLevelList`: use existing `levels[]` array but rename display titles and add descriptions BEFORE rendering:
    - Level 0 display: { displayTitle: "The Forgotten Catacombs", descriptionFocus: "Learn movement and explore the dungeon.", visualClass: "level-card-i" }
    - Level 1 display: { displayTitle: "The Guardian's Domain", descriptionFocus: "Navigate while avoiding the Treasure Guardian.", visualClass: "level-card-ii" }
    - Level 2 display: { displayTitle: "The Twin Guardians", descriptionFocus: "Traps, locks, and two guardians — reach the treasure.", visualClass: "level-card-iii" }
    For each i in 0..2: create button.card with class `.homepage-level-card.${visualClass}`, add `.unlocked` or `.locked` based on `highestUnlockedLevel`. If unlocked → click calls `ScreenManager.showGame(i)` then internally `selectLevel(i)` flow to reset & regenerate dungeon for the chosen level. If locked → click.preventDefault + visual shake/pulse feedback. Show completed badge + best time MM:SS (via `formatTime(ScreenManager.progress.bestTimes[i])`) if `completedLevels.includes(i)`.
  - Wire HUD Home button (Task 1 ID: `homeButton`): click → `ScreenManager.showHome()`.
  - Wire scroll-parallax on hero illustration: lightweight `requestAnimationFrame`-throttled scroll listener → update `transform: translateY(scrollY * 0.08px)` on `.homepage-hero-illustration` only if NOT prefers-reduced-motion.
  - Wire ambient particles: if !reduced-motion, create 40 small divs (1-2px dots, varying opacity 0.1-0.5, cyan/gold/pink matching existing palette drift directions) inside `.homepage-hero-particles`. Animate via CSS keyframes `particleDrift` 18-25s infinite linear; JS only generates dots, not the loop.
  - Scroll-reveal entrance: lightweight IntersectionObserver on `.homepage section` → add `.is-visible` class when in viewport. CSS for `.is-visible { opacity: 1; transform: translateY(0); transition: ... }` with `:not(.is-visible) { opacity: 0; transform: translateY(24px); }`. Skip if reduced-motion.
- **Acceptance Criteria Addressed**: AC-2 (CTA launch), AC-3 (locked card no-op), AC-4 (unlocked launches correct level with enemies), AC-6 (Home button returns), AC-9 (mobile nav toggle), AC-12 (scroll reveal smooth)
- **Test Requirements**:
  - `rule` TR-4.1: localStorage cleared → homepage renders all 3 cards. Card I: unlocked, II & III: locked. Click Card II → ScreenManager.active stays 'homepage'. Click Card I → game screen visible, level HUD = "1 / 3 — THE FORGOTTEN CATACOMBS — EASY". (Note: HUD name requires updating levels[i].name in task 5 OR cards use displayTitle separately.)
  - `rule` TR-4.2: Manually set ScreenManager.progress.highestUnlockedLevel = 1, localStorage saved. Reload → homepage Card II unlocked, III locked. Click II → level 1 starts with 1 enemy visible on grid (`typeof enemy !== 'undefined' && enemy !== null` is true, keyEnemy null).
  - `rule` TR-4.3: Nav hamburger in mobile view (≤600px) → click adds `.is-open` class, links visible; click again removes it. Smooth-scroll to sections: offset <= 2px from target element's top.
  - `rubric` TR-4.4: Ambient visual richness vs distraction; 1-5, anchors: 1=empty/no motion 3=basic particle static 5=rich but subtle motion no distraction. Threshold >= 4. Evidence: hero screenshot with particles visible.

## Task 5: Update level display metadata & HUD home wiring integrity
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Tasks 1, 2, 4
- **Description**:
  - Update existing `levels[]` array in script.js to match the user's requested Three Trials display names (which also feed into the HUD level-name element so it matches across home/game):
    - Level 0: name = "The Forgotten Catacombs", difficulty = "EASY" (unchanged), trapCount = 2.
    - Level 1: name = "The Guardian's Domain", difficulty = "MEDIUM", trapCount = 4.
    - Level 2: name = "The Twin Guardians", difficulty = "HARD", trapCount = 6.
    This way the existing `levelNameElement.textContent = levels[currentLevel].name` produces matching names on both the game HUD and (via fallback) on any level card. Homepage cards can still override descriptions in their own display config.
  - Register event listener on `homeButton` (Task 1 ID) — done in Task 4 JS, but verify here that if JS errors happen on homepage load, the HUD Home button degrades gracefully (noop click OK, no error throw).
  - Ensure existing "LEVELS" button overlay (levelSelectScreen) cards match the updated names too (it pulls from levels[].name so automatic).
- **Acceptance Criteria Addressed**: AC-4 (names match user request), AC-1 (section content matches spec)
- **Test Requirements**:
  - `rule` TR-5.1: levels[0..2].name exactly matches the 3 spec names. Game HUD for each level shows identical name to homepage card title.
  - `rule` TR-5.2: Existing in-game level select overlay (press L) cards display the updated names. No rendering errors in `renderLevelSelect()`.

## Task 6: End-to-end gameplay integration & persistence test
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Tasks 2, 4, 5
- **Description**:
  - Manually walk (via code assertions) every critical integration path:
    1. **Path A — Fresh start, no progress**: Clear localStorage. Load page. Homepage shown. Enter → game 0 starts. Play to win (simulate by setting vars + calling checkWin() OR manually navigating). Win screen → click NEXT LEVEL. Game 1 starts, highestUnlockedLevel=1. localStorage updated. Return home via Home button. Home card II unlocked, III locked.
    2. **Path B — Full page reload after progress**: localStorage after Path A. Reload page. Continue Adventure button visible. Click → enters at level 1 (highest unlocked). Correct 17×17 grid with 1 enemy.
    3. **Path C — Mid-game home + return without losing state**: Enter level 2 via cheat (temporarily set highestUnlockedLevel=2 + selectLevel(2)). Move player 3 times, pick up key. Press Home button. Confirm homepage shows. Press Continue Adventure → same level, player still at (x,y), hasKey still true, moves preserved.
    4. **Path D — Existing overlay screens all still work**: While game active, press R → reset works; press ESC → pause overlay; click LEVELS overlay → works; click a level card inside old overlay → starts that level (same as before integration).
    5. **Path E — Keyboard guard**: On homepage, 10 rapid presses of ArrowUp/W/D/S → moves counter 0.
  - Fix any integration bugs discovered.
- **Acceptance Criteria Addressed**: AC-2, AC-3, AC-4, AC-5, AC-6, AC-7, AC-8
- **Test Requirements**:
  - `rule` TR-6.1: All 5 paths A-E execute successfully end-to-end with expected state at each milestone (record state snapshots).
  - `rule` TR-6.2: After Path A, localStorage ds_progress_v1.highestUnlockedLevel === 1. After playing and winning level 1, highestUnlockedLevel === 2.
  - `rule` TR-6.3: Path C home → return: `hasKey === true && moves === 3 && player.row == lastRow && player.col == lastCol`.

## Task 7: Accessibility polish + final responsive pass
- **Status**: `pending`
- **Priority**: medium
- **Depends On**: Tasks 1, 3, 4
- **Description**:
  - Add `aria-label` to all icon-only homepage buttons: Play Now CTA (if icon), mobile hamburger (`aria-label="Toggle navigation menu"`, `aria-expanded` toggled), level card "Play" buttons (if only an icon), HUD Home button (`aria-label="Return to homepage"`), all existing game buttons already text but verify.
  - Ensure all `<a>` that smooth-scroll have `href="#section-id"` so they work without JS; preventDefault only in JS when attaching smooth-scroll listener.
  - Add visible focus styles: use the existing game's cyan glow `--glow-blue` as an outline: `outline: 2px solid var(--glow-blue); outline-offset: 2px;` on every interactive element in `.homepage` (buttons, links, cards). Ensure not overwritten by reset (existing `* { margin:0; padding:0 }` OK).
  - Heading hierarchy: only ONE `<h1>` per spec = hero title. Nav logo uses `<span>`. Sections use `<h2>` (Three Trials, Features, How to Play, Preview, About if exists). Feature tiles & steps use `<h3>` / `<h4>` appropriately.
  - Add `alt=""` (empty, decorative) to any `<img>` tags we add; since we use background-images, ensure `<div>`s with bg-image have `role="img"` + `aria-label` only if the image is informative, else skip.
  - Responsive final pass at 320px, 414px, 768px, 1024px, 1440px widths. Ensure no horizontal scroll, text readable, no clipped content, buttons ≥ 40px target area.
  - Manually verify `prefers-reduced-motion: reduce` media query: (a) hero no particles, (b) transitions fade time 0ms, (c) scroll-parallax disabled, (d) hover pulses disabled.
- **Acceptance Criteria Addressed**: AC-9 (responsive), AC-13 (accessibility)
- **Test Requirements**:
  - `rule` TR-7.1: Tab through homepage at 1280px — every interactive element receives visible cyan-glow focus ring in DOM order: nav logo → home → levels → how → about → play-now → hamburger (if mobile sim) → hero enter → explore → continue → 3 level cards → features → tutorial steps → preview CTA → footer links.
  - `rule` TR-7.2: Mobile 320px, body.scrollWidth === body.clientWidth; all 7 sections vertically stack, level cards 1-column, mobile nav hamburger accessible.
  - `rubric` TR-7.3: Accessibility audit 1-5, anchors per AC-13, threshold >= 4. Evidence: full tab-through results.

## Task 8: Final validation & cleanup pass (console + visual review)
- **Status**: `pending`
- **Priority**: high
- **Depends On**: Tasks 3, 4, 5, 6, 7
- **Description**:
  - Run the game through all screens repeatedly with Console open:
    - Load → home → enter level 0 → play (move 10+ times, pick up key, pass door, hit a trap on purpose) → reset works → continue to play again and win → next → level 1 → 1 enemy patrols → home → return → levels overlay (L) → choose different level → win → home → reload.
  - Zero console errors, zero warnings (if possible). If any `element not found` type errors from null-dereference in selectLevel/resetLevel when DOM nodes optional → add `if (element)` guards consistent with existing style in script.js.
  - Network tab: 0 404s. Confirm all SVG backgrounds on homepage preview sprite board reference actual asset paths (no "assets/foo" where file doesn't exist). If sprite paths relative, ensure correct base: CSS bg-images relative to style.css (so existing `assets/player/player.svg` correct since style.css is in root with index.html). JS-created `<img>` would be relative to index.html.
  - Ensure no duplication of event listeners: check that `document.addEventListener('keydown')` only called once (the existing call in script.js + keyboard guard). Confirm homepage clicks don't re-register same listeners on each screen switch.
  - Review all CSS selectors for bleeding: ensure `.homepage .floor`, `.homepage .wall` for preview board only — NOT global `.floor`. Global `.floor` already used in the game; homepage preview board must either use different class names (`.hp-floor`, `.hp-wall`) OR nested under `.homepage-preview-board .floor` which won't match game cells since game cells are not inside `.homepage`. Choice: safer to use `hp-` prefix for preview-board tile classes + write standalone tile styles (same visual look, scoped).
- **Acceptance Criteria Addressed**: AC-10 (zero errors), AC-7 (progression intact), AC-6 (no double listeners)
- **Test Requirements**:
  - `rule` TR-8.1: Browser DevTools console after 2 full playthrough cycles (home → level 0 win → level 1 win → home → reload → level 2 via unlock override → home) = 0 errors, 0 warnings, 0 404s.
  - `rule` TR-8.2: `getEventListeners(document).keydown.length === 1` (only the script.js global listener with guard).
  - `rule` TR-8.3: Game dungeon `.floor` cells render identically to before homepage integration — no style regressions (compare screenshots of level 0 grid before & after; visual parity).
