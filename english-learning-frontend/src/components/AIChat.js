// src/components/Chat.js
import React, { useState } from 'react';
import axios from 'axios';
import '../css/Chat.css';

export default function AIChat() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [error, setError] = useState('');

  const handleSend = async () => {
    if (!input.trim()) return;

    const newMsg = { role: 'user', text: input };
    setMessages([...messages, newMsg]);
    setInput('');

    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://192.168.29.99:8000/chat/',
        { message: input },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      const botReply = { role: 'bot', text: res.data.assistant };
      setMessages((prev) => [...prev, botReply]);
      setError('');
    } catch (err) {
      setError('Something went wrong. Are you logged in?');
    }
  };

  return (
    <div className="chat-container">
      <h2 style={{fontFamily: 'Montserrat', color:'#6c63ff'}}>Chat with AI</h2>
      <div className="chat-box">
        {messages.map((msg, idx) => (
          <div key={idx} className={`chat-bubble ${msg.role}`}>
            {msg.text}
          </div>
        ))}
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button onClick={handleSend}>Send</button>
      </div>
      {error && <p className="error">{error}</p>}
    </div>
  );
}
