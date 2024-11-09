
const board = document.getElementById('board');
const message = document.getElementById('message');
const restartButton = document.getElementById('restart');
const difficultySelect = document.getElementById('difficultySelect');
const gameModeSelect = document.getElementById('gameModeSelect');
const scoreDisplay = document.getElementById('score');

let gameState = ['', '', '', '', '', '', '', '', ''];
let currentPlayer = 'X';
let isGameActive = true;
let difficulty = difficultySelect.value;
let gameMode = gameModeSelect.value;
let score = 0;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
];

difficultySelect.addEventListener('change', (event) => {
    difficulty = event.target.value;
    restartGame();
});

gameModeSelect.addEventListener('change', (event) => {
    gameMode = event.target.value;
    restartGame();
});

function createBoard() {
    board.innerHTML = '';
    gameState.forEach((cell, index) => {
        const cellElement = document.createElement('div');
        cellElement.classList.add('cell');
        cellElement.setAttribute('data-cell-index', index);
        cellElement.innerText = cell;
        cellElement.addEventListener('click', handleCellClick);
        board.appendChild(cellElement);
    });
}

function handleCellClick(event) {
    const cellIndex = event.target.getAttribute('data-cell-index');
    if (gameState[cellIndex] !== '' || !isGameActive) return;
    
    gameState[cellIndex] = currentPlayer;
    event.target.innerText = currentPlayer;
    
    checkResult();
}

function checkResult() {
    let roundWon = false;
    for (let i = 0; i < winningConditions.length; i++) {
        const [a, b, c] = winningConditions[i];
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            roundWon = true;
            break;
        }
    }
    if (roundWon) {
        message.innerText = `Игрок ${currentPlayer} выиграл!`;
        if (currentPlayer === 'X') {
            score++;
            scoreDisplay.innerText = score;
        }
        isGameActive = false;
        return;
    }
    if (!gameState.includes('')) {
        message.innerText = 'Ничья!';
        isGameActive = false;
        return;
    }
    
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    if (gameMode === 'bot' && currentPlayer === 'O') {
        botMove();
    }
}

function botMove() {
    let availableCells = gameState.map((cell, index) => (cell === '' ? index : null)).filter(cell => cell !== null);
    if (availableCells.length === 0) return;

    if (difficulty === 'hard') {
        let bestMove = findBestMove();
        if (bestMove !== undefined) {
            gameState[bestMove] = currentPlayer;
            board.children[bestMove].innerText = currentPlayer;
        }
    } else {
        const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
        gameState[randomIndex] = currentPlayer;
        board.children[randomIndex].innerText = currentPlayer;
    }
    checkResult();
}

function findBestMove() {
    let bestScore = -Infinity;
    let move;
    for (let i = 0; i < gameState.length; i++) {
        if (gameState[i] === '') {
            gameState[i] = 'O';
            let score = minimax(gameState, 0, false);
            gameState[i] = '';
            if (score > bestScore) {
                bestScore = score;
                move = i;
            }
        }
    }
    return move;
}

function minimax(board, depth, isMaximizing) {
    const scores = { 'X': -1, 'O': 1, 'tie': 0 };
    const result = checkWinner();
    if (result !== null) return scores[result];

    if (isMaximizing) {
        let bestScore = -Infinity;
        for (let i = 0; i < board.length; i++) {


if (board[i] === '') {
                board[i] = 'O';
                let score = minimax(board, depth + 1, false);
                board[i] = '';
                bestScore = Math.max(score, bestScore);
            }
        }
        return bestScore;
    } else {
        let bestScore = Infinity;
        for (let i = 0; i < board.length; i++) {
            if (board[i] === '') {
                board[i] = 'X';
                let score = minimax(board, depth + 1, true);
                board[i] = '';
                bestScore = Math.min(score, bestScore);
            }
        }
        return bestScore;
    }
}

function checkWinner() {
    for (const [a, b, c] of winningConditions) {
        if (gameState[a] === gameState[b] && gameState[a] === gameState[c] && gameState[a] !== '') {
            return gameState[a];
        }
    }
    return gameState.includes('') ? null : 'tie';
}

restartButton.addEventListener('click', restartGame);

function restartGame() {
    gameState = ['', '', '', '', '', '', '', '', ''];
    currentPlayer = 'X';
    isGameActive = true;
    message.innerText = '';
    scoreDisplay.innerText = 0;
    score = 0;
    createBoard();
}

createBoard();