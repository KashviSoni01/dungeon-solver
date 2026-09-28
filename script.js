/* =========================================================
   GAME STATE
========================================================= */

let currentLevel = 0;

let timer = 0;
let moves = 0;

let gameStarted = false;
let gameWon = false;
let gamePaused = false;

let highestUnlockedLevel = 0;


/* =========================================================
   LEVELS
========================================================= */

const levels = [

    {
        name: "The Forgotten Cell",
        difficulty: "EASY",
        trapCount: 2
    },

    {
        name: "The Lost Crypt",
        difficulty: "MEDIUM",
        trapCount: 4
    },

    {
        name: "The Ancient Vault",
        difficulty: "HARD",
        trapCount: 6
    }

];


/* =========================================================
   DOM ELEMENTS
========================================================= */

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

const levelsButton =
    document.getElementById("levelsButton");


const pauseScreen =
    document.getElementById("pauseScreen");

const resumeButton =
    document.getElementById("resume");

const pauseRestartButton =
    document.getElementById("pauseRestart");


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

const closeLevels =
    document.getElementById(
        "closeLevels"
    );


/* =========================================================
   CREATE DUNGEONS
========================================================= */

const dungeons =
    levels.map(
        (_, index) =>
            generateDungeon(index)
    );


/* =========================================================
   CHECK WIN
========================================================= */

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


/* =========================================================
   KEYBOARD CONTROLS
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        /* =====================================
           ARROW KEYS / WASD
        ===================================== */

        switch (event.key) {

            case "ArrowUp":
            case "w":
            case "W":

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

                event.preventDefault();

                movePlayer(
                    0,
                    1,
                    "right"
                );

                return;
        }


        /* =====================================
           ESC = PAUSE
        ===================================== */

        if (
            event.key === "Escape"
        ) {

            togglePause();

            return;
        }


        /* =====================================
           R = RESET
        ===================================== */

        if (
            event.key === "r" ||
            event.key === "R"
        ) {

            resetLevel();

            return;
        }


        /* =====================================
           L = LEVEL SELECT
        ===================================== */

        if (
            event.key === "l" ||
            event.key === "L"
        ) {

            openLevelSelect();

        }

    }
);


/* =========================================================
   TIMER
========================================================= */

let timerInterval =
    setInterval(
        () => {

            if (
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


/* =========================================================
   RESET LEVEL
========================================================= */

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


/* =========================================================
   PAUSE
========================================================= */

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


/* =========================================================
   OPEN LEVEL SELECT
========================================================= */

function openLevelSelect() {

    renderLevelSelect();

    levelSelectScreen.style.display =
        "flex";
}


/* =========================================================
   CLOSE LEVEL SELECT
========================================================= */

function closeLevelSelect() {

    levelSelectScreen.style.display =
        "none";
}


/* =========================================================
   SELECT LEVEL
========================================================= */

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


/* =========================================================
   RESTART BUTTON
========================================================= */

if (restartButton) {

    restartButton.addEventListener(
        "click",
        () => {

            resetLevel();

        }
    );
}


/* =========================================================
   PAUSE BUTTON
========================================================= */

if (pauseButton) {

    pauseButton.addEventListener(
        "click",
        () => {

            togglePause();

        }
    );
}


/* =========================================================
   RESUME BUTTON
========================================================= */

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


/* =========================================================
   PAUSE RESTART
========================================================= */

if (pauseRestartButton) {

    pauseRestartButton.addEventListener(
        "click",
        () => {

            resetLevel();

        }
    );
}


/* =========================================================
   LEVELS BUTTON
========================================================= */

if (levelsButton) {

    levelsButton.addEventListener(
        "click",
        () => {

            openLevelSelect();

        }
    );
}


/* =========================================================
   CLOSE LEVELS
========================================================= */

if (closeLevels) {

    closeLevels.addEventListener(
        "click",
        () => {

            closeLevelSelect();

        }
    );
}


/* =========================================================
   NEXT LEVEL
========================================================= */

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


                currentLevel++;

                resetLevel();

            }
            else {

                alert(
                    "🎉 You completed all three levels!"
                );

                currentLevel = 0;

                resetLevel();
            }

        }
    );
}


/* =========================================================
   PLAY AGAIN
========================================================= */

if (playAgainButton) {

    playAgainButton.addEventListener(
        "click",
        () => {

            currentLevel = 0;

            resetLevel();

        }
    );
}


/* =========================================================
   INITIAL RENDER
========================================================= */

renderDungeon();