# Dungeon Solver - Premium Homepage & Game Integration

## Overview
- **Summary**: Build a visually polished, dark-fantasy themed homepage for the existing Dungeon Solver browser game, seamlessly integrated with the current 3-level gameplay system. The homepage serves as the landing experience featuring a cinematic hero, level selection (Three Trials), feature showcase, tutorial, gameplay preview, and footer — all with real, working connections to the existing dungeon initialization, level progression, and reset logic.
- **Purpose**: Elevate the project from a working puzzle prototype to a premium indie-game feel that excites players before they enter the labyrinth, while keeping every existing game mechanic intact.
- **Target Users**: Casual puzzle-game players, browser-game visitors, testers evaluating both visual presentation and gameplay quality.

## Goals
- Deliver a cohesive landing page experience with premium dark-fantasy visual language matching the existing dungeon HUD aesthetic.
- Connect homepage actions (CTA buttons, level cards) to real `selectLevel()`, `resetLevel()`, and `highestUnlockedLevel` logic in script.js without creating a conflicting state system.
- Implement a reliable screen-switching architecture (Home ↔ Game) that does not double-register event listeners, break keyboard guards, or corrupt the current dungeon state.
- Add lightweight `localStorage` progress persistence for highest-unlocked level, completed levels, and best completion times, with safe validation and fallbacks.
- Ensure responsive behavior across desktop, laptop, tablet, and mobile viewports with accessible, semantic markup.
- Preserve 100% of existing dungeon generation, movement logic, collision, enemy patrols, trap behavior, timers, and win conditions.

## Non-Goals
- **Do not** modify core gameplay logic: dungeon generation (`dungeon.js` generation functions), player movement (`movePlayer`), enemy patrol algorithms, win conditions, trap resets, collision handlers — these are READ-ONLY for this spec.
- **Do not** introduce React, Next.js, a build system, or any new runtime framework.
- **Do not** fake a playable preview board. Use a clearly illustrative preview OR safely reuse the renderer with a non-interactive flag.
- **Do not** invent daily challenges, achievements, or save features not backed by real persistence.
- **Do not** use emojis as substitutes for visual artwork.

## Background & Context
### Architecture Audit (2026-10-04)
- **Page structure**: Single `index.html` containing `.game` container + 3 `.overlay` screens (levelSelect, pause, win). Scripts load in order: dungeon → player → enemy → ui → script.
- **Startup flow**: On page load, `script.js` calls `generateDungeon(index)` for 3 levels → stores results in global `dungeons[]` array → `initializeEnemy(0)` → `renderDungeon()`. Initial state: `currentLevel = 0`, `highestUnlockedLevel = 0` (memory-only).
- **Level progression**: `selectLevel(index)` → guards with `highestUnlockedLevel` → sets `currentLevel` → calls `resetLevel()` (regenerates dungeon + re-initializes enemy + renders).
- **Unlock logic**: On `nextLevel` click, `highestUnlockedLevel = max(highestUnlockedLevel, currentLevel + 1)` — currently memory-only (lost on reload).
- **Controls**: Global `document.keydown` listener handles WASD/Arrows, ESC (pause), R (reset), L (level select). NO guard for "when overlay is open" except the in-game state checks — adding a homepage screen REQUIRES a keyboard guard.
- **Enemy system**: Level 0 = 0 enemies, Level 1 = 1 treasure guardian, Level 2 = treasure + key guardians. Enemies are initialized by `initializeEnemy(currentLevel)` and started on interval-based patrols.
- **UI rendering**: `renderDungeon()` in ui.js rebuilds the `#dungeon` grid from scratch every call. Creates inner sprite `<div>` elements for each object type. Level select cards are rendered by `renderLevelSelect()` into `#levelList` inside the existing overlay.
- **Assets available (SVG, pixelated)**: player (4x4 sprite sheet), enemy (4x4), key (2x2), treasure (2x2), door (2x2, locked/unlocked rows), trap (2x2), hud/emblem. NO new external PNG/JPG assets exist; homepage artwork must use CSS, inline SVG, gradients, and the existing asset paths.
- **Fonts**: CSS declares `Press Start 2P` (display) and `VT323` (body) but HTML has no Google Fonts `<link>` → currently falling back to Courier New. Fonts must be loaded for premium feel.
- **Level data (`levels[]`)**:
  - Index 0: "The Forgotten Cell", EASY, trapCount=2, grid 15×15, 0 enemies.
  - Index 1: "The Lost Crypt", MEDIUM, trapCount=4, grid 17×17, 1 enemy.
  - Index 2: "The Ancient Vault", HARD, trapCount=6, grid 21×21, 2 enemies.
