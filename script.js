document.addEventListener('DOMContentLoaded', () => {
    const instructionsModal = document.getElementById('instructions-modal');
    const solvedPreview = document.getElementById('solved-preview');
    const startBtn = document.getElementById('start-btn');
    const puzzleContainer = document.getElementById('puzzle-container');
    const puzzleBoard = document.getElementById('puzzle-board');
    const successContainer = document.getElementById('success-container');
    const messageModal = document.getElementById('message-modal');
    const questionModal = document.getElementById('question-modal');
    const continueBtn = document.getElementById('continue-btn');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const questionText = document.getElementById('question-text');
    const pieces = [];
    const gridSize = 3; // 3x3 sliding puzzle
    let blankIndex = 8; // Position of the blank piece (bottom-right initially)

    // Show solved preview for 5 seconds, then hide it
    setTimeout(() => {
        solvedPreview.style.display = 'none';
    }, 5000);

    // Start button to begin the puzzle
    startBtn.addEventListener('click', () => {
        instructionsModal.style.display = 'none';
        puzzleContainer.style.display = 'block';
    });

    // Create puzzle pieces: 8 numbered tiles (1-8) + 1 blank
    for (let i = 1; i < gridSize * gridSize; i++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.dataset.index = i - 1; // 0-7 for tracking
        piece.textContent = i; // Number 1-8
        piece.addEventListener('click', () => movePiece(i - 1));
        pieces.push(piece);
        puzzleBoard.appendChild(piece);
    }
    // Add the blank piece
    const blankPiece = document.createElement('div');
    blankPiece.classList.add('puzzle-piece', 'blank');
    blankPiece.dataset.index = 8;
    pieces.push(blankPiece);
    puzzleBoard.appendChild(blankPiece);

    // Shuffle pieces (ensure solvable)
    shuffleArray(pieces);
    pieces.forEach(piece => puzzleBoard.appendChild(piece));
    updateBlankIndex();

    function movePiece(clickedIndex) {
        const blankPos = getPosition(blankIndex);
        const clickedPos = getPosition(clickedIndex);
        if (isAdjacent(blankPos, clickedPos)) {
            // Swap the clicked piece with the blank
            swapPieces(clickedIndex, blankIndex);
            blankIndex = clickedIndex;
            checkIfSolved();
        }
    }

    function getPosition(index) {
        return { row: Math.floor(index / gridSize), col: index % gridSize };
    }

    function isAdjacent(pos1, pos2) {
        const rowDiff = Math.abs(pos1.row - pos2.row);
        const colDiff = Math.abs(pos1.col - pos2.col);
        return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
    }

    function swapPieces(index1, index2) {
        const temp = puzzleBoard.children[index1];
        puzzleBoard.children[index1] = puzzleBoard.children[index2];
        puzzleBoard.children[index2] = temp;
        puzzleBoard.insertBefore(puzzleBoard.children[index2], puzzleBoard.children[index1]);
    }

    function updateBlankIndex() {
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i].classList.contains('blank')) {
                blankIndex = i;
                break;
            }
        }
    }

    function checkIfSolved() {
        const currentOrder = Array.from(puzzleBoard.children).map(piece => parseInt(piece.dataset.index));
        const solvedOrder = [0, 1, 2, 3, 4, 5, 6, 7, 8]; // Solved state: numbers 0-7 in order, blank at 8
        if (JSON.stringify(currentOrder) === JSON.stringify(solvedOrder)) {
            // Puzzle solved: Hide puzzle, show real static image + Spotify, then first modal
            document.getElementById('puzzle-container').style.display = 'none';
            successContainer.style.display = 'block';
            setTimeout(() => {
                messageModal.style.display = 'flex';
            }, 2000); // Delay to enjoy the real image
        }
    }

    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }

    // First Modal: Continue to Question
    continueBtn.addEventListener('click', () => {
        messageModal.style.display = 'none';
        questionModal.style.display = 'flex';
    });

    // Second Modal: Forced Yes Mechanic (Trending Valentine's Prompts)
    let noClickCount = 0;
    const messages = [
        "Will you be my Valentine? ❤️",
        "Are you sure? 😏",
        "Think again! ❤️",
        "Come on, say yes! 💕",
        "Okay, fine... but really? 😘"
    ];

    noBtn.addEventListener('click', () => {
        noClickCount++;
        // Move "No" button randomly (trending mechanic)
        noBtn.style.left = Math.random() * 70 + '%';
        noBtn.style.top = Math.random() * 70 + '%';
        // Shake animation for fun
        questionModal.classList.add('shake');
        setTimeout(() => questionModal.classList.remove('shake'), 500);
        // Update question text progressively
        if (noClickCount < messages.length) {
            questionText.textContent = messages[noClickCount];
        } else {
            // Force "Yes" after persistent clicks (trending persistence)
            noBtn.style.display = 'none';
            questionText.textContent = "Just say yes already! ❤️";
            yesBtn.textContent = "Yes! (I give up)";
        }
    });

    yesBtn.addEventListener('click', () => {
        // Trigger confetti animation
        confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
        });
        // Show updated message
        alert('Congratulations! nanalo ka ng date with me! See you soon Adi ko😘');
        questionModal.style.display = 'none';
        // Optional: Add more actions, like redirecting to a final page
    });
});
