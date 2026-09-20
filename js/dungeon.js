// ===============================
// DUNGEON GENERATION
// ===============================

function isDungeonSolvable(dungeon) {

    const rows = dungeon.length;
    const cols = dungeon[0].length;

    const dr = [-1, 1, 0, 0];
    const dc = [0, 0, -1, 1];

    /*
        visited[row][col][key][door]

        key:
        0 = no key
        1 = has key

        door:
        0 = door not passed
        1 = door passed
    */

    const visited = Array.from(
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

    /*
        BFS state:
        [row, col, hasKey, passedDoor]
    */

    const queue = [
        [player.row, player.col, false, false]
    ];

    visited[player.row][player.col][0][0] = true;

    while (queue.length > 0) {

        const [
            currR,
            currC,
            hasKey,
            passedDoor
        ] = queue.shift();

        if (
            dungeon[currR][currC] === "T" &&
            hasKey &&
            passedDoor
        ) {
            return true;
        }

        for (let i = 0; i < 4; i++) {

            const nextR =
                currR + dr[i];

            const nextC =
                currC + dc[i];

            if (
                nextR < 0 ||
                nextR >= rows ||
                nextC < 0 ||
                nextC >= cols
            ) {
                continue;
            }

            const nextCell =
                dungeon[nextR][nextC];

            // Wall
            if (nextCell === "W") {
                continue;
            }

            // Trap
            if (nextCell === "X") {
                continue;
            }

            // Door requires key
            if (
                nextCell === "D" &&
                !hasKey
            ) {
                continue;
            }

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

            if (
                visited[nextR][nextC]
                    [keyState]
                    [doorState]
            ) {
                continue;
            }

            visited[nextR][nextC]
                [keyState]
                [doorState] = true;

            queue.push([
                nextR,
                nextC,
                newHasKey,
                newPassedDoor
            ]);
        }
    }

    return false;
}


// ===============================
// GENERATE RANDOM DUNGEON
// ===============================

function generateDungeon() {

    while (true) {

        const dungeon = [];

        const rows = 6;
        const cols = 6;

        // Create dungeon grid
        for (let r = 0; r < rows; r++) {

            dungeon[r] = [];

            for (let c = 0; c < cols; c++) {

                // Outer boundary = wall
                if (
                    r === 0 ||
                    r === rows - 1 ||
                    c === 0 ||
                    c === cols - 1
                ) {

                    dungeon[r][c] = "W";

                } else {

                    // Random inner walls
                    if (
                        Math.random() < 0.25
                    ) {

                        dungeon[r][c] = "W";

                    } else {

                        dungeon[r][c] = ".";
                    }
                }
            }
        }

        // Important objects
        dungeon[1][1] = ".";
        dungeon[3][2] = "K";
        dungeon[4][3] = "D";
        dungeon[4][4] = "T";


        // ===============================
        // PLACE TRAPS
        // ===============================

        const trapCount = 2;

        let trapsPlaced = 0;

        while (
            trapsPlaced < trapCount
        ) {

            const r =
                Math.floor(
                    Math.random() * (rows - 2)
                ) + 1;

            const c =
                Math.floor(
                    Math.random() * (cols - 2)
                ) + 1;

            // Never put trap on player
            if (
                r === player.row &&
                c === player.col
            ) {
                continue;
            }

            // Only replace empty floor
            if (
                dungeon[r][c] === "."
            ) {

                dungeon[r][c] = "X";

                trapsPlaced++;
            }
        }


        // Only return dungeon
        // if it has a safe solution
        if (
            isDungeonSolvable(dungeon)
        ) {

            return dungeon;
        }
    }
}