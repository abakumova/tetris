let main = document.querySelector(".main");
let gameSpeed = 400;

const scoreElement = document.getElementById("score-value");
let score = 0;
let isPaused = false;
let gameTimerID;
let pauseButton = document.getElementById("play-pause");

//0 - free; 1 - moving; 2 - fixed
let playField = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
];

let figures = {
    0: [
        [1, 1],
        [1, 1],
    ],
    1: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
    ],
    2: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0],
    ],
    3: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0],
    ],
    4: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0],
    ],
    5: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0],
    ],
    6: [
        [1, 1, 1],
        [0, 1, 0],
        [0, 0, 0],
    ],
};

setTimeout(startGame, gameSpeed);
draw();

function draw() {
    if (!isPaused) {
        let mainInnerHTML = "";
        for (let y = 0; y < playField.length; y++) {
            for (let x = 0; x < playField[y].length; x++) {
                if (playField[y][x] === 1) {
                    mainInnerHTML += '<div class="cell moving-cell"></div>';
                } else if (playField[y][x] === 2) {
                    mainInnerHTML += '<div class="cell fixed-cell"></div>';
                } else {
                    mainInnerHTML += '<div class="cell"></div>';
                }
            }
        }
        main.innerHTML = mainInnerHTML;
    }
}

function startGame() {
    draw();
    moveDown();
    if (!isPaused && active != null) {
        updateGameState();
        setTimeout(startGame, gameSpeed);
    }
}

function updateGameState() {
    if (!isPaused) {
        if (active != null) {
            addActive();
            draw();
        }
    }
}

document.onkeydown = function (e) {
    if (!isPaused && active != null) {
        if (e.code === "ArrowLeft") {
            active.x -= 1;
            if (hasCollisions()) {
                active.x += 1;
            }
        } else if (e.code === "ArrowRight") {
            active.x += 1;
            if (hasCollisions()) {
                active.x -= 1;
            }
        } else if (e.code === "ArrowDown") {
            moveDown();
        } else if (e.code === "ArrowUp") {
            rotate();
        } else if (e.code === "Space") {
            drop();
        }

        updateGameState();
    }
};

pauseButton.onmousedown = function changePlayPauseButton(e) {
    let change = document.getElementById("play-pause");
    if (change.className === "button pause-button") {
        change.className = "button play-button";
        clearTimeout(gameTimerID);
    } else {
        change.className = "button pause-button";
        gameTimerID = setTimeout(startGame, gameSpeed);
    }
    isPaused = !isPaused;
};

function removeFullLines() {
    let canRemoveLine = true,
        filledLines = 0;
    for (let y = 0; y < playField.length; y++) {
        for (let x = 0; x < playField[y].length; x++) {
            if (playField[y][x] !== 2) {
                canRemoveLine = false;
                break;
            }
        }
        if (canRemoveLine) {
            playField.splice(y, 1);
            playField.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);
            filledLines += 1;
        }
        canRemoveLine = true;
    }

    switch (filledLines) {
        case 1:
            score += 10;
            break;
        case 2:
            score += 10 * 3;
            break;
        case 3:
            score += 10 * 6;
            break;
        case 4:
            score += 10 * 12;
            break;
    }

    scoreElement.innerHTML = score;
}

function getNew() {
    const rand = Math.floor(Math.random() * 7);
    const newTetro = figures[rand];

    return {
        x: Math.floor((10 - newTetro[0].length) / 2),
        y: 0,
        shape: newTetro,
    };
}

let active = getNew();

function addActive() {
    removePreviousActive();
    if (active != null) {
        for (let y = 0; y < active.shape.length; y++) {
            for (let x = 0; x < active.shape[y].length; x++) {
                if (active.shape[y][x] === 1) {
                    playField[active.y + y][active.x + x] =
                        active.shape[y][x];
                }
            }
        }
    }
}

function removePreviousActive() {
    for (let y = 0; y < playField.length; y++) {
        for (let x = 0; x < playField[y].length; x++) {
            if (playField[y][x] === 1) {
                playField[y][x] = 0;
            }
        }
    }
}

function rotate() {
    if (active != null) {
        const prevState = active.shape;

        active.shape = active.shape[0].map((val, index) =>
            active.shape.map((row) => row[index]).reverse()
        );

        if (hasCollisions()) {
            active.shape = prevState;
        }
    }
}

function hasCollisions() {
    if (active != null) {
        for (let y = 0; y < active.shape.length; y++) {
            for (let x = 0; x < active.shape[y].length; x++) {
                if (
                    active.shape[y][x] &&
                    (playField[active.y + y] === undefined ||
                        playField[active.y + y][active.x + x] === undefined ||
                        playField[active.y + y][active.x + x] === 2)
                ) {
                    return true;
                }
            }
        }
    }
    return false;
}

function fix() {
    for (let y = 0; y < playField.length; y++) {
        for (let x = 0; x < playField[y].length; x++) {
            if (playField[y][x] === 1) {
                playField[y][x] = 2;
            }
        }
    }
}

function moveDown() {
    if (active != null) {
        active.y += 1;
        if (hasCollisions()) {
            active.y -= 1;
            fix();
            active = getNew();
            removeFullLines();
            if (hasCollisions()) {
                active = null;
                draw();
            }
        }
    }
}

function drop() {
    if (active != null) {
        for (let y = active.y; y < playField.length; y++) {
            active.y += 1;
            if (hasCollisions()) {
                active.y -= 1;
                break;
            }
        }
    }
}