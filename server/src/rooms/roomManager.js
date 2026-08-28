import config from '../config.js';

/**
 * Room Manager
 * Handles room creation, joining, leaving, presence tracking,
 * and reconnection with a grace period.
 */

// In-memory room state (always in memory for real-time access; DB is for persistence)
const rooms = new Map();
const playerRoomMap = new Map(); // playerId -> roomCode
const disconnectTimers = new Map(); // playerId -> timeout handle

// Characters for room codes (excluding ambiguous: O/0/I/1/L)
const CODE_CHARS = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

function generateRoomCode() {
  let code = '';
  for (let i = 0; i < config.room.codeLength; i++) {
    code += CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)];
  }
  // Ensure uniqueness
  if (rooms.has(code)) return generateRoomCode();
  return code;
}

/**
 * Create a new room.
 * @param {string} playerId - The creating player's persistent ID
 * @param {string} socketId - The creating player's current socket ID
 * @param {string} playerName - Display name
 * @returns {object} room
 */
export function createRoom(playerId, socketId, playerName) {
  const code = generateRoomCode();
  const player = {
    id: playerId,
    socketId,
    name: playerName || `Player 1`,
    connected: true,
    joinedAt: Date.now(),
  };

  const room = {
    code,
    players: [player],
    activeGame: null,
    gameState: null,
    messages: [],
    createdAt: Date.now(),
  };

  rooms.set(code, room);
  playerRoomMap.set(playerId, code);

  return room;
}

/**
 * Join an existing room.
 * @param {string} code - Room code
 * @param {string} playerId - The joining player's persistent ID
 * @param {string} socketId - The joining player's current socket ID
 * @param {string} playerName - Display name
 * @returns {{ room: object, error?: string }}
 */
export function joinRoom(code, playerId, socketId, playerName) {
  const room = rooms.get(code);

  if (!room) {
    return { room: null, error: 'Room not found. Check the code and try again.' };
  }

  // Check if player is already in this room (reconnecting)
  const existingPlayer = room.players.find((p) => p.id === playerId);
  if (existingPlayer) {
    // Reconnection — update their socket and mark connected
    existingPlayer.socketId = socketId;
    existingPlayer.connected = true;

    // Clear any disconnect timer
    if (disconnectTimers.has(playerId)) {
      clearTimeout(disconnectTimers.get(playerId));
      disconnectTimers.delete(playerId);
    }

    playerRoomMap.set(playerId, code);
    return { room, reconnected: true };
  }

  // Count active (non-disconnected-past-grace) players
  const activePlayers = room.players.filter(
    (p) => p.connected || disconnectTimers.has(p.id),
  );

  if (activePlayers.length >= config.room.maxPlayers) {
    return { room: null, error: 'Room is full. Max 2 players allowed.' };
  }

  // If there's a disconnected player whose grace period expired, replace them
  const disconnectedIndex = room.players.findIndex(
    (p) => !p.connected && !disconnectTimers.has(p.id),
  );
  if (disconnectedIndex !== -1 && room.players.length >= config.room.maxPlayers) {
    const old = room.players[disconnectedIndex];
    playerRoomMap.delete(old.id);
    room.players.splice(disconnectedIndex, 1);
  }

  const player = {
    id: playerId,
    socketId,
    name: playerName || `Player ${room.players.length + 1}`,
    connected: true,
    joinedAt: Date.now(),
  };

  room.players.push(player);
  playerRoomMap.set(playerId, code);

  return { room };
}

/**
 * Handle a player disconnecting (socket drop).
 * Starts a grace period before fully removing them.
 * @param {string} socketId - The disconnected socket ID
 * @param {function} onGraceExpired - Called if grace period expires without reconnect
 * @returns {{ room: object, player: object } | null}
 */
export function handleDisconnect(socketId, onGraceExpired) {
  // Find the player by socket ID
  for (const [code, room] of rooms) {
    const player = room.players.find((p) => p.socketId === socketId);
    if (player) {
      player.connected = false;

      // Start grace period
      const timer = setTimeout(() => {
        disconnectTimers.delete(player.id);
        // If still disconnected after grace period, fully remove
        if (!player.connected) {
          removePlayer(code, player.id);
          if (onGraceExpired) onGraceExpired(code, player);
        }
      }, config.room.reconnectGracePeriodMs);

      disconnectTimers.set(player.id, timer);

      return { room, player };
    }
  }
  return null;
}

