

function renderDungeon() {

    dungeonElement.innerHTML = "";


    const dungeon =
        dungeons[currentLevel];


    dungeonElement.style.gridTemplateColumns =
        `repeat(${dungeon[0].length}, 1fr)`;


    dungeonElement.style.gridTemplateRows =
        `repeat(${dungeon.length}, 1fr)`;


    
    if (typeof hasKey !== "undefined" && hasKey) {
        dungeonElement.classList.add("keyPicked");
    } else {
        dungeonElement.classList.remove("keyPicked");
    }


    dungeon.forEach(
        (row, rowIndex) => {

            row.forEach(
                (cell, colIndex) => {

                    const cellElement =
                        document.createElement("div");


                    cellElement.classList.add(
                        "cell"
                    );


                    

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


                    

                    if (
                        cell === "K"
                    ) {

                        cellElement.classList.add(
                            "key"
                        );

                        const sprite =
                            document.createElement("div");

                        sprite.classList.add(
                            "keySprite"
                        );

                        cellElement.appendChild(
                            sprite
                        );
                    }


                    

                    if (
                        cell === "D"
                    ) {

                        cellElement.classList.add(
                            "door"
                        );

                        const sprite =
                            document.createElement("div");

                        sprite.classList.add(
                            "doorSprite"
                        );

                        cellElement.appendChild(
                            sprite
                        );
                    }


                    

                    if (
                        cell === "T"
                    ) {

                        cellElement.classList.add(
                            "treasure"
                        );

                        const sprite =
                            document.createElement("div");

                        sprite.classList.add(
                            "treasureSprite"
                        );

                        cellElement.appendChild(
                            sprite
                        );
                    }


                    

                    if (
                        cell === "X"
                    ) {

                        cellElement.classList.add(
                            "trap"
                        );

                        const sprite =
                            document.createElement("div");

                        sprite.classList.add(
                            "trapSprite"
                        );

                        cellElement.appendChild(
                            sprite
                        );
                    }


                    

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


                        const sprite =
                            document.createElement("div");

                        sprite.classList.add(
                            "enemySprite"
                        );

                        enemyElement.appendChild(
                            sprite
                        );


                        cellElement.appendChild(
                            enemyElement
                        );
                    }


                    

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


            if (unlocked) {
                card.classList.add(
                    "unlocked"
                );
            }
            else {
                card.classList.add(
                    "locked"
                );
            }


            card.innerHTML = `
                <span class="level-number">
                    LEVEL ${index + 1}
                </span>

                <span class="level-symbol" aria-hidden="true"></span>

                <div>
                    <h3>
                        ${level.name}
                    </h3>

                    <small>
                        Explore the dungeon
                    </small>

                    <span class="difficulty">
                        ${level.difficulty}
                    </span>
                </div>

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
