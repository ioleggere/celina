import React, { useContext, useEffect, useState } from 'react';
import './index.scss'
import { AuthContext } from '../../contexts/Auth/AuthContext';
import io from 'socket.io-client';
interface ChatProps {
  room: string
}

const Chat: React.FC<ChatProps> = ({ room }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const socket = io(import.meta.env.VITE_CELINA_API + '/' + room);
  
  useEffect(() => {
    // Listen for messages from the server
    socket.on('receive_message', (data) => {
      setMessages((prevMessages) => [...prevMessages, `${data.username}: ${data.message}`]);
    });

    // Clean up the effect when the component is unmounted
    return () => {
      socket.disconnect();
    };
  }, [socket]);

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const message = input;
    if (message.trim()) {
      // Send the message to the server
      socket.emit('send_message', {
        username: auth.user?.username,
        message
      });
      setInput('');
    }
  };
  const auth = useContext(AuthContext);
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