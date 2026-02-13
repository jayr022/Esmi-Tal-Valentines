// DOM Elements
const envelope = document.getElementById('envelope');
const envelopeStage = document.getElementById('envelopeStage');
const body = document.body;

const puzzleContainer = document.getElementById('puzzleContainer');
const puzzleGrid = document.getElementById('puzzleGrid');
const puzzleOverlay = document.getElementById('puzzleOverlay');
const continueBtn = document.getElementById('continueBtn');

const puzzleView = document.getElementById('puzzleView');
const questionView = document.getElementById('questionView');
const finalView = document.getElementById('finalView');

const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const modalInner = document.querySelector('.modal-inner');

let tiles = [];
let emptyIndex = 8;
let noClickCount = 0;
const maxNoClicks = 5;

/* -----------------------------
   PUZZLE INITIALIZATION
----------------------------- */

function initPuzzle() {
    puzzleGrid.innerHTML = ""; // clear grid
    tiles = [];
    emptyIndex = 8;

    for (let i = 0; i < 9; i++) {
        const tile = document.createElement('div');
        tile.className = 'puzzle-tile';
        tile.dataset.index = i;

        if (i === 8) {
            tile.classList.add('empty');
        } else {
            tile.style.backgroundImage = `url('cartoon.png')`;
            tile.style.backgroundSize = "300% 300%";
            tile.style.backgroundPosition =
                `${-(i % 3) * 100}% ${-Math.floor(i / 3) * 100}%`;
        }

        tile.addEventListener('click', handleTileClick);
        tiles.push(tile);
        puzzleGrid.appendChild(tile);
    }

    shufflePuzzle();
}

function shufflePuzzle() {
    for (let i = 0; i < 150; i++) {
        const adj = getAdjacentTiles(emptyIndex);
        const rand = adj[Math.floor(Math.random() * adj.length)];
        swapTiles(emptyIndex, rand);
        emptyIndex = rand;
    }
}

function handleTileClick(e) {
    const index = parseInt(e.currentTarget.dataset.index);

    if (getAdjacentTiles(emptyIndex).includes(index)) {
        swapTiles(emptyIndex, index);
        emptyIndex = index;
        checkWin();
    }
}

function swapTiles(a, b) {
    const tempBg = tiles[a].style.backgroundPosition;
    tiles[a].style.backgroundPosition = tiles[b].style.backgroundPosition;
    tiles[b].style.backgroundPosition = tempBg;

    tiles[a].classList.toggle('empty');
    tiles[b].classList.toggle('empty');
}

function getAdjacentTiles(index) {
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
        const correct =
            `${-(i % 3) * 100}% ${-Math.floor(i / 3) * 100}%`;

        if (tiles[i].style.backgroundPosition !== correct) return;
    }

    // WIN
    puzzleContainer.classList.add('completed');
    puzzleOverlay.classList.add('show');
    continueBtn.style.display = "block";
}

/* -----------------------------
   ENVELOPE FLOW
----------------------------- */

envelope.addEventListener('click', () => {
    envelope.classList.add('opening');

    setTimeout(() => {
        envelopeStage.style.display = "none";
        body.classList.add('show-modal');
        initPuzzle();
    }, 800);
});

/* -----------------------------
   CONTINUE → QUESTION
----------------------------- */

continueBtn.addEventListener('click', () => {
    puzzleView.classList.remove('visible');
    questionView.classList.add('visible');
});

/* -----------------------------
   NO BUTTON (Force YES Logic)
----------------------------- */

noBtn.addEventListener('click', () => {

    noClickCount++;

    // shrink effect
    const scale = Math.max(0.2, 1 - noClickCount * 0.2);
    noBtn.style.transform = `scale(${scale})`;

    // move randomly within container safely
    const containerRect = modalInner.getBoundingClientRect();

    const maxX = containerRect.width - 120;
    const maxY = containerRect.height - 60;

    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;

    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;

    if (noClickCount >= maxNoClicks) {
        noBtn.style.display = "none";
    }
});

/* -----------------------------
   YES BUTTON
----------------------------- */

yesBtn.addEventListener('click', () => {
    questionView.classList.remove('visible');
    finalView.classList.add('visible');
});
