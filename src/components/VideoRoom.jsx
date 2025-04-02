import React, { useContext, useEffect, useState } from 'react';
import styled from 'styled-components';
import { SocketContext } from '../context/SocketContext';
import Video from './Video';
import Controls from './Controls';
import Chat from './Chat';

const VideoRoom = ({ match }) => {
  const {
    username,
    stream,
    myVideo,
    peers,
    messages,
    sendMessage,
    joinRoom,
    isAudioEnabled,
    isVideoEnabled,
    toggleAudio,
    toggleVideo,
    leaveCall
  } = useContext(SocketContext);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const roomIdFromUrl = match?.params?.roomId || '';
  
  useEffect(() => {
    if (roomIdFromUrl && username) {
      joinRoom(roomIdFromUrl, username);
    }
  }, [roomIdFromUrl, username, joinRoom]);
  
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  
  return (
    <RoomContainer>
      <MainContent>
        <VideoGrid>
          {stream && (
            <VideoContainer>
              <Video
                ref={myVideo}
                name={`${username} (You)`}
                muted
                isVideoDisabled={!isVideoEnabled}
                isAudioDisabled={!isAudioEnabled}
              />
            </VideoContainer>
          )}
          {Object.entries(peers).map(([userId, userData]) => (
            <VideoContainer key={userId}>
              <Video
                ref={(instance) => {
                  if (instance && userData.peer && !instance.srcObject) {
                    userData.peer.on('stream', (peerStream) => {
                      instance.srcObject = peerStream;
                    });
                  }
                }}
                name={userData.username}
                muted={false}
                isVideoDisabled={!userData.hasVideo}
                isAudioDisabled={!userData.hasAudio}
              />
            </VideoContainer>
          ))}
        </VideoGrid>
        <Controls
          isAudioEnabled={isAudioEnabled}
          isVideoEnabled={isVideoEnabled}
          toggleAudio={toggleAudio}
          toggleVideo={toggleVideo}
          leaveCall={leaveCall}
        />
      </MainContent>
      <ChatPanel $isOpen={isChatOpen}>
        <Chat messages={messages} sendMessage={sendMessage} username={username} />
      </ChatPanel>
      <ChatToggle $isOpen={isChatOpen} onClick={toggleChat}>
        {isChatOpen ? 'Hide Chat' : 'Show Chat'}
      </ChatToggle>
    </RoomContainer>
  );
};

export default VideoRoom;

const RoomContainer = styled.div`
  display: flex;
  height: 100vh;
  position: relative;
`;

const MainContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

const VideoGrid = styled.div`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  grid-auto-rows: 1fr;
  gap: 1rem;
  padding: 1rem;
  background-color: #1a1a1a;
  overflow: auto;
`;

const VideoContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const ChatPanel = styled.div.attrs(() => ({ role: 'complementary' }))`
  width: 300px;
  background-color: #262626;
  display: ${({ $isOpen }) => ($isOpen ? 'flex' : 'none')};
  flex-direction: column;
  transition: width 0.3s ease;

  @media (max-width: 768px) {
    position: absolute;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
  }
`;

const ChatToggle = styled.button.attrs(() => ({ type: 'button' }))`
  position: absolute;
  bottom: 80px;
  right: ${({ $isOpen }) => ($isOpen ? '310px' : '10px')};
  background-color: #4285f4;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  z-index: 20;

  @media (max-width: 768px) {
    bottom: 80px;
    right: ${({ $isOpen }) => ($isOpen ? '310px' : '10px')};
  }
`;
