import axios from 'axios';

const API_URL = 'http://localhost:8000';

const api = {
  createOrJoinRoom: async (name, roomId = null) => {
    try {
      const response = await axios.post(`${API_URL}/api/v1/create-or-join-room/`, {
        name,
        room_id: roomId
      });
      return response.data;
    } catch (error) {
      console.error('Error creating/joining room:', error);
      throw error;
    }
  },
  
  getMessages: async (roomId) => {
    try {
      const response = await axios.get(`${API_URL}/api/v1/messages/${roomId}/`);
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }
};

export default api;