- **Homepage integration decision**: Use a single-page architecture with two sibling screens: `.homepage` (default-visible on first load) and `.game` (hidden until user starts). Screen switching via CSS `display` + JS state guard. Full page reloads are rejected because they'd lose generated dungeon state AND because the existing script runs init code unconditionally at file-level scope.

## Functional Requirements
- **FR-1 (Navigation Bar)**: Homepage renders a fixed/sticky nav with logo+wordmark "DUNGEON SOLVER", links (Home, Explore Levels, How to Play, About), and a prominent "Play Now" CTA. Includes a responsive mobile hamburger menu. Each nav item: smooth-scrolls to corresponding section or triggers screen switch.
- **FR-2 (Cinematic Hero)**: First screen shows large "DUNGEON SOLVER" title, tagline, short game description, two CTAs ("Enter the Dungeon" → starts game at lowest unlocked or saved level; "Explore the Levels" → smooth-scrolls to level section). Includes ambient layered background (stone/dungeon scene via CSS + gradients), subtle parallax and particle effects.
- **FR-3 (Level Selection — The Three Trials)**: Homepage renders 3 distinct level cards matching the real 3-index levels array. Each card shows custom visual treatment (per-level theme: stone/torch for I, gold/guardian for II, dark-magic/two-guardians for III), difficulty, short description, hover state, and action button. Card locked/unlocked state reflects `highestUnlockedLevel` (from localStorage). Clicking a card calls `selectLevel(index)` directly AND switches to game screen. Level completed state and best-time display if available.
- **FR-4 (Features Section)**: 6 gameplay feature tiles with custom SVG/CSS icons: Procedurally Generated Labyrinths, Keys & Locked Doors, Hidden Traps, Moving Guardians, Increasing Difficulty, Strategic Puzzle Solving. Only features actually supported by existing code.
- **FR-5 (How to Play / Tutorial)**: 5-step illustrated guide showing the real game controls (WASD/Arrows, ESC, R, L confirmed). Step order matches: (1) Move with WASD/Arrows, (2) Find the key, (3) Pass the locked door, (4) Avoid traps & guardians, (5) Reach the treasure.
- **FR-6 (Gameplay Preview)**: A clearly-labeled non-interactive preview (or a safely-isolated real renderer snapshot) showing the dungeon grid with all 6 element types visible, plus a CTA "Enter the Dungeon" that starts the real game.
- **FR-7 (Footer)**: Footer with mini logo, navigation link repeats, controls reference line, atmospheric tagline.
- **FR-8 (Screen Switching)**: Reliable Home ↔ Game transitions. When homepage is active: (a) game screen is `display:none`, (b) movement keyboard events are blocked (player must not move while browsing home), (c) enemy intervals paused, (d) timer paused. When game screen activates: state restored from where it left off OR freshly initialized if entering from a level card / CTA.
- **FR-9 (Return Home Action)**: In-game HUD gains a new "HOME" button (alongside RESTART, PAUSE, LEVELS) that switches back to the homepage screen without corrupting current dungeon state or re-running file-level init.
- **FR-10 (Progress Persistence)**: localStorage with keys `ds_progress_v1` storing `{highestUnlockedLevel, completedLevels:[], bestTimes:{}}`. Loaded on startup, validated, written back on unlock/level completion. Fallback: if data is invalid or missing, default to level 0 unlocked, empty arrays. Existing in-memory variables must mirror localStorage after load.
- **FR-11 (Continue Adventure)**: If valid saved progress exists (unlocked > 0 or active level in progress state), hero section shows a "Continue Adventure" secondary button that resumes the highest unlocked level.
- **FR-12 (Working Overlays)**: Existing overlay screens (levelSelect, pause, win) remain fully functional inside the `.game` screen after all homepage integration. Level progression flow unchanged: win → nextLevel → unlock next → resetLevel.

