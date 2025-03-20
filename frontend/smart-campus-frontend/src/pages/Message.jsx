import { useState, useEffect } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './Message.css';
import { Layer } from 'recharts';
import Layout from './Layout';

const socket = io('http://localhost:5000');

function Message() {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [username, setUsername] = useState('');

  useEffect(() => {
    // Get initial messages
    axios.get('http://localhost:5000/api/messages')
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

//   const sendMessage = (e) => {
//     e.preventDefault();
//     if (message && username) {
//       socket.emit('sendMessage', { username, message });
//       setMessage('');
//     }
//   };
const sendMessage = (e) => {
    e.preventDefault();
    if (message && username) {
      console.log("Sending message:", { username, message }); // Debug log
      socket.emit('sendMessage', { username, message });
      setMessage('');
    } else {
      console.log("Username or message is empty");
    }
  };

  return (
    <Layout>
        <div className="message-panel">
        <h1>Chat Box</h1>
        
        <div className="username-container">
            <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
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
    </Layout>
  );
}

export default Message;