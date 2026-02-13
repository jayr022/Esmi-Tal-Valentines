const envelope = document.getElementById("envelope");
const envelopeSection = document.getElementById("envelopeSection");
const puzzleSection = document.getElementById("puzzleSection");
const puzzleGrid = document.getElementById("puzzleGrid");
const puzzleOverlay = document.getElementById("puzzleOverlay");
const continueBtn = document.getElementById("continueBtn");

const questionSection = document.getElementById("questionSection");
const finalSection = document.getElementById("finalSection");
const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");

let board = [];
let emptyIndex = 8;

envelope.addEventListener("click", () => {
    envelopeSection.classList.add("hidden");
    puzzleSection.classList.remove("hidden");
    initPuzzle();
});

function initPuzzle() {
    board = [...Array(9).keys()];
    shuffle(board);
    emptyIndex = board.indexOf(8);
    render();
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

function render() {
    puzzleGrid.innerHTML = "";

    board.forEach((value, index) => {
        const tile = document.createElement("div");

        if (value === 8) {
            tile.classList.add("puzzle-tile", "empty");
        } else {
            tile.classList.add("puzzle-tile");
            const x = (value % 3) * 50;
            const y = Math.floor(value / 3) * 50;
            tile.style.backgroundPosition = `${x}% ${y}%`;
            tile.addEventListener("click", () => moveTile(index));
        }

        puzzleGrid.appendChild(tile);
    });
}

function moveTile(index) {
    const validMoves = [
        emptyIndex - 1,
        emptyIndex + 1,
        emptyIndex - 3,
        emptyIndex + 3
    ];

    if (validMoves.includes(index)) {
        [board[index], board[emptyIndex]] =
        [board[emptyIndex], board[index]];

        emptyIndex = index;
        render();
        checkWin();
    }
}

function checkWin() {
    for (let i = 0; i < 8; i++) {
        if (board[i] !== i) return;
    }

    puzzleOverlay.classList.add("show");
    continueBtn.classList.remove("hidden");
}

continueBtn.addEventListener("click", () => {
    puzzleSection.classList.add("hidden");
    questionSection.classList.remove("hidden");
});

yesBtn.addEventListener("click", () => {
    questionSection.classList.add("hidden");
    finalSection.classList.remove("hidden");
});

noBtn.addEventListener("mouseover", () => {
    noBtn.style.position = "absolute";
    noBtn.style.top = Math.random() * 300 + "px";
    noBtn.style.left = Math.random() * 300 + "px";
});
