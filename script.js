const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const startBtn = document.getElementById('startBtn');
const scoreEl = document.getElementById('score');
const levelEl = document.getElementById('level');
const livesEl = document.getElementById('lives');
const message = document.getElementById('message');

const WIDTH = canvas.width;
const HEIGHT = canvas.height;

let mouseX = WIDTH / 2;
let mouseY = HEIGHT / 2;

let score = 0;
let level = 1;
let lives = 3;
let plantItems = [];
let intervalId;
let playerSize = 30;
let isRunning = false;

function startGame() {
  score = 0;
  level = 1;
  lives = 3;
  isRunning = true;
  plantItems = [];
  updateUI();
  message.textContent = '';
  spawnPlants();
  animate();
}

function updateUI() {
  scoreEl.textContent = score;
  levelEl.textContent = level;
  livesEl.textContent = lives;
}

function drawCursor() {
  ctx.fillStyle = '#388e3c';
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, playerSize / 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#1b5e20';
  ctx.stroke();
}

function drawPlant(x, y, size) {
  ctx.fillStyle = '#66bb6a';
  ctx.beginPath();
  ctx.arc(x, y, size, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#388e3c';
  ctx.stroke();
}

function spawnPlants() {
  clearInterval(intervalId);
  intervalId = setInterval(() => {
    if (!isRunning) return;
    const size = 15 + Math.random() * 15;
    const x = Math.random() * (WIDTH - size * 2) + size;
    const y = Math.random() * (HEIGHT - size * 2) + size;
    plantItems.push({ x, y, size });
  }, 2000 - level * 90); // faster as levels increase
}

function animate() {
  if (!isRunning) return;
  ctx.clearRect(0, 0, WIDTH, HEIGHT);

  drawCursor();

  plantItems.forEach((plant, index) => {
    drawPlant(plant.x, plant.y, plant.size);

    const dx = plant.x - mouseX;
    const dy = plant.y - mouseY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < plant.size + playerSize / 2) {
      plantItems.splice(index, 1);
      score += 10;
      updateUI();

      if (score >= level * 100 && level < 20) {
        level++;
        updateUI();
        message.textContent = `🌿 Level ${level} reached!`;
        setTimeout(() => (message.textContent = ''), 1500);
      }
    }
  });

  if (Math.random() < 0.01 * level) {
    // simulate bad plant (hazard)
    const size = 20;
    const x = Math.random() * (WIDTH - size * 2) + size;
    const y = Math.random() * (HEIGHT - size * 2) + size;
    plantItems.push({ x, y, size, bad: true });
  }

  // Check for bad plants
  plantItems.forEach((plant, i) => {
    if (plant.bad) {
      ctx.fillStyle = 'red';
      ctx.beginPath();
      ctx.arc(plant.x, plant.y, plant.size, 0, Math.PI * 2);
      ctx.fill();

      const dx = plant.x - mouseX;
      const dy = plant.y - mouseY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < plant.size + playerSize / 2) {
        plantItems.splice(i, 1);
        lives--;
        updateUI();
        message.textContent = `❌ Hit a bad plant!`;
function endGame() {
  isRunning = false;
  clearInterval(intervalId);
  message.textContent = '';

  finalScore.textContent = `Score: ${score}`;
  finalLevel.textContent = `Level Reached: ${level}`;
  resultsScreen.classList.remove('hidden');
}

        if (lives <= 0) {
          endGame();
        }

        setTimeout(() => (message.textContent = ''), 1500);
      }
    }
  });

  requestAnimationFrame(animate);
}

function endGame() {
  isRunning = false;
  clearInterval(intervalId);
  message.textContent = `Game Over! Final Score: ${score}`;
}
canvas.addEventListener('mousemove', (e) => {
  const rect = canvas.getBoundingClientRect();
  mouseX = e.clientX - rect.left;
  mouseY = e.clientY - rect.top;
});

startBtn.addEventListener('click', () => {
  if (!isRunning) {
    startGame();
  }
});
restartBtn.addEventListener('click', () => {
  resultsScreen.classList.add('hidden');
  startGame();
});
