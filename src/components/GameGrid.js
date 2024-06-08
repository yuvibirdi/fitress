// GameGrid.js

import React from 'react';

const GameGrid = ({ grid, tetromino, tetrominoPos }) => {
  const isTetrominoCell = (rowIndex, colIndex) => {
    if (
      tetromino &&
      rowIndex >= tetrominoPos.y &&
      rowIndex < tetrominoPos.y + tetromino.length &&
      colIndex >= tetrominoPos.x &&
      colIndex < tetrominoPos.x + tetromino[0].length &&
      tetromino[rowIndex - tetrominoPos.y][colIndex - tetrominoPos.x] !== 0
    ) {
      return true;
    }
    return false;
  };

  return (
    <div className="game-grid">
      {grid.map((row, rowIndex) => 
        row.map((cell, colIndex) => {
          const isOccupied = cell !== 0 || isTetrominoCell(rowIndex, colIndex);
          return (
            <div key={`${rowIndex}-${colIndex}`} className={`cell ${isOccupied ? 'occupied' : ''}`}>
              {isOccupied && cell}
            </div>
          );
        })
      )}
    </div>
  );
};

export default GameGrid;
