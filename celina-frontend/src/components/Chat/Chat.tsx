import React, { useContext, useEffect, useState } from 'react';
import './index.scss';
import classNames from 'classnames';
import { AuthContext } from '../../contexts/Auth/AuthContext';

interface ChatProps {
  socket: any;
}

const Chat: React.FC<ChatProps> = ({ socket }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [minimized, setMinimized] = useState(false);
  const [hasUnreadMessages, setHasUnreadMessages] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      socket.disconnect(); // Certifique-se de desconectar o socket
    };

    socket.on('message', (data: any) => {
      setMessages((prevMessages) => [...prevMessages, data]);
      if (minimized) {
        setHasUnreadMessages(true);
      }
    });

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      socket.off('message');
    };
  }, [socket, minimized]);

  const handleMessageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (socket) {
      socket.emit('message', `${auth.user?.username}: ${input}`);
      setInput('');
    }
  };

  const toggleMinimized = () => {
    setMinimized((prevMinimized) => !prevMinimized);
    if (hasUnreadMessages) {
      setHasUnreadMessages(false); // Limpar a flag ao maximizar
    }
  };

  const auth = useContext(AuthContext);

  return (
    <div className={classNames('chat-component', { minimized, hasUnread: hasUnreadMessages })}>
      {!minimized && (
        <>
          <span className='title-chat'>CHAT</span>
          <div className='messages'>
            {messages.map((message, index) => (
              <div key={index}>{message}</div>
            ))}
          </div>
          <form onSubmit={handleMessageSubmit} className='message_form'>
            <input
              type="text"
              value={input}
              className='input'
              onChange={(e) => setInput(e.target.value)}
            />
            <button type="submit" className='btn_send'>{'>'}</button>
          </form>
        </>
      )}
      <div className="btn_toggle-container">
      <button onClick={toggleMinimized}  className={classNames('btn_toggle', { minimized })}>
        {minimized ? 'Chat' : 'Minimizar'}
      </button>
    </div>
    </div>
  );
};

export default Chat;

