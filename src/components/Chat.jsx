import React, { useState, useContext } from "react";
import styled from "styled-components";
import { SocketContext } from "../context/SocketContext";

const Chat = () => {
  const { name, chatMessages, sendMessage } = useContext(SocketContext);
  const [message, setMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
  };

  return (
    <Container>
      <MessagesContainer>
        {chatMessages.map((msg, index) => (
          <Message key={index} $isMe={msg.sender === name}>
            <Sender>{msg.sender === name ? "You" : msg.sender}</Sender>
            <Content>{msg.message}</Content>
          </Message>
        ))}
      </MessagesContainer>

      <InputContainer onSubmit={handleSendMessage}>
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
        />
        <SendButton type="submit">Send</SendButton>
      </InputContainer>
    </Container>
  );
};

export default Chat;

// Styled Components
const Container = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const MessagesContainer = styled.div`
  flex: 1;
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
  align-self: ${({ $isMe }) => ($isMe ? "flex-end" : "flex-start")};
  background-color: ${({ $isMe }) => ($isMe ? "#0B93F6" : "#444")};
  color: white;
`;

const Sender = styled.div`
  font-size: 0.8rem;
  margin-bottom: 0.25rem;
  opacity: 0.8;
`;

const Content = styled.div``;

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
