import React, { useContext } from 'react';
import { AppProvider, AppContext } from './context/AppContext';
import HomeScreen from './screens/HomeScreen';
import RoomLobbyScreen from './screens/RoomLobbyScreen';
import GameSelectionScreen from './screens/GameSelectionScreen';
import TriviaScreen from './screens/TriviaScreen';
import SuccessScreen from './screens/SuccessScreen';
import MomentsScreen from './screens/MomentsScreen';
import ActiveSessionsScreen from './screens/ActiveSessionsScreen';
import './styles/App.css';

const AppContent = () => {
  const { currentScreen } = useContext(AppContext);

  return (
    <div className="app-container">
      {currentScreen === 'home' && <HomeScreen />}
      {currentScreen === 'roomLobby' && <RoomLobbyScreen />}
      {currentScreen === 'gameSelection' && <GameSelectionScreen />}
      {currentScreen === 'trivia' && <TriviaScreen />}
      {currentScreen === 'success' && <SuccessScreen />}
      {currentScreen === 'moments' && <MomentsScreen />}
      {currentScreen === 'sessions' && <ActiveSessionsScreen />}
    </div>
  );
};

function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
