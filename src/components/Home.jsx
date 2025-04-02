// src/components/Home.js
import React, { useState, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import styled from 'styled-components';

const Home = () => {
  const { joinRoom } = useContext(SocketContext);
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [isCreating, setIsCreating] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name) {
      alert('Please enter your name');
      return;
    }
    
    if (isCreating) {
      // Create a new room
      try {
        const response = await fetch('http://localhost:8000/api/v1/rooms/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: `${name}'s Room` }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to create room');
        }
        
        const data = await response.json();
        joinRoom(name, data.id);
      } catch (error) {
        console.error('Error creating room:', error);
        alert('Failed to create room. Please try again.');
      }
    } else {
      // Join existing room
      if (!roomId) {
        alert('Please enter a room ID');
        return;
      }
      
      try {
        const response = await fetch(`http://localhost:8000/api/v1/rooms/${roomId}/`);
        
        if (!response.ok) {
          throw new Error('Room not found');
        }
        
        joinRoom(name, roomId);
      } catch (error) {
        console.error('Error joining room:', error);
        alert('Room not found. Please check the room ID and try again.');
      }
    }
  };

  return (
    <Container>
      <Card>
        <Title>Video Meet App</Title>
        <ToggleContainer>
          <ToggleButton 
            active={isCreating} 
            onClick={() => setIsCreating(true)}
          >
            Create Room
          </ToggleButton>
          <ToggleButton 
            active={!isCreating} 
            onClick={() => setIsCreating(false)}
          >
            Join Room
          </ToggleButton>
        </ToggleContainer>
        
        <Form onSubmit={handleSubmit}>
          <Input
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          
          {!isCreating && (
            <Input
              type="text"
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
            />
          )}
          
          <Button type="submit">
            {isCreating ? 'Create & Join' : 'Join Room'}
          </Button>
        </Form>
      </Card>
    </Container>
  );
};

export default Home;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f5f5f5;
`;

const Card = styled.div`
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h1`
  color: #333;
  text-align: center;
  margin-bottom: 2rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: #4285f4;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #3367d6;
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  justify-content: center;
  gap: 1rem;
`;

const ToggleButton = styled.button`
  background: ${props => props.active ? '#4285f4' : '#f5f5f5'};
  color: ${props => props.active ? 'white' : '#333'};
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
`;