// ===============================
// PLAYER STATE
// ===============================

player = {
    row: 1,
    col: 1,
    direction: "down",
    isMoving: false
};

let hasKey = false;
let hasPassedDoor = false;

let trapTriggered = false;


// ===============================
// MOVE PLAYER
// ===============================

function movePlayer(
    rowChange,
    colChange
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


    // ===============================
    // CHECK BOUNDARIES
    // ===============================

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


    // ===============================
    // WALL
    // ===============================

    if (nextCell === "W") {
        return;
    }


    // ===============================
    // DOOR
    // ===============================

    if (
        nextCell === "D" &&
        !hasKey
    ) {
        return;
    }

    if (
        nextCell === "T" &&
        !hasPassedDoor
    ) {
        return;
    }


    // ===============================
    // MOVE
    // ===============================

    player.row = newRow;
player.col = newCol;

player.isMoving = true;

if (rowChange === -1) {
    player.direction = "up";
} else if (rowChange === 1) {
    player.direction = "down";
} else if (colChange === -1) {
    player.direction = "left";
} else if (colChange === 1) {
    player.direction = "right";
}


    // ===============================
    // UPDATE DIRECTION
    // ===============================

    if (rowChange === -1) {

        player.direction = "up";

    } else if (rowChange === 1) {

        player.direction = "down";

    } else if (colChange === -1) {

        player.direction = "left";

    } else if (colChange === 1) {

        player.direction = "right";
    }


    // ===============================
    // START GAME
    // ===============================

    if (!gameStarted) {

        gameStarted = true;
    }

    moves++;


    // ===============================
    // PICK UP KEY
    // ===============================

    if (nextCell === "K") {

        hasKey = true;

        dungeon[newRow][newCol] = ".";
    }

    if (nextCell === "D") {
        hasPassedDoor = true;
    }


    // ===============================
    // TRAP
    // ===============================

    if (nextCell === "X") {

        trapTriggered = true;

        renderDungeon();

        setTimeout(() => {

            alert(
                "💀 You stepped on a trap!"
            );

            resetLevel();

        }, 200);

        return;
    }


    // ===============================
    // UPDATE SCREEN
    // ===============================

renderDungeon();
checkWin();

setTimeout(() => {
    player.isMoving = false;
    renderDungeon();
}, 350);
}