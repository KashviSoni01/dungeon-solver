/* =========================================================
   RENDER DUNGEON
========================================================= */

function renderDungeon() {

    dungeonElement.innerHTML = "";


    const dungeon =
        dungeons[currentLevel];


    dungeonElement.style.gridTemplateColumns =
        `repeat(${dungeon[0].length}, 1fr)`;


    dungeonElement.style.gridTemplateRows =
        `repeat(${dungeon.length}, 1fr)`;


    dungeon.forEach(
        (row, rowIndex) => {

            row.forEach(
                (cell, colIndex) => {

                    const cellElement =
                        document.createElement("div");


                    cellElement.classList.add(
                        "cell"
                    );


                    /* =====================================
                       WALL / FLOOR
                    ===================================== */

                    if (
                        cell === "#"
                    ) {

                        cellElement.classList.add(
                            "wall"
                        );

                    }
                    else {

                        cellElement.classList.add(
                            "floor"
                        );
                    }


                    /* =====================================
                       KEY
                    ===================================== */

                    if (
                        cell === "K"
                    ) {

                        cellElement.classList.add(
                            "key"
                        );
                    }


                    /* =====================================
                       DOOR
                    ===================================== */

                    if (
                        cell === "D"
                    ) {

                        cellElement.classList.add(
                            "door"
                        );
                    }


                    /* =====================================
                       TREASURE
                    ===================================== */

                    if (
                        cell === "T"
                    ) {

                        cellElement.classList.add(
                            "treasure"
                        );
                    }


                    /* =====================================
                       TRAP
                    ===================================== */

                    if (
                        cell === "X"
                    ) {

                        cellElement.classList.add(
                            "trap"
                        );
                    }


                    /* =====================================
                       ENEMY
                    ===================================== */

                    if (
                        typeof getEnemyAt === "function" &&
                        getEnemyAt(
                            rowIndex,
                            colIndex
                        )
                    ) {

                        const enemyElement =
                            document.createElement("div");


                        enemyElement.classList.add(
                            "enemy"
                        );


                        enemyElement.textContent =
                            "👹";


                        cellElement.appendChild(
                            enemyElement
                        );
                    }


                    /* =====================================
                       PLAYER
                    ===================================== */

                    if (
                        rowIndex === player.row &&
                        colIndex === player.col
                    ) {

                        const playerElement =
                            document.createElement(
                                "div"
                            );


                        playerElement.classList.add(
                            "player"
                        );


                        const sprite =
                            document.createElement(
                                "div"
                            );


                        sprite.classList.add(
                            "playerSprite",
                            `face-${player.direction}`
                        );


                        if (
                            isPlayerMoving
                        ) {

                            sprite.classList.add(
                                "walking"
                            );
                        }


                        playerElement.appendChild(
                            sprite
                        );


                        cellElement.appendChild(
                            playerElement
                        );
                    }


                    dungeonElement.appendChild(
                        cellElement
                    );
                }
            );
        }
    );


    updateUI();
}


/* =========================================================
   UPDATE UI
========================================================= */

function updateUI() {

    if (
        timerElement
    ) {

        timerElement.textContent =
            formatTime(timer);
    }


    if (
        movesElement
    ) {

        movesElement.textContent =
            moves;
    }


    if (
        levelElement
    ) {

        levelElement.textContent =
            `${currentLevel + 1} / ${dungeons.length}`;
    }


    if (
        levelNameElement
    ) {

        levelNameElement.textContent =
            levels[currentLevel].name;
    }


    if (
        levelDifficultyElement
    ) {

        levelDifficultyElement.textContent =
            levels[currentLevel].difficulty;
    }
}


/* =========================================================
   FORMAT TIME
========================================================= */

function formatTime(seconds) {

    const minutes =
        Math.floor(
            seconds / 60
        );


    const remainingSeconds =
        seconds % 60;


    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0")
    );
}


/* =========================================================
   LEVEL SELECT
========================================================= */

function renderLevelSelect() {

    if (!levelList) {
        return;
    }


    levelList.innerHTML = "";


    levels.forEach(
        (level, index) => {

            const card =
                document.createElement(
                    "button"
                );


            card.classList.add(
                "levelCard"
            );


            const unlocked =
                index <=
                highestUnlockedLevel;


            if (!unlocked) {

                card.classList.add(
                    "locked"
                );
            }


            card.innerHTML = `
                <span class="levelNumber">
                    ${index + 1}
                </span>

                <span class="levelInfo">
                    <strong>
                        ${level.name}
                    </strong>

                    <small>
                        ${level.difficulty}
                    </small>
                </span>

                <span class="levelStatus">
                    ${unlocked ? "PLAY" : "LOCKED"}
                </span>
            `;


            if (
                unlocked
            ) {

                card.addEventListener(
                    "click",
                    () => {

                        selectLevel(index);

                    }
                );
            }


            levelList.appendChild(
                card
            );
        }
    );
}