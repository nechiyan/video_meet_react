import React, { createContext, useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Peer from 'simple-peer';

const SocketContext = createContext();

const SocketContextProvider = ({ children }) => {
  const [stream, setStream] = useState(null);
  const [callEnded, setCallEnded] = useState(false);
  const [name, setName] = useState('');
  const [roomId, setRoomId] = useState('');
  const [peers, setPeers] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [chatMessages, setChatMessages] = useState([]);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  
  const myVideo = useRef();
  const socketRef = useRef(null);
  const peersRef = useRef([]);
  const navigate = useNavigate();

  const clientId = useRef(Math.random().toString(36).substr(2, 9)); // Unique client ID

  const ws = new WebSocket("ws://localhost:8000/ws/signaling/test/");
  ws.onopen = () => console.log("✅ WebSocket connected");
  ws.onerror = (error) => console.error("❌ WebSocket error:", error);
  ws.onclose = () => console.warn("⚠️ WebSocket closed");


  useEffect(() => {
    const getMediaStream = async () => {
      try {
        const currentStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        setStream(currentStream);
        if (myVideo.current) {
          myVideo.current.srcObject = currentStream;
        }
      } catch (error) {
        console.error('Error accessing media devices:', error);
      }
    };

    getMediaStream();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);

  const joinRoom = (userName, room) => {
  setName(userName);
  setRoomId(room);

  if (!socketRef.current) {
    console.log(`Attempting to connect to WebSocket for room: ${room}`);
    socketRef.current = new WebSocket(`ws://localhost:8000/ws/signaling/${room}/`);

    socketRef.current.onopen = () => {
      console.log("✅ WebSocket connection established");
      socketRef.current.send(JSON.stringify({ type: 'join', name: userName, clientId: clientId.current }));
    };

    socketRef.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log("📩 Received WebSocket Message:", data);

      switch (data.type) {
        case 'room_users':
          initializeConnections(data.users);
          break;
        case 'user_joined':
          createPeer(data.userId, data.name);
          break;
        case 'user_left':
          removePeer(data.userId);
          break;
        case 'offer':
          handleOffer(data);
          break;
        case 'answer':
          handleAnswer(data);
          break;
        case 'ice_candidate':
          handleIceCandidate(data);
          break;
        case 'chat_message':
          handleChatMessage(data);
          break;
        default:
          console.log('⚠️ Unknown message type:', data.type);
      }
    };

    socketRef.current.onerror = (error) => console.error("❌ WebSocket error:", error);

    socketRef.current.onclose = () => {
      console.warn("⚠️ WebSocket connection closed. Retrying in 3 seconds...");
      socketRef.current = null;
      setTimeout(() => {
        joinRoom(userName, room); // 🔄 Auto-reconnect
      }, 3000);
    };
  } else {
    console.log("ℹ️ WebSocket already exists, skipping new connection.");
  }

  navigate(`/room/${room}`);
};



  const initializeConnections = (users) => {
    users.forEach(user => {
      if (user.id !== clientId.current) {
        createPeer(user.id, user.name);
      }
    });
    setParticipants(users);
  };

  const createPeer = (userId, userName) => {
    if (peersRef.current.some(p => p.peerId === userId)) return;

    const peer = new Peer({ initiator: true, trickle: false, stream });

    peer.on('signal', (signal) => {
      socketRef.current.send(JSON.stringify({ type: 'offer', target: userId, offer: signal, from: clientId.current, fromName: name }));
    });

    peer.on('stream', (remoteStream) => {
      setPeers(prev => [...prev, { peerId: userId, peerName: userName, peer, stream: remoteStream }]);
    });

    peersRef.current.push({ peerId: userId, peerName: userName, peer });
  };

  const handleOffer = (data) => {
    const peer = new Peer({ initiator: false, trickle: false, stream });

    peer.on('signal', (signal) => {
      socketRef.current.send(JSON.stringify({ type: 'answer', target: data.from, answer: signal }));
    });

    peer.on('stream', (remoteStream) => {
      setPeers(prev => [...prev, { peerId: data.from, peerName: data.fromName, peer, stream: remoteStream }]);
    });

    peer.signal(data.offer);
  };

  const removePeer = (userId) => {
    peersRef.current = peersRef.current.filter(p => p.peerId !== userId);
    setPeers(prev => prev.filter(p => p.peerId !== userId));
    setParticipants(prev => prev.filter(p => p.id !== userId));
  };

const sendMessage = (message) => {
  if (!socketRef.current) {
    console.warn("⚠️ WebSocket is not connected. Retrying in 2 seconds...");
    setTimeout(() => sendMessage(message), 2000);
    return;
  }

  if (socketRef.current.readyState === WebSocket.CONNECTING) {
    console.log("⏳ WebSocket is still connecting. Retrying in 1 second...");
    setTimeout(() => sendMessage(message), 1000);
    return;
  }

  if (socketRef.current.readyState === WebSocket.OPEN) {
    socketRef.current.send(JSON.stringify({ type: 'chat_message', message, sender: name }));
    setChatMessages(prev => [...prev, { sender: name, message, timestamp: new Date().toISOString(), isMe: true }]);
  } else {
    console.error("❌ WebSocket is not open. Current state:", socketRef.current.readyState);
  }
};




  const leaveCall = () => {
    setCallEnded(true);
    peersRef.current.forEach(peer => peer.peer.destroy());
    peersRef.current = [];
    setPeers([]);
    if (socketRef.current) socketRef.current.close();
    navigate('/');
  };

  const toggleAudio = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => (track.enabled = !track.enabled));
      setIsAudioEnabled(prev => !prev);
    }
  };

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => (track.enabled = !track.enabled));
      setIsVideoEnabled(prev => !prev);
    }
  };

  return (
    <SocketContext.Provider value={{
      stream,
      callEnded,
      name,
      roomId,
      peers,
      participants,
      chatMessages,
      myVideo,
      isAudioEnabled,
      isVideoEnabled,
      joinRoom,
      leaveCall,
      sendMessage,
      toggleAudio,
      toggleVideo,
    }}>
      {children}
    </SocketContext.Provider>
  );
};

export { SocketContextProvider, SocketContext };