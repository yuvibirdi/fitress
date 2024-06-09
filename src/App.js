import React, { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState([]);

  const fetchData = () => {
    fetch("/exercise")
      .then((res) => res.json())
      .then((data) => {
        setData(data.exercise); // Adjust based on your JSON structure
        console.log(data);
      });
  };

  useEffect(() => {
    fetchData(); // Fetch data initially
    const interval = setInterval(fetchData, 5000); // Poll every 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, []);

  return (
    <div>
      {data.map((item, index) => (
        <div key={index}>{item}</div>
      ))}
    </div>
  );
}

export default App;
