const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

let W, H;
function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}
window.addEventListener("resize", resize);
resize();

// HUD
const scoreEl = document.getElementById("score");
const livesEl = document.getElementById("lives");
const overlay = document.getElementById("overlay");
const startBtn = document.getElementById("startBtn");

let keys = {};
window.addEventListener("keydown", (e) => {
  keys[e.key.toLowerCase()] = true;
  if (e.key.toLowerCase() === "r") restart();
});
window.addEventListener("keyup", (e) => {
  keys[e.key.toLowerCase()] = false;
});

// Player
const player = {
  x: 0, y: 0,
  r: 16,
  speed: 5
};

// Meteors
let meteors = [];
function spawnMeteor() {
  const r = 10 + Math.random() * 20;
  const x = Math.random() * W;
  const y = -r - 10;
  const speed = 2 + Math.random() * (3 + difficulty * 0.3);
  meteors.push({ x, y, r, speed });
}

// Particles
let particles = [];
function burst(x,y,color="#00ffd5"){
  for(let i=0;i<16;i++){
    particles.push({
      x, y,
      vx:(Math.random()-0.5)*6,
      vy:(Math.random()-0.5)*6,
      life: 40 + Math.random()*25,
      color
    });
  }
}

let running = false;
let score = 0;
let lives = 3;
let difficulty = 1;
let frame = 0;

function init() {
  player.x = W / 2;
  player.y = H * 0.75;
  meteors = [];
  particles = [];
  score = 0;
  lives = 3;
  difficulty = 1;
  frame = 0;
  updateHUD();
}

function updateHUD() {
  scoreEl.textContent = Math.floor(score);
  livesEl.textContent = lives;
}

function restart() {
  init();
  overlay.style.display = "flex";
  running = false;
}

startBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  running = true;
});

// Collision
function dist(ax, ay, bx, by) {
  return Math.hypot(ax - bx, ay - by);
}

// Drawing helpers
function glowCircle(x, y, r, color) {
  ctx.save();
  ctx.shadowBlur = 20;
  ctx.shadowColor = color;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawBackground() {
  ctx.fillStyle = "rgba(5,5,10,0.35)";
  ctx.fillRect(0, 0, W, H);

  // neon grid
  ctx.save();
  ctx.globalAlpha = 0.10;
  ctx.strokeStyle = "#00ffd5";
  ctx.lineWidth = 1;

  const gap = 60;
  for (let x = 0; x < W; x += gap) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, H);
    ctx.stroke();
  }
  for (let y = 0; y < H; y += gap) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(W, y);
    ctx.stroke();
  }
  ctx.restore();
}

function update() {
  requestAnimationFrame(update);
  drawBackground();

  if (!running) {
    // show preview player
    glowCircle(player.x, player.y, player.r, "#00ffd5");
    return;
  }

  frame++;

  // increase difficulty over time
  score += 0.12 + difficulty * 0.02;
  if (frame % 600 === 0) difficulty += 1;

  // spawn meteors
  if (frame % Math.max(30, 60 - difficulty * 3) === 0) spawnMeteor();

  // movement
  let vx = 0, vy = 0;
  if (keys["arrowleft"] || keys["a"]) vx = -1;
  if (keys["arrowright"] || keys["d"]) vx = 1;
  if (keys["arrowup"] || keys["w"]) vy = -1;
  if (keys["arrowdown"] || keys["s"]) vy = 1;

  player.x += vx * player.speed;
  player.y += vy * player.speed;

  // clamp
  player.x = Math.max(player.r, Math.min(W - player.r, player.x));
  player.y = Math.max(player.r, Math.min(H - player.r, player.y));

  // draw player
  glowCircle(player.x, player.y, player.r, "#00ffd5");

  // update meteors
  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i];
    m.y += m.speed;

    glowCircle(m.x, m.y, m.r, "#ff2d55");

    // collision
    if (dist(player.x, player.y, m.x, m.y) < player.r + m.r) {
      meteors.splice(i, 1);
      lives--;
      burst(player.x, player.y, "#00ffd5");
      burst(m.x, m.y, "#ff2d55");
      updateHUD();

      if (lives <= 0) {
        running = false;
        overlay.querySelector("h1").textContent = "GAME OVER";
        overlay.querySelector("p").textContent = `Score: ${Math.floor(score)} (Press R to Restart)`;
        startBtn.textContent = "PLAY AGAIN";
        overlay.style.display = "flex";
      }
      continue;
    }

    // offscreen
    if (m.y - m.r > H) meteors.splice(i, 1);
  }

  // particles
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;

    ctx.save();
    ctx.globalAlpha = Math.max(0, p.life / 60);
    glowCircle(p.x, p.y, 3, p.color);
    ctx.restore();

    if (p.life <= 0) particles.splice(i, 1);
  }

  updateHUD();
}

// Start
init();
update();
