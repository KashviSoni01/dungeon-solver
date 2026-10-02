

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
let trapResetTimer = null;




function movePlayer(
    rowChange,
    colChange,
    direction
) {

    if (
        gameWon ||
        gamePaused ||
        trapTriggered ||
        (
            typeof collisionResetPending !== "undefined" &&
            collisionResetPending
        )
    ) {
        return;
    }


    const dungeon =
        dungeons[currentLevel];


    const newRow =
        player.row + rowChange;

    const newCol =
        player.col + colChange;


    

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


    

    if (
        nextCell === "#"
    ) {

        return;
    }


    

    if (
        nextCell === "D" &&
        !hasKey
    ) {

        return;
    }

    if (
        typeof getEnemyAt === "function" &&
        getEnemyAt(newRow, newCol)
    ) {
        return;
    }


    

    player.row = newRow;
    player.col = newCol;


    

    player.direction =
        direction;


    moves++;


    

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


    

    if (
        nextCell === "X"
    ) {

        trapTriggered = true;

        if (typeof stopEnemy === "function") {
            stopEnemy();
        }

        renderDungeon();


        trapResetTimer = setTimeout(
            () => {

                trapResetTimer = null;

                alert(
                    "You stepped on a trap!"
                );

                resetLevel();

            },
            100
        );


        return;
    }


    

    renderDungeon();


    

    checkWin();
}




function resetPlayer() {

    clearTimeout(
        movementAnimationTimer
    );

    clearTimeout(trapResetTimer);
    trapResetTimer = null;


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