import React, { useState, useEffect, useRef, FormEvent } from 'react';
import './App.css';
import { ChatMessage, OutgoingMessage } from './types';

const WEBSOCKET_URL = 'ws://localhost:8080';

function App() {
  const [username, setUsername] = useState<string>('');
  const [isUsernameSet, setIsUsernameSet] = useState<boolean>(false);
  const [tempUsername, setTempUsername] = useState<string>('');

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const ws = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isUsernameSet || !username) return;

    ws.current = new WebSocket(WEBSOCKET_URL);
    console.log('Tentando conectar ao WebSocket...');

    ws.current.onopen = () => {
      console.log('Conectado ao servidor WebSocket!');
      setIsConnected(true);
      const joinMessage: OutgoingMessage = { type: 'userJoined', user: username };
      ws.current?.send(JSON.stringify(joinMessage));
    };

    ws.current.onmessage = (event) => {
      try {
        const receivedMessage: ChatMessage = JSON.parse(event.data as string);
        setMessages((prevMessages) => [...prevMessages, { ...receivedMessage, id: Math.random().toString(36).substr(2, 9) }]);
      } catch (error) {
        console.error("Erro ao processar mensagem recebida:", error);
        const errorMessage: ChatMessage = {
          type: 'info',
          text: `Erro ao processar mensagem: ${event.data}`,
          timestamp: new Date().toISOString(),
          id: Math.random().toString(36).substr(2, 9)
        };
        setMessages((prevMessages) => [...prevMessages, errorMessage]);
      }
    };

    ws.current.onclose = () => {
      console.log('Desconectado do servidor WebSocket.');
      setIsConnected(false);
      setMessages((prevMessages) => [...prevMessages, {
        type: 'info',
        text: 'Você foi desconectado. Tente recarregar a página.',
        timestamp: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9)
      }]);
    };

    ws.current.onerror = (error) => {
      console.error('Erro no WebSocket:', error);
      setIsConnected(false);
      setMessages((prevMessages) => [...prevMessages, {
        type: 'info',
        text: 'Erro na conexão WebSocket. O servidor está rodando?',
        timestamp: new Date().toISOString(),
        id: Math.random().toString(36).substr(2, 9)
      }]);
    };

    return () => {
      ws.current?.close();
    };
  }, [isUsernameSet, username]); 

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleUsernameSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (tempUsername.trim()) {
      setUsername(tempUsername.trim());
      setIsUsernameSet(true);
    }
  };

  const sendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (currentMessage.trim() && ws.current?.readyState === WebSocket.OPEN) {
      const messageToSend: OutgoingMessage = {
        type: 'newMessage',
        user: username,
        text: currentMessage.trim(),
      };
      ws.current.send(JSON.stringify(messageToSend));
      setCurrentMessage('');
    } else if (ws.current?.readyState !== WebSocket.OPEN) {
        console.error("WebSocket não está aberto. Estado atual:", ws.current?.readyState);
         setMessages((prevMessages) => [...prevMessages, {
            type: 'info',
            text: 'Não é possível enviar mensagem. Conexão perdida.',
            timestamp: new Date().toISOString(),
            id: Math.random().toString(36).substr(2, 9)
         }]);
    }
  };

  if (!isUsernameSet) {
    return (
      <div className="App username-container">
        <form onSubmit={handleUsernameSubmit}>
          <h1>Entrar no Chat</h1>
          <input
            type="text"
            placeholder="Digite seu apelido"
            value={tempUsername}
            onChange={(e) => setTempUsername(e.target.value)}
            autoFocus
          />
          <button type="submit">Entrar</button>
        </form>
      </div>
    );
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Chat com {username}</h1>
        <p className={isConnected ? 'status-connected' : 'status-disconnected'}>
          Status: {isConnected ? 'Conectado' : 'Desconectado'}
        </p>
      </header>
      <div className="chat-window">
        {messages.map((msg) => (
          <div key={msg.id} className={`message-item message-${msg.type}`}>
            {msg.type === 'message' && <span className="message-user">{msg.user}: </span>}
            <span className="message-text">{msg.text}</span>
            <span className="message-timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form className="message-input-form" onSubmit={sendMessage}>
        <input
          type="text"
          placeholder="Digite sua mensagem..."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          disabled={!isConnected}
        />
        <button type="submit" disabled={!isConnected || !currentMessage.trim()}>
          Enviar
        </button>
      </form>
    </div>
  );
}

export default App;