// Tetris.js

import React, { useState, useEffect } from 'react';
import { createEmptyGrid, checkCollision, GRID_WIDTH, GRID_HEIGHT, randomTetromino } from './helpers';
import GameGrid from './GameGrid';
import './Tetris.css'; // Import Tetris-specific CSS

const Tetris = () => {
  const [grid, setGrid] = useState(createEmptyGrid());
  const [tetromino, setTetromino] = useState(randomTetromino());
  const [tetrominoPos, setTetrominoPos] = useState({ x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    const initializeGame = () => {
      setGrid(createEmptyGrid());
      setTetromino(randomTetromino());
      setTetrominoPos({ x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 });
      setGameOver(false);
    };

    initializeGame();
  }, []);

  useEffect(() => {
    const dropInterval = setInterval(() => {
      dropTetromino();
    }, 500);

    return () => clearInterval(dropInterval);
  }, [tetrominoPos, tetromino, grid]);

  const moveTetromino = (dx, dy) => {
    if (!checkCollision(tetromino, grid, { x: tetrominoPos.x + dx, y: tetrominoPos.y + dy })) {
      setTetrominoPos((prevPos) => ({
        x: prevPos.x + dx,
        y: prevPos.y + dy,
      }));
    }
  };

  const rotateTetromino = () => {
    const rotate = (matrix) => {
      // Transpose the matrix
      const transposed = matrix[0].map((_, i) => matrix.map(row => row[i]));
      // Reverse the rows to get the rotated matrix
      return transposed.map(row => row.reverse());
    };

    const rotatedTetromino = rotate(tetromino);

    // Check for collision with rotated tetromino
    if (!checkCollision(rotatedTetromino, grid, tetrominoPos)) {
      setTetromino(rotatedTetromino);
    }
  };

  const dropTetromino = () => {
    if (!checkCollision(tetromino, grid, { x: tetrominoPos.x, y: tetrominoPos.y + 1 })) {
      setTetrominoPos((prevPos) => ({
        ...prevPos,
        y: prevPos.y + 1,
      }));
    } else {
      // Lock the Tetromino in place and spawn a new one
      placeTetromino();
    }
  };

  const harddropTetromino = () => {
    let dropDistance = 0;
    while (!checkCollision(tetromino, grid, { x: tetrominoPos.x, y: tetrominoPos.y + dropDistance + 1 })) {
      dropDistance++;
    }
    // Set the Tetrimino position to the final drop position
    setTetrominoPos((prevPos) => ({
      ...prevPos,
      y: prevPos.y + dropDistance,
    }));
    // Lock the Tetrimino in place and spawn a new one
  };
  
  

  const placeTetromino = () => {
    const newGrid = grid.map((row) => [...row]);

    tetromino.forEach((row, y) => {
      row.forEach((cell, x) => {
        if (cell !== 0) {
          if (tetrominoPos.y + y >= 0) {
            newGrid[tetrominoPos.y + y][tetrominoPos.x + x] = cell;
          }
        }
      });
    });

    setGrid(newGrid);

    // Check for line clears
    for (let y = GRID_HEIGHT - 1; y >= 0; y--) {
      if (newGrid[y].every((cell) => cell !== 0)) {
        // Clear the line and shift the grid down
        newGrid.splice(y, 1);
        newGrid.unshift(Array(GRID_WIDTH).fill(0));
      }
    }

    // Spawn a new Tetromino
    const newTetromino = randomTetromino();
    const newTetrominoPos = { x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 };

    // Check for game over condition
    if (checkCollision(newTetromino, newGrid, newTetrominoPos)) {
      setGameOver(true);
    } else {
      setTetromino(newTetromino);
      setTetrominoPos(newTetrominoPos);
    }
  };

  const handleKeyDown = (event) => {
    if (!gameOver) {
      switch (event.key) {
        case 'ArrowLeft':
          moveTetromino(-1, 0);
          break;
        case 'ArrowRight':
          moveTetromino(1, 0);
          break;
        case 'ArrowDown':
          harddropTetromino();
          break;
        case 'ArrowUp':
          rotateTetromino();
          break;
        default:
          break;
      }
    }
  };

  useEffect(() => {
    // Add keyboard event listener
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      // Remove keyboard event listener
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="tetris">
      <h1>Tetris</h1>
      <GameGrid grid={grid} tetromino={tetromino} tetrominoPos={tetrominoPos} />
      {gameOver && <div className="game-over">Game Over</div>}
    </div>
  );
};

export default Tetris;
