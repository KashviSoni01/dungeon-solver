
let enemy = null;
let keyEnemy = null;

const enemySettings = {
    patrolInterval: 700
};







function initializeEnemy(level) {

    stopEnemy();

    enemy = null;
    keyEnemy = null;

    // Preserve the original Level 2 Treasure Guardian.
    if (level === 1) {
        createTreasureGuard();
        return;
    }

    // Add both guardians on Level 3.
    if (level === 2) {
        createTreasureGuard();
        createKeyGuard();
    }
}






function createTreasureGuard() {

    const dungeon =
        dungeons[currentLevel];

    if (!dungeon) {
        return;
    }

    const solutionPath =
        findSafeSolutionPath(dungeon);

    if (!solutionPath) {
        return;
    }

    const patrolPath =
        buildGuardPatrol(
            dungeon,
            solutionPath
        );

    if (
        patrolPath.length < 2
    ) {
        return;
    }

    enemy = {

        row:
            patrolPath[0].row,

        col:
            patrolPath[0].col,

        path:
            patrolPath,

        pathIndex: 0,

        direction: 1,

        interval: null,

        collisionPending: false
    };

    startEnemyPatrol();
}





function createKeyGuard() {

    const dungeon =
        dungeons[currentLevel];

    if (!dungeon) {
        return;
    }

    const solutionPath =
        findSafeSolutionPath(dungeon);

    if (!solutionPath) {
        return;
    }

    const patrolPath =
        buildGuardPatrol(
            dungeon,
            solutionPath,
            "K"
        );

    if (
        patrolPath.length < 2
    ) {
        return;
    }

    keyEnemy = {

        row:
            patrolPath[0].row,

        col:
            patrolPath[0].col,

        path:
            patrolPath,

        pathIndex: 0,

        direction: 1,

        interval: null,

        collisionPending: false
    };

    startKeyEnemyPatrol();
}






