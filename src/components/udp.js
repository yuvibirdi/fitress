import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, StyleSheet } from 'react-native';
import dgram from 'react-native-udp';

export default function App() {
  const [socket, setSocket] = useState(null);
  const [receivedMessage, setReceivedMessage] = useState('');

  useEffect(() => {
    const client = dgram.createSocket('udp4');

    client.bind(69420); // Bind to a specific port
    setSocket(client);

    client.on('listening', function() {
      console.log('UDP Client listening on port 69420');
    });

    client.on('message', function(msg, rinfo) {
      setReceivedMessage(msg.toString());
      console.log('Message received:', msg.toString());
    });

    return () => {
      if (socket) {
        socket.close();
      }
    };
  }, []);
