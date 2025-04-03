import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SocketContextProvider } from './context/SocketContext';
import Home from './components/Home';
import VideoRoom from './components/VideoRoom';
import { createGlobalStyle } from 'styled-components';

export const DarkModeContext = createContext();

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  body {
    background-color: ${(props) => (props.darkMode ? '#121212' : '#f5f5f5')};
    color: ${(props) => (props.darkMode ? '#ffffff' : '#000000')};
    transition: background-color 0.3s, color 0.2s;
  }
`;

function App() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setDarkMode((prevMode) => !prevMode);
  };

  return (
    <Router>
      <DarkModeContext.Provider value={{ darkMode, toggleDarkMode }}>
        <GlobalStyle darkMode={darkMode} />
        <SocketContextProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/room/:roomId" element={<VideoRoom />} />
          </Routes>
        </SocketContextProvider>
      </DarkModeContext.Provider>
    </Router>
  );
}

export default App;
