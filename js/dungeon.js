




const MAZE_DIRECTIONS = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 }
];




function shuffle(array) {

    const result = [...array];

    for (let i = result.length - 1; i > 0; i--) {

        const j =
            Math.floor(Math.random() * (i + 1));

        [result[i], result[j]] =
            [result[j], result[i]];
    }

    return result;
}




function findPath(dungeon, start, target) {

    const queue = [
        {
            row: start.row,
            col: start.col
        }
    ];

    const visited = new Set();
    const previous = new Map();

    const startKey =
        `${start.row},${start.col}`;

    visited.add(startKey);


    while (queue.length > 0) {

        const current = queue.shift();

        const currentKey =
            `${current.row},${current.col}`;


        if (
            current.row === target.row &&
            current.col === target.col
        ) {

            const path = [];

            let key = currentKey;


            while (key) {

                const [
                    row,
                    col
                ] =
                    key
                        .split(",")
                        .map(Number);


                path.push({
                    row,
                    col
                });


                key =
                    previous.get(key);
            }


            return path.reverse();
        }


        for (
            const direction
            of MAZE_DIRECTIONS
        ) {

            const nextRow =
                current.row +
                direction.row;

            const nextCol =
                current.col +
                direction.col;


            if (
                nextRow < 0 ||
                nextRow >= dungeon.length ||
                nextCol < 0 ||
                nextCol >= dungeon[0].length
            ) {
                continue;
            }


            if (
                dungeon[nextRow][nextCol] === "#"
            ) {
                continue;
            }


            const nextKey =
                `${nextRow},${nextCol}`;


            if (
                visited.has(nextKey)
            ) {
                continue;
            }


            visited.add(nextKey);


            previous.set(
                nextKey,
                currentKey
            );


            queue.push({
                row: nextRow,
                col: nextCol
            });
        }
    }


    return null;
}




function generateMaze(level = 0) {

    let rows;
    let cols;


    

    if (level === 0) {

        rows = 15;
        cols = 15;

    }
    else if (level === 1) {

        rows = 17;
        cols = 17;

    }
    else {

        rows = 21;
        cols = 21;
    }


    

    const dungeon =
        Array.from(
            { length: rows },
            () =>
                Array(cols).fill("#")
        );


    const visited = new Set();


    function getKey(row, col) {

        return `${row},${col}`;
    }


    function carve(row, col) {

        visited.add(
            getKey(row, col)
        );


        dungeon[row][col] = ".";


        

        const directions =
            shuffle([
                { row: -2, col: 0 },
                { row: 2, col: 0 },
                { row: 0, col: -2 },
                { row: 0, col: 2 }
            ]);


        for (
            const direction
            of directions
        ) {

            const nextRow =
                row +
                direction.row;

            const nextCol =
                col +
                direction.col;


            

            if (
                nextRow < 1 ||
                nextRow >= rows - 1 ||
                nextCol < 1 ||
                nextCol >= cols - 1
            ) {
                continue;
            }


            const nextKey =
                getKey(
                    nextRow,
                    nextCol
                );


            if (
                visited.has(nextKey)
            ) {
                continue;
            }


            

            const wallRow =
                row +
                direction.row / 2;

            const wallCol =
                col +
                direction.col / 2;


            dungeon[
                wallRow
            ][
                wallCol
            ] = ".";


            carve(
                nextRow,
                nextCol
            );
        }
    }


    

    carve(1, 1);


    

    const loopChance =
        level === 0
            ? 0.08
            : level === 1
                ? 0.10
                : 0.12;


    const possibleOpenings = [];


    

    for (
        let row = 1;
        row < rows - 1;
        row++
    ) {

        for (
            let col = 2;
            col < cols - 1;
            col += 2
        ) {

            if (
                dungeon[row][col] === "#" &&
                dungeon[row][col - 1] === "." &&
                dungeon[row][col + 1] === "."
            ) {

                possibleOpenings.push({
                    row,
                    col
                });
            }
        }
    }


    

    for (
        let row = 2;
        row < rows - 1;
        row += 2
    ) {

        for (
            let col = 1;
            col < cols - 1;
            col++
        ) {

            if (
                dungeon[row][col] === "#" &&
                dungeon[row - 1][col] === "." &&
                dungeon[row + 1][col] === "."
            ) {

                possibleOpenings.push({
                    row,
                    col
                });
            }
        }
    }


    

    const shuffledOpenings =
        shuffle(possibleOpenings);


    const openingCount =
        Math.max(
            2,
            Math.floor(
                shuffledOpenings.length *
                loopChance
            )
        );


    for (
        let i = 0;
        i < openingCount &&
        i < shuffledOpenings.length;
        i++
    ) {

        const opening =
            shuffledOpenings[i];


        dungeon[
            opening.row
        ][
            opening.col
        ] = ".";
    }


    return dungeon;
}




