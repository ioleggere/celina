import React, { useState } from 'react';
import './index.scss'
const Chat: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setMessages([...messages, input]);
    setInput('');
  };

  return (
    <div className='chat'>
      <h1>CHAT</h1>
      <div className='mensages'>
        {messages.map((message, index) => (
          <div key={index}>{message}</div>
        ))}
      </div>
      <form onSubmit={handleMessageSubmit} className='mensage_form'>
        <input
          type="text"
          value={input}
          className='input'
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className='btn_send'>Enviar</button>
      </form>
    </div>
  );
};

export default Chat;