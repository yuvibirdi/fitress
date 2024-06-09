import React, { useEffect, useState } from 'react';
import socketIOClient from 'socket.io-client';

const WebSocketComponent = () => {
    const [udpData, setUdpData] = useState(null);

    useEffect(() => {
        const socket = socketIOClient('http://localhost:5000'); // WebSocket connection to Flask server
        socket.on('udp_data', data => {
            setUdpData(data.exercise);
        });
        return () => socket.disconnect();
    }, []);

    return (
        <div>
            <h1>UDP Data:</h1>
            <p>{udpData}</p>
        </div>
    );
};

export default WebSocketComponent;