## Non-Functional Requirements
- **NFR-1 (Visual Consistency)**: Homepage color palette matches the existing `:root` CSS variables (deep navy `#02030a`–`#0d1a2e`, stone `#142237`, gold `#ffc857`, cyan glow `#5dd3ff`, red `#d94b63`). No bright neon or childish colors.
- **NFR-2 (Atmosphere)**: Page includes layered atmospheric effects: radial vignettes, controlled glow (gold/blue), subtle particle drift, scanline overlay, stone-textured blocks, animated torch/magic accents.
- **NFR-3 (Responsive)**: No horizontal overflow at any breakpoint 320px+. Grid-based homepage section layouts collapse to 2-col → 1-col for tablets/mobile. Mobile nav menu (hamburger) functional. Dungeon frame sizing already responsive — ensure it remains undisturbed.
- **NFR-4 (Accessibility)**: Semantic HTML (`<nav>`, `<main>`, `<section>`, `<footer>`, `<h1..h6>` hierarchy). Visible keyboard focus states on all interactive elements. `aria-label` on icon-only controls. Alt text on decorative images empty `""`; meaningful alt on key art. `prefers-reduced-motion` disables non-essential animations.
- **NFR-5 (Performance)**: No heavy JS loops outside existing game code. Homepage particle count capped at reasonable value (≤ 60). CSS animations GPU-friendly (transform/opacity only where possible).
- **NFR-6 (CSS Scoping)**: Homepage styles scoped with a `.homepage` ancestor class so the new CSS cannot accidentally restyle `.game` cells, sprites, or overlays.
- **NFR-7 (Zero Console Errors)**: After integration, no console errors on page load, screen transitions, level navigation, or gameplay. No missing asset 404s.
- **NFR-8 (No Global Scope Breakage)**: New global variables limited to a single `HomepageApp` object or equivalent. Do not overwrite existing globals (`player`, `hasKey`, `dungeons`, `currentLevel`, `enemy`, etc.).

## Constraints
- **Technical**: Pure HTML + CSS + vanilla JavaScript. No React, build tools, npm packages, or external image references except the existing SVGs in `/assets/`. Google Fonts CDN is permitted for Press Start 2P + VT323.
- **Business**: Existing gameplay, movement, enemy logic, dungeon generation, and win conditions MUST NOT be modified. Homepage adapts to them.
- **Dependencies**: All new homepage JS must load AFTER the existing scripts OR safely check function existence before calling (e.g., `typeof selectLevel === "function"`).
- **Z-Index**: Homepage screens must not conflict with game overlay z-index (overlays use `z-index: 500`). Game screen z-index relative; homepage use a dedicated layer below overlays.
- **Sprite rendering**: Existing sprites must maintain `image-rendering: pixelated`, 70-80% sizing, and z-order: floor < wall < objects < enemy (z:8) < player (z:10).

## Assumptions
- User will load `index.html` directly via `file://` or a simple static server; no server-side rendering assumed.
- Google Fonts CDN is reachable; fallback to Courier New if not, matching current behavior.
- localStorage is available in the target browser; gracefully degrade to in-memory-only progress if not.
- The 3 level names shown on the homepage cards will follow the user's requested names (Forgotten Catacombs / Guardian's Domain / Twin Guardians) for DISPLAY purposes but the underlying `levels[]` array names will remain as-is OR be updated — this is a spec-level decision: we update `levels[].name` to match the user's request since it's pure display data and preserves semantic meaning.

## Acceptance Criteria

