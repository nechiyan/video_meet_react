import React, { useState, useContext } from 'react';
import { SocketContext } from '../context/SocketContext';
import { DarkModeContext } from '../App';
import styled from 'styled-components';
import { Sun, Moon } from 'lucide-react';

const Home = () => {
  const { joinRoom } = useContext(SocketContext);
  const { darkMode, toggleDarkMode } = useContext(DarkModeContext);

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
    <Container darkMode={darkMode}>
         <DarkModeButton onClick={toggleDarkMode} darkMode={darkMode}>
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </DarkModeButton>
      <Card darkMode={darkMode}>
        
        <Title darkMode={darkMode}>Video Meet App</Title>
        <ToggleContainer>
          <ToggleButton 
            active={isCreating} 
            onClick={() => setIsCreating(true)}
            darkMode={darkMode}
          >
            Create Room
          </ToggleButton>
          <ToggleButton 
            active={!isCreating} 
            onClick={() => setIsCreating(false)}
            darkMode={darkMode}
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
            darkMode={darkMode}
          />
          
          {!isCreating && (
            <Input
              type="text"
              placeholder="Room ID"
              value={roomId}
              onChange={(e) => setRoomId(e.target.value)}
              required
              darkMode={darkMode}
            />
          )}
          
          <Button darkMode={darkMode} type="submit">
            {isCreating ? 'Create & Join' : 'Join Room'}
          </Button>
        </Form>
      </Card>
     

    </Container>
  );
};

export default Home;

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: ${(props) => (props.darkMode ? '#121212' : '#f5f5f5')};
`;


const Card = styled.div`
  background: ${(props) => (props.darkMode ? '#333' : 'white')};
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 500px;
`;

const Title = styled.h1`
  color: ${(props) => (props.darkMode ? '#fff' : '#333')};
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
  background-color: ${(props) => (props.darkMode ? '#444' : '#fff')};
  color: ${(props) => (props.darkMode ? '#fff' : '#000')};
`;

const Button = styled.button`
  padding: 0.75rem;
  background-color: ${(props) => (props.darkMode ? '#666' : '#4285f4')};
  color: ${(props) => (props.darkMode ? '#fff' : 'white')};
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: ${(props) => (props.darkMode ? '#555' : '#3367d6')};
  }
`;

const ToggleContainer = styled.div`
  display: flex;
  margin-top: 1rem;
  justify-content: center;
  gap: 1rem;
`;

const ToggleButton = styled.button`
  background: ${(props) => (props.active ? '#4285f4' : '#f5f5f5')};
  color: ${(props) => (props.active ? 'white' : '#333')};
  border: 1px solid #ddd;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
`;
const DarkModeButton = styled.button`
  position: absolute;
  top: 20px;
  right: 20px;
  background: transparent;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  border-radius: 50%;
  transition: all 0.3s ease-in-out;
  &:hover {
    background: ${(props) => (props.darkMode ? '#444' : '#ddd')};
  }
  svg {
    color: ${(props) => (props.darkMode ? '#FFff' : '#333')};
  }
`;
