const canvas = document.getElementById('game-canvas');
const ctx = canvas.getContext("2d");
// нам знадобиться ігровий контейнер, щоб зробити його розмитим
// коли ми показуємо кінцеве меню
const gameContainer = document.getElementById('game-container');

const flappyImg = new Image();
flappyImg.src = 'img/flappy_dunk.png';

//Константи гри
const FLAP_SPEED = -5;
const BIRD_WIDTH = 40;
const BIRD_HEIGHT = 30;
const PIPE_WIDTH = 50;
const PIPE_GAP = 125;

// Bird variables
let birdX = 50;
let birdY = 50;
let birdVelocity = 0;
let birdAcceleration = 0.1;

// Трубні змінні
let pipeX = 400;
let pipeY = canvas.height - 200;

// змінні балів і рекордів
let scoreDiv = document.getElementById('score-display');
let score = 0;
let highScore = 0;

// ми додаємо змінну bool, щоб ми могли перевіряти, коли flappy пропуски ми збільшуємо
// значення
let scored = false;

// дозволяє нам керувати птахом за допомогою клавіші пробілу
document.body.onkeyup = function(e) {
    if (e.code === 'Space') {
        birdVelocity = FLAP_SPEED;
    }
}

// дозволяє перезапустити гру, якщо ми завершимо гру
document.getElementById('restart-button').addEventListener('click', function() {
    hideEndMenu();
    resetGame();
    loop();
})



function increaseScore() {
    // тепер збільшуйте наш лічильник, коли наша птиця проходить повз труби
    if(birdX > pipeX + PIPE_WIDTH &&
        (birdY < pipeY + PIPE_GAP ||
            birdY + BIRD_HEIGHT > pipeY + PIPE_GAP) &&
        !scored) {
        score++;
        scoreDiv.innerHTML = score;
        scored = true;
    }

    // скинути прапор, якщо птах проходить повз труби
    if (birdX < pipeX + PIPE_WIDTH) {
        scored = false;
    }
}

function collisionCheck() {
    // Створіть обмежувальні рамки для птаха та труб

    const birdBox = {
        x: birdX,
        y: birdY,
        width: BIRD_WIDTH,
        height: BIRD_HEIGHT
    }

    const topPipeBox = {
        x: pipeX,
        y: pipeY - PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: pipeY
    }

    const bottomPipeBox = {
        x: pipeX,
        y: pipeY + PIPE_GAP + BIRD_HEIGHT,
        width: PIPE_WIDTH,
        height: canvas.height - pipeY - PIPE_GAP
    }

    // Перевірте на предмет зіткнення з верхньою коробкою труб
    if (birdBox.x + birdBox.width > topPipeBox.x &&
        birdBox.x < topPipeBox.x + topPipeBox.width &&
        birdBox.y < topPipeBox.y) {
        return true;
    }

    // Перевірте наявність зіткнення з нижньою коробкою труб
    if (birdBox.x + birdBox.width > bottomPipeBox.x &&
        birdBox.x < bottomPipeBox.x + bottomPipeBox.width &&
        birdBox.y + birdBox.height > bottomPipeBox.y) {
        return true;
    }

    // перевірте, чи птах торкається меж
    return birdY < 0 || birdY + BIRD_HEIGHT > canvas.height;



}

function hideEndMenu () {
    document.getElementById('end-menu').style.display = 'none';
    gameContainer.classList.remove('backdrop-blur');
}

function showEndMenu () {
    document.getElementById('end-menu').style.display = 'block';
    gameContainer.classList.add('backdrop-blur');
    document.getElementById('end-score').innerHTML = score;
    // Таким чином ми завжди оновлюємо свій рекорд наприкінці гри
    // якщо ми маємо вищий високий бал, ніж попередній
    if (highScore < score) {
        highScore = score;
    }
    document.getElementById('best-score').innerHTML = highScore;
}

// ми скидаємо значення на початок, щоб почати
// з пташкою на початку
function resetGame() {
    birdX = 50;
    birdY = 50;
    birdVelocity = 0;
    birdAcceleration = 0.1;

    pipeX = 400;
    pipeY = canvas.height - 200;

    score = 0;
}

function endGame() {
    showEndMenu();
}

function loop() {
    // скинути ctx після кожної ітерації циклу
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Намалюйте Flappy Bird
    ctx.drawImage(flappyImg, birdX, birdY);

    // Малювати труби
    ctx.fillStyle = '#333';
    ctx.fillRect(pipeX, -100, PIPE_WIDTH, pipeY);
    ctx.fillRect(pipeX, pipeY + PIPE_GAP, PIPE_WIDTH, canvas.height - pipeY);

    // тепер нам потрібно буде додати перевірку зіткнень, щоб показати наше кінцеве меню
    // і завершити гру
    // collisionCheck поверне значення true, якщо у нас виникне зіткнення
    // інакше false
    if (collisionCheck()) {
        endGame();
        return;
    }

    // якщо труба виходить за рамку, нам потрібно скинути трубу
    pipeX -= 1.5;

    if (pipeX < -50) {
        pipeX = 400;
        pipeY = Math.random() * (canvas.height - PIPE_GAP) + PIPE_WIDTH;
    }

    // застосувати силу тяжіння до птаха і дозволити йому рухатися
    birdVelocity += birdAcceleration;
    birdY += birdVelocity;

    // завжди перевіряйте, якщо ви викликаєте функцію ...
    increaseScore()
    requestAnimationFrame(loop);
}

loop();