import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSocketContext } from './SocketProvider';

const RoomContext = createContext(null);

export function useRoomContext() {
  const ctx = useContext(RoomContext);
  if (!ctx) throw new Error('useRoomContext must be used within RoomProvider');
  return ctx;
}

export default function RoomProvider({ children }) {
  const { socket, emit, playerId } = useSocketContext();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [partnerDisconnected, setPartnerDisconnected] = useState(false);
  const [gameState, setGameState] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  // Listen for room events
  useEffect(() => {
    if (!socket) return;

    const handlePlayerJoined = ({ room: roomInfo }) => {
      setRoom(roomInfo);
      if (roomInfo.messages) {
        setChatMessages(roomInfo.messages);
      }
      setPartnerDisconnected(false);
    };

    const handlePlayerLeft = ({ room: roomInfo, playerId: leftId }) => {
      setRoom(roomInfo);
      if (leftId !== playerId) {
        setPartnerDisconnected(false);
      }
    };

    const handlePlayerDisconnected = ({ room: roomInfo, playerId: dcId }) => {
      setRoom(roomInfo);
      if (dcId !== playerId) {
        setPartnerDisconnected(true);
      }
    };

    const handleGameSelected = ({ _gameId, room: roomInfo }) => {
      setRoom(roomInfo);
    };

    const handleGameCleared = ({ room: roomInfo }) => {
      setRoom(roomInfo);
      setGameState(null);
    };

    const handleStateSync = (state) => {
      setGameState(state);
    };

    const handleChatMessage = (msg) => {
      setChatMessages((prev) => [...prev, msg]);
    };

    socket.on('room:player-joined', handlePlayerJoined);
    socket.on('room:player-left', handlePlayerLeft);
    socket.on('room:player-disconnected', handlePlayerDisconnected);
    socket.on('room:game-selected', handleGameSelected);
    socket.on('room:game-cleared', handleGameCleared);
    socket.on('game:state-sync', handleStateSync);
    socket.on('room:chat-message', handleChatMessage);

    return () => {
      socket.off('room:player-joined', handlePlayerJoined);
      socket.off('room:player-left', handlePlayerLeft);
      socket.off('room:player-disconnected', handlePlayerDisconnected);
      socket.off('room:game-selected', handleGameSelected);
      socket.off('room:game-cleared', handleGameCleared);
      socket.off('game:state-sync', handleStateSync);
      socket.off('room:chat-message', handleChatMessage);
    };
  }, [socket, playerId]);

  const createRoom = useCallback(
    (playerName) => {
      setIsLoading(true);
      setError(null);
      setChatMessages([]);
      emit('room:create', { playerName }, (response) => {
        setIsLoading(false);
        if (response.error) {
          setError(response.error);
        } else {
          setRoom(response.room);
          if (response.room?.messages) {
            setChatMessages(response.room.messages);
          }
        }
      });
    },
    [emit],
  );

  const joinRoom = useCallback(
    (roomCode, playerName) => {
      setIsLoading(true);
      setError(null);
      emit('room:join', { roomCode, playerName }, (response) => {
        setIsLoading(false);
        if (response.error) {
          setError(response.error);
        } else {
          setRoom(response.room);
          if (response.room?.messages) {
            setChatMessages(response.room.messages);
          }
          if (response.reconnected) {
            setPartnerDisconnected(false);
          }
        }
      });
    },
    [emit],
  );

  const leaveRoom = useCallback(() => {
    if (room) {
      emit('room:leave', { roomCode: room.code });
    }
    setRoom(null);
    setError(null);
    setPartnerDisconnected(false);
    setGameState(null);
    setChatMessages([]);
  }, [emit, room]);

  const selectGame = useCallback(
    (gameId) => {
      if (room) {
        emit('room:select-game', { roomCode: room.code, gameId });
      }
    },
    [emit, room],
  );

  const backToHub = useCallback(() => {
    if (room) {
      emit('room:back-to-hub', { roomCode: room.code });
    }
  }, [emit, room]);

  const sendChatMessage = useCallback(
    (text) => {
      if (room && text?.trim()) {
        emit('room:chat-send', { roomCode: room.code, message: text.trim() });
      }
    },
    [emit, room],
  );

  const clearError = useCallback(() => setError(null), []);

  const value = {
    room,
    error,
    isLoading,
    partnerDisconnected,
    gameState,
    chatMessages,
    createRoom,
    joinRoom,
    leaveRoom,
    selectGame,
    backToHub,
    sendChatMessage,
    clearError,
    setRoom,
  };

  return <RoomContext.Provider value={value}>{children}</RoomContext.Provider>;
}
