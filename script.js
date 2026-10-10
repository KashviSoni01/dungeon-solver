const ScreenManager = (() => {

    const storageKey = "ds_progress_v1";
    let active = "homepage";


    function getHomeEl() {
        return document.querySelector(".homepage");
    }

    function getGameEl() {
        return document.querySelector(".game");
    }

    function loadProgress() {
        try {
            const raw =
                typeof localStorage !== "undefined"
                    ? localStorage.getItem(storageKey)
                    : null;

            if (!raw) return fallbackProgress();

            const parsed = JSON.parse(raw);

            const highest =
                Number.isInteger(parsed.highestUnlockedLevel)
                && parsed.highestUnlockedLevel >= 0
                && parsed.highestUnlockedLevel <= 2
                    ? parsed.highestUnlockedLevel
                    : 0;

            const completed =
                Array.isArray(parsed.completedLevels)
                    ? parsed.completedLevels
                        .filter(n => Number.isInteger(n) && n >= 0 && n <= 2)
                    : [];

            const bestTimes =
                parsed.bestTimes && typeof parsed.bestTimes === "object"
                    ? parsed.bestTimes
                    : {};

            for (const k of Object.keys(bestTimes)) {
                const idx = parseInt(k, 10);
                if (
                    !(idx >= 0 && idx <= 2) ||
                    !Number.isInteger(bestTimes[k]) ||
                    bestTimes[k] < 0
                ) {
                    delete bestTimes[k];
                }
            }

            return {
                highestUnlockedLevel: highest,
                completedLevels: completed,
                bestTimes
            };

        } catch (err) {
            return fallbackProgress();
        }
    }

    function fallbackProgress() {
        return {
            highestUnlockedLevel: 0,
            completedLevels: [],
            bestTimes: {}
        };
    }

    function saveProgress(data) {
        try {
            if (typeof localStorage !== "undefined") {
                localStorage.setItem(storageKey, JSON.stringify(data));
            }
        } catch (err) {
        }
    }

    const progress = loadProgress();

    function applyVisibility(homeDisplay, gameDisplay, classesToAdd, classesToRemove) {
        const home = getHomeEl();
        const game = getGameEl();
        if (home) {
            home.style.display = homeDisplay;
            classesToAdd.forEach(c => home.classList.add(c));
            classesToRemove.forEach(c => home.classList.remove(c));
        }
        if (game) {
            game.style.display = gameDisplay;
        }
    }

    function showHome() {
        active = "homepage";

        if (typeof stopEnemy === "function") {
            stopEnemy();
        }

        if (typeof gamePaused !== "undefined") {
            gamePaused = true;
        }

        applyVisibility("block", "none", ["screen-enter"], ["screen-leave"]);

        setTimeout(() => {
            const home = getHomeEl();
            if (home) home.classList.remove("screen-enter");
        }, 420);
    }

    function showGame(levelIndex, opts) {
        const options = opts || {};
        const forceReset = options.reset === true;

        const target =
            Number.isInteger(levelIndex) &&
            levelIndex >= 0 &&
            levelIndex <= progress.highestUnlockedLevel
                ? levelIndex
                : progress.highestUnlockedLevel;

        active = "game";

        applyVisibility("none", "flex", [], []);

        const shouldReset =
            forceReset ||
            (typeof currentLevel !== "undefined" && currentLevel !== target);

        if (shouldReset) {
            if (typeof selectLevel === "function") {
                selectLevel(target);
            }
        } else {
            if (typeof gamePaused !== "undefined") {
                gamePaused = false;
            }
            if (typeof renderDungeon === "function") {
                renderDungeon();
            }
            if (typeof initializeEnemy === "function" &&
                typeof dungeons !== "undefined" &&
                dungeons[target] &&
                ((typeof enemy === "undefined" || enemy === null) &&
                 (typeof keyEnemy === "undefined" || keyEnemy === null))) {
                initializeEnemy(target);
            }
            if (typeof startEnemyPatrol === "function") {
                startEnemyPatrol();
            }
            if (typeof startKeyEnemyPatrol === "function") {
                startKeyEnemyPatrol();
            }
        }
    }

    /* ---------- Progress mutation helpers called by game flow ---------- */

    function markLevelCompleted(levelIdx, timeSec) {
        if (!(levelIdx >= 0 && levelIdx <= 2)) return;

        if (progress.completedLevels.indexOf(levelIdx) === -1) {
            progress.completedLevels.push(levelIdx);
        }

        if (
            Number.isInteger(timeSec) && timeSec >= 0 &&
            (!progress.bestTimes[levelIdx] || timeSec < progress.bestTimes[levelIdx])
        ) {
            progress.bestTimes[levelIdx] = timeSec;
        }

        saveProgress(progress);
    }

    function unlockLevel(levelIdx) {
        if (!(levelIdx >= 0 && levelIdx <= 2)) return;
        if (levelIdx > progress.highestUnlockedLevel) {
            progress.highestUnlockedLevel = levelIdx;
            saveProgress(progress);
        }
    }

    return {
        get active() { return active; },
        set active(v) { if (v === "homepage" || v === "game") active = v; },
        progress,
        loadProgress,
        saveProgress: () => saveProgress(progress),
        markLevelCompleted,
        unlockLevel,
        showHome,
        showGame
    };

})();


