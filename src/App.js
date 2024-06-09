  // App.js

  import React from 'react';
  import './App.css';
  import Tetris from './components/Tetris';
  import { useState, useEffect } from 'react';

  function App() {

    const [data, setData] = useState([]);

    const fetchData = () => {
      console.log("Fetching data App.js...")
      fetch("/exercise")
        .then((res) => res.json())
        .then((data) => {
          setData(data.exercise); // Adjust based on your JSON structure
          console.log(data);
        });
    };

    useEffect(() => {
      fetchData(); // Fetch data initially
      const interval = setInterval(fetchData, 200); // Poll every 5 seconds

      return () => clearInterval(interval); // Cleanup on unmount
    }, []);

    return (
      <div className="App">
        <Tetris data = {data}/>
      </div>
    );
  }

  export default App;
