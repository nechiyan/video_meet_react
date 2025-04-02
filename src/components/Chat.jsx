// src/components/Chat.js
import React, { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

const Chat = ({ messages, sendMessage, username }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);
  
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    sendMessage(message);
    setMessage('');
  };
  
  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <Container>
      <Header>
        <Title>Chat</Title>
      </Header>
      
      <MessagesContainer>
        {messages?.map((msg, index) => (
          <Message key={index} $isMe={msg.sender === username || msg.isMe}>
            <Sender>{msg.sender === username || msg.isMe ? 'You' : msg.sender}</Sender>
            <Content>{msg.message}</Content>
            <Time>{formatTime(msg.timestamp)}</Time>
          </Message>
        ))}
        <div ref={messagesEndRef} />
      </MessagesContainer>
      
      <InputContainer onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <SendButton type="submit" disabled={!message.trim()}>
          Send
        </SendButton>
      </InputContainer>
    </Container>
  );
};

export default Chat;


const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const Header = styled.div`
  padding: 1rem;
  background-color: #333;
  border-bottom: 1px solid #444;
`;

const Title = styled.h3`
  margin: 0;
  font-size: 1.2rem;
`;

const MessagesContainer = styled.div`
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Message = styled.div`
  padding: 0.75rem;
  border-radius: 8px;
  max-width: 80%;
  word-break: break-word;
  
  ${({ $isMe }) => $isMe ? `
    align-self: flex-end;
    background-color: #0B93F6;
    color: white;
  ` : `
    align-self: flex-start;
    background-color: #444;
    color: white;
  `}
`;


const Sender = styled.div`
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  opacity: 0.8;
`;

const Content = styled.div``;

const Time = styled.div`
  font-size: 0.7rem;
  text-align: right;
  margin-top: 0.25rem;
  opacity: 0.8;
`;

const InputContainer = styled.form`
  display: flex;
  padding: 0.5rem;
  background-color: #333;
  border-top: 1px solid #444;
`;

const Input = styled.input`
  flex: 1;
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  background-color: #444;
  color: white;
  
  &:focus {
    outline: none;
  }
`;

const SendButton = styled.button`
  margin-left: 0.5rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0 1rem;
  cursor: pointer;
  
  &:hover {
    background-color: #3367d6;
  }
  
  &:disabled {
    background-color: #666;
    cursor: not-allowed;
  }
`;
