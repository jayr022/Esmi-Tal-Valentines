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
    img.src = 'cartoon.png'; // Updated to .png
    img.onload = () => {
        console.log('Image loaded successfully');
        for (let i = 0; i < 9; i++) {
            const tile = document.createElement('div');
            tile.className = 'puzzle-tile';
            if (i === 8) tile.classList.add('empty');
            tile.dataset.index = i;
            tile.style.backgroundImage = `url('cartoon.png')`; // Updated to .png
            tile.style.backgroundPosition = `${-(i % 3) * 100}% ${-Math.floor(i / 3) * 100}%`;
            tile.addEventListener('click', handleTileClick);
            tile.addEventListener('touchstart', handleTileClick); // Mobile support
            tiles.push(tile);
            puzzleGrid.appendChild(tile);
        }
        shufflePuzzle();
    };
    img.onerror = () => {
        console.error('Failed to load cartoon.png. Check file path and upload.');
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
    console.log(`Tile ${index} clicked. Empty