/**
 * Fully remove a player from a room.
 * @param {string} code - Room code
 * @param {string} playerId - Player ID
 */
export function removePlayer(code, playerId) {
  const room = rooms.get(code);
  if (!room) return;

  room.players = room.players.filter((p) => p.id !== playerId);
  playerRoomMap.delete(playerId);

  if (disconnectTimers.has(playerId)) {
    clearTimeout(disconnectTimers.get(playerId));
    disconnectTimers.delete(playerId);
  }

  // If room is empty, clean it up
  if (room.players.length === 0) {
    rooms.delete(code);
  }
}

/**
 * Leave a room intentionally (not a disconnect).
 * @param {string} code - Room code
 * @param {string} playerId - Player ID
 */
export function leaveRoom(code, playerId) {
  removePlayer(code, playerId);
}

/**
 * Get a room by code.
 * @param {string} code
 * @returns {object|null}
 */
export function getRoom(code) {
  return rooms.get(code) || null;
}

/**
 * Get a room by player ID.
 * @param {string} playerId
 * @returns {object|null}
 */
export function getRoomByPlayerId(playerId) {
  const code = playerRoomMap.get(playerId);
  if (!code) return null;
  return rooms.get(code) || null;
}

/**
 * Get the room code a player is in.
 * @param {string} playerId
 * @returns {string|null}
 */
export function getPlayerRoomCode(playerId) {
  return playerRoomMap.get(playerId) || null;
}

/**
 * Set the active game for a room.
 * @param {string} code - Room code
 * @param {string} gameId - Game identifier
 */
export function setActiveGame(code, gameId) {
  const room = rooms.get(code);
  if (room) {
    room.activeGame = gameId;
    room.gameState = null;
  }
}

/**
 * Set/update game state for a room.
 * @param {string} code - Room code
 * @param {object} state - Game state object
 */
export function setGameState(code, state) {
  const room = rooms.get(code);
  if (room) {
    room.gameState = state;
  }
}

/**
 * Get game state for a room.
 * @param {string} code - Room code
 * @returns {object|null}
 */
export function getGameState(code) {
  const room = rooms.get(code);
  return room?.gameState || null;
}

/**
 * Clear the active game and state.
 * @param {string} code
 */
export function clearActiveGame(code) {
  const room = rooms.get(code);
  if (room) {
    room.activeGame = null;
    room.gameState = null;
  }
}

/**
 * Get player from room by socket ID.
 * @param {string} code - Room code
 * @param {string} socketId
 * @returns {object|null}
 */
export function getPlayerBySocketId(code, socketId) {
  const room = rooms.get(code);
  if (!room) return null;
  return room.players.find((p) => p.socketId === socketId) || null;
}

/**
 * Get the other player in the room.
 * @param {string} code - Room code
 * @param {string} playerId - Current player ID
 * @returns {object|null}
 */
export function getOtherPlayer(code, playerId) {
  const room = rooms.get(code);
  if (!room) return null;
  return room.players.find((p) => p.id !== playerId) || null;
}

/**
 * Add a chat message to a room.
 * @param {string} code - Room code
 * @param {string} senderId - Player ID
 * @param {string} senderName - Player Name
 * @param {string} text - Message text
 * @returns {object|null}
 */
export function addChatMessage(code, senderId, senderName, text) {
  const room = rooms.get(code);
  if (!room) return null;
  if (!room.messages) room.messages = [];

  const msg = {
    id: 'msg_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
    senderId,
    senderName,
    text,
    timestamp: Date.now(),
  };

  room.messages.push(msg);
  if (room.messages.length > 50) {
    room.messages.shift();
  }
  return msg;
}

/**
 * Get serializable room info for clients.
 * @param {string} code
 * @returns {object|null}
 */
export function getRoomInfo(code) {
  const room = rooms.get(code);
  if (!room) return null;

  return {
    code: room.code,
    players: room.players.map((p) => ({
      id: p.id,
      name: p.name,
      connected: p.connected,
    })),
    activeGame: room.activeGame,
    messages: room.messages || [],
    createdAt: room.createdAt,
  };
}
