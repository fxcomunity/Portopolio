<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Neon Dodge | Game</title>
  <link rel="stylesheet" href="style.css"/>
</head>
<body>

  <div class="hud">
    <div>❤️ <span id="lives">3</span></div>
    <div>⭐ Score: <span id="score">0</span></div>
    <div class="hint">Move: WASD / Arrow • Restart: R</div>
  </div>

  <canvas id="game"></canvas>

  <div class="overlay" id="overlay">
    <div class="panel">
      <h1>NEON DODGE</h1>
      <p>Hindari meteor selama mungkin.</p>
      <button id="startBtn">START</button>
      <p class="small">WASD / Arrow • R restart</p>
    </div>
  </div>

  <script src="game.js"></script>
</body>
</html>
