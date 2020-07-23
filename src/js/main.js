let main = document.querySelector(".main");
let gameSpeed = 400;

//0 - free; 1 - moving; 2 - fixed
let playField = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 1, 0, 0, 0, 0],
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

function draw() {
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

draw();

function startGame() {
    moveDown();
    draw();
    setTimeout(startGame, gameSpeed);
}

setTimeout(startGame, gameSpeed);

document.onkeydown = function (e) {
    if (e.code === "ArrowLeft") {
        moveLeft();
    } else if (e.code === "ArrowRight") {
        moveRight();
    } else if (e.code === "ArrowDown") {
        moveDown();
    }
    draw();
};

function canMoveDown() {
    for (let y = 0; y < playField.length; y++) {
        for (let x = 0; x < playField[y].length; x++) {
            if (playField[y][x] === 1 && (y === playField.length - 1 || playField[y + 1][x] === 2)) {
                return false;
            }
        }
    }
    return true;
}

function moveDown() {
    if (canMoveDown()) {
        for (let y = playField.length - 1; y >= 0; y--) {
            for (let x = 0; x < playField[y].length; x++) {
                if (playField[y][x] === 1) {
                    playField[y + 1][x] = 1;
                    playField[y][x] = 0;
                }
            }
        }
    } else {
        fix();
    }
}

function canMoveLeft() {
    for (let y = 0; y < playField.length; y++) {
        for (let x = 0; x < playField[y].length; x++) {
            if (playField[y][x] === 1) {
                if (x === 0 || playField[y][x - 1] === 2) {
                    return false;
                }
            }
        }
    }

    return true;

}

function moveLeft() {
    if (canMoveLeft()) {
        for (let y = playField.length - 1; y >= 0; y--) {
            for (let x = 0; x < playField[y].length; x++) {
                if (playField[y][x] === 1) {
                    playField[y][x - 1] = 1;
                    playField[y][x] = 0;
                }
            }
        }
    } else {
        fix();
    }
}

function canMoveRight() {
    for (let y = 0; y < playField.length; y++) {
        for (let x = 0; x < playField[y].length; x++) {
            if (playField[y][x] === 1) {
                if (x === 9 || playField[y][x + 1] === 2) {
                    return false;
                }
            }
        }
    }
    return true;
}

function moveRight() {
    if (canMoveRight()) {
        for (let y = playField.length - 1; y >= 0; y--) {
            for (let x = playField[0].length - 1; x >= 0; x--) {
                if (playField[y][x] === 1) {
                    playField[y][x + 1] = 1;
                    playField[y][x] = 0;
                }
            }
        }
    } else {
        fix();
    }
}


function removeFullLines() {
    let canRemoveLine = true;
    for (let y = 0; y < playField.length; y++) {
        for (let x = 0; x < playField[y].length; x++) {
            if (playField[y][x] !== 2) {
                canRemoveLine = false;
                break;
            }
        }
        if (canRemoveLine) {
            playField.splice(y, 1);
            playField.splice(0, 0, [0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
        }
        canRemoveLine = true;
    }
}

function fix() {
    for (let y = 0; y < playField.length; y++) {
        for (let x = 0; x < playField[y].length; x++) {
            if (playField[y][x] === 1) {
                playField[y][x] = 2;
            }
        }
    }
    removeFullLines();

    playField[0] = [0, 0, 0, 0, 1, 1, 0, 0, 0, 0];
    playField[1] = [0, 0, 0, 0, 1, 1, 0, 0, 0, 0];
}

function changePlayPauseButton() {
    let change = document.getElementById("play-pause");
    if (change.className === "pause-button") {
        change.className = "play-button";
    } else {
        change.className = "pause-button";
    }
}