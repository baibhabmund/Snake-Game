const canvas = document.getElementById("snakeCanvas");
const ctx = canvas.getContext("2d");

let box = 20; // Size of the snake block
let rows, cols; // Grid dimensions
let snake, dx, dy, score, changingDirection, difficultyLevel, obstacleCap;
let foods = [];
let obstacles = [];
let game;

function resizeCanvas() {
  // Calculate canvas size based on window size, reducing by 10% (0.9)
  const width = window.innerWidth * 0.9;  // 90% of the window width
  const height = window.innerHeight * 0.7; // 90% of the window height
  cols = Math.floor(width / box);  // Columns based on width
  rows = Math.floor(height / box); // Rows based on height
  
  canvas.width = cols * box;
  canvas.height = rows * box;
}

function startGame() {
  snake = [
    { x: 200, y: 200 },
    { x: 180, y: 200 },
    { x: 160, y: 200 },
  ];
  dx = box;
  dy = 0;
  score = 0;
  difficultyLevel = 1;
  obstacleCap = 50; // Increased obstacle limit
  foods = generateFood(5); // Increased initial food count
  obstacles = generateObstacles(10); // Increased initial obstacles count
  document.getElementById("score").innerText = score;
  document.getElementById("level").innerText = difficultyLevel;
  document.getElementById("gameOver").classList.add("hidden");
  game = setInterval(drawGame, 150);
}

document.addEventListener("keydown", changeDirection);

function drawRoundedRect(x, y, size, radius, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + size - radius, y);
  ctx.quadraticCurveTo(x + size, y, x + size, y + radius);
  ctx.lineTo(x + size, y + size - radius);
  ctx.quadraticCurveTo(x + size, y + size, x + size - radius, y + size);
  ctx.lineTo(x + radius, y + size);
  ctx.quadraticCurveTo(x, y + size, x, y + size - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.fill();
}

function drawGame() {
  if (isGameOver()) {
    clearInterval(game);
    document.getElementById("gameOver").classList.remove("hidden");
    return;
  }

  changingDirection = false;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawSnake();
  drawFoods();
  drawObstacles();
  moveSnake();
}

function drawSnake() {
  snake.forEach((part, index) =>
    drawRoundedRect(part.x, part.y, box, 6, index === 0 ? "#7CFC00" : "lime")
  );
}

function drawFoods() {
  for (const food of foods) {
    drawRoundedRect(food.x, food.y, box, 10, "red");
  }
}

function drawObstacles() {
  for (const obs of obstacles) {
    drawRoundedRect(obs.x, obs.y, box, 5, "#555");
  }
}

function moveSnake() {
  const head = { x: snake[0].x + dx, y: snake[0].y + dy };
  snake.unshift(head);

  const eatenFoodIndex = foods.findIndex(f => f.x === head.x && f.y === head.y);
  if (eatenFoodIndex !== -1) {
    score++;
    document.getElementById("score").innerText = score;
    foods.splice(eatenFoodIndex, 1);
    foods.push(generateValidPosition());

    // Increase difficulty every 5 points
    if (score % 5 === 0 && obstacles.length < obstacleCap) {
      obstacles.push(generateValidPosition());
      difficultyLevel++;
      document.getElementById("level").innerText = difficultyLevel;
    }

    // Add more food after each 10 points
    if (score % 10 === 0) {
      foods.push(generateValidPosition());
    }
  } else {
    snake.pop();
  }
}

function generateValidPosition() {
  let pos;
  do {
    pos = {
      x: Math.floor(Math.random() * cols) * box,
      y: Math.floor(Math.random() * rows) * box,
    };
  } while (
    snake.some(s => s.x === pos.x && s.y === pos.y) ||
    foods.some(f => f.x === pos.x && f.y === f.y) ||
    obstacles.some(o => o.x === pos.x && o.y === pos.y)
  );
  return pos;
}

function generateFood(count) {
  const foodList = [];
  for (let i = 0; i < count; i++) {
    foodList.push(generateValidPosition());
  }
  return foodList;
}

function generateObstacles(count) {
  const obsList = [];
  for (let i = 0; i < count; i++) {
    obsList.push(generateValidPosition());
  }
  return obsList;
}

function changeDirection(e) {
  if (changingDirection) return;
  changingDirection = true;

  const LEFT = 37, UP = 38, RIGHT = 39, DOWN = 40;
  const A = 65, W = 87, D = 68, S = 83;

  const goingUp = dy === -box;
  const goingDown = dy === box;
  const goingLeft = dx === -box;
  const goingRight = dx === box;

  if ((e.keyCode === LEFT || e.keyCode === A) && !goingRight) {
    dx = -box;
    dy = 0;
  } else if ((e.keyCode === UP || e.keyCode === W) && !goingDown) {
    dx = 0;
    dy = -box;
  } else if ((e.keyCode === RIGHT || e.keyCode === D) && !goingLeft) {
    dx = box;
    dy = 0;
  } else if ((e.keyCode === DOWN || e.keyCode === S) && !goingUp) {
    dx = 0;
    dy = box;
  }
}

function isGameOver() {
  const head = snake[0];
  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height
  ) return true;

  if (snake.slice(1).some(p => p.x === head.x && p.y === head.y))
    return true;

  if (obstacles.some(o => o.x === head.x && o.y === head.y))
    return true;

  return false;
}

function restartGame() {
  startGame();
}

// Initial setup
resizeCanvas();
window.addEventListener("resize", () => {
  resizeCanvas(); 
  startGame();  // Restart the game after resizing
});

startGame();
