const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('playButton');
const scoreElement = document.getElementById('score');
const highScoreElement = document.getElementById('highScore');
const nameInput = document.getElementById('nameInput');
const submitScoreButton = document.getElementById('submitScore');
const highScoreTable = document.getElementById('highScoreTable');
const highScoreTableBody = document.getElementById('highScoreTableBody');

const GRID_SIZE = 20;
const TILE_WIDTH = 40;
const TILE_HEIGHT = 20;
const BOARD_WIDTH = 15;
const BOARD_HEIGHT = 15;
const SNAKE_HEIGHT = 15;

let snake = [];
let food = {};
let dx = 1;
let dy = 0;
let score = 0;
let highScore = 0;
let gameRunning = false;
let rotationAngle = 0;

function initGame() {
    snake = [{ x: 7, y: 7 }];
    generateFood();
    dx = 1;
    dy = 0;
    score = 0;
    updateScore();
    updateHighScore();
}

function drawGame() {
    if (!gameRunning) return;

    clearCanvas();
    drawBoard();
    moveSnake();
    drawSnake();
    drawFood();
    checkCollision();
    rotationAngle += 0.1;
    setTimeout(drawGame, 150);
}

function clearCanvas() {
    ctx.fillStyle = '#87CEEB';  // Sky blue background
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function drawBoard() {
    for (let y = 0; y < BOARD_HEIGHT; y++) {
        for (let x = 0; x < BOARD_WIDTH; x++) {
            drawTile(x, y, '#8FBC8F');  // Dark sea green tiles
        }
    }
}

function drawTile(x, y, color) {
    const screenX = (x - y) * TILE_WIDTH / 2 + canvas.width / 2;
    const screenY = (x + y) * TILE_HEIGHT / 2 + 100;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(screenX, screenY);
    ctx.lineTo(screenX + TILE_WIDTH / 2, screenY + TILE_HEIGHT / 2);
    ctx.lineTo(screenX, screenY + TILE_HEIGHT);
    ctx.lineTo(screenX - TILE_WIDTH / 2, screenY + TILE_HEIGHT / 2);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        updateScore();
        generateFood();
    } else {
        snake.pop();
    }
}

function drawSnake() {
    snake.forEach((segment, index) => {
        const screenX = (segment.x - segment.y) * TILE_WIDTH / 2 + canvas.width / 2;
        const screenY = (segment.x + segment.y) * TILE_HEIGHT / 2 + 100;

        // Draw 3D snake segment
        ctx.fillStyle = index === 0 ? '#FF6347' : '#228B22';  // Head is tomato, body is forest green
        ctx.beginPath();
        ctx.moveTo(screenX, screenY);
        ctx.lineTo(screenX + TILE_WIDTH / 2, screenY + TILE_HEIGHT / 2);
        ctx.lineTo(screenX + TILE_WIDTH / 2, screenY + TILE_HEIGHT / 2 - SNAKE_HEIGHT);
        ctx.lineTo(screenX, screenY - SNAKE_HEIGHT);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(screenX, screenY);
        ctx.lineTo(screenX - TILE_WIDTH / 2, screenY + TILE_HEIGHT / 2);
        ctx.lineTo(screenX - TILE_WIDTH / 2, screenY + TILE_HEIGHT / 2 - SNAKE_HEIGHT);
        ctx.lineTo(screenX, screenY - SNAKE_HEIGHT);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = index === 0 ? '#FF7F50' : '#32CD32';  // Lighter shade for top
        ctx.beginPath();
        ctx.moveTo(screenX, screenY - SNAKE_HEIGHT);
        ctx.lineTo(screenX + TILE_WIDTH / 2, screenY + TILE_HEIGHT / 2 - SNAKE_HEIGHT);
        ctx.lineTo(screenX, screenY + TILE_HEIGHT - SNAKE_HEIGHT);
        ctx.lineTo(screenX - TILE_WIDTH / 2, screenY + TILE_HEIGHT / 2 - SNAKE_HEIGHT);
        ctx.closePath();
        ctx.fill();

        if (index === 0) {
            // Draw eyes
            ctx.fillStyle = 'white';
            ctx.beginPath();
            ctx.arc(screenX - 5, screenY - SNAKE_HEIGHT + 5, 2, 0, Math.PI * 2);
            ctx.arc(screenX + 5, screenY - SNAKE_HEIGHT + 5, 2, 0, Math.PI * 2);
            ctx.fill();
        }
    });
}

