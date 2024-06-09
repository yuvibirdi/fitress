// helpers.js

export const GRID_WIDTH = 10;
export const GRID_HEIGHT = 15;

export const createEmptyGrid = () => {
  return Array.from(Array(GRID_HEIGHT), () => Array(GRID_WIDTH).fill(0));
};

export const checkCollision = (tetromino, grid, { x: moveX, y: moveY }) => {
  for (let y = 0; y < tetromino.length; y++) {
    for (let x = 0; x < tetromino[y].length; x++) {
      if (tetromino[y][x] !== 0) {
        const newX = x + moveX;
        const newY = y + moveY;

        // Check if the tetromino is within the grid boundaries
        if (newX < 0 || newX >= GRID_WIDTH || newY >= GRID_HEIGHT) {
          return true;
        }

        // Check if the tetromino collides with existing blocks in the grid
        if (newY >= 0 && grid[newY][newX] !== 0) {
          return true;
        }
      }
    }
  }
  return false;
};

export const randomTetromino = () => {
  const tetrominoes = [
    { shape: [[1, 1, 1, 1]], color: 'cyan' },            // I
    { shape: [[1, 1, 1], [0, 1, 0]], color: 'purple' },  // T
    { shape: [[1, 1, 1], [1, 0, 0]], color: 'blue' },    // J
    { shape: [[1, 1, 1], [0, 0, 1]], color: 'orange' },  // L
    { shape: [[1, 1], [1, 1]], color: 'yellow' },        // O
    { shape: [[0, 1, 1], [1, 1, 0]], color: 'green' },   // S
    { shape: [[1, 1, 0], [0, 1, 1]], color: 'red' },     // Z

];

const randomIndex = Math.floor(Math.random() * tetrominoes.length);
return tetrominoes[randomIndex];
};