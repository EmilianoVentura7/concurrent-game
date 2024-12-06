let gameStatus = "playing"; // Estado inicial

self.onmessage = function (e) {
  const { action } = e.data;

  if (action === "startGame") {
    gameStatus = "playing"; 
  }

  if (action === "gameOver") {
    gameStatus = "Game Over"; // Cambiar estado a "Game Over"
  }

  if (action === "win") {
    gameStatus = "You Win!"; // Cambiar estado a "You Win!"
  }


  if (action === "getStatus") {
    self.postMessage({ action: "gameStatus", status: gameStatus });
  }
};