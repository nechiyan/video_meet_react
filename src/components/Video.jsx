import React, { forwardRef } from 'react';
import styled from 'styled-components';

const Video = forwardRef(({ name, muted, isVideoDisabled, isAudioDisabled }, ref) => {
  return (
    <VideoWrapper>
      {isVideoDisabled ? (
        <DisabledVideoPlaceholder>
          <span>{name?.[0] || '?'}</span>
        </DisabledVideoPlaceholder>
      ) : (
        <VideoElement 
          playsInline 
          ref={ref} 
          autoPlay 
          muted={muted} 
        />
      )}
      
      <VideoOverlay>
        <Name>{name}</Name>
      </VideoOverlay>
      
      <StatusIndicator>
        <Icon active={!isVideoDisabled}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M23 7l-7 5 7 5V7z"></path>
            <rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect>
          </svg>
        </Icon>
        
        <Icon active={!isAudioDisabled}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"></path>
            <line x1="12" y1="19" x2="12" y2="23"></line>
            <line x1="8" y1="23" x2="16" y2="23"></line>
          </svg>
        </Icon>
      </StatusIndicator>
    </VideoWrapper>
  );
});

export default Video;


const VideoWrapper = styled.div`
  position: relative;
  width: 100%;
  max-width: 600px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  aspect-ratio: 16/9;
`;

const VideoElement = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const VideoOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  padding: 0.5rem;
`;

const Name = styled.p`
  margin: 0;
  color: white;
  font-weight: bold;
`;

const StatusIndicator = styled.div`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  display: flex;
  gap: 0.5rem;
`;

const Icon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);
  color: ${props => props.active ? 'white' : 'red'};
`;

const DisabledVideoPlaceholder = styled.div`
  width: 100%;
  height: 100%;
  background-color: #333;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 3rem;
`;