function getReachableCells(
    dungeon,
    start
) {

    const queue = [
        {
            row: start.row,
            col: start.col,
            distance: 0
        }
    ];

    const visited = new Set();

    const startKey =
        `${start.row},${start.col}`;

    visited.add(startKey);

    const cells = [];


    while (queue.length > 0) {

        const current =
            queue.shift();


        cells.push(current);


        for (
            const direction
            of MAZE_DIRECTIONS
        ) {

            const nextRow =
                current.row +
                direction.row;

            const nextCol =
                current.col +
                direction.col;


            if (
                nextRow < 0 ||
                nextRow >= dungeon.length ||
                nextCol < 0 ||
                nextCol >= dungeon[0].length
            ) {
                continue;
            }


            if (
                dungeon[nextRow][nextCol] === "#"
            ) {
                continue;
            }


            const nextKey =
                `${nextRow},${nextCol}`;


            if (
                visited.has(nextKey)
            ) {
                continue;
            }


            visited.add(nextKey);


            queue.push({
                row: nextRow,
                col: nextCol,
                distance:
                    current.distance + 1
            });
        }
    }


    return cells;
}




function isDungeonSolvable(dungeon) {

    const queue = [
        {
            row: 1,
            col: 1,
            hasKey: false,
            passedDoor: false
        }
    ];


    const visited = new Set();


    while (queue.length > 0) {

        const state =
            queue.shift();


        const stateKey =
            `${state.row},${state.col},` +
            `${state.hasKey},${state.passedDoor}`;


        if (
            visited.has(stateKey)
        ) {
            continue;
        }


        visited.add(stateKey);


        let hasKey =
            state.hasKey;

        let passedDoor =
            state.passedDoor;


        const currentCell =
            dungeon[
                state.row
            ][
                state.col
            ];


        

        if (
            currentCell === "K"
        ) {

            hasKey = true;
        }


        

        if (
            currentCell === "D"
        ) {

            if (!hasKey) {
                continue;
            }


            passedDoor = true;
        }


        

        if (
            currentCell === "T" &&
            hasKey &&
            passedDoor
        ) {

            return true;
        }


        for (
            const direction
            of MAZE_DIRECTIONS
        ) {

            const nextRow =
                state.row +
                direction.row;

            const nextCol =
                state.col +
                direction.col;


            if (
                nextRow < 0 ||
                nextRow >= dungeon.length ||
                nextCol < 0 ||
                nextCol >= dungeon[0].length
            ) {
                continue;
            }


            const nextCell =
                dungeon[
                    nextRow
                ][
                    nextCol
                ];


            if (
                nextCell === "#"
            ) {
                continue;
            }


            

            if (
                nextCell === "X"
            ) {
                continue;
            }


            

            if (
                nextCell === "D" &&
                !hasKey
            ) {
                continue;
            }


            queue.push({
                row: nextRow,
                col: nextCol,
                hasKey,
                passedDoor
            });
        }
    }


    return false;
}




function placeObjectives(
    dungeon,
    path
) {

    if (
        path.length < 12
    ) {
        return false;
    }


    

    const keyIndex =
        Math.floor(
            path.length * 0.30
        );


    

    const doorIndex =
        Math.floor(
            path.length * 0.60
        );


    

    const treasureIndex =
        Math.floor(
            path.length * 0.90
        );


    if (
        keyIndex <= 0 ||
        doorIndex <= keyIndex ||
        treasureIndex <= doorIndex
    ) {
        return false;
    }


    const key =
        path[keyIndex];

    const door =
        path[doorIndex];

    const treasure =
        path[treasureIndex];


    dungeon[
        key.row
    ][
        key.col
    ] = "K";


    dungeon[
        door.row
    ][
        door.col
    ] = "D";


    dungeon[
        treasure.row
    ][
        treasure.col
    ] = "T";


    return {
        key,
        door,
        treasure
    };
}




function placeTraps(
    dungeon,
    safePath,
    trapCount
) {

    const safePathSet =
        new Set(
            safePath.map(
                cell =>
                    `${cell.row},${cell.col}`
            )
        );


    const candidates = [];


    for (
        let row = 1;
        row < dungeon.length - 1;
        row++
    ) {

        for (
            let col = 1;
            col < dungeon[0].length - 1;
            col++
        ) {

            if (
                dungeon[row][col] !== "."
            ) {
                continue;
            }


            

            if (
                safePathSet.has(
                    `${row},${col}`
                )
            ) {
                continue;
            }


            

            if (
                row === 1 &&
                col === 1
            ) {
                continue;
            }


            candidates.push({
                row,
                col
            });
        }
    }


    const shuffled =
        shuffle(candidates);


    for (
        let i = 0;
        i < trapCount &&
        i < shuffled.length;
        i++
    ) {

        const trap =
            shuffled[i];


        dungeon[
            trap.row
        ][
            trap.col
        ] = "X";
    }
}




