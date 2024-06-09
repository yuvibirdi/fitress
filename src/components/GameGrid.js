// GameGrid.js

import React from 'react';
import { randomTetromino } from './helpers';

const GameGrid = ({ grid, tetromino, tetrominoPos, colours, className }) => {
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
          // console.log(tetromino)
          // console.log(cell)
          if (isOccupied){
            if (isTetrominoCell(rowIndex, colIndex)){
              return (
                <div key={`${rowIndex}-${colIndex}`} className={`cell ${isOccupied ? 'occupi`game-grid ${className}`{`game-grid ${className}`ed' : '' }`} style={{backgroundColor: colours}}>
                  {isOccupied}
                </div>
              );
            }else{
              return (
                // color issue is here, must add color to this div

                <div key={`${rowIndex}-${colIndex}`} className={`cell ${isOccupied ? 'occupied' : '' }`}>
                  {isOccupied}
                </div>
                // grid[rowIndex][colIndex]
              );
            }
          }else{
            return (
              <div key={`${rowIndex}-${colIndex}`} className={`cell ${isOccupied ? 'occupied' : '' }`} style={{backgroundColor: 'transparent'}}>
                {isOccupied}
              </div>
            );
          
          }
        })
      )}
    </div>
  );
};

export default GameGrid;
