let player;
let obstacles = [];
let score = 0;
let gameOver = false;

// Color timer
let t = 0;

// Kill bar size
const KILL_BAR_HEIGHT = 10;

function setup() {
  createCanvas(900, 900);
  resetGame();
}

function draw() {
  background(220);

  // Draw kill bars
  drawKillBars();

  if (gameOver) {
    textSize(32);
    fill(0);
    textAlign(CENTER, CENTER);
    text(
      'Game Over!\nScore: ' + score + '\nPress UP ARROW to Restart',
      width / 2,
      height / 2
    );
    return;
  }

  // Smooth RGB cycling
  let r = 128 + 127 * sin(t);
  let g = 128 + 127 * sin(t + TWO_PI / 3);
  let b = 128 + 127 * sin(t + (2 * TWO_PI) / 3);
  t += 0.03;

  // Player
  player.update();
  player.show();

  // Kill bar collision
  if (
    player.y - player.height / 2 <= KILL_BAR_HEIGHT ||
    player.y + player.height / 2 >= height - KILL_BAR_HEIGHT
  ) {
    gameOver = true;
  }

  // Spawn obstacles
  if (frameCount % 10 === 0) {
    obstacles.push(new Obstacle(r, g, b));
  }

  // Obstacles
  for (let i = obstacles.length - 1; i >= 0; i--) {
    let obs = obstacles[i];
    obs.update();
    obs.show();

    if (obs.hits(player)) {
      gameOver = true;
    }

    if (obs.offScreen()) {
      obstacles.splice(i, 1);
      score++;
    }
  }

  // Score
  textSize(24);
  fill(0);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 20, 20);
}

// Restart + control
function keyPressed() {
  if (keyCode === UP_ARROW) {
    if (gameOver) {
      resetGame();
    } else {
      player.rise();
    }
  }
}

function keyReleased() {
  if (keyCode === UP_ARROW) {
    player.fall();
  }
}

function resetGame() {
  score = 0;
  gameOver = false;
  obstacles = [];
  player = new Player();
}

// Draw top & bottom kill bars
function drawKillBars() {
  fill(255, 0, 0);
  noStroke();
  rect(0, 0, width, KILL_BAR_HEIGHT); // top
  rect(0, height - KILL_BAR_HEIGHT, width, KILL_BAR_HEIGHT); // bottom
}

// ================= PLAYER =================
class Player {
  constructor() {
    this.x = 50;
    this.y = height / 2;
    this.width = 40;
    this.height = 30;
    this.ySpeed = 0;
    this.gravity = 1.0;
    this.lift = -5;
    this.isRising = false;
  }

  update() {
    if (this.isRising) {
      this.ySpeed = this.lift;
    } else {
      this.ySpeed += this.gravity;
    }

    this.y += this.ySpeed;
  }

  rise() {
    this.isRising = true;
  }

  fall() {
    this.isRising = false;
  }

  show() {
    fill(255, 0, 0);
    noStroke();
    ellipse(this.x, this.y, this.width, this.height);
  }
}

// ================= OBSTACLE =================
class Obstacle {
  constructor(r, g, b) {
    this.width = random(80, 120);
    this.height = random(100, 150);
    this.x = width;
    this.y = random(KILL_BAR_HEIGHT, height - this.height - KILL_BAR_HEIGHT);
    this.speed = 6;

    this.r = r;
    this.g = g;
    this.b = b;
  }

  update() {
    this.x -= this.speed;
  }

  show() {
    fill(this.r, this.g, this.b);
    noStroke();
    rect(this.x, this.y, this.width, this.height);
  }

  hits(player) {
    return (
      player.x + player.width / 2 > this.x &&
      player.x - player.width / 2 < this.x + this.width &&
      player.y + player.height / 2 > this.y &&
      player.y - player.height / 2 < this.y + this.height
    );
  }

  offScreen() {
    return this.x + this.width < 0;
  }
}
