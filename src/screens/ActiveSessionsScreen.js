import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { Home, RefreshCw, Users } from 'lucide-react';
import '../styles/ActiveSessionsScreen.css';

const ActiveSessionsScreen = () => {
  const { setCurrentScreen } = useContext(AppContext);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/sessions', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }
      const data = await response.json();
      console.log('Fetched sessions:', data);
      setSessions(data);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setSessions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
    const interval = setInterval(fetchSessions, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="screen">
      <div className="screen-header">
        <div>🎮 Active Sessions</div>
      </div>

      <div className="screen-content sessions-content">
        <div className="sessions-container">
          {loading ? (
            <div className="empty-state">
              <p>Loading sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🎮</div>
              <p>No active sessions</p>
              <p className="empty-subtitle">Create a room to start playing!</p>
            </div>
          ) : (
            <div className="sessions-list">
              {sessions.map((session) => (
                <div key={session.id} className="session-card">
                  <div className="session-header">
                    <h3 className="session-name">{session.name}</h3>
                    <span className="player-count">
                      <Users size={16} />
                      {session.playerCount}
                    </span>
                  </div>

                  <div className="session-info">
                    <div className="info-row">
                      <span className="info-label">Room Master:</span>
                      <span className="info-value">👑 {session.master}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Room ID:</span>
                      <span className="info-value code">{session.id}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Status:</span>
                      <span className={`status-badge ${session.status}`}>
                        {session.status === 'playing' ? '🎯 Playing' : '⏳ Waiting'}
                      </span>
                    </div>
                  </div>

                  <div className="players-preview">
                    <span className="preview-label">Players:</span>
                    <div className="players-list">
                      {session.players.map((player, idx) => (
                        <span key={idx} className={`player-tag ${player === session.master ? 'master' : ''}`}>
                          {player}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="screen-footer">
        <button className="btn btn-primary btn-small" onClick={fetchSessions}>
          <RefreshCw size={18} />
          Refresh
        </button>
        <button className="btn btn-danger btn-small" onClick={() => setCurrentScreen('home')}>
          <Home size={18} />
          Home
        </button>
      </div>
    </div>
  );
};

export default ActiveSessionsScreen;
