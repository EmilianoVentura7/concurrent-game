onmessage = function (event) {
    const { type, x, y, tileSize, currentDirection, tileMap } = event.data;
  
    if (type === "changeDirection") {
      const directions = [0, 1, 2, 3];
      const validDirections = directions.filter((direction) => {
        return !didCollideWithEnvironment(x, y, direction, tileSize, tileMap);
      });
  
      const newDirection =
        validDirections.length > 0
          ? validDirections[Math.floor(Math.random() * validDirections.length)]
          : currentDirection;
  
      postMessage({ type: "newDirection", newDirection });
    }
  };
  
  function didCollideWithEnvironment(x, y, direction, tileSize, tileMap) {
    const row = Math.floor(y / tileSize);
    const column = Math.floor(x / tileSize);
  
    switch (direction) {
      case 3: // right
        return tileMap[row][column + 1] === 1;
      case 2: // left
        return tileMap[row][column - 1] === 1;
      case 0: // up
        return tileMap[row - 1][column] === 1;
      case 1: // down
        return tileMap[row + 1][column] === 1;
      default:
        return false;
    }
  }
    