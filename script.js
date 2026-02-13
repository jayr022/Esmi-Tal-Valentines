// DOM Elements
const envelope = document.getElementById('envelope');
const envelopeStage = document.getElementById('envelopeStage');
const body = document.body;
const puzzleContainer = document.getElementById('puzzleContainer');
const puzzleGrid = document.getElementById('puzzleGrid');
const puzzleOverlay = document.getElementById('puzzleOverlay');
const puzzleRevealText = document.getElementById('puzzleRevealText');
const yesBtn = document.getElementById('yesBtn');
const noBtn = document.getElementById('noBtn');
const puzzleView = document.getElementById('puzzleView');
const finalView = document.getElementById('finalView');
const modalInner = document.querySelector('.modal-inner');

// Puzzle Variables
let tiles = [];
let emptyIndex = 8; // Last tile is empty
let noClickCount = 0;
const maxNoClicks = 5; // After this, "No" button disappears

// Initialize Puzzle
function initPuzzle() {
    tiles = [];
    const img = new Image();
    img.src = 'cartoon.jpg'; // Updated to .jpg
    img.onload = () => {
        console.log('Image loaded successfully');
        for (let i = 0; i < 9; i++) {
            const tile = document.createElement('div');
            tile.className = 'puzzle-tile';
            if (i === 8) tile.classList.add('empty');
            tile.dataset.index = i;
            tile.style.backgroundImage = `url('cartoon.jpg')`; // Updated to .jpg
            tile.style.backgroundPosition = `${-(i % 3) * 100}% ${-Math.floor(i / 3) * 100}%`;
            tile.addEventListener('click', handleTileClick);
            tile.addEventListener('touchstart', handleTileClick); // Mobile support
            tiles.push(tile);
            puzzleGrid.appendChild(tile);
        }
        shufflePuzzle();
    };
    img.onerror = () => {
        console.error('Failed to load cartoon.jpg. Check file path and upload.');
    };
}

// Shuffle Puzzle (ensure solvable)
function shufflePuzzle() {
    for (let i = 0; i < 100; i++) {
        const adjacent = getAdjacentTiles(emptyIndex);
        if (adjacent.length > 0) {
            const randomAdjacent = adjacent[Math.floor(Math.random() * adjacent.length)];
            swapTiles(emptyIndex, randomAdjacent);
        }
    }
}

// Handle Tile Click/Touch
function handleTileClick(e) {
    e.preventDefault(); // Prevent default zoom on mobile
    const index = parseInt(e.currentTarget.dataset.index);
    console.log(`Tile ${index} clicked. Empty index: ${emptyIndex}`);
    if (getAdjacentTiles(emptyIndex).includes(index)) {
        console.log('Swapping tiles');
        swapTiles(emptyIndex, index);
        emptyIndex = index;
        checkWin();
    } else {
        console.log('Tile not adjacent, no swap');
    }
}

// Swap Tiles
function swapTiles(from, to) {
    const temp = tiles[from].style.backgroundPosition;
    tiles[from].style.backgroundPosition = tiles[to].style.backgroundPosition;
    tiles[to].style.backgroundPosition = temp;
    tiles[from].classList.toggle('empty');
    tiles[to].classList.toggle('empty');
}

// Get Adjacent Tiles
function getAdjacentTiles(index) {
    const row = Math.floor(index / 3);
    const col = index % 3;
    const adjacent = [];
    if (row > 0) adjacent.push(index - 3);
    if (row < 2) adjacent.push(index + 3);
    if (col > 0) adjacent.push(index - 1);
    if (col < 2) adjacent.push(index + 1);
    return adjacent;
}

// Check if Puzzle is Solved
function checkWin() {
    for (let i = 0; i < 8; i++) {
        const expectedPos = `${-(i % 3) * 100}% ${-Math.floor(i / 3) * 100}%`;
        if (tiles[i].style.backgroundPosition !== expectedPos) return;
    }
    console.log('Puzzle solved!');
    // Win!
    puzzleContainer.classList.add('completed');
    puzzleGrid.classList.add('merging');
    setTimeout(() => {
        puzzleOverlay.classList.add('show');
        puzzleGrid.classList.add('revealing');
        setTimeout(() => {
            puzzleRevealText.classList.add('show');
        }, 500);
    }, 1000);
}

// Envelope Click/Touch Handler
function handleEnvelopeClick(e) {
    e.preventDefault();
    envelope.classList.add('opening');
    setTimeout(() => {
        envelopeStage.classList.add('envelope-stage-fade-out');
        setTimeout(() => {
            body.classList.add('show-modal');
            puzzleView.classList.add('puzzle-stage-fade-in');
            initPuzzle();
        }, 500);
    }, 800);
}

// "No" Button Handler
function handleNoClick(e) {
    e.preventDefault();
    noBtn.classList.add('shake');
    setTimeout(() => noBtn.classList.remove('shake'), 500);
    noClickCount++;
    const scale = Math.max(0.1, 1 - noClickCount * 0.2);
    noBtn.style.transform = `scale(${scale})`;
    // Random position within modal-inner
    const containerRect = modalInner.getBoundingClientRect();
    const btnRect = noBtn.getBoundingClientRect();
    const maxX = containerRect.width - btnRect.width;
    const maxY = containerRect.height - btnRect.height;
    const randomX = Math.random() * maxX;
    const randomY = Math.random() * maxY;
    noBtn.style.left = `${randomX}px`;
    noBtn.style.top = `${randomY}px`;
    if (noClickCount >= maxNoClicks) {
        noBtn.classList.add('shrinking');
    }
}

// "Yes" Button Handler
function handleYesClick(e) {
    e.preventDefault();
    puzzleView.classList.remove('visible');
    finalView.classList.add('visible');
}

// Event Listeners
envelope.addEventListener('click', handleEnvelopeClick);
envelope.addEventListener('touchstart', handleEnvelopeClick); // Mobile
noBtn.addEventListener('click', handleNoClick);
noBtn.addEventListener('touchstart', handleNoClick); // Mobile
yesBtn.addEventListener('click', handleYesClick);
yesBtn.addEventListener('touchstart', handleYesClick); // Mobile