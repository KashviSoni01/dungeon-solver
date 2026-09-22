// ===============================
// GAME STATE
// ===============================

let currentLevel = 0;

let timer = 0;
let moves = 0;

let gameStarted = false;
let gameWon = false;
let gamePaused = false;

let timerInterval;


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
    generateDungeon(0),
    generateDungeon(1),
    generateDungeon(2)
];


// ===============================
// CHECK WIN
// ===============================

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

        if (event.key === "Escape") {
            togglePause();
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
            gameWon ||
            gamePaused
        ) {
            return;
        }

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

function startTimer() {

    clearInterval(
        timerInterval
    );

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
// RESET LEVEL
// ===============================

function resetLevel() {

    clearInterval(
        timerInterval
    );

    player = {
        row: 1,
        col: 1,
        direction: "down"
    };

    hasKey = false;
    hasPassedDoor = false;

    timer = 0;
    moves = 0;

    gameStarted = false;
    gameWon = false;
    gamePaused = false;
    trapTriggered = false;

    winScreen.style.display =
        "none";

    pauseScreen.style.display =
        "none";

    dungeons[currentLevel] =
        generateDungeon(currentLevel);

    renderDungeon();

    startTimer();
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

restartButton.addEventListener(
    "click",
    () => {
        resetLevel();
    }
);


pauseButton.addEventListener(
    "click",
    () => {
        togglePause();
    }
);


resumeButton.addEventListener(
    "click",
    () => {

        gamePaused = false;

        pauseScreen.style.display =
            "none";
    }
);


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

startTimer();