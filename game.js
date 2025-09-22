const canvas = document.getElementById('pong');
const ctx = canvas.getContext('2d');

// Game settings
const paddleWidth = 12;
const paddleHeight = 100;
const ballRadius = 10;
const playerX = 20;
const aiX = canvas.width - playerX - paddleWidth;

// Game state
let playerY = (canvas.height - paddleHeight) / 2;
let aiY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 7 * (Math.random() < 0.5 ? 1 : -1);
let ballSpeedY = 5 * (Math.random() * 2 - 1);

// Draw functions
function drawRect(x, y, w, h, color="#fff") {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, w, h);
}
function drawCircle(x, y, r, color="#fff") {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2, false);
    ctx.closePath();
    ctx.fill();
}

// Draw everything
function draw() {
    // Clear
    drawRect(0, 0, canvas.width, canvas.height, '#111');
    // Net
    for (let i = 0; i < canvas.height; i += 30) {
        drawRect(canvas.width/2 - 2, i, 4, 20, "#444");
    }
    // Paddles
    drawRect(playerX, playerY, paddleWidth, paddleHeight, "#0ff");
    drawRect(aiX, aiY, paddleWidth, paddleHeight, "#f00");
    // Ball
    drawCircle(ballX, ballY, ballRadius, "#fff");
}

// Mouse control for player paddle
canvas.addEventListener('mousemove', function(evt) {
    const rect = canvas.getBoundingClientRect();
    const mouseY = evt.clientY - rect.top;
    playerY = mouseY - paddleHeight / 2;
    // Clamp within canvas
    playerY = Math.max(0, Math.min(playerY, canvas.height - paddleHeight));
});

// Basic AI for right paddle
function aiMove() {
    const center = aiY + paddleHeight / 2;
    const target = ballY - 35 * Math.sign(ballSpeedY);
    if (center < target - 10)
        aiY += 6;
    else if (center > target + 10)
        aiY -= 6;
    // Clamp
    aiY = Math.max(0, Math.min(aiY, canvas.height - paddleHeight));
}

// Collision detection
function collision(x, y, px, py) {
    return (
        x > px &&
        x < px + paddleWidth &&
        y > py &&
        y < py + paddleHeight
    );
}

// Ball movement & physics
function update() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Top and bottom wall collision
    if (ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }

    // Left paddle collision
    if (collision(ballX - ballRadius, ballY, playerX, playerY)) {
        ballSpeedX = -ballSpeedX;
        // Add some spin based on where it hit the paddle
        let collidePoint = ballY - (playerY + paddleHeight/2);
        ballSpeedY = collidePoint * 0.25;
    }

    // Right paddle collision
    if (collision(ballX + ballRadius, ballY, aiX, aiY)) {
        ballSpeedX = -ballSpeedX;
        let collidePoint = ballY - (aiY + paddleHeight/2);
        ballSpeedY = collidePoint * 0.25;
    }

    // Left or right wall (reset ball)
    if (ballX - ballRadius < 0 || ballX + ballRadius > canvas.width) {
        resetBall();
    }

    aiMove();
}

function resetBall() {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX = 7 * (Math.random() < 0.5 ? 1 : -1);
    ballSpeedY = 5 * (Math.random() * 2 - 1);
}

// Game loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();