### AC-1: Homepage screen renders with all required sections
- **Type**: `rule`
- **Given**: Fresh page load, no modifications
- **When**: Browser renders the page
- **Then**: Visible sections present: (1) Nav with logo, Home, Explore Levels, How to Play, About, Play Now; (2) Hero with title, subtitle, description, Enter + Explore CTAs; (3) Level selection with 3 cards named "Level I — The Forgotten Catacombs", "Level II — The Guardian's Domain", "Level III — The Twin Guardians"; (4) Features section with 6 feature tiles; (5) How to Play 5-step tutorial; (6) Gameplay preview with Enter CTA; (7) Footer with mini logo, links, controls reference, tagline.
- **Pass Condition**: All 7 sections render without visual breakage or missing content. DOM inspection confirms each section's unique class/id.
- **Evidence**: Screenshot + DOM node list from browser.

### AC-2: Primary CTA launches game with correct level
- **Type**: `rule`
- **Given**: User on homepage, game screen hidden
- **When**: Click "Enter the Dungeon" CTA
- **Then**: (1) `.game` screen visible, `.homepage` hidden; (2) `currentLevel === 0` if no saved progress OR `currentLevel === highestUnlockedLevel` if progress saved; (3) dungeon rendered correctly for chosen level; (4) timer starts on first move; (5) keyboard movement enabled.
- **Pass Condition**: Level index matches expected state, dungeon renders, player can move with WASD.
- **Evidence**: Console log of `currentLevel` + `highestUnlockedLevel` after CTA click; screenshot of active game.

### AC-3: Level card click selects exact level respecting unlock rules
- **Type**: `rule`
- **Given**: 3 level cards on homepage. localStorage initially clear → `highestUnlockedLevel = 0`.
- **When**: User clicks Level II card (index 1) while it is locked
- **Then**: Game screen does NOT switch. No state change. No console error.
- **Pass Condition**: `currentLevel` still 0, `.game` still hidden.
- **Evidence**: Console state snapshot + screenshot showing still on homepage.

### AC-4: Level card click unlocks AND launches real level
- **Type**: `rule`
- **Given**: Progress state `highestUnlockedLevel = 1` (Level I completed, II unlocked, III locked)
- **When**: Click Level II card (index 1)
- **Then**: Calls `selectLevel(1)` equivalent flow → `.game` visible, dungeon for level 1 rendered with 1 guardian enemy, player at (1,1), timer reset.
- **Pass Condition**: Level 1 specific grid (17×17) with enemy visible. `dungeons[1]` exists and grid size matches.
- **Evidence**: `dungeons[1].length === 17` assertion; in-game level HUD shows "LEVEL 2 / 3 — THE LOST CRYPT — MEDIUM".

### AC-5: Homepage keyboard guard blocks player movement
- **Type**: `rule`
- **Given**: Homepage active (`.homepage` visible, `.game` hidden)
- **When**: Press Arrow keys, WASD keys 10+ times
- **Then**: `player.row === 1`, `player.col === 1`, `moves === 0` for a fresh entry. Also `gameStarted` remains false until first actual move in game screen.
- **Pass Condition**: Player state unchanged. No `movePlayer()` calls while home active.
- **Evidence**: Spy/log `movePlayer` calls count = 0 after key presses.

### AC-6: Return home button preserves current dungeon state
- **Type**: `rule`
- **Given**: User in game, level 1 active, player at (5,5), 12 moves made, key picked, enemy patrolling.
- **When**: Click new HOME button in HUD controls
- **Then**: (1) `.homepage` visible, `.game` hidden; (2) enemy intervals paused (no patrol steps fire); (3) timer paused; (4) player.row/col/moves/hasKey state preserved in memory.
- **Pass Condition**: After clicking HOME → immediately clicking BACK (via continue) to same level without reset → player position, moves, key state restored.
- **Evidence**: State snapshots before home-enter, after home, after return.

### AC-7: Existing win → next-level progression intact
- **Type**: `rule`
- **Given**: Integration complete, playing level 0, reach treasure after key+door
- **When**: Win screen shows → click NEXT LEVEL
- **Then**: `currentLevel === 1`, `highestUnlockedLevel === 1`, dungeon regenerated for level 1, enemy initialized (1 guardian), levelSelect screen shows II unlocked.
- **Pass Condition**: All progression state variables update; level 1 renders.
- **Evidence**: Variable dumps after nextLevel click.

