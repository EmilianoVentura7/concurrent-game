self.onmessage = function (event) {
    const { type, data } = event.data;
  
    if (type === "checkCollision") {
      const { x, y, direction, tileSize, map } = data;
      const result = checkCollision(x, y, direction, tileSize, map);
      self.postMessage({ type: "collisionResult", result });
    }
  };
  
  function checkCollision(x, y, direction, tileSize, map) {
    let nextColumn = 0;
    let nextRow = 0;
    switch (direction) {
      case 3: // right
        nextColumn = x + tileSize;
        break;
      case 2: // left
        nextColumn = x - tileSize;
        break;
      case 0: // up
        nextRow = y - tileSize;
        break;
      case 1: // down
        nextRow = y + tileSize;
        break;
    }
  
    const column = nextColumn / tileSize;
    const row = nextRow / tileSize;
  
    if (map[row] && map[row][column] === 1) {
      return true; // Collision detected
    }
    return false; 
  }
  