import React from 'react';
import styled from 'styled-components';
import Video from './Video';


const VideoGrid = ({ myStream, myVideo, myName, peers, isVideoEnabled, isAudioEnabled }) => {
  const totalParticipants = peers.length + 1; 
  
  return (
    <Grid>
      <VideoContainer>
        <Video 
          ref={myVideo} 
          muted 
          name={`${myName} (You)`}
          isVideoDisabled={!isVideoEnabled}
          isAudioDisabled={!isAudioEnabled}
        />
      </VideoContainer>
      
      {peers.map((peerObj) => (
        <VideoContainer key={peerObj.peerId}>
          <Video
            srcObject={peerObj.stream}
            name={peerObj.peerName}
          />
        </VideoContainer>
      ))}
    </Grid>
  );
};

export default VideoGrid;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  grid-auto-rows: 240px;
  gap: 1rem;
  width: 100%;
  padding: 1rem;
`;

const VideoContainer = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
  border-radius: 8px;
`;
