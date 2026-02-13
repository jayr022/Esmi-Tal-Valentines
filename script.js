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

/* -------------------------
   INIT PUZZLE
------------------------- */

function initPuzzle() {
    puzzleGrid.innerHTML = "";
    board = [0,1,2,3,4,5,6,7,null];
    emptyIndex = 8;

    shuffleBoard();
    renderBoard();
}

function shuffleBoard() {
    for (let i = 0; i < 200; i++) {
        const adj = getAdjacent(emptyIndex);
        const rand = adj[Math.floor(Math.random() * adj.length)];
        swap(emptyIndex, rand);
        emptyIndex = rand;
    }
}

function renderBoard() {
    puzzleGrid.innerHTML = "";

    board.forEach((value, index) => {
        const tile = document.createElement("div");
        tile.className = "puzzle-tile";
        tile.dataset.index = index;

        if (value === null) {
            tile.classList.add("empty");
        } else {
            tile.style.backgroundImage = "url('./cartoon.png')";
            tile.style.backgroundSize = "300% 300%";
            tile.style.backgroundPosition =
                `${-(value % 3) * 100}% ${-Math.floor(value / 3) * 100}%`;
        }

        tile.addEventListener("click", handleTileClick);
        puzzleGrid.appendChild(tile);
    });
}

function handleTileClick(e) {
    const index = parseInt(e.currentTarget.dataset.index);

    if (getAdjacent(emptyIndex).includes(index)) {
        swap(emptyIndex, index);
        emptyIndex = index;
        renderBoard();
        checkWin();
    }
}

function swap(a, b) {
    [board[a], board[b]] = [board[b], board[a]];
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
    continueBtn.style.display = "block";
}

/* -------------------------
   ENVELOPE FLOW
------------------------- */

envelope.addEventListener("click", () => {
    envelope.classList.add("opening");

    setTimeout(() => {
        envelopeStage.style.display = "none";
        body.classList.add("show-modal");
        initPuzzle();
    }, 800);
});

/* -------------------------
   CONTINUE
------------------------- */

continueBtn.addEventListener("click", () => {
    puzzleView.classList.remove("visible");
    questionView.classList.add("visible");
});

/* -------------------------
   NO BUTTON
------------------------- */

noBtn.addEventListener("click", () => {
    noClickCount++;

    const scale = Math.max(0.2, 1 - noClickCount * 0.2);
    noBtn.style.transform = `scale(${scale})`;

    const containerRect = modalInner.getBoundingClientRect();
    const maxX = containerRect.width - 120;
    const maxY = containerRect.height - 60;

    noBtn.style.left = `${Math.random() * maxX}px`;
    noBtn.style.top = `${Math.random() * maxY}px`;

    if (noClickCount >= maxNoClicks) {
        noBtn.style.display = "none";
    }
});

/* -------------------------
   YES BUTTON
------------------------- */

yesBtn.addEventListener("click", () => {
    questionView.classList.remove("visible");
    finalView.classList.add("visible");
});
