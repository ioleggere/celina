import React, { useContext, useEffect, useState } from 'react';
import './index.scss'
import { AuthContext } from '../../contexts/Auth/AuthContext';
interface ChatProps {
  socket: any
}

const Chat: React.FC<ChatProps> = ({ socket }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      socket.disconnect(); // Certifique-se de desconectar o socket
  };
    socket.on('message', (data: any) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });
    window.addEventListener('beforeunload', handleBeforeUnload);
  return () => {
    socket.off('message');
  };
  
}, [socket, messages]);

const handleMessageSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  if (socket) {
    socket.emit('message', (auth.user?.username + ": " + input));
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