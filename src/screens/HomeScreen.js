import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { Plus, LogIn, Image, Users } from 'lucide-react';
import '../styles/HomeScreen.css';

const HomeScreen = () => {
  const { createRoom, joinRoom, setCurrentScreen } = useContext(AppContext);
  const [showCreateRoom, setShowCreateRoom] = useState(false);
  const [showJoinRoom, setShowJoinRoom] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [userName, setUserName] = useState('');
  const [joinRoomId, setJoinRoomId] = useState('');
  const [joinUserName, setJoinUserName] = useState('');

  const handleCreateRoom = (e) => {
    e.preventDefault();
    if (roomName.trim() && userName.trim()) {
      createRoom(roomName, userName);
      setRoomName('');
      setUserName('');
      setShowCreateRoom(false);
    }
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    if (joinRoomId.trim() && joinUserName.trim()) {
      joinRoom(joinRoomId, joinUserName);
      setJoinRoomId('');
      setJoinUserName('');
      setShowJoinRoom(false);
    }
  };

  return (
    <div className="screen">
      <div className="home-header">
        <div className="logo-container">
          <div className="logo">CG FUN</div>
          <div className="logo-subtitle">Companion App</div>
        </div>
      </div>

      <div className="screen-content home-content">
        <div className="welcome-section">
          <h2>Welcome to CG FUN!</h2>
          <p>Bond with your church cell group through fun games and activities.</p>
        </div>

        {!showCreateRoom && !showJoinRoom && (
          <div className="action-buttons">
            <button
              className="btn btn-primary btn-block action-btn"
              onClick={() => setShowCreateRoom(true)}
            >
              <Plus size={20} />
              Create Room
            </button>
            <button
              className="btn btn-secondary btn-block action-btn"
              onClick={() => setShowJoinRoom(true)}
            >
              <LogIn size={20} />
              Join Room
            </button>
            <button
              className="btn btn-danger btn-block action-btn"
              onClick={() => setCurrentScreen('moments')}
            >
              <Image size={20} />
              CG FUN Moments
            </button>
            <button
              className="btn btn-info btn-block action-btn"
              onClick={() => setCurrentScreen('sessions')}
            >
              <Users size={20} />
              Active Sessions
            </button>
          </div>
        )}

        {showCreateRoom && (
          <form onSubmit={handleCreateRoom} className="form-container">
            <h3>Create a New Room</h3>
            <div className="input-group">
              <label>Room Name</label>
              <input
                type="text"
                placeholder="e.g., Cell Group A"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary btn-block">
                Create Room
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={() => setShowCreateRoom(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {showJoinRoom && (
          <form onSubmit={handleJoinRoom} className="form-container">
            <h3>Join a Room</h3>
            <div className="input-group">
              <label>Room ID</label>
              <input
                type="text"
                placeholder="Enter room ID"
                value={joinRoomId}
                onChange={(e) => setJoinRoomId(e.target.value)}
                required
              />
            </div>
            <div className="input-group">
              <label>Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={joinUserName}
                onChange={(e) => setJoinUserName(e.target.value)}
                required
              />
            </div>
            <div className="form-buttons">
              <button type="submit" className="btn btn-primary btn-block">
                Join Room
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-block"
                onClick={() => setShowJoinRoom(false)}
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default HomeScreen;
