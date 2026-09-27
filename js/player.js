/* =========================================================
   PLAYER STATE
========================================================= */

let player = {
    row: 1,
    col: 1,
    direction: "down"
};

let hasKey = false;
let hasPassedDoor = false;
let trapTriggered = false;

let isPlayerMoving = false;
let movementAnimationTimer = null;


/* =========================================================
   MOVE PLAYER
========================================================= */

function movePlayer(
    rowChange,
    colChange,
    direction
) {

    if (
        gameWon ||
        gamePaused ||
        trapTriggered
    ) {
        return;
    }


    const dungeon =
        dungeons[currentLevel];


    const newRow =
        player.row + rowChange;

    const newCol =
        player.col + colChange;


    /* =========================================
       BOUNDARY
    ========================================= */

    if (
        newRow < 0 ||
        newRow >= dungeon.length ||
        newCol < 0 ||
        newCol >= dungeon[0].length
    ) {
        return;
    }


    const nextCell =
        dungeon[newRow][newCol];


    /* =========================================
       WALL
    ========================================= */

    if (
        nextCell === "#"
    ) {

        return;
    }


    /* =========================================
       LOCKED DOOR
    ========================================= */

    if (
        nextCell === "D" &&
        !hasKey
    ) {

        return;
    }


    /* =========================================
       MOVE
    ========================================= */

    player.row = newRow;
    player.col = newCol;


    /* =========================================
       DIRECTION
    ========================================= */

    player.direction =
        direction;


    moves++;


    /* =========================================
       START ANIMATION
    ========================================= */

    isPlayerMoving = true;


    clearTimeout(
        movementAnimationTimer
    );


    movementAnimationTimer =
        setTimeout(
            () => {

                isPlayerMoving = false;

                renderDungeon();

            },
            180
        );


    /* =========================================
       KEY
    ========================================= */

    if (
        nextCell === "K"
    ) {

        hasKey = true;

        dungeon[
            newRow
        ][
            newCol
        ] = ".";
    }


    /* =========================================
       DOOR
    ========================================= */

    if (
        nextCell === "D" &&
        hasKey
    ) {

        hasPassedDoor = true;

        dungeon[
            newRow
        ][
            newCol
        ] = ".";
    }


    /* =========================================
       TRAP
    ========================================= */

    if (
        nextCell === "X"
    ) {

        trapTriggered = true;

        renderDungeon();


        setTimeout(
            () => {

                alert(
                    "You stepped on a trap!"
                );

                resetLevel();

            },
            100
        );


        return;
    }


    /* =========================================
       RENDER
    ========================================= */

    renderDungeon();


    /* =========================================
       WIN
    ========================================= */

    checkWin();
}


/* =========================================================
   RESET PLAYER
========================================================= */

function resetPlayer() {

    clearTimeout(
        movementAnimationTimer
    );


    player = {
        row: 1,
        col: 1,
        direction: "down"
    };


    hasKey = false;

    hasPassedDoor = false;

    trapTriggered = false;

    isPlayerMoving = false;
}