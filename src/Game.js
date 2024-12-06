import TileMap from "./components/TileMap.js";

const tileSize = 32;
const velocity = 2;

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const tileMap = new TileMap(tileSize);
const pacman = tileMap.getPacman(velocity);
const enemies = tileMap.getEnemies(velocity);

let gameOver = false;
let gameWin = false;
const gameOverSound = new Audio("sounds/gameOver.wav");
const gameWinSound = new Audio("sounds/gameWin.wav");

const gameStatsWorker = new Worker("./workers/gameWorker.js");

gameStatsWorker.onmessage = function (e) {
  const { action, message, elapsedTime } = e.data;

  if (action === "started") {
    console.log(message); 
  } else if (action === "stopped") {
    const timeElement = document.getElementById("timePlayed");
    if (timeElement) {
      timeElement.textContent = `Time Played: ${elapsedTime} seconds`;
    }
  }
};


function updateGameStatus(status) {
  const statusElement = document.getElementById("gameStatus");
  if (statusElement) {
    statusElement.textContent = `Game Status: ${status}`;
  }
}

gameStatsWorker.postMessage({ action: "start" });

function gameLoop() {
  tileMap.draw(ctx);
  
  pacman.draw(ctx, pause(), enemies);
  enemies.forEach((enemy) => enemy.draw(ctx, pause(), pacman));
  checkGameOver();
  checkGameWin();
}

function checkGameWin() {
  if (!gameWin) {
    gameWin = tileMap.didWin();
    if (gameWin) {
      gameWinSound.play();
      stopTracking();
      updateGameStatus("Win");
    }
  }
}

function checkGameOver() {
  if (!gameOver) {
    gameOver = isGameOver();
    if (gameOver) {
      gameOverSound.play();
      stopTracking();
      updateGameStatus("Game Over");
    }
  }
}

function isGameOver() {
  return enemies.some(
    (enemy) => !pacman.powerDotActive && enemy.collideWith(pacman)
  );
}

function pause() {
  return !pacman.madeFirstMove || gameOver || gameWin;
}

function drawGameEnd() {
  if (gameOver || gameWin) {
    let text = " You Win!";
    if (gameOver) {
      text = "Game Over";
    }

    ctx.fillStyle = "black";
    ctx.fillRect(0, canvas.height / 3.2, canvas.width, 80);

    ctx.font = "75px comic sans";
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
    gradient.addColorStop("0", "magenta");
    gradient.addColorStop("0.5", "blue");
    gradient.addColorStop("1.0", "red");

    ctx.fillStyle = gradient;
    ctx.fillText(text, 10, canvas.height / 2);
  }
}

function stopTracking() {
  gameStatsWorker.postMessage({ action: "stop" });
}

tileMap.setCanvasSize(canvas);
setInterval(gameLoop, 1000 / 75);