// ===============================
// RENDER DUNGEON
// ===============================

function renderDungeon() {

    dungeonElement.innerHTML = "";

    const dungeon =
        dungeons[currentLevel];

    dungeon.forEach(
        (row, rowIndex) => {

            row.forEach(
                (cell, colIndex) => {

                    const cellElement =
                        document.createElement("div");


                    // ===============================
                    // WALL / FLOOR
                    // ===============================

                    if (cell === "W") {

                        cellElement.classList.add(
                            "wall"
                        );

                    } else {

                        cellElement.classList.add(
                            "floor"
                        );
                    }


                    // ===============================
                    // TREASURE
                    // ===============================

                    if (cell === "T") {

                        cellElement.classList.add(
                            "treasure"
                        );
                    }


                    // ===============================
                    // KEY
                    // ===============================

                    if (cell === "K") {

                        cellElement.classList.add(
                            "key"
                        );
                    }


                    // ===============================
                    // DOOR
                    // ===============================

                    if (cell === "D") {

                        cellElement.classList.add(
                            "door"
                        );
                    }


                    // ===============================
                    // TRAP
                    // ===============================

                    if (cell === "X") {

                        cellElement.classList.add(
                            "trap"
                        );
                    }


                    // ===============================
                    // PLAYER
                    // ===============================

                    if (
                        rowIndex === player.row &&
                        colIndex === player.col
                    ) {

                        const playerElement =
                            document.createElement("div");

                        playerElement.classList.add(
                            "player"
                        );


                        // ===============================
                        // SPRITE SHEET PLAYER
                        // ===============================

                        const sprite =
                            document.createElement("div");

                        sprite.classList.add(
                            "playerSprite",
                            `face-${player.direction}`
                        );


                        // Only animate while moving
                        if (
                            typeof isPlayerMoving !==
                            "undefined" &&
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


// ===============================
// UPDATE UI
// ===============================

function updateUI() {

    timerElement.textContent =
        formatTime(timer);

    movesElement.textContent =
        moves;

    levelElement.textContent =
        `${currentLevel + 1} / ${dungeons.length}`;
}


// ===============================
// FORMAT TIME
// ===============================

function formatTime(seconds) {

    const minutes =
        Math.floor(seconds / 60);

    const remainingSeconds =
        seconds % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0")
    );
}