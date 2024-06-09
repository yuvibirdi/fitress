import React, { useState, useEffect } from 'react';
import { createEmptyGrid, checkCollision, GRID_WIDTH, GRID_HEIGHT, randomTetromino } from './helpers';
import GameGrid from './GameGrid';
import './Tetris.css'; // Import Tetris-specific CSS

const Tetris = () => {
  const [grid, setGrid] = useState(createEmptyGrid(15, 10));
  const [tetromino, setTetromino] = useState();
  const [tetrominoPos, setTetrominoPos] = useState({ x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [colours, setColours] = useState();
  const [hold, setHold] = useState(null);
  const [hasHeld, setHasHeld] = useState(false);
  const [nextThreeTetrominos, setNextThreeTetrominos] = useState([null, null, null]);
  

  useEffect(() => {
    const initializeGame = () => {
      setGrid(createEmptyGrid(15, 10));
      const temp = randomTetromino();
      setTetromino(temp.shape);
      setColours(temp.color);
      setTetrominoPos({ x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 });
      setGameOver(false);
      setNextThreeTetrominos([randomTetromino(), randomTetromino(), randomTetromino()]);
    };

    initializeGame();
  }, []);

  useEffect(() => {
    const dropInterval = setInterval(() => {
      if(!gameOver){
        dropTetromino();
      }
    }, 500);
      // console.log(tetromino)
      // console.log(colours)
    return () => clearInterval(dropInterval);
 }, [tetrominoPos, tetromino, grid, colours]);

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
      placeTetromino(tetrominoPos);
    }
  };

  const harddropTetromino = () => {
    setHasHeld(false);

    let dropDistance = 0;
    while (!checkCollision(tetromino, grid, { x: tetrominoPos.x, y: tetrominoPos.y + dropDistance + 1 })) {
      dropDistance++;
    }
    // Set the Tetrimino position to the final drop position
    // setTetrominoPos((prevPos) => ({
    //   ...prevPos,
    //   y: prevPos.y + dropDistance,
    // }));
    // for(let i=0; i<dropDistance; i++){
    //   dropTetromino();
    // }
    let temp_tetrominoPos = {x: tetrominoPos.x, y: tetrominoPos.y + dropDistance}
    setTetrominoPos((prevPos) => ({
      ...prevPos,
      y: (prevPos.y + dropDistance),
    }));
        // ...tetrominoPos,
        // y: tetrominoPos.y + dropDistance,
        // x: tetrominoPos.x,
        // y: tetrominoPos.y + dropDistance,
    

    // Lock the Tetrimino in place and spawn a new one
    placeTetromino(temp_tetrominoPos);
  };

  const spawnTetromino = () => {
    popAndSetNextTetromino();
    setTetrominoStartPos();
  };

  const setTetrominoStartPos = () => {
    const newTetrominoPos = { x: Math.floor(GRID_WIDTH / 2) - 1, y: 0 };
    if (checkCollision(tetromino, grid, newTetrominoPos)) {
      setGameOver(true);
    } else {
      setTetrominoPos(newTetrominoPos);
    }
  }

  const popAndSetNextTetromino = () => {
    setTetromino(nextThreeTetrominos[0].shape);
    setColours(nextThreeTetrominos[0].color);
    for(let i=0; i<nextThreeTetrominos.length-1; i++){
      nextThreeTetrominos[i] = nextThreeTetrominos[i+1];
    }
    nextThreeTetrominos[nextThreeTetrominos.length-1] = randomTetromino();

  }

  const placeTetromino = (tetrominoPos) => {
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
        y++;
      }
    }

    // Spawn a new Tetromino
    spawnTetromino();
  };


  const holdTetromino = () => {

    if(hasHeld){
      return;
    } else {
      setHasHeld(true);
    }
    
    // swap curr tetronimo and hold tetronimo, update coords of new curr tetronimo, update board
    // swap
    if(hold===null){
      setHold({tetromino, colours});
      popAndSetNextTetromino();
    } else {
      let temp=hold;
      setHold({tetromino, colours});
      setTetromino(temp.tetromino);
      setColours(temp.colours);
    }

    // above set methods may not set in time for this method call, be wary of that, use print here
    setTetrominoStartPos()
  }

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
        case 'Enter':
          holdTetromino();
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

  console.log(hold)


  return (
    <div className='whole'>
      <div className='tetrisTwo'>
        <div className='uppt2'>
          <h2>HOLDS</h2>
          <div className='hold'>
            {hold ? (<GameGrid grid={createEmptyGrid(5, 10)} tetromino={hold.tetromino} tetrominoPos={{ x: 2, y: 1}} colours={hold.colours} />) : ( <GameGrid
          grid={createEmptyGrid(5, 10)} // Render an empty grid
        />)}
        </div>
      </div>
      </div>
    <div className="tetris">
      <div className='up'>
        <h1>FITRIS</h1>
        <GameGrid grid={grid} tetromino={tetromino} tetrominoPos={tetrominoPos} colours={colours} /> {/* Pass colours prop */}
        {gameOver && (
          <div className="game-over-overlay">
            <div className="game-over">
              Game Over
            </div>
            <button className="play" onClick={() => window.location.reload()}>Play Again</button>
          </div>
        )}
      </div>
    </div>
    <div className='tetrisThree'>
        <div className='uppt2'>
          <h2>NEXT</h2>
          <div className='next-tetrominos'>
            {nextThreeTetrominos.map((nextTetromino, index) => (
              nextTetromino && (
              <div key={index}>
                <GameGrid
                  grid={createEmptyGrid(4, 10)}
                  tetromino={nextTetromino.shape}
                  tetrominoPos={{ x: 2, y: 1 }}
                  colours={nextTetromino.color}
                />
              </div>
              )
            ))}     
          </div>   
        </div>
      </div>
    
    </div>
  );
};

export default Tetris;
