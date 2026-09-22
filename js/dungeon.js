// ===============================
// CHECK DUNGEON SOLVABILITY
// ===============================

function isDungeonSolvable(dungeon) {

    const rows = dungeon.length;
    const cols = dungeon[0].length;

    const dr = [-1, 1, 0, 0];
    const dc = [0, 0, -1, 1];

    /*
        visited[row][col][hasKey][passedDoor]

        We need to remember whether the
        player has the key and whether
        the player has passed through
        the door.
    */

    const visited =
        Array.from(
            { length: rows },
            () =>
                Array.from(
                    { length: cols },
                    () =>
                        Array.from(
                            { length: 2 },
                            () => [false, false]
                        )
                )
        );

    const queue = [
        [1, 1, false, false]
    ];

    visited[1][1][0][0] = true;


    while (queue.length > 0) {

        const [
            row,
            col,
            hasKey,
            passedDoor
        ] = queue.shift();


        // ===============================
        // WIN CONDITION
        // ===============================

        if (
            dungeon[row][col] === "T" &&
            hasKey &&
            passedDoor
        ) {
            return true;
        }


        // ===============================
        // FOUR DIRECTIONS
        // ===============================

        for (let i = 0; i < 4; i++) {

            const nextRow =
                row + dr[i];

            const nextCol =
                col + dc[i];


            // Outside dungeon

            if (
                nextRow < 0 ||
                nextRow >= rows ||
                nextCol < 0 ||
                nextCol >= cols
            ) {
                continue;
            }


            const nextCell =
                dungeon[nextRow][nextCol];


            // ===============================
            // WALL
            // ===============================

            if (nextCell === "W") {
                continue;
            }


            // ===============================
            // TRAP
            // ===============================

            if (nextCell === "X") {
                continue;
            }


            // ===============================
            // TREASURE
            // ===============================

            // Treasure cannot be reached
            // before passing through the door.

            if (
                nextCell === "T" &&
                !passedDoor
            ) {
                continue;
            }


            // ===============================
            // DOOR
            // ===============================

            // Door requires key.

            if (
                nextCell === "D" &&
                !hasKey
            ) {
                continue;
            }


            // ===============================
            // UPDATE STATE
            // ===============================

            const newHasKey =
                hasKey ||
                nextCell === "K";

            const newPassedDoor =
                passedDoor ||
                nextCell === "D";


            const keyState =
                newHasKey ? 1 : 0;

            const doorState =
                newPassedDoor ? 1 : 0;


            // Already visited with
            // the same state.

            if (
                visited[nextRow][nextCol]
                    [keyState]
                    [doorState]
            ) {
                continue;
            }


            visited[nextRow][nextCol]
                [keyState]
                [doorState] = true;


            queue.push([
                nextRow,
                nextCol,
                newHasKey,
                newPassedDoor
            ]);
        }
    }


    return false;
}


// ===============================
// DISTANCE
// ===============================

function getDistance(
    row1,
    col1,
    row2,
    col2
) {

    return (
        Math.abs(row1 - row2) +
        Math.abs(col1 - col2)
    );
}


// ===============================
// RANDOM FLOOR CELL
// ===============================

function getRandomFloorCell(
    dungeon,
    minRow,
    maxRow,
    minCol,
    maxCol,
    startRow = null,
    startCol = null,
    minDistance = 0
) {

    const candidates = [];


    for (
        let row = minRow;
        row <= maxRow;
        row++
    ) {

        for (
            let col = minCol;
            col <= maxCol;
            col++
        ) {

            if (
                dungeon[row][col] !== "."
            ) {
                continue;
            }


            // Distance requirement

            if (
                startRow !== null &&
                startCol !== null
            ) {

                const distance =
                    getDistance(
                        startRow,
                        startCol,
                        row,
                        col
                    );

                if (
                    distance < minDistance
                ) {
                    continue;
                }
            }


            candidates.push({
                row,
                col
            });
        }
    }


    if (
        candidates.length === 0
    ) {
        return null;
    }


    const randomIndex =
        Math.floor(
            Math.random() *
            candidates.length
        );


    return candidates[randomIndex];
}


// ===============================
// CREATE BASE DUNGEON
// ===============================