let currentLevel = 0;

let timer = 0;
let moves = 0;

let gameStarted = false;
let gameWon = false;
let gamePaused = false;

let highestUnlockedLevel =
    (ScreenManager.progress && Number.isInteger(ScreenManager.progress.highestUnlockedLevel))
        ? ScreenManager.progress.highestUnlockedLevel
        : 0;


const levels = [

    {
        name: "The Forgotten Catacombs",
        difficulty: "EASY",
        trapCount: 2
    },

    {
        name: "The Guardian's Domain",
        difficulty: "MEDIUM",
        trapCount: 4
    },

    {
        name: "The Twin Guardians",
        difficulty: "HARD",
        trapCount: 6
    }

];



const dungeonElement =
    document.getElementById("dungeon");

const timerElement =
    document.getElementById("timer");

const movesElement =
    document.getElementById("moves");

const levelElement =
    document.getElementById("level");

const levelNameElement =
    document.getElementById("levelName");

const levelDifficultyElement =
    document.getElementById("levelDifficulty");


const restartButton =
    document.getElementById("restart");

const pauseButton =
    document.getElementById("pause");

const homeButton =
    document.getElementById("homeButton");

const levelsButton =
    document.getElementById("levelSelectButton");

const pauseLevelSelectButton =
    document.getElementById("pauseLevelSelect");

const winLevelSelectButton =
    document.getElementById("winLevelSelect");


const pauseScreen =
    document.getElementById("pauseScreen");

const resumeButton =
    document.getElementById("resume");


const winScreen =
    document.getElementById("winScreen");

const winTime =
    document.getElementById("winTime");

const winMoves =
    document.getElementById("winMoves");

const nextLevelButton =
    document.getElementById("nextLevel");

const playAgainButton =
    document.getElementById("playAgain");


const levelSelectScreen =
    document.getElementById(
        "levelSelectScreen"
    );

const levelList =
    document.getElementById(
        "levelList"
    );

const closeLevelSelectBtn =
    document.getElementById(
        "closeLevelSelect"
    );

const dungeons =
    levels.map(
        (_, index) =>
            generateDungeon(index)
    );

function checkWin() {

    const dungeon =
        dungeons[currentLevel];


    if (
        dungeon[player.row][player.col] === "T" &&
        hasKey &&
        hasPassedDoor
    ) {

        gameWon = true;


        clearInterval(
            timerInterval
        );


        winTime.textContent =
            formatTime(timer);


        winMoves.textContent =
            moves;


        ScreenManager.markLevelCompleted(currentLevel, timer);


        winScreen.style.display =
            "flex";


        if (
            currentLevel ===
            dungeons.length - 1
        ) {

            nextLevelButton.textContent =
                "FINISH GAME";

        }
        else {

            nextLevelButton.textContent =
                "NEXT LEVEL";
        }
    }
}

document.addEventListener(
    "keydown",
    event => {
        if (ScreenManager.active !== "game") {
            return;
        }

        const overlayShown =
            (pauseScreen && pauseScreen.style.display === "flex") ||
            (levelSelectScreen && levelSelectScreen.style.display === "flex") ||
            (winScreen && winScreen.style.display === "flex");


        switch (event.key) {

            case "ArrowUp":
            case "w":
            case "W":

                if (overlayShown) return;

                event.preventDefault();

                movePlayer(
                    -1,
                    0,
                    "up"
                );

                return;


            case "ArrowDown":
            case "s":
            case "S":

                if (overlayShown) return;

                event.preventDefault();

                movePlayer(
                    1,
                    0,
                    "down"
                );

                return;


            case "ArrowLeft":
            case "a":
            case "A":

                if (overlayShown) return;

                event.preventDefault();

                movePlayer(
                    0,
                    -1,
                    "left"
                );

                return;


            case "ArrowRight":
            case "d":
            case "D":

                if (overlayShown) return;

                event.preventDefault();

                movePlayer(
                    0,
                    1,
                    "right"
                );

                return;
        }

        if (
            event.key === "Escape"
        ) {

            if (overlayShown) {
                if (levelSelectScreen && levelSelectScreen.style.display === "flex") {
                    closeLevelSelect();
                } else if (pauseScreen && pauseScreen.style.display === "flex") {
                    togglePause();
                }
            } else {
                togglePause();
            }

            return;
        }

        if (
            event.key === "r" ||
            event.key === "R"
        ) {

            resetLevel();

            return;
        }

        if (
            event.key === "l" ||
            event.key === "L"
        ) {

            openLevelSelect();

        }

    }
);

