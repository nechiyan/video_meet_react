import React, { useContext, useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { SocketContext } from '../context/SocketContext';
import Video from './Video';
import Controls from './Controls';
import Chat from './Chat';

const VideoRoom = ({ match }) => {
  const {
    name,
    stream,
    myVideo,
    peers,
    chatMessages,
    sendMessage,
    joinRoom,
    isAudioEnabled,
    isVideoEnabled,
    toggleAudio,
    toggleVideo,
    leaveCall,
    roomId,
    roomCreated,
    copyRoomId,
    participants 
  } = useContext(SocketContext);
  
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  const roomIdFromUrl = match?.params?.roomId || '';
  
  const localVideoRef = useRef();
  
  useEffect(() => {
    if (localVideoRef.current) {
      myVideo.current = localVideoRef.current;
    }
  }, [localVideoRef, myVideo]);
  
  useEffect(() => {
    if (stream && localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
    }
  }, [stream]);
  
  useEffect(() => {
    if (roomIdFromUrl && name) {
      joinRoom(name, roomIdFromUrl);
    }
  }, [roomIdFromUrl, name, joinRoom]);
  
  useEffect(() => {
    if (roomCreated && roomId) {
      handleCopyRoomId();
    }
  }, [roomCreated, roomId]);
  
  const handleCopyRoomId = () => {
    copyRoomId();
    setCopySuccess('Room ID copied to clipboard!');
    setTimeout(() => setCopySuccess(''), 3000);
  };
  
  const toggleChat = () => setIsChatOpen(!isChatOpen);
  
const participantCount = participants.length > 0 ? participants.length : (peers.length + 1);
  
  return (
    <RoomContainer>
      <RoomInfoBar>
        <RoomInfo>
          <h3>Room: {roomId}</h3>
          <CopyButton onClick={handleCopyRoomId}>
            {copySuccess || 'Copy Room ID'}
          </CopyButton>
        </RoomInfo>
       <ParticipantCount>
        {participantCount} {participantCount === 1 ? 'Participant' : 'Participants'}
      </ParticipantCount>

      </RoomInfoBar>
      
      <MainContent>
        <VideoGrid>
          {stream && (
            <VideoContainer>
              <Video
                ref={localVideoRef}
                muted={true}
                name={name + " (You)"}
                isVideoDisabled={!isVideoEnabled}
                isAudioDisabled={!isAudioEnabled}
              />
            </VideoContainer>
          )}
          {peers.map(({ peerId, peerName, stream }) => (
            <VideoContainer key={peerId}>
              <Video
                ref={(instance) => {
                  if (instance) {
                    instance.srcObject = stream;
                  }
                }}
                name={peerName}
                muted={false}
                isVideoDisabled={false}
                isAudioDisabled={false}
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
        <Chat messages={chatMessages} sendMessage={sendMessage} />
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
  flex-direction: column;
  height: 100vh;
  position: relative;
`;

const RoomInfoBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #262626;
  padding: 0.5rem 1rem;
  color: white;
`;

const RoomInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  
  h3 {
    margin: 0;
    font-size: 1rem;
  }
`;

const CopyButton = styled.button`
  background-color: #4285f4;
  border: none;
  color: white;
  padding: 0.3rem 0.7rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.8rem;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #3367d6;
  }
`;

const ParticipantCount = styled.div`
  font-size: 0.9rem;
  color: #e0e0e0;
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
  position: absolute;
  right: 0;
  top: 2.5rem; 
  bottom: 0;
  z-index: 10;
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