function generateDungeon(
    level = 0
) {

    

    let trapCount;


    if (level === 0) {

        trapCount = 2;

    }
    else if (level === 1) {

        trapCount = 4;

    }
    else {

        trapCount = 6;
    }


    

    for (
        let attempt = 0;
        attempt < 500;
        attempt++
    ) {

        const dungeon =
            generateMaze(level);


        const start = {
            row: 1,
            col: 1
        };


        

        const reachable =
            getReachableCells(
                dungeon,
                start
            );


        

        reachable.sort(
            (a, b) =>
                b.distance -
                a.distance
        );


        const farthest =
            reachable[0];


        if (
            !farthest ||
            farthest.distance < 12
        ) {
            continue;
        }


        

        const safePath =
            findPath(
                dungeon,
                start,
                farthest
            );


        if (
            !safePath
        ) {
            continue;
        }


        

        const objectives =
            placeObjectives(
                dungeon,
                safePath
            );


        if (
            !objectives
        ) {
            continue;
        }


        

        placeTraps(
            dungeon,
            safePath,
            trapCount
        );


        

        if (
            isDungeonSolvable(
                dungeon
            )
        ) {

            return dungeon;
        }
    }


    

    const fallbackDungeon =
        createFallbackDungeon(level);

    return isDungeonSolvable(fallbackDungeon)
        ? fallbackDungeon
        : createGuaranteedFallbackDungeon(level);
}




function createFallbackDungeon(
    level = 0
) {

    let size;


    if (level === 0) {

        size = 15;

    }
    else if (level === 1) {

        size = 17;

    }
    else {

        size = 21;
    }


    const dungeon =
        Array.from(
            { length: size },
            () =>
                Array(size).fill("#")
        );


    

    for (
        let row = 1;
        row < size - 1;
        row++
    ) {

        dungeon[row][1] = ".";
    }


    for (
        let col = 1;
        col < size - 1;
        col++
    ) {

        dungeon[size - 2][col] = ".";
    }


    

    for (
        let row = 3;
        row < size - 3;
        row += 4
    ) {

        for (
            let col = 1;
            col < size - 3;
            col += 2
        ) {

            dungeon[row][col] = ".";
        }
    }


    

    const keyRow =
        Math.floor(size * 0.30);

    const doorRow =
        Math.floor(size * 0.55);


    dungeon[keyRow][1] = "K";

    dungeon[doorRow][1] = "D";

    dungeon[size - 2][size - 2] = "T";


    

    if (level === 2) {

        const safePath = [];

        for (
            let row = 1;
            row < size - 1;
            row++
        ) {
            safePath.push({ row, col: 1 });
        }

        for (
            let col = 2;
            col < size - 1;
            col++
        ) {
            safePath.push({ row: size - 2, col });
        }

        placeTraps(dungeon, safePath, 6);

    } else {

        dungeon[2][3] = "X";

        dungeon[4][5] = "X";
    }


    return dungeon;
}


function createGuaranteedFallbackDungeon(level = 0) {

    const size =
        level === 0
            ? 15
            : level === 1
                ? 17
                : 21;

    const dungeon =
        Array.from(
            { length: size },
            (_, row) =>
                Array.from(
                    { length: size },
                    (_, col) =>
                        row > 0 &&
                        row < size - 1 &&
                        col > 0 &&
                        col < size - 1
                            ? "."
                            : "#"
                )
        );

    const key = { row: 1, col: 3 };
    const door = { row: 1, col: 6 };
    const treasure = {
        row: size - 2,
        col: size - 2
    };

    dungeon[key.row][key.col] = "K";
    dungeon[door.row][door.col] = "D";
    dungeon[treasure.row][treasure.col] = "T";

    const safePath = [];

    for (let col = 1; col <= door.col; col++) {
        safePath.push({ row: 1, col });
    }

    for (let row = 2; row <= treasure.row; row++) {
        safePath.push({ row, col: door.col });
    }

    for (
        let col = door.col + 1;
        col <= treasure.col;
        col++
    ) {
        safePath.push({ row: treasure.row, col });
    }

    const trapCount =
        level === 0
            ? 2
            : level === 1
                ? 4
                : 6;

    placeTraps(dungeon, safePath, trapCount);

    return dungeon;
}