let timerInterval =
    setInterval(
        () => {

            if (
                ScreenManager.active === "game" &&
                gameStarted &&
                !gameWon &&
                !gamePaused &&
                !trapTriggered
            ) {

                timer++;

                updateUI();
            }

        },
        1000
    );

function resetLevel() {

    clearInterval(
        timerInterval
    );


    resetPlayer();


    timer = 0;
    moves = 0;


    gameStarted = false;
    gameWon = false;
    gamePaused = false;


    if (winScreen) {

        winScreen.style.display =
            "none";
    }


    if (pauseScreen) {

        pauseScreen.style.display =
            "none";
    }


    /*
        Generate a fresh dungeon.
    */

    dungeons[currentLevel] =
    generateDungeon(
        currentLevel
    );


initializeEnemy(
    currentLevel
);


renderDungeon();


    timerInterval =
        setInterval(
            () => {

                if (
                    ScreenManager.active === "game" &&
                    gameStarted &&
                    !gameWon &&
                    !gamePaused &&
                    !trapTriggered
                ) {

                    timer++;

                    updateUI();
                }

            },
            1000
        );
}

function togglePause() {

    if (gameWon) {
        return;
    }


    gamePaused =
        !gamePaused;


    if (gamePaused) {

        pauseScreen.style.display =
            "flex";

    }
    else {

        pauseScreen.style.display =
            "none";
    }
}

function openLevelSelect() {

    renderLevelSelect();

    levelSelectScreen.style.display =
        "flex";
}

function closeLevelSelect() {

    levelSelectScreen.style.display =
        "none";
}

function selectLevel(index) {

    if (
        index > highestUnlockedLevel
    ) {
        return;
    }


    currentLevel = index;

    closeLevelSelect();

    resetLevel();
}

if (restartButton) {

    restartButton.addEventListener(
        "click",
        () => {

            resetLevel();

        }
    );
}

if (pauseButton) {

    pauseButton.addEventListener(
        "click",
        () => {

            togglePause();

        }
    );
}

if (homeButton) {

    homeButton.addEventListener(
        "click",
        () => {

            ScreenManager.showHome();

        }
    );
}

if (resumeButton) {

    resumeButton.addEventListener(
        "click",
        () => {

            gamePaused = false;

            pauseScreen.style.display =
                "none";

        }
    );
}


if (levelsButton) {

    levelsButton.addEventListener(
        "click",
        () => {

            openLevelSelect();

        }
    );
}


if (closeLevelSelectBtn) {

    closeLevelSelectBtn.addEventListener(
        "click",
        () => {

            closeLevelSelect();

        }
    );
}


if (pauseLevelSelectButton) {

    pauseLevelSelectButton.addEventListener(
        "click",
        () => {

            gamePaused = false;

            pauseScreen.style.display =
                "none";

            openLevelSelect();

        }
    );
}

if (winLevelSelectButton) {

    winLevelSelectButton.addEventListener(
        "click",
        () => {

            winScreen.style.display =
                "none";

            openLevelSelect();

        }
    );
}

if (nextLevelButton) {

    nextLevelButton.addEventListener(
        "click",
        () => {

            if (
                currentLevel <
                dungeons.length - 1
            ) {

                highestUnlockedLevel =
                    Math.max(
                        highestUnlockedLevel,
                        currentLevel + 1
                    );

                ScreenManager.unlockLevel(currentLevel + 1);

                currentLevel++;

                resetLevel();

            }
            else {

                alert(
                    "You completed all three levels!"
                );

                currentLevel = 0;

                resetLevel();
            }

        }
    );
}


if (playAgainButton) {

    playAgainButton.addEventListener(
        "click",
        () => {

            currentLevel = 0;

            resetLevel();

        }
    );
}

initializeEnemy(currentLevel);
renderDungeon();

(function applyInitialScreenVisibility() {
    const home = document.querySelector(".homepage");
    const game = document.querySelector(".game");
    if (home) home.style.display = "block";
    if (game) game.style.display = "none";
})();