### AC-8: Progress persists across page reload
- **Type**: `rule`
- **Given**: After AC-7, `highestUnlockedLevel = 1`
- **When**: Full page reload (F5)
- **Then**: `highestUnlockedLevel` reads back as 1 from localStorage, Level II card on homepage shows unlocked (not locked).
- **Pass Condition**: localStorage key `ds_progress_v1` exists and parses to valid object. Level card II NOT greyed out.
- **Evidence**: `localStorage.getItem('ds_progress_v1')` output + card CSS class contains `unlocked`.

### AC-9: Responsive homepage at 375px mobile viewport
- **Type**: `rule`
- **Given**: Browser viewport 375×812 (iPhone SE-like)
- **When**: Render homepage + scroll through all sections
- **Then**: No horizontal overflow (body.clientWidth matches viewport). Level cards 1 column. Mobile nav menu present and toggles open/closed. Text not clipped. Buttons touch-friendly (≥ 40px tall).
- **Pass Condition**: `document.body.scrollWidth === document.body.clientWidth`; all 7 sections vertically stack.
- **Evidence**: Screenshot of mobile viewport + scrollWidth assertion.

### AC-10: No console errors or missing asset 404s
- **Type**: `rule`
- **Given**: Integration complete
- **When**: Load page → click all homepage CTAs, all section nav links, toggle mobile menu, enter game, play through a level win, return home, reload 3 times
- **Then**: Console error count = 0. Network panel shows 0 404/5xx responses.
- **Pass Condition**: DevTools Console clean; Network panel filtered 404 = 0 rows.
- **Evidence**: Console screenshot; Network screenshot.

### AC-11: Homepage visual fidelity — dark-fantasy premium aesthetic
- **Type**: `rubric`
- **Dimension**: Visual quality and atmosphere cohesion with existing game HUD
- **Scale**: 1-5
- **Anchors**: 1 = flat, generic SaaS-card look, mismatched colors with game HUD; 3 = basic sections present, themed colors used but flat, minimal atmospheric layering; 5 = premium indie-game opening screen feel: layered stone textures, torch/gold glow, subtle drifting particles, depth via shadows and gradients, elegant display typography (Press Start 2P titles, VT323 body), restrained magical accents, no visual clutter.
- **Pass Threshold**: >= 4
- **Evidence**: Full-page hero screenshot; side-by-side comparison with game HUD showing matching palette/variables.

### AC-12: Transition smoothness between home ↔ game
- **Type**: `rubric`
- **Dimension**: Fade/transition smoothness, absence of jank or flicker
- **Scale**: 1-5
- **Anchors**: 1 = abrupt show/hide, visible layout reflow jumps, screen flicker; 3 = simple fade but slight timing mismatches; 5 = smooth tasteful crossfade 250-450ms, content ready before reveal, no layout shift, respects prefers-reduced-motion by disabling animations when requested.
- **Pass Threshold**: >= 4
- **Evidence**: Transition behavior observed, no jank reported, reduced-motion tested.

### AC-13: Accessibility baseline
- **Type**: `rubric`
- **Dimension**: Keyboard navigation, semantic structure, focus visibility
- **Scale**: 1-5
- **Anchors**: 1 = tab order broken, no focus rings, divs-as-buttons; 3 = nav works via tab, visible focus, but some icon buttons lack aria; 5 = full tab flow (nav → CTAs → cards → footer → home button in HUD), visible focus rings with the theme's cyan glow, all icon-only buttons have `aria-label`, section landmarks, heading hierarchy h1→h6 respected.
- **Pass Threshold**: >= 4
- **Evidence**: Tab-through test, axe-devtools or manual aria-label audit.

## Open Questions
- None. Integration architecture decided (single-page sibling screens + keyboard guard state flag + localStorage persistence) based on the audit.
