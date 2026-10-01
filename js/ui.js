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

                        const keySprite =
                            document.createElement("div");

                        keySprite.classList.add(
                            "keySprite"
                        );

                        cellElement.appendChild(
                            keySprite
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

                        if (
                            typeof hasKey !== "undefined" &&
                            hasKey
                        ) {
                            cellElement.classList.add(
                                "keyPicked"
                            );
                        }

                        const doorSprite =
                            document.createElement("div");

                        doorSprite.classList.add(
                            "doorSprite"
                        );

                        cellElement.appendChild(
                            doorSprite
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

                        const treasureSprite =
                            document.createElement("div");

                        treasureSprite.classList.add(
                            "treasureSprite"
                        );

                        cellElement.appendChild(
                            treasureSprite
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

                        const trapSprite =
                            document.createElement("div");

                        trapSprite.classList.add(
                            "trapSprite"
                        );

                        cellElement.appendChild(
                            trapSprite
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


                        const enemySprite =
                            document.createElement("div");

                        enemySprite.classList.add(
                            "enemySprite"
                        );

                        enemyElement.appendChild(
                            enemySprite
                        );


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
                "level-card"
            );


            const unlocked =
                index <=
                highestUnlockedLevel;


            if (!unlocked) {

                card.classList.add(
                    "locked"
                );
            } else {
                card.classList.add("unlocked");
            }


            card.innerHTML = `
                <span class="level-number">
                    LEVEL ${index + 1}
                </span>

                <div class="level-symbol"></div>

                <h3>
                    ${level.name}
                </h3>

                <small>
                    ${level.difficulty === "EASY" ? "Perfect for beginners" : level.difficulty === "MEDIUM" ? "Watch your step" : "True challenge awaits"}
                </small>

                <span class="difficulty">
                    ${level.difficulty}
                </span>

                <span class="level-status">
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
