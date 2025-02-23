const board = document.getElementById("board");
const cells = document.querySelectorAll(".cell");
const status = document.getElementById("status");
const resetBtn = document.getElementById("resetBtn");
const modeSelect = document.getElementById("modeSelect"); // Mode selector

let currentPlayer = "X";
let boardState = ["", "", "", "", "", "", "", "", ""];
let gameActive = true;
let isSinglePlayer = true; // Default to AI mode

// Winning combinations
const winningCombos = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
];

// Handle mode change (AI or Player vs Player)
modeSelect.addEventListener("change", () => {
    isSinglePlayer = modeSelect.value === "ai"; 
    resetGame(); 
});

// Handle Cell Click (Player Move)
cells.forEach(cell => {
    cell.addEventListener("click", () => {
        const index = cell.getAttribute("data-index");

        if (boardState[index] === "" && gameActive) {
            makeMove(index, currentPlayer);
            if (gameActive && isSinglePlayer && currentPlayer === "O") {
                setTimeout(aiMove, 500);
            }
        }
    });
});

// **Make Move Function**
function makeMove(index, player) {
    boardState[index] = player;
    cells[index].textContent = player;
    checkWinner();

    if (gameActive) {
        currentPlayer = currentPlayer === "X" ? "O" : "X";
        status.textContent = `Player ${currentPlayer}'s Turn`;
    }
}

// **AI Move (Unbeatable AI)**
function aiMove() {
    let bestMove = minimax(boardState, "O").index; // AI plays as "O"
    makeMove(bestMove, "O");
}

// **Minimax Algorithm - Unbeatable AI**
function minimax(newBoard, player) {
    let emptyCells = getEmptyCells(newBoard);

    if (checkWin(newBoard, "X")) return { score: -10 }; // Player X wins
    if (checkWin(newBoard, "O")) return { score: 10 };  // AI O wins
    if (emptyCells.length === 0) return { score: 0 };   // Draw

    let moves = [];

    for (let i of emptyCells) {
        let move = {};
        move.index = i;
        newBoard[i] = player;

        if (player === "O") {
            let result = minimax(newBoard, "X");
            move.score = result.score;
        } else {
            let result = minimax(newBoard, "O");
            move.score = result.score;
        }

        newBoard[i] = ""; // Undo move
        moves.push(move);
    }

    let bestMove;
    if (player === "O") {
        let bestScore = -Infinity;
        for (let move of moves) {
            if (move.score > bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    } else {
        let bestScore = Infinity;
        for (let move of moves) {
            if (move.score < bestScore) {
                bestScore = move.score;
                bestMove = move;
            }
        }
    }

    return bestMove;
}

// **Helper Functions**
function getEmptyCells(board) {
    return board.map((cell, index) => (cell === "" ? index : null)).filter(index => index !== null);
}

function checkWin(board, player) {
    return winningCombos.some(combo => combo.every(index => board[index] === player));
}

// **Check Winner**
function checkWinner() {
    for (let combo of winningCombos) {
        let [a, b, c] = combo;
        if (boardState[a] && boardState[a] === boardState[b] && boardState[a] === boardState[c]) {
            status.textContent = `🎉 Player ${boardState[a]} Wins!`;
            highlightWinningCells(combo);
            gameActive = false;
            return;
        }
    }

    if (!boardState.includes("")) {
        status.textContent = "🤝 It's a Draw!";
        gameActive = false;
    }
}

// **Highlight Winning Cells**
function highlightWinningCells(combo) {
    combo.forEach(index => {
        cells[index].classList.add("winning-cell");
    });
}

// **Reset Game**
function resetGame() {
    boardState = ["", "", "", "", "", "", "", "", ""];
    gameActive = true;
    currentPlayer = "X";
    status.textContent = `Player X's Turn`;
    cells.forEach(cell => {
        cell.textContent = "";
        cell.classList.remove("winning-cell");
    });

    if (isSinglePlayer && currentPlayer === "O") {
        setTimeout(aiMove, 500); // AI starts if it's AI mode
    }
}

resetBtn.addEventListener("click", resetGame);
