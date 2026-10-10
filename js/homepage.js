(function () {
    "use strict";

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---- Inline SVG icon fragments (no emoji, no external files) ---- */
    const SVG_LOCK = (
        '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
            '<rect x="4" y="11" width="16" height="11" rx="2" ry="2" fill="#5dd3ff" opacity="0.9"/>' +
            '<path d="M8 11V8a4 4 0 0 1 8 0v3" stroke="#8de4ff" stroke-width="2" fill="none" stroke-linecap="round"/>' +
            '<circle cx="12" cy="16.5" r="1.2" fill="#050913"/>' +
        '</svg>'
    );

    const SVG_CHECK = (
        '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
            '<path d="M5 12.5l4.2 4.3L19 7.2" stroke="#c6ffdd" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' +
        '</svg>'
    );

    const SVG_PLAY = (
        '<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
            '<polygon points="8.5,6 18.5,12 8.5,18" fill="#2a1a02"/>' +
        '</svg>'
    );

    /* ---- Feature icon SVGs (inline, stroke, no external files) ---- */
    const FEATURE_ICONS = [
        // Maze (labyrinths)
        '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
            '<rect x="3" y="3" width="26" height="26" rx="2"/>' +
            '<path d="M9 3v8h6v5h5v5H9"/>' +
            '<path d="M23 11h-3"/>' +
        '</svg>',
        // Key
        '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
            '<circle cx="11" cy="11" r="5"/>' +
            '<path d="M15 15l12 12"/>' +
            '<path d="M22 22l3 3"/>' +
            '<path d="M19 25l3 3"/>' +
        '</svg>',
        // Trap (spike)
        '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M3 26h26"/>' +
            '<path d="M7 26V11l5 15"/>' +
            '<path d="M14 26V8l5 18"/>' +
            '<path d="M21 26v-11l5 11"/>' +
        '</svg>',
        // Guardian (eye)
        '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M3 16s5-10 13-10 13 10 13 10-5 10-13 10S3 16 3 16z"/>' +
            '<circle cx="16" cy="16" r="4"/>' +
            '<circle cx="16" cy="16" r="1.2" fill="currentColor"/>' +
        '</svg>',
        // Difficulty (bars up)
        '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
            '<rect x="4" y="20" width="5" height="8" rx="1"/>' +
            '<rect x="11" y="14" width="5" height="14" rx="1"/>' +
            '<rect x="18" y="8" width="5" height="20" rx="1"/>' +
            '<rect x="25" y="3" width="5" height="25" rx="1"/>' +
        '</svg>',
        // Strategy (brain grid)
        '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
            '<rect x="4" y="4" width="24" height="24" rx="3"/>' +
            '<path d="M4 11h24M4 18h24M11 4v24M18 4v24"/>' +
            '<circle cx="7.5" cy="7.5" r="1.2" fill="currentColor"/>' +
            '<circle cx="24.5" cy="24.5" r="1.2" fill="currentColor"/>' +
        '</svg>'
    ];

    const FEATURE_TITLES = [
        'Procedurally <span class="hp-accent">Generated</span> Labyrinths',
        'Keys & <span class="hp-accent">Locked</span> Doors',
        'Hidden <span class="hp-accent">Traps</span>',
        'Moving <span class="hp-accent">Guardians</span>',
        'Increasing <span class="hp-accent">Difficulty</span>',
        'Strategic <span class="hp-accent">Movement</span> & Puzzles'
    ];

    const FEATURE_DESCS = [
        'Every dungeon is a unique stone labyrinth — replayable, solvable, and packed with secrets.',
        'Find a golden key, then carry it past the ancient stone door to the treasure chamber.',
        'Pressure plates litter the floors. Step off the safe path and pay the price.',
        'Skeletal guardians patrol the corridors. Predict their routes or be caught.',
        'Three trials scale up in size, complexity, and danger. Easy is only the beginning.',
        'Every move costs time. Map the dungeon in your head, or get trapped forever.'
    ];

    /* ---- Tutorial step icons + titles + descriptions ---- */
    const STEP_ICONS = [
        // Compass (Explore)
        '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
            '<circle cx="16" cy="16" r="11"/>' +
            '<polygon points="16,7 19,16 16,25 13,16" fill="currentColor" opacity="0.35"/>' +
            '<path d="M16 7v9h9"/>' +
        '</svg>',
        // Key
        '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
            '<circle cx="10" cy="10" r="5"/>' +
            '<path d="M14 14l14 14M21 21l3 3M18 24l3 3"/>' +
        '</svg>',
        // Door (archway)
        '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M6 28V14a10 10 0 0 1 20 0v14"/>' +
            '<path d="M3 28h26"/>' +
            '<circle cx="21.5" cy="20" r="1.2" fill="currentColor"/>' +
        '</svg>',
        // Shield / avoid
        '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
            '<path d="M16 3l11 4v8c0 8-5 13-11 14-6-1-11-6-11-14V7z"/>' +
            '<path d="M10 13l12 10M22 13L10 23"/>' +
        '</svg>',
        // Treasure chest
        '<svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
            '<rect x="4" y="14" width="24" height="14" rx="2"/>' +
            '<path d="M4 19h24"/>' +
            '<path d="M6 14c1.5-5 18.5-5 20 0"/>' +
            '<rect x="14" y="18" width="4" height="5" rx="0.5"/>' +
        '</svg>'
    ];

    const STEP_TITLES = [
        'Explore the Dungeon',
        'Find the Key',
        'Pass the Locked Door',
        'Avoid Traps & Guardians',
        'Reach the Treasure'
    ];

    const STEP_DESCS = [
        'Use WASD or arrow keys to walk one tile at a time. Press ESC to pause, R to restart, or L for the level list.',
        'A glowing golden key lies somewhere in the labyrinth. Walk onto it to pick it up.',
        'Carry the key to the stone archway. It will unlock — step through to the inner halls.',
        'Watch the floor for hidden traps and the corridors for patrolling guardians. One wrong move resets you.',
        'Open the glowing chest, claim the treasure, and unlock the next trial.'
    ];

    /* ---- Level display metadata (tied to real level indexes 0/1/2) ---- */
    const LEVEL_CONFIG = [
        {
            levelIdx: 0,
            name: "The Forgotten Catacombs",
            roman: "LEVEL I",
            descFocus: "Learn movement and explore damp stone corridors lit by ancient torches.",
            visualClass: "level-card-i",
            pillColor: "easy",
            pillLabel: "EASY"
        },
        {
            levelIdx: 1,
            name: "The Guardian's Domain",
            roman: "LEVEL II",
            descFocus: "Navigate winding halls while avoiding the Treasure Guardian and its patrol route.",
            visualClass: "level-card-ii",
            pillColor: "medium",
            pillLabel: "MEDIUM"
        },
        {
            levelIdx: 2,
            name: "The Twin Guardians",
            roman: "LEVEL III",
            descFocus: "Traps, a locked door, and two patrolling guardians — reach the treasure or stay entombed.",
            visualClass: "level-card-iii",
            pillColor: "hard",
            pillLabel: "HARD"
        }
    ];

    /* ============================================================
     *  HELPERS
     * ============================================================ */
    function $(sel, root) { return (root || document).querySelector(sel); }
    function $$(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }

    function safeFormatTime(sec) {
        if (typeof formatTime === "function") return formatTime(sec);
        const s = Math.max(0, Math.floor(sec || 0));
        const mm = String(Math.floor(s / 60)).padStart(2, "0");
        const ss = String(s % 60).padStart(2, "0");
        return mm + ":" + ss;
    }

    function enterDungeonFromCTA() {
        if (typeof ScreenManager === "undefined") return;
        const savedBest = ScreenManager.progress.highestUnlockedLevel;
        const target = (savedBest > 0) ? savedBest : 0;
        ScreenManager.showGame(target, { reset: true });
    }

    function continueAdventure() {
        if (typeof ScreenManager === "undefined") return;
        const target = Math.max(0, ScreenManager.progress.highestUnlockedLevel);
        ScreenManager.showGame(target, { reset: false });
    }

    function unlockCardToLevel(cfg) {
        if (typeof ScreenManager === "undefined") return;
        const unlockedMax = ScreenManager.progress.highestUnlockedLevel;
        if (cfg.levelIdx > unlockedMax) return false;
        ScreenManager.showGame(cfg.levelIdx, { reset: true });
        return true;
    }

    /* ============================================================
     *  NAV — hamburger toggle + smooth scroll + brand->home
     * ============================================================ */
    function setupNav() {
        const nav = $(".homepage-nav");
        const toggle = $(".homepage-nav-toggle", nav);
        const links = $("#homepage-nav-links");
        if (nav && toggle) {
            toggle.setAttribute("aria-expanded", "false");
            toggle.setAttribute("aria-controls", "homepage-nav-links");
            toggle.addEventListener("click", function () {
                const open = nav.classList.toggle("is-open");
                toggle.setAttribute("aria-expanded", open ? "true" : "false");
            });
        }

        // Close drawer on link click (mobile)
        $$(".homepage-nav-links a, .homepage-nav-links button").forEach(function (el) {
            el.addEventListener("click", function () {
                if (nav && nav.classList.contains("is-open")) {
                    nav.classList.remove("is-open");
                    if (toggle) toggle.setAttribute("aria-expanded", "false");
                }
            });
        });

        // Smooth scroll + special "Home" behavior when on game screen
        $$('[data-nav]').forEach(function (el) {
            el.addEventListener("click", function (e) {
                const navTarget = el.getAttribute("data-nav");
                const href = el.getAttribute("href") || "";
                // Case: user is on game screen and clicks brand/home link -> go to homepage
                if (typeof ScreenManager !== "undefined" && ScreenManager.active !== "homepage") {
                    e.preventDefault();
                    ScreenManager.showHome();
                    if (href && href.charAt(0) === "#" && href.length > 1) {
                        // scroll to id when homepage becomes visible
                        setTimeout(function () {
                            const t = document.getElementById(href.slice(1));
                            if (t) t.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
                        }, 120);
                    }
                    return;
                }
                // Case: homepage anchor scroll
                if (href.charAt(0) === "#" && href.length > 1) {
                    const t = document.getElementById(href.slice(1));
                    if (t) {
                        e.preventDefault();
                        t.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
                    }
                }
                if (navTarget === "home") {
                    // already on homepage; just scroll to top
                    e.preventDefault();
                    window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
                }
            });
        });

        // Play Now in nav
        $$(".hp-nav-play").forEach(function (btn) {
            btn.addEventListener("click", function (e) { e.preventDefault(); enterDungeonFromCTA(); });
        });
    }

    /* ============================================================
     *  HERO CTAs
     * ============================================================ */
    function setupHeroCTAs() {
        // Enter the Dungeon -> go to highest unlocked (fresh start)
        $$('[data-action="enter-dungeon"]').forEach(function (btn) {
            btn.addEventListener("click", function (e) { e.preventDefault(); enterDungeonFromCTA(); });
        });

        // Continue Adventure -> resume same level if any
        const continueBtn = $('[data-action="continue-adventure"]');
        if (typeof ScreenManager !== "undefined" && continueBtn) {
            const prog = ScreenManager.progress;
            const hasProgress = prog.highestUnlockedLevel > 0 || (prog.completedLevels && prog.completedLevels.length > 0);
            if (hasProgress) {
                continueBtn.removeAttribute("hidden");
            }
            continueBtn.addEventListener("click", function (e) { e.preventDefault(); continueAdventure(); });
        }

        // Explore Levels secondary CTA -> anchor scroll
        const explore = $('[data-action="explore-levels"]');
        if (explore) {
            explore.addEventListener("click", function (e) {
                const anchor = document.getElementById("homepage-levels");
                if (anchor) {
                    e.preventDefault();
                    anchor.scrollIntoView({ behavior: reducedMotion ? "auto" : "smooth", block: "start" });
                }
            });
        }
    }

    /* ============================================================
     *  FEATURES 6 TILES — inject SVGs + titles + descriptions dynamically
     * ============================================================ */
    function renderFeatures() {
        const features = $$(".homepage-feature");
        features.forEach(function (card, i) {
            if (!card) return;
            const iconWrap = $(".hp-feature-icon", card);
            const h3 = $("h3", card);
            const p = $("p", card);
            if (iconWrap && FEATURE_ICONS[i]) iconWrap.innerHTML = FEATURE_ICONS[i];
            if (h3 && FEATURE_TITLES[i]) h3.innerHTML = FEATURE_TITLES[i];
            if (p && FEATURE_DESCS[i]) p.textContent = FEATURE_DESCS[i];
        });
    }

    /* ============================================================
     *  TUTORIAL 5 STEPS — inject icons/titles/descriptions + kb keys for Step 1
     * ============================================================ */
    function renderSteps() {
        const steps = $$(".homepage-step");
        steps.forEach(function (step, i) {
            if (!step) return;
            const iconWrap = $(".hp-step-icon", step);
            const h3 = $("h3", step);
            const p = $("p", step);
            if (iconWrap && STEP_ICONS[i]) iconWrap.innerHTML = STEP_ICONS[i];
            if (h3 && STEP_TITLES[i]) h3.textContent = STEP_TITLES[i];
            if (p && STEP_DESCS[i]) p.innerHTML = STEP_DESCS[i];
        });

        // Step 1 kb keys (first step)
        const kbRow = $('.homepage-steps .hp-kb-row');
        if (kbRow) {
            const kbLabels = ["W","A","S","D","↑","←","↓","→","ESC","R","L"];
            kbRow.innerHTML = kbLabels.map(function (k, idx) {
                const isMove = idx < 8;
                const cls = isMove ? "hp-kb-key group" : "hp-kb-key";
                return '<span class="' + cls + '">' + k + '</span>';
            }).join("");
        }
    }

    /* ============================================================
     *  LEVEL CARDS — dynamic 3 cards into #homepageLevelList
     * ============================================================ */
    function renderHomepageLevelCards() {
        const grid = $("#homepageLevelList");
        if (!grid) return;
        grid.innerHTML = "";

        const prog = (typeof ScreenManager !== "undefined") ? ScreenManager.progress : { highestUnlockedLevel: 0, completedLevels: [], bestTimes: {} };
        const unlockedMax = prog.highestUnlockedLevel || 0;
        const completed = (prog.completedLevels || []).slice();
        const bestTimes = prog.bestTimes || {};

        LEVEL_CONFIG.forEach(function (cfg) {
            const isUnlocked = cfg.levelIdx <= unlockedMax;
            const isCompleted = completed.indexOf(cfg.levelIdx) !== -1;
            const best = (typeof bestTimes[cfg.levelIdx] === "number") ? bestTimes[cfg.levelIdx] : null;

            const card = document.createElement("div");
            // Cards are interactive containers with inner button. We mark the outer <button> for keyboard nav.
            const outer = document.createElement("button");
            outer.type = "button";
            outer.className = "homepage-level-card hp-panel " + cfg.visualClass + " " + (isUnlocked ? "unlocked" : "locked");
            outer.setAttribute("aria-label", (isUnlocked ? "Play " : "Locked: ") + cfg.roman + " — " + cfg.name);
            if (!isUnlocked) {
                outer.setAttribute("aria-disabled", "true");
            }

            const inner = document.createElement("div");
            inner.className = "hp-card-inner";

            // completed badge
            if (isCompleted) {
                const done = document.createElement("span");
                done.className = "hp-card-completed";
                done.innerHTML = SVG_CHECK + "<span>CLEARED</span>";
                outer.appendChild(done);
            }

            // Lock overlay (grays + central SVG) for locked cards
            if (!isUnlocked) {
                const lock = document.createElement("div");
                lock.className = "hp-card-lock-overlay";
                lock.innerHTML = SVG_LOCK;
                outer.appendChild(lock);
            }

            // Badge row: number + diff pill
            const badge = document.createElement("div");
            badge.className = "hp-card-badge";
            badge.innerHTML =
                '<span class="hp-card-level-num">' + cfg.roman + '</span>' +
                '<span class="hp-card-diff ' + cfg.pillColor + '">' + cfg.pillLabel + '</span>';
            inner.appendChild(badge);

            // Emblem
            const emblem = document.createElement("div");
            emblem.className = "hp-card-emblem";
            emblem.setAttribute("aria-hidden", "true");
            inner.appendChild(emblem);

            // Title + best
            const titleWrap = document.createElement("div");
            const h3 = document.createElement("h3");
            h3.textContent = cfg.name;
            titleWrap.appendChild(h3);
            if (best !== null) {
                const bestEl = document.createElement("div");
                bestEl.className = "hp-card-best";
                bestEl.textContent = "Best: " + safeFormatTime(best);
                titleWrap.appendChild(bestEl);
            }
            inner.appendChild(titleWrap);

            // Description
            const desc = document.createElement("p");
            desc.className = "hp-card-desc";
            desc.textContent = cfg.descFocus;
            inner.appendChild(desc);

            // Footer button
            const footer = document.createElement("div");
            footer.className = "hp-card-footer";
            const btn = document.createElement("button");
            btn.type = "button";
            btn.className = "hp-cta-small " + (isUnlocked ? "" : "locked-version");
            btn.setAttribute("tabindex", "-1"); // focus the outer card instead
            btn.setAttribute("aria-hidden", "true");
            if (isUnlocked) {
                btn.innerHTML = SVG_PLAY + '<span>Play Level</span>';
            } else {
                btn.innerHTML = SVG_LOCK + '<span>Locked</span>';
                btn.disabled = true;
            }
            footer.appendChild(btn);
            inner.appendChild(footer);

            outer.appendChild(inner);
            grid.appendChild(outer);

            // Card click: unlocked -> launch; locked -> shake + no-op
            outer.addEventListener("click", function (e) {
                if (!isUnlocked) {
                    e.preventDefault();
                    e.stopPropagation();
                    outer.classList.remove("hp-card-locked-shake");
                    // Force reflow so animation can restart
                    void outer.offsetWidth;
                    outer.classList.add("hp-card-locked-shake");
                    setTimeout(function () {
                        outer.classList.remove("hp-card-locked-shake");
                    }, 420);
                    return;
                }
                unlockCardToLevel(cfg);
            });
        });
    }

    /* ============================================================
     *  PREVIEW BOARD — static 7x7 mini board built with hp-* tiles
     * ============================================================ */
    function renderPreviewBoard() {
        const grid = $(".hp-board-grid");
        if (!grid) return;
        grid.innerHTML = "";

        // 7x7: W=wall, F=floor, P=player on floor, E=enemy on floor, K=key, D=door, T=trap, R=treasure
        const PATTERN = [
            "WWWWWWW",
            "WPFF F W".replace(" ",""),
            "W WFW W",
            "WFF KDW".replace(" ",""),
            "W W W W",
            "WFE T W".replace(" ",""),
            "WWFWRWW"
        ];
        // Correct 7x7 map (above has a glitch; redo by hand to ensure it looks good)
        const MAP = [
            "WWWWWWW",
            "WPFFFFW",
            "WFWFFWW",
            "WFFKFDW",
            "WWFWFWW",
            "WFFTEFW",
            "WWWWWMW"
        ];
        // Fix M → treasure cell
        const BOARD = MAP.map(function (row) { return row.replace("M", "R"); });

        for (let r = 0; r < 7; r++) {
            const row = BOARD[r] || "WWWWWWW";
            for (let c = 0; c < 7; c++) {
                const ch = row.charAt(c) || "W";
                const tile = document.createElement("div");
                const isWall = ch === "W";
                tile.className = isWall ? "hp-wall" : "hp-floor";

                if (ch === "P") {
                    const sp = document.createElement("div");
                    sp.className = "hp-sprite hp-player";
                    tile.appendChild(sp);
                } else if (ch === "E") {
                    const sp = document.createElement("div");
                    sp.className = "hp-sprite hp-enemy";
                    tile.appendChild(sp);
                } else if (ch === "K") {
                    const sp = document.createElement("div");
                    sp.className = "hp-sprite hp-key";
                    tile.appendChild(sp);
                } else if (ch === "D") {
                    const sp = document.createElement("div");
                    sp.className = "hp-sprite hp-door";
                    tile.appendChild(sp);
                } else if (ch === "T") {
                    const sp = document.createElement("div");
                    sp.className = "hp-sprite hp-trap";
                    tile.appendChild(sp);
                } else if (ch === "R") {
                    const sp = document.createElement("div");
                    sp.className = "hp-sprite hp-treasure";
                    tile.appendChild(sp);
                }
                grid.appendChild(tile);
            }
        }

        // Preview board-side enter button
        $$(".hp-preview-enter").forEach(function (btn) {
            btn.addEventListener("click", function (e) { e.preventDefault(); enterDungeonFromCTA(); });
        });
    }

    /* ============================================================
     *  HERO PARALLAX (scroll)
     * ============================================================ */
    function setupParallax() {
        if (reducedMotion) return;
        const ill = $(".homepage-hero-illustration");
        if (!ill) return;
        let ticking = false;
        window.addEventListener("scroll", function () {
            if (!ticking) {
                window.requestAnimationFrame(function () {
                    const y = Math.min(window.scrollY || 0, window.innerHeight);
                    ill.style.transform = "translateY(" + (y * 0.08).toFixed(2) + "px)";
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    /* ============================================================
     *  HERO PARTICLES (40)
     * ============================================================ */
    function setupParticles() {
        if (reducedMotion) return;
        const wrap = $(".homepage-hero-particles");
        if (!wrap) return;
        const PALETTE = ["8de4ff", "ffc857", "ff8da2"];
        const count = 40;
        for (let i = 0; i < count; i++) {
            const p = document.createElement("div");
            p.className = "hp-particle";
            const size = 1 + Math.random() * 1.8;
            const left = Math.random() * 100;
            const top = 10 + Math.random() * 90;
            const op = 0.12 + Math.random() * 0.4;
            const dur = 18 + Math.random() * 9;
            const delay = -Math.random() * dur;
            const color = "#" + PALETTE[Math.floor(Math.random() * PALETTE.length)];
            p.style.cssText =
                "left:" + left.toFixed(2) + "%;" +
                "top:" + top.toFixed(2) + "%;" +
                "width:" + size.toFixed(2) + "px;" +
                "height:" + size.toFixed(2) + "px;" +
                "opacity:" + op.toFixed(2) + ";" +
                "background:" + color + ";" +
                "box-shadow:0 0 " + (size * 3).toFixed(1) + "px " + color + ";" +
                "animation-duration:" + dur.toFixed(1) + "s;" +
                "animation-delay:" + delay.toFixed(1) + "s;";
            wrap.appendChild(p);
        }
    }

    /* ============================================================
     *  SCROLL REVEAL (sections)
     * ============================================================ */
    function setupScrollReveal() {
        const sections = $$(".homepage section");
        if (reducedMotion) {
            sections.forEach(function (s) { s.classList.add("is-visible"); });
            return;
        }
        if (!("IntersectionObserver" in window)) {
            sections.forEach(function (s) { s.classList.add("is-visible"); });
            return;
        }
        const io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
                if (e.isIntersecting) {
                    e.target.classList.add("is-visible");
                    io.unobserve(e.target);
                }
            });
        }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
        sections.forEach(function (s) { io.observe(s); });
    }

    /* ============================================================
     *  FOOTER — inject kb controls row
     * ============================================================ */
    function setupFooterControls() {
        const row = $(".homepage-footer .hp-footer-controls .hp-kb-row");
        if (!row) return;
        const items = ["WASD","Arrows","ESC","R","L"];
        row.innerHTML = items.map(function (lbl, i) {
            const cls = i < 2 ? "hp-kb-key group" : "hp-kb-key";
            return '<span class="' + cls + '">' + lbl + '</span>';
        }).join("");
    }

    /* ============================================================
     *  INIT
     * ============================================================ */
    function init() {
        if (!document.querySelector(".homepage")) return;
        setupNav();
        setupHeroCTAs();
        renderFeatures();
        renderSteps();
        renderHomepageLevelCards();
        renderPreviewBoard();
        setupParallax();
        setupParticles();
        setupScrollReveal();
        setupFooterControls();
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }

    // Expose a tiny API for future runtime refresh (e.g. if ScreenManager writes,
    // homepage can re-render cards. Not used today but safe.)
    window.DungeonHomepage = {
        refreshCards: renderHomepageLevelCards
    };
})();
