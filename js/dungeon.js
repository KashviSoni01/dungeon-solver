/* =========================================================
   DUNGEON GENERATION
   Real Maze + Key + Door + Treasure + Safe Traps + BFS
========================================================= */


/* =========================================================
   DIRECTIONS
========================================================= */

const MAZE_DIRECTIONS = [
    { row: -1, col: 0 },
    { row: 1, col: 0 },
    { row: 0, col: -1 },
    { row: 0, col: 1 }
];


/* =========================================================
   SHUFFLE
========================================================= */

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


/* =========================================================
   FIND PATH USING BFS
========================================================= */

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


        /*
            Target found.
        */

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


            /*
                Outside dungeon.
            */

            if (
                nextRow < 0 ||
                nextRow >= dungeon.length ||
                nextCol < 0 ||
                nextCol >= dungeon[0].length
            ) {
                continue;
            }


            /*
                Wall.
            */

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


/* =========================================================
   GENERATE PERFECT MAZE
========================================================= */

function generateMaze() {

    const rows = 10;
    const cols = 10;


    /*
        Start with every cell as a wall.

        # = wall
        . = floor
    */

    const dungeon =
        Array.from(
            { length: rows },
            () =>
                Array(cols).fill("#")
        );


    /*
        Maze cells exist at odd coordinates:

        (1,1)
        (1,3)
        (1,5)
        (1,7)

        (3,1)
        (3,3)
        etc.
    */

    const visited = new Set();


    function getKey(row, col) {
        return `${row},${col}`;
    }


    function carve(row, col) {

        visited.add(
            getKey(row, col)
        );


        /*
            Current maze cell becomes floor.
        */

        dungeon[row][col] = ".";


        /*
            Randomize directions.

            This makes every generated dungeon
            different.
        */

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
                row + direction.row;

            const nextCol =
                col + direction.col;


            /*
                Keep inside the maze.

                Valid maze cells:
                1, 3, 5, 7
            */

            if (
                nextRow < 1 ||
                nextRow > 7 ||
                nextCol < 1 ||
                nextCol > 7
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


            /*
                Remove the wall between
                current cell and next cell.
            */

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


            /*
                Continue carving.
            */

            carve(
                nextRow,
                nextCol
            );
        }
    }


    /*
        Start at player position.
    */

    carve(1, 1);


    return dungeon;
}


/* =========================================================
   FIND ALL REACHABLE CELLS
========================================================= */

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


/* =========================================================
   BFS SOLVABILITY CHECK
========================================================= */

