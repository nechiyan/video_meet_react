# Video Calling Application

A real-time video calling application built with Django REST Framework, WebSocket, and React that allows users to create and join video conference rooms.

## Features

- Create or join video conference rooms with a unique identifier
- Real-time video and audio streaming using WebRTC
- Text chat alongside video calls
- Mute/unmute audio and enable/disable video
- Responsive design with dark mode support
- Multi-user support with grid layout (need to implement)

## Technology Stack

### Backend
- Django 4.2.7
- Django REST Framework 3.14.0
- Django Channels 4.0.0 (for WebSocket)
- Redis (for Channels layer)

### Frontend
- React 18
- React Router
- simple-peer (WebRTC)
- styled-components

## python
- install req.txt file and venv activate