import { Routes, Route, Navigate } from 'react-router-dom';
import SocketProvider from './app/SocketProvider';
import RoomProvider from './app/RoomContext';
import { ToastProvider } from './components/Toast';
import Layout from './app/Layout';
import GameHub from './app/GameHub';
import RoomLobby from './app/RoomLobby';

export default function App() {
  return (
    <SocketProvider>
      <RoomProvider>
        <ToastProvider>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<GameHub />} />
              <Route path="/room/:roomCode" element={<RoomLobby />} />
            </Route>
            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </RoomProvider>
    </SocketProvider>
  );
}
