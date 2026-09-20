/* =====================================================
   GAME STATE
===================================================== */

let currentLevel = 0;

let player = {
    row: 1,
    col: 1,
    direction: "down"
};

let timer = 0;

let moves = 0;

let gameStarted = false;

let gameWon = false;

let gamePaused = false;


/* =====================================================
   ELEMENTS
===================================================== */

const dungeonElement =
    document.getElementById("dungeon");

const timerElement =
    document.getElementById("timer");

const movesElement =
    document.getElementById("moves");

const levelElement =
    document.getElementById("level");

const winScreen =
    document.getElementById("winScreen");

const winTime =
    document.getElementById("winTime");

const winMoves =
    document.getElementById("winMoves");

const nextLevel =
    document.getElementById("nextLevel");

const playAgain =
    document.getElementById("playAgain");

const restartButton =
    document.getElementById("restart");

const pauseButton =
    document.getElementById("pause");

const pauseScreen =
    document.getElementById("pauseScreen");

const resumeButton =
    document.getElementById("resume");


/* =====================================================
   BFS - CHECK DUNGEON SOLVABILITY
===================================================== */

function isDungeonSolvable(dungeon) {

    const rows = dungeon.length;
    const cols = dungeon[0].length;

    const dr = [-1, 1, 0, 0];
    const dc = [0, 0, -1, 1];

    const visited =
        Array.from(
            { length: rows },
            () => Array(cols).fill(false)
        );

    const queue = [[player.row, player.col]];
    visited[player.row][player.col] = true;

    while (queue.length > 0) {

        const [currR, currC] =
            queue.shift();

        if (
            dungeon[currR][currC] === "T"
        ) {

            return true;

        }

        for (let i = 0; i < 4; i++) {

            const nextR = currR + dr[i];
            const nextC = currC + dc[i];

            if (
                nextR >= 0 &&
                nextR < rows &&
                nextC >= 0 &&
                nextC < cols &&
                dungeon[nextR][nextC] !== "W" &&
                !visited[nextR][nextC]
            ) {

                visited[nextR][nextC] = true;
                queue.push([nextR,nextC]);

            }
        }

    }
    return false;

}


/* =====================================================
   DUNGEON GENERATION
===================================================== */

function generateDungeon() {

    while (true) {

        const dungeon = [];

        for (let row = 0; row < 6; row++) {

            const currentRow = [];


            for (let col = 0; col < 6; col++) {

                /* Outer border is always wall */

                if (
                    row === 0 ||
                    row === 5 ||
                    col === 0 ||
                    col === 5
                ) {

                    currentRow.push("W");

                }

                else {

                    /* Randomly create walls */

                    const probability =
                        Math.random();

                    if (probability < 0.25) {
                        currentRow.push("W");
                    }

                    else {
                        currentRow.push(".");
                    }

                }

            }


            dungeon.push(currentRow);

        }


        /* Make player starting position open */
        dungeon[1][1] = ".";

        dungeon[4][4] = "T";


        /* Check if dungeon is solvable */

        if (isDungeonSolvable(dungeon)) {

            return dungeon;

        }
    }

}


/* =====================================================
   DUNGEONS
===================================================== */

const dungeons = [

    generateDungeon(),

    generateDungeon(),

    generateDungeon()

];


/* =====================================================
   CURRENT DUNGEON
===================================================== */

function getCurrentDungeon() {

    return dungeons[currentLevel];

}


/* =====================================================
   RENDER DUNGEON
===================================================== */

function renderDungeon() {

    const dungeon =
        getCurrentDungeon();


    dungeonElement.innerHTML = "";


    dungeon.forEach(
        (row, rowIndex) => {

            row.forEach(
                (cell, columnIndex) => {

                    const element =
                        document.createElement("div");


                    element.classList.add("cell");


                    /* WALL */

                    if (cell === "W") {

                        element.classList.add("wall");

                    }


                    /* FLOOR */

                    if (cell === ".") {

                        element.classList.add("floor");

                    }


                    /* TREASURE */

                    if (cell === "T") {

                        element.classList.add(
                            "floor"
                        );

                        element.classList.add(
                            "treasure"
                        );

                        element.textContent = "💎";

                    }


                    /* PLAYER */

                    if (
                        rowIndex === player.row &&
                        columnIndex === player.col
                    ) {

                        element.classList.add(
                            "player"
                        );


                        const playerSprite =
                            document.createElement("div");


                        playerSprite.classList.add(
                            "playerSprite"
                        );


                        playerSprite.classList.add(
                            `face-${player.direction}`
                        );


                        element.appendChild(
                            playerSprite
                        );

                    }


                    dungeonElement.appendChild(
                        element
                    );

                }
            );

        }
    );

}


