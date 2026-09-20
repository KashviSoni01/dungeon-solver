// ===============================
// GAME STATE
// ===============================

let currentLevel = 0;

let timer = 0;
let moves = 0;

let gameStarted = false;
let gameWon = false;
let gamePaused = false;


// ===============================
// DOM ELEMENTS
// ===============================

const dungeonElement =
    document.getElementById("dungeon");

const timerElement =
    document.getElementById("timer");

const movesElement =
    document.getElementById("moves");

const levelElement =
    document.getElementById("level");

const restartButton =
    document.getElementById("restart");

const pauseButton =
    document.getElementById("pause");

const pauseScreen =
    document.getElementById("pauseScreen");

const resumeButton =
    document.getElementById("resume");

const winScreen =
    document.getElementById("winScreen");

const finalTimeElement =
    document.getElementById("winTime");

const finalMovesElement =
    document.getElementById("winMoves");

const nextLevelButton =
    document.getElementById("nextLevel");

const playAgainButton =
    document.getElementById("playAgain");


// ===============================
// CREATE LEVELS
// ===============================

const dungeons = [
    generateDungeon(),
    generateDungeon(),
    generateDungeon()
];


// ===============================
// CHECK WIN
// ===============================

function checkWin() {

    const dungeon =
        dungeons[currentLevel];

    if (
        dungeon[player.row][player.col] === "T" &&
        hasKey
    ) {

        gameWon = true;

        clearInterval(
            timerInterval
        );

        finalTimeElement.textContent =
            formatTime(timer);

        finalMovesElement.textContent =
            moves;

        winScreen.style.display =
            "flex";
    }
}


// ===============================
// KEYBOARD CONTROLS
// ===============================

document.addEventListener(
    "keydown",
    (event) => {

        // ESC = PAUSE / RESUME

        if (event.key === "Escape") {

            togglePause();

            return;
        }


        // R = RESTART

        if (
            event.key === "r" ||
            event.key === "R"
        ) {

            resetLevel();

            return;
        }


        // STOP INPUT

        if (
            gameWon ||
            gamePaused
        ) {

            return;
        }


        // MOVEMENT

        switch (event.key) {

            case "ArrowUp":
            case "w":
            case "W":

                movePlayer(-1, 0);

                break;


            case "ArrowDown":
            case "s":
            case "S":

                movePlayer(1, 0);

                break;


            case "ArrowLeft":
            case "a":
            case "A":

                movePlayer(0, -1);

                break;


            case "ArrowRight":
            case "d":
            case "D":

                movePlayer(0, 1);

                break;
        }
    }
);


// ===============================
// TIMER
// ===============================

let timerInterval =
    setInterval(() => {

        if (
            gameStarted &&
            !gameWon &&
            !gamePaused &&
            !trapTriggered
        ) {

            timer++;

            updateUI();
        }

    }, 1000);


// ===============================
// RESET LEVEL
// ===============================

function resetLevel() {

    clearInterval(
        timerInterval
    );


    // RESET PLAYER

    player = {
        row: 1,
        col: 1,
        direction: "down"
    };


    // RESET GAME STATE

    hasKey = false;

    timer = 0;
    moves = 0;

    gameStarted = false;
    gameWon = false;
    gamePaused = false;
    trapTriggered = false;


    // HIDE SCREENS

    winScreen.style.display =
        "none";

    pauseScreen.style.display =
        "none";


    // GENERATE NEW DUNGEON

    dungeons[currentLevel] =
        generateDungeon();


    // RENDER

    renderDungeon();


    // RESTART TIMER

    timerInterval =
        setInterval(() => {

            if (
                gameStarted &&
                !gameWon &&
                !gamePaused &&
                !trapTriggered
            ) {

                timer++;

                updateUI();
            }

        }, 1000);
}


// ===============================
// PAUSE / RESUME
// ===============================

function togglePause() {

    if (gameWon) {

        return;
    }

    gamePaused =
        !gamePaused;


    if (gamePaused) {

        pauseScreen.style.display =
            "flex";

    } else {

        pauseScreen.style.display =
            "none";
    }
}


// ===============================
// BUTTONS
// ===============================

// RESTART

restartButton.addEventListener(
    "click",
    () => {

        resetLevel();
    }
);


// PAUSE

pauseButton.addEventListener(
    "click",
    () => {

        togglePause();
    }
);


// RESUME

resumeButton.addEventListener(
    "click",
    () => {

        gamePaused = false;

        pauseScreen.style.display =
            "none";
    }
);


// NEXT LEVEL

nextLevelButton.addEventListener(
    "click",
    () => {

        if (
            currentLevel <
            dungeons.length - 1
        ) {

            currentLevel++;

            resetLevel();

        } else {

            alert(
                "🎉 You completed all levels!"
            );

            currentLevel = 0;

            resetLevel();
        }
    }
);


// PLAY AGAIN

playAgainButton.addEventListener(
    "click",
    () => {

        currentLevel = 0;

        resetLevel();
    }
);


// ===============================
// INITIAL RENDER
// ===============================

renderDungeon();