function createBaseDungeon(
    rows,
    cols,
    barrierCol,
    doorRow,
    wallChance
) {

    const dungeon = [];


    // ===============================
    // CREATE ALL FLOOR
    // ===============================

    for (
        let row = 0;
        row < rows;
        row++
    ) {

        dungeon[row] = [];

        for (
            let col = 0;
            col < cols;
            col++
        ) {

            // Outer border

            if (
                row === 0 ||
                row === rows - 1 ||
                col === 0 ||
                col === cols - 1
            ) {

                dungeon[row][col] = "W";

            } else {

                dungeon[row][col] = ".";
            }
        }
    }


    // ===============================
    // CENTRAL WALL
    // ===============================

    for (
        let row = 1;
        row < rows - 1;
        row++
    ) {

        dungeon[row][barrierCol] = "W";
    }


    // ===============================
    // ONE DOOR
    // ===============================

    dungeon[doorRow][barrierCol] =
        "D";


    // ===============================
    // GUARANTEED CORRIDOR
    // ===============================

    /*
        Left side corridor:

        Player → → → → Door

        Right side corridor:

        Door → → → → Treasure area

        These corridors make the basic
        dungeon structure reliable.
    */

    for (
        let col = 1;
        col < barrierCol;
        col++
    ) {

        dungeon[doorRow][col] = ".";
    }


    for (
        let col = barrierCol + 1;
        col < cols - 1;
        col++
    ) {

        dungeon[doorRow][col] = ".";
    }


    // ===============================
    // RANDOM INTERNAL WALLS
    // ===============================

    for (
        let row = 1;
        row < rows - 1;
        row++
    ) {

        for (
            let col = 1;
            col < cols - 1;
            col++
        ) {

            // Never touch central barrier

            if (
                col === barrierCol
            ) {
                continue;
            }


            // Never block the guaranteed
            // horizontal corridor.

            if (
                row === doorRow
            ) {
                continue;
            }


            if (
                Math.random() <
                wallChance
            ) {

                dungeon[row][col] = "W";
            }
        }
    }


    return dungeon;
}


// ===============================
// GENERATE DUNGEON
// ===============================

function generateDungeon(level) {

    let wallChance;
    let trapCount;


    // ===============================
    // DIFFICULTY
    // ===============================

    if (level === 0) {

        wallChance = 0.12;
        trapCount = 3;

    } else if (level === 1) {

        wallChance = 0.18;
        trapCount = 5;

    } else {

        wallChance = 0.23;
        trapCount = 7;
    }


    // ===============================
    // DUNGEON SIZE
    // ===============================

    const rows = 10;
    const cols = 10;


    // Central wall

    const barrierCol = 5;


    // Door in the wall

    const doorRow = 5;


    // ===============================
    // GENERATE UNTIL VALID
    // ===============================

    while (true) {

        const dungeon =
            createBaseDungeon(
                rows,
                cols,
                barrierCol,
                doorRow,
                wallChance
            );


        // ===============================
        // PLAYER START
        // ===============================

        dungeon[1][1] = ".";


        // ===============================
        // KEY
        // ===============================

        const keyPosition =
            getRandomFloorCell(
                dungeon,

                1,
                rows - 2,

                1,
                barrierCol - 1,

                1,
                1,

                4
            );


        if (!keyPosition) {
            continue;
        }


        dungeon[
            keyPosition.row
        ][
            keyPosition.col
        ] = "K";


        // ===============================
        // TREASURE
        // ===============================

        const treasurePosition =
            getRandomFloorCell(
                dungeon,

                1,
                rows - 2,

                barrierCol + 1,
                cols - 2,

                doorRow,
                barrierCol,

                3
            );


        if (!treasurePosition) {
            continue;
        }


        dungeon[
            treasurePosition.row
        ][
            treasurePosition.col
        ] = "T";


        // ===============================
        // TRAPS
        // ===============================

        let trapsPlaced = 0;
        let attempts = 0;

        const maxAttempts = 500;


        while (
            trapsPlaced < trapCount &&
            attempts < maxAttempts
        ) {

            attempts++;


            const row =
                Math.floor(
                    Math.random() *
                    (rows - 2)
                ) + 1;

            const col =
                Math.floor(
                    Math.random() *
                    (cols - 2)
                ) + 1;


            // Never trap the player.

            if (
                row === 1 &&
                col === 1
            ) {
                continue;
            }


            // Never trap the door.

            if (
                row === doorRow &&
                col === barrierCol
            ) {
                continue;
            }


            // Never replace important objects.

            if (
                dungeon[row][col] !== "."
            ) {
                continue;
            }


            dungeon[row][col] = "X";

            trapsPlaced++;
        }


        // Couldn't place all traps.

        if (
            trapsPlaced < trapCount
        ) {
            continue;
        }


        // ===============================
        // FINAL SOLVABILITY CHECK
        // ===============================

        if (
            isDungeonSolvable(
                dungeon
            )
        ) {

            return dungeon;
        }
    }
}