/* =====================================================
   MOVE PLAYER
===================================================== */

function movePlayer(
    rowChange,
    colChange
) {

    if (gameWon || gamePaused) {

        return;

    }


    const dungeon =
        getCurrentDungeon();


    const newRow =
        player.row + rowChange;

    const newCol =
        player.col + colChange;


    /* OUTSIDE DUNGEON */

    if (
        newRow < 0 ||
        newRow >= dungeon.length ||
        newCol < 0 ||
        newCol >= dungeon[0].length
    ) {

        return;

    }


    /* WALL */

    if (
        dungeon[newRow][newCol] === "W"
    ) {

        return;

    }


    /* UPDATE POSITION */

    player.row = newRow;

    player.col = newCol;


    /* UPDATE DIRECTION */

    if (rowChange === -1) {

        player.direction = "up";

    }

    else if (rowChange === 1) {

        player.direction = "down";

    }

    else if (colChange === -1) {

        player.direction = "left";

    }

    else if (colChange === 1) {

        player.direction = "right";

    }


    /* START GAME */

    gameStarted = true;


    /* COUNT MOVE */

    moves++;


    movesElement.textContent =
        moves;


    /* RENDER */

    renderDungeon();


    /* CHECK WIN */

    checkWin();

}


/* =====================================================
   CHECK WIN
===================================================== */

function checkWin() {

    const dungeon =
        getCurrentDungeon();


    if (
        dungeon[player.row][player.col] === "T"
    ) {

        gameWon = true;


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

            nextLevel.textContent =
                "FINISH GAME";

        }

        else {

            nextLevel.textContent =
                "NEXT LEVEL";

        }

    }

}


/* =====================================================
   FORMAT TIME
===================================================== */

function formatTime(totalSeconds) {

    const minutes =
        Math.floor(
            totalSeconds / 60
        );


    const seconds =
        totalSeconds % 60;


    const formattedMinutes =
        String(minutes)
            .padStart(2, "0");


    const formattedSeconds =
        String(seconds)
            .padStart(2, "0");


    return (
        formattedMinutes +
        ":" +
        formattedSeconds
    );

}


/* =====================================================
   KEYBOARD CONTROLS
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        /* UP */

        if (
            event.key === "ArrowUp"
        ) {

            event.preventDefault();

            movePlayer(-1, 0);

        }


        /* DOWN */

        else if (
            event.key === "ArrowDown"
        ) {

            event.preventDefault();

            movePlayer(1, 0);

        }


        /* LEFT */

        else if (
            event.key === "ArrowLeft"
        ) {

            event.preventDefault();

            movePlayer(0, -1);

        }


        /* RIGHT */

        else if (
            event.key === "ArrowRight"
        ) {

            event.preventDefault();

            movePlayer(0, 1);

        }


        /* RESTART */

        else if (
            event.key.toLowerCase() === "r"
        ) {

            restartGame();

        }


        /* PAUSE */

        else if (
            event.key === "Escape"
        ) {

            togglePause();

        }

    }
);


/* =====================================================
   TIMER
===================================================== */

setInterval(
    function() {

        if (
            gameStarted &&
            !gameWon &&
            !gamePaused
        ) {

            timer++;

            timerElement.textContent =
                formatTime(timer);

        }

    },
    1000
);


/* =====================================================
   RESET LEVEL
===================================================== */

function resetLevel() {

    player.row = 1;

    player.col = 1;

    player.direction = "down";


    timer = 0;

    moves = 0;


    gameStarted = false;

    gameWon = false;

    gamePaused = false;


    timerElement.textContent =
        "00:00";


    movesElement.textContent =
        "0";


    levelElement.textContent =
        `${currentLevel + 1} / ${dungeons.length}`;


    winScreen.style.display =
        "none";


    pauseScreen.style.display =
        "none";


    renderDungeon();

}


/* =====================================================
   RESTART GAME
===================================================== */

function restartGame() {

    currentLevel = 0;

    resetLevel();

}


/* =====================================================
   LOAD NEXT LEVEL
===================================================== */

function loadNextLevel() {

    if (
        currentLevel <
        dungeons.length - 1
    ) {

        currentLevel++;

        resetLevel();

    }

    else {

        currentLevel = 0;

        resetLevel();

    }

}


/* =====================================================
   PAUSE
===================================================== */

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


/* =====================================================
   BUTTON EVENTS
===================================================== */

restartButton.addEventListener(
    "click",
    restartGame
);


pauseButton.addEventListener(
    "click",
    togglePause
);


resumeButton.addEventListener(
    "click",
    togglePause
);


playAgain.addEventListener(
    "click",
    restartGame
);


nextLevel.addEventListener(
    "click",
    loadNextLevel
);


/* =====================================================
   START
===================================================== */

renderDungeon();