function findSafeSolutionPath(dungeon) {

    const start = {
        row: 1,
        col: 1
    };

    const startKey =
        stateKey(
            start.row,
            start.col,
            false,
            false
        );

    const queue = [
        {
            row: start.row,
            col: start.col,
            hasKey: false,
            passedDoor: false
        }
    ];

    const visited =
        new Set([
            startKey
        ]);

    const previous =
        new Map();

    const states =
        new Map([
            [startKey, queue[0]]
        ]);

    let goalKey = null;

    for (
        let index = 0;
        index < queue.length;
        index++
    ) {

        const current =
            queue[index];

        const cell =
            dungeon[
                current.row
            ][
                current.col
            ];

        const hasKey =
            current.hasKey ||
            cell === "K";

        const passedDoor =
            current.passedDoor ||
            cell === "D";

        const currentKey =
            stateKey(
                current.row,
                current.col,
                hasKey,
                passedDoor
            );

        if (
            cell === "T" &&
            hasKey &&
            passedDoor
        ) {

            goalKey =
                currentKey;

            break;
        }

        const directions = [

            {
                row: -1,
                col: 0
            },

            {
                row: 1,
                col: 0
            },

            {
                row: 0,
                col: -1
            },

            {
                row: 0,
                col: 1
            }

        ];

        for (
            const direction
            of directions
        ) {

            const row =
                current.row +
                direction.row;

            const col =
                current.col +
                direction.col;

            if (
                row < 0 ||
                row >= dungeon.length ||
                col < 0 ||
                col >= dungeon[row].length
            ) {
                continue;
            }

            const nextCell =
                dungeon[row][col];

            if (
                nextCell === "#" ||
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

            const nextHasKey =
                hasKey ||
                nextCell === "K";

            const nextPassedDoor =
                passedDoor ||
                nextCell === "D";

            const nextKey =
                stateKey(
                    row,
                    col,
                    nextHasKey,
                    nextPassedDoor
                );

            if (
                visited.has(nextKey)
            ) {
                continue;
            }

            visited.add(
                nextKey
            );

            previous.set(
                nextKey,
                currentKey
            );

            const nextState = {

                row,
                col,

                hasKey:
                    nextHasKey,

                passedDoor:
                    nextPassedDoor
            };

            states.set(
                nextKey,
                nextState
            );

            queue.push(
                nextState
            );
        }
    }

    if (!goalKey) {
        return null;
    }

    const path = [];

    let key =
        goalKey;

    while (key) {

        const state =
            states.get(key);

        path.push({

            row:
                state.row,

            col:
                state.col
        });

        key =
            previous.get(key);
    }

    return path.reverse();
}






function stateKey(
    row,
    col,
    hasKey,
    passedDoor
) {

    return (
        `${row},${col},${hasKey},${passedDoor}`
    );
}






function buildGuardPatrol(
    dungeon,
    solutionPath,
    objectiveSymbol = "T"
) {

    const treasureIndex =
        solutionPath.findIndex(
            cell =>
                dungeon[
                    cell.row
                ][
                    cell.col
                ] === objectiveSymbol
        );

    if (
        treasureIndex < 1
    ) {
        return [];
    }

    const patrolCells = new Map();

    const startIndex =
        Math.max(
            1,
            treasureIndex - 4
        );

    for (
        let index = startIndex;
        index <= treasureIndex;
        index++
    ) {

        const cell =
            solutionPath[index];

        const key =
            `${cell.row},${cell.col}`;

        patrolCells.set(
            key,
            {
                row: cell.row,
                col: cell.col
            }
        );
    }

    const treasure =
        solutionPath[
            treasureIndex
        ];

    const searchRadius = 2;

    for (
        let row = 1;
        row < dungeon.length - 1;
        row++
    ) {

        for (
            let col = 1;
            col < dungeon[row].length - 1;
            col++
        ) {

            if (
                dungeon[row][col] !== "."
            ) {
                continue;
            }

            const distance =
                Math.abs(
                    row -
                    treasure.row
                ) +
                Math.abs(
                    col -
                    treasure.col
                );

            if (
                distance > searchRadius
            ) {
                continue;
            }

            const key =
                `${row},${col}`;

            patrolCells.set(
                key,
                {
                    row,
                    col
                }
            );
        }
    }

    const candidates =
        [...patrolCells.values()];

    const patrolPath =
        findConnectedPatrol(
            dungeon,
            candidates,
            solutionPath,
            treasure
        );

    return patrolPath;
}






function findConnectedPatrol(
    dungeon,
    candidates,
    solutionPath,
    treasure
) {

    if (
        candidates.length < 2
    ) {
        return [];
    }

    const candidateKeys =
        new Set(
            candidates.map(
                cell =>
                    `${cell.row},${cell.col}`
            )
        );

    const orderedCandidates =
        [...candidates].sort(
            (a, b) => {

                const distanceA =
                    Math.abs(
                        a.row -
                        treasure.row
                    ) +
                    Math.abs(
                        a.col -
                        treasure.col
                    );

                const distanceB =
                    Math.abs(
                        b.row -
                        treasure.row
                    ) +
                    Math.abs(
                        b.col -
                        treasure.col
                    );

                return (
                    distanceA -
                    distanceB
                );
            }
        );

    let bestPath = [];

    for (
        const start
        of orderedCandidates
    ) {

        const path = [
            start
        ];

        const used =
            new Set([
                `${start.row},${start.col}`
            ]);

        function extendPath() {

            if (
                path.length >
                bestPath.length
            ) {

                bestPath =
                    [...path];
            }

            if (
                path.length >= 8
            ) {
                return;
            }

            const current =
                path[
                    path.length - 1
                ];

            const directions = [

                {
                    row: -1,
                    col: 0
                },

                {
                    row: 1,
                    col: 0
                },

                {
                    row: 0,
                    col: -1
                },

                {
                    row: 0,
                    col: 1
                }

            ];

            const neighbors =
                directions
                    .map(
                        direction => ({

                            row:
                                current.row +
                                direction.row,

                            col:
                                current.col +
                                direction.col
                        })
                    )
                    .filter(
                        cell => {

                            const key =
                                `${cell.row},${cell.col}`;

                            return (
                                candidateKeys.has(
                                    key
                                ) &&
                                !used.has(
                                    key
                                )
                            );
                        }
                    );

            for (
                const next
                of shuffleEnemyCandidates(
                    neighbors
                )
            ) {

                const key =
                    `${next.row},${next.col}`;

                used.add(key);

                path.push(next);

                extendPath();

                path.pop();

                used.delete(key);

                if (
                    bestPath.length >= 8
                ) {
                    return;
                }
            }
        }

        extendPath();

        if (
            bestPath.length >= 8
        ) {
            break;
        }
    }

    if (
        bestPath.length < 2
    ) {
        return [];
    }

    return bestPath;
}






function shuffleEnemyCandidates(
    candidates
) {

    const shuffled =
        [...candidates];

    for (
        let index =
            shuffled.length - 1;
        index > 0;
        index--
    ) {

        const swapIndex =
            Math.floor(
                Math.random() *
                (index + 1)
            );

        [
            shuffled[index],
            shuffled[swapIndex]
        ] = [
            shuffled[swapIndex],
            shuffled[index]
        ];
    }

    return shuffled;
}






function startEnemyPatrol() {

    if (!enemy) {
        return;
    }

    stopEnemy();

    enemy.interval =
        setInterval(
            () => {

                if (
                    (
                        typeof gamePaused !==
                        "undefined" &&
                        gamePaused
                    ) ||
                    (
                        typeof gameWon !==
                        "undefined" &&
                        gameWon
                    )
                ) {
                    return;
                }

                movePatrolEnemy();

            },

            enemySettings.patrolInterval
        );
}






function movePatrolEnemy() {

    if (
        !enemy ||
        !enemy.path ||
        enemy.path.length < 2
    ) {
        return;
    }

    if (
        checkEnemyCollision()
    ) {
        return;
    }

    enemy.pathIndex +=
        enemy.direction;

    if (
        enemy.pathIndex >=
        enemy.path.length
    ) {

        enemy.direction = -1;

        enemy.pathIndex =
            enemy.path.length - 2;
    }

    if (
        enemy.pathIndex < 0
    ) {

        enemy.direction = 1;

        enemy.pathIndex = 1;
    }

    const next =
        enemy.path[
            enemy.pathIndex
        ];

    if (!next) {
        return;
    }

    enemy.row =
        next.row;

    enemy.col =
        next.col;

    checkEnemyCollision();

    renderDungeon();
}






function startKeyEnemyPatrol() {

    if (!keyEnemy) {
        return;
    }

    keyEnemy.interval =
        setInterval(
            () => {

                if (
                    (
                        typeof gamePaused !==
                        "undefined" &&
                        gamePaused
                    ) ||
                    (
                        typeof gameWon !==
                        "undefined" &&
                        gameWon
                    )
                ) {
                    return;
                }

                moveKeyPatrolEnemy();

            },

            enemySettings.patrolInterval
        );
}






function moveKeyPatrolEnemy() {

    if (
        !keyEnemy ||
        !keyEnemy.path ||
        keyEnemy.path.length < 2
    ) {
        return;
    }

    if (
        checkKeyEnemyCollision()
    ) {
        return;
    }

    keyEnemy.pathIndex +=
        keyEnemy.direction;

    if (
        keyEnemy.pathIndex >=
        keyEnemy.path.length
    ) {

        keyEnemy.direction = -1;

        keyEnemy.pathIndex =
            keyEnemy.path.length - 2;
    }

    if (
        keyEnemy.pathIndex < 0
    ) {

        keyEnemy.direction = 1;

        keyEnemy.pathIndex = 1;
    }

    const next =
        keyEnemy.path[
            keyEnemy.pathIndex
        ];

    if (!next) {
        return;
    }

    keyEnemy.row =
        next.row;

    keyEnemy.col =
        next.col;

    checkKeyEnemyCollision();

    renderDungeon();
}






function checkKeyEnemyCollision() {

    if (
        !keyEnemy
    ) {
        return false;
    }

    if (
        keyEnemy.collisionPending
    ) {
        return false;
    }

    if (
        keyEnemy.row !== player.row ||
        keyEnemy.col !== player.col
    ) {
        return false;
    }

    keyEnemy.collisionPending = true;

    stopEnemy();

    setTimeout(
        () => {

            alert(
                "The guard caught you!"
            );

            resetLevel();

        },

        100
    );

    return true;
}






function checkEnemyCollision() {

    if (
        !enemy
    ) {
        return false;
    }

    if (
        enemy.collisionPending
    ) {
        return false;
    }

    if (
        enemy.row !== player.row ||
        enemy.col !== player.col
    ) {
        return false;
    }

    enemy.collisionPending =
        true;

    stopEnemy();

    setTimeout(
        () => {

            alert(
                "The guard caught you!"
            );

            resetLevel();

        },

        100
    );

    return true;
}






function stopEnemy() {

    if (
        enemy &&
        enemy.interval
    ) {

        clearInterval(
            enemy.interval
        );

        enemy.interval =
            null;
    }

    if (
        keyEnemy &&
        keyEnemy.interval
    ) {

        clearInterval(
            keyEnemy.interval
        );

        keyEnemy.interval =
            null;
    }
}






function getEnemyAt(
    row,
    col
) {

    return Boolean(

        (
            enemy &&
            enemy.row === row &&
            enemy.col === col
        ) ||

        (
            keyEnemy &&
            keyEnemy.row === row &&
            keyEnemy.col === col
        )

    );
}