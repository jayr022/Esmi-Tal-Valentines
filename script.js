document.addEventListener('DOMContentLoaded', () => {
    const puzzleBoard = document.getElementById('puzzle-board');
    const successContainer = document.getElementById('success-container');
    const messageModal = document.getElementById('message-modal');
    const questionModal = document.getElementById('question-modal');
    const continueBtn = document.getElementById('continue-btn');
    const yesBtn = document.getElementById('yes-btn');
    const noBtn = document.getElementById('no-btn');
    const questionText = document.getElementById('question-text');
    const pieces = [];
    const gridSize = 3; // 3x3 puzzle; change for more complexity
    const cartoonSrc = 'cartoon.gif'; // Your animated/cartoonized GIF for the puzzle

    // Create puzzle pieces from the animated/cartoonized GIF
    for (let i = 0; i < gridSize * gridSize; i++) {
        const piece = document.createElement('div');
        piece.classList.add('puzzle-piece');
        piece.draggable = true;
        piece.dataset.index = i;
        piece.style.backgroundImage = `url(${cartoonSrc})`; // Pieces show parts of the animated GIF
        piece.style.backgroundPosition = `-${(i % gridSize) * 100}px -${Math.floor(i / gridSize) * 100}px`;
        pieces.push(piece);
        puzzleBoard.appendChild(piece);
    }

    // Shuffle pieces
    shuffleArray(pieces);
    pieces.forEach(piece => puzzleBoard.appendChild(piece));

    // Drag and drop logic
    let draggedPiece = null;

    pieces.forEach(piece => {
        piece.addEventListener('dragstart', (e) => {
            draggedPiece = e.target;
            e.target.classList.add('dragging');
        });

        piece.addEventListener('dragend', (e) => {
            e.target.classList.remove('dragging');
            draggedPiece = null;
            checkIfSolved();
        });

        piece.addEventListener('dragover', (e) => {
            e.preventDefault();
        });

        piece.addEventListener('drop', (e) => {
            e.preventDefault();
            if (draggedPiece && e.target !== draggedPiece) {
                const draggedIndex = Array.from(puzzleBoard.children).indexOf(draggedPiece);
                const targetIndex = Array.from(puzzleBoard.children).indexOf(e.target);
                swapPieces(draggedIndex, targetIndex);
            }
        });
    });

    function swapPieces(index1, index2) {
        const temp = puzzleBoard.children[index1];
        puzzleBoard.children[index1] = puzzleBoard.children[index2];
        puzzleBoard.children[index2] = temp;
        puzzleBoard.insertBefore(puzzleBoard.children[index2], puzzleBoard.children[index1]);
    }

    function checkIfSolved() {
        const currentOrder = Array.from(puzzleBoard.children).map(piece => parseInt(piece.dataset.index));
        const solvedOrder = Array.from({length: gridSize * gridSize}, (_, i) => i);
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