function isDungeonSolvable(dungeon) {

    /*
        State:

        row
        col
        hasKey
        passedDoor
    */

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


        /*
            Pick up key.
        */

        if (
            currentCell === "K"
        ) {

            hasKey = true;
        }


        /*
            Door.

            The player cannot enter
            the door without the key.
        */

        if (
            currentCell === "D"
        ) {

            if (!hasKey) {
                continue;
            }


            passedDoor = true;
        }


        /*
            Treasure is only valid
            after:

            KEY + DOOR
        */

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


            /*
                Outside dungeon.
            */

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


            /*
                Wall.
            */

            if (
                nextCell === "#"
            ) {
                continue;
            }


            /*
                IMPORTANT:

                Traps are walkable during the
                actual game, but BFS treats them
                as blocked.

                Therefore BFS asks:

                "Is there a SAFE route?"
            */

            if (
                nextCell === "X"
            ) {
                continue;
            }


            /*
                Locked door.
            */

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


/* =========================================================
   PLACE OBJECTIVES ON A SINGLE SAFE PATH
========================================================= */

function placeObjectives(
    dungeon,
    path
) {

    /*
        We need a reasonably long path.

        Example:

        START
          ↓
          ↓
        KEY
          ↓
          ↓
        DOOR
          ↓
          ↓
        TREASURE
    */

    if (
        path.length < 12
    ) {
        return false;
    }


    /*
        Key around 30% of the route.
    */

    const keyIndex =
        Math.floor(
            path.length * 0.30
        );


    /*
        Door around 60%.
    */

    const doorIndex =
        Math.floor(
            path.length * 0.60
        );


    /*
        Treasure near the end.
    */

    const treasureIndex =
        Math.floor(
            path.length * 0.90
        );


    /*
        Make sure indices are properly
        separated.
    */

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


    /*
        Place the objects.
    */

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


/* =========================================================
   PLACE TRAPS
========================================================= */

function placeTraps(
    dungeon,
    safePath,
    trapCount
) {

    /*
        Convert safe path into a Set
        for quick lookup.
    */

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

            /*
                Only normal floor cells.
            */

            if (
                dungeon[row][col] !== "."
            ) {
                continue;
            }


            /*
                NEVER put a trap
                on the guaranteed route.
            */

            if (
                safePathSet.has(
                    `${row},${col}`
                )
            ) {
                continue;
            }


            /*
                Never put a trap
                on the starting cell.
            */

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


    /*
        Add requested number of traps.
    */

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


/* =========================================================
   MAIN DUNGEON GENERATOR
========================================================= */

function generateDungeon(
    level = 0
) {

    /*
        Different trap counts
        for different levels.
    */

    let trapCount;


    if (level === 0) {

        trapCount = 2;

    } else if (level === 1) {

        trapCount = 4;

    } else {

        trapCount = 6;
    }


    /*
        Try multiple random mazes.

        If one doesn't have a long enough
        route, generate another.
    */

    for (
        let attempt = 0;
        attempt < 500;
        attempt++
    ) {

        /*
            Generate a brand-new
            perfect maze.
        */

        const dungeon =
            generateMaze();


        const start = {
            row: 1,
            col: 1
        };


        /*
            Find all reachable cells.
        */

        const reachable =
            getReachableCells(
                dungeon,
                start
            );


        /*
            Find the farthest cell.

            Because this is a perfect maze,
            the path from start to this cell
            is unique.
        */

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


        /*
            Find the actual path from
            player to farthest cell.
        */

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


        /*
            Put:

            KEY
            DOOR
            TREASURE

            directly on this path.
        */

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


        /*
            Put traps ONLY away
            from the safe path.
        */

        placeTraps(
            dungeon,
            safePath,
            trapCount
        );


        /*
            Final BFS verification.

            This must return TRUE.

            If not, destroy this dungeon
            and generate another one.
        */

        if (
            isDungeonSolvable(
                dungeon
            )
        ) {

            return dungeon;
        }
    }


    /*
        This should almost never be reached,
        but provides a guaranteed valid
        dungeon if something goes wrong.
    */

    return createFallbackDungeon();
}


/* =========================================================
   GUARANTEED FALLBACK DUNGEON
========================================================= */

function createFallbackDungeon() {

    /*
        # = wall
        . = floor

        The route is:

        PLAYER
           ↓
           ↓
         KEY
           ↓
           ↓
         DOOR
           ↓
           ↓
       TREASURE
    */

    const dungeon = [

        [
            "#","#","#","#","#","#","#","#","#","#"
        ],

        [
            "#",".","#","#","#","#","#","#","#","#"
        ],

        [
            "#",".","#",".",".",".",".",".","#","#"
        ],

        [
            "#",".","#",".","#","#","#",".","#","#"
        ],

        [
            "#",".",".","K","#","D","#",".","#","#"
        ],

        [
            "#","#","#",".","#",".","#",".","#","#"
        ],

        [
            "#","#","#",".","#",".","#",".","#","#"
        ],

        [
            "#","#","#",".","#",".","#",".","#","#"
        ],

        [
            "#","#","#",".","#",".","#",".","T","#"
        ],

        [
            "#","#","#","#","#","#","#","#","#","#"
        ]

    ];


    /*
        Add traps away from the
        guaranteed route.
    */

    dungeon[2][4] = "X";

    dungeon[7][5] = "X";


    return dungeon;
}