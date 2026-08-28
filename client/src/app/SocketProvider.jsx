import { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import { io } from 'socket.io-client';
import { getPlayerId, getPlayerName } from '../lib/utils';

const SocketContext = createContext(null);

export function useSocketContext() {
  const ctx = useContext(SocketContext);
  if (!ctx) throw new Error('useSocketContext must be used within SocketProvider');
  return ctx;
}

export default function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isReconnecting, setIsReconnecting] = useState(false);
  const socketRef = useRef(null);

  useEffect(() => {
    const serverUrl = import.meta.env.VITE_SOCKET_URL || '';
    const playerId = getPlayerId();
    const playerName = getPlayerName();

    const newSocket = io(serverUrl, {
      auth: { playerId, playerName },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
      transports: ['websocket', 'polling'],
    });

    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.on('connect', () => {
      setIsConnected(true);
      setIsReconnecting(false);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    newSocket.on('reconnect_attempt', () => {
      setIsReconnecting(true);
    });

    newSocket.on('reconnect', () => {
      setIsConnected(true);
      setIsReconnecting(false);
    });

    newSocket.on('reconnect_failed', () => {
      setIsReconnecting(false);
    });

    return () => {
      newSocket.close();
      socketRef.current = null;
    };
  }, []);

  const emit = useCallback(
    (event, data, callback) => {
      if (socketRef.current?.connected) {
        socketRef.current.emit(event, data, callback);
      } else if (socketRef.current) {
        socketRef.current.once('connect', () => {
          socketRef.current.emit(event, data, callback);
        });
      } else if (callback) {
        callback({ error: 'Network error: Not connected to server' });
      }
    },
    [],
  );

  const value = {
    socket,
    isConnected,
    isReconnecting,
    emit,
    playerId: getPlayerId(),
  };

  return <SocketContext.Provider value={value}>{children}</SocketContext.Provider>;
}
