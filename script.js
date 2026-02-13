const envelope = document.getElementById("envelope");
const envelopeStage = document.getElementById("envelopeStage");
const body = document.body;

const puzzleGrid = document.getElementById("puzzleGrid");
const puzzleOverlay = document.getElementById("puzzleOverlay");
const continueBtn = document.getElementById("continueBtn");

const puzzleView = document.getElementById("puzzleView");
const questionView = document.getElementById("questionView");
const finalView = document.getElementById("finalView");

const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const modalInner = document.querySelector(".modal-inner");

let board = [];
let emptyIndex = 8;
let noClickCount = 0;
const maxNoClicks = 5;

const IMAGE_SIZE = 450;
const TILE_SIZE = 150; // 450 / 3

/* ------------------ PUZZLE INIT ------------------ */

function initPuzzle() {
    board = [0,1,2,3,4,5,6,7,null];
    emptyIndex = 8;
    shuffleBoard();
    renderBoard();
}

function shuffleBoard() {
    for (let i = 0; i < 200; i++) {
        const adj = getAdjacent(emptyIndex);
        const rand = adj[Math.floor(Math.random() * adj.length)];
        [board[emptyIndex], board[rand]] = [board[rand], board[emptyIndex]];
        emptyIndex = rand;
    }
}

function renderBoard() {
    puzzleGrid.innerHTML = "";

    board.forEach((val, idx) => {
        const tile = document.createElement("div");
        tile.className = "puzzle-tile";
        tile.dataset.index = idx;

        if (val === null) {
            tile.classList.add("empty");
        } else {
            tile.style.backgroundImage = "url('./cartoon.png')";
            tile.style.backgroundSize = IMAGE_SIZE + "px " + IMAGE_SIZE + "px";
            tile.style.backgroundPosition =
                `-${(val % 3) * TILE_SIZE}px -${Math.floor(val / 3) * TILE_SIZE}px`;
            tile.style.backgroundRepeat = "no-repeat";
        }

        tile.addEventListener("click", () => handleTileClick(idx));
        puzzleGrid.appendChild(tile);
    });
}

function handleTileClick(index) {
    if (getAdjacent(emptyIndex).includes(index)) {
        [board[emptyIndex], board[index]] = [board[index], board[emptyIndex]];
        emptyIndex = index;
        renderBoard();
        checkWin();
    }
}

function getAdjacent(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const adj = [];

    if (row > 0) adj.push(index - 3);
    if (row < 2) adj.push(index + 3);
    if (col > 0) adj.push(index - 1);
    if (col < 2) adj.push(index + 1);

    return adj;
}

function checkWin() {
    for (let i = 0; i < 8; i++) {
        if (board[i] !== i) return;
    }

    puzzleOverlay.classList.add("show");
    continueBtn.style.display = "inline-block";
}

/* ------------------ FLOW ------------------ */

envelope.addEventListener("click", () => {
    envelope.classList.add("opening");

    setTimeout(() => {
        envelopeStage.style.display = "none";
        body.classList.add("show-modal");
        initPuzzle();
    }, 800);
});

continueBtn.addEventListener("click", () => {
    puzzleView.classList.remove("visible");
    questionView.classList.add("visible");
});

/* ------------------ NO BUTTON ------------------ */

noBtn.addEventListener("click", () => {
    noClickCount++;

    const scale = Math.max(0.2, 1 - noClickCount * 0.2);
    noBtn.style.transform = `scale(${scale})`;

    const rect = modalInner.getBoundingClientRect();
    noBtn.style.left = `${Math.random() * (rect.width - 120)}px`;
    noBtn.style.top = `${Math.random() * (rect.height - 60)}px`;

    if (noClickCount >= maxNoClicks) {
        noBtn.style.display = "none";
    }
});

/* ------------------ YES BUTTON ------------------ */

yesBtn.addEventListener("click", () => {
    questionView.classList.remove("visible");
    finalView.classList.add("visible");
});
