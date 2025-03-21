import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './Message.css';

const socket = io('http://192.168.1.9:5000');

function Message() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Get initial messages
    axios.get('http://192.168.1.9:5000/messages')
      .then(response => setMessages(response.data));

    // Socket.IO listeners
    socket.on('initMessages', (initialMessages) => {
      setMessages(initialMessages);
    });

    socket.on('newMessage', (newMessage) => {
      setMessages(prev => [...prev, newMessage]);
    });

    return () => {
      socket.off('initMessages');
      socket.off('newMessage');
    };
  }, []);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message && username) {
      socket.emit('sendMessage', { username, message });
      setMessage('');
    }
  };

  return (
    <div className="App-container">
      <h1>Smart Campus Chat</h1>
      
      <div className="username-container">
        <input
          type="text"
          placeholder="Select Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        { <div className='group-button'>
          <button type="submit" onClick={() => setUsername('')} ><span style={{color:'yellow'}}>+</span> Group</button>
        </div> }
      </div>

      <div className="messages-container">
        {messages.map((msg, index) => (
          <div key={index} className="message">
            <strong>{msg.username}: </strong>
            <span>{msg.message}</span>
            <small>{new Date(msg.timestamp).toLocaleTimeString()}</small>
          </div>
        ))}
      </div>

      <form onSubmit={sendMessage} className="message-form">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <button type="submit" disabled={!username}>Send</button>
      </form>
    </div>
  );
}

export default Message;