function drawFood() {
    const screenX = (food.x - food.y) * TILE_WIDTH / 2 + canvas.width / 2;
    const screenY = (food.x + food.y) * TILE_HEIGHT / 2 + 100;

    // Draw 3D rotating apple
    ctx.save();
    ctx.translate(screenX, screenY - 10);
    ctx.rotate(rotationAngle);

    // Apple body
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.arc(0, 0, 10, 0, Math.PI * 2);
    ctx.fill();

    // Apple highlight
    ctx.fillStyle = '#FF6347';
    ctx.beginPath();
    ctx.arc(-3, -3, 5, 0, Math.PI * 2);
    ctx.fill();

    // Apple stem
    ctx.fillStyle = '#8B4513';
    ctx.fillRect(-1, -12, 2, 4);

    ctx.restore();
}

function generateFood() {
    food = {
        x: Math.floor(Math.random() * BOARD_WIDTH),
        y: Math.floor(Math.random() * BOARD_HEIGHT)
    };
}

function checkCollision() {
    const head = snake[0];
    if (head.x < 0 || head.x >= BOARD_WIDTH || head.y < 0 || head.y >= BOARD_HEIGHT) {
        endGame();
    }
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            endGame();
        }
    }
}

function endGame() {
    gameRunning = false;
    if (score > highScore) {
        highScore = score;
        updateHighScore();
        showNameInput();
    } else {
        showPlayButton();
    }
}

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
}

function updateHighScore() {
    highScore = Math.max(highScore, score);
    highScoreElement.textContent = `High Score: ${highScore}`;
    localStorage.setItem('snakeHighScore', highScore);
}

function showNameInput() {
    nameInput.style.display = 'block';
    submitScoreButton.style.display = 'block';
}

function showPlayButton() {
    playButton.style.display = 'block';
    updateHighScoreTable();
    highScoreTable.style.display = 'block';
}

function updateHighScoreTable() {
    const highScores = JSON.parse(localStorage.getItem('snakeHighScores')) || [];
    highScoreTableBody.innerHTML = '';
    highScores.sort((a, b) => b.score - a.score).slice(0, 5).forEach((entry, index) => {
        const row = highScoreTableBody.insertRow();
        row.insertCell(0).textContent = index + 1;
        row.insertCell(1).textContent = entry.name;
        row.insertCell(2).textContent = entry.score;
    });
}

document.addEventListener('keydown', (e) => {
    if (!gameRunning) return;
    switch (e.key) {
        case 'ArrowUp': if (dy === 0) { dx = 0; dy = -1; } break;
        case 'ArrowDown': if (dy === 0) { dx = 0; dy = 1; } break;
        case 'ArrowLeft': if (dx === 0) { dx = -1; dy = 0; } break;
        case 'ArrowRight': if (dx === 0) { dx = 1; dy = 0; } break;
    }
});

playButton.addEventListener('click', () => {
    gameRunning = true;
    playButton.style.display = 'none';
    highScoreTable.style.display = 'none';
    initGame();
    drawGame();
});

submitScoreButton.addEventListener('click', () => {
    const name = nameInput.value.trim() || 'Anonymous';
    const highScores = JSON.parse(localStorage.getItem('snakeHighScores')) || [];
    highScores.push({ name, score });
    localStorage.setItem('snakeHighScores', JSON.stringify(highScores));
    nameInput.style.display = 'none';
    submitScoreButton.style.display = 'none';
    showPlayButton();
});

// Load high score from local storage
highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
updateHighScore();
initGame();
drawBoard();