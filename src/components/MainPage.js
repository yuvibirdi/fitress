// MainPage.js

import React from 'react';

const MainPage = ({ startGame }) => {
  return (
    <div className="main-page">
      <header>
        <h1>Tetris Game</h1>
      </header>
      <main>
        <button onClick={startGame}>Start Game</button>
        {/* Additional content or instructions can be added here */}
      </main>
    </div>
  );
};

export default MainPage;
