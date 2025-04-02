// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { SocketContextProvider } from './context/SocketContext';
import Home from './components/Home';
import VideoRoom from './components/VideoRoom';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  }
  
  body {
    background-color: #f5f5f5;
  }
`;

function App() {
  return (
    <Router>
      <GlobalStyle />
      <SocketContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/room/:roomId" element={<VideoRoom />} />
        </Routes>
      </SocketContextProvider>
    </Router>
  );
}

export default App;