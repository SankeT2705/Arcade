import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import config from './config.js';
import * as roomManager from './rooms/roomManager.js';
import { registerAllHandlers, getGameSessionState, getAllGames } from './games/gameRegistry.js';
import {
  checkRoomCreationLimit,
  checkSocketEventLimit,
  cleanupSocketLimit,
} from './middleware/rateLimiter.js';

// ─── Express & CORS Setup ───────────────────────────────

const allowedOrigins = config.clientUrl.includes(',')
  ? config.clientUrl.split(',').map((u) => u.trim())
  : [config.clientUrl];

const corsOriginChecker = (origin, callback) => {
  if (!origin || config.clientUrl === '*') return callback(null, true);
  if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
    return callback(null, true);
  }
  return callback(null, true); // Allow connection with credentials
};

const app = express();
app.use(cors({ origin: corsOriginChecker, credentials: true }));
app.use(express.json());

// Root status
app.get('/', (_req, res) => {
  res.json({
    name: 'Duo Arcade Server',
    status: 'online',
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', uptime: process.uptime() });
});

// Get all registered games
app.get('/api/games', (_req, res) => {
  res.json({ games: getAllGames() });
});

// ─── HTTP Server + Socket.IO ────────────────────────────

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: corsOriginChecker,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// ─── Socket.IO Connection Handling ──────────────────────

io.on('connection', (socket) => {
  const playerId = socket.handshake.auth?.playerId;
  const playerName = socket.handshake.auth?.playerName;

  console.info(`[Socket] Connected: ${socket.id} (player: ${playerId})`);

  // Rate limiting middleware for all events
  socket.use((packet, next) => {
    if (!checkSocketEventLimit(socket.id)) {
      return next(new Error('Rate limit exceeded. Please slow down.'));
    }
    next();
  });

  // ─── Room Events ────────────────────────────────────

  socket.on('room:create', (data, callback) => {
    const ip = socket.handshake.address;
    if (!checkRoomCreationLimit(ip)) {
      if (callback) callback({ error: 'Too many rooms created. Please wait a minute.' });
      return;
    }

    if (!playerId) {
      if (callback) callback({ error: 'Player ID required.' });
      return;
    }

    const name = data?.playerName || playerName || 'Player 1';
    const room = roomManager.createRoom(playerId, socket.id, name);

    socket.join(room.code);
    console.info(`[Room] Created: ${room.code} by ${playerId}`);

    if (callback) callback({ room: roomManager.getRoomInfo(room.code) });
  });

  socket.on('room:join', (data, callback) => {
    const { roomCode } = data || {};

    if (!playerId) {
      if (callback) callback({ error: 'Player ID required.' });
      return;
    }

    if (!roomCode || typeof roomCode !== 'string') {
      if (callback) callback({ error: 'Room code is required.' });
      return;
    }

    const code = roomCode.toUpperCase().trim();
    const name = data?.playerName || playerName || 'Player 2';
    const result = roomManager.joinRoom(code, playerId, socket.id, name);

    if (result.error) {
      if (callback) callback({ error: result.error });
      return;
    }

    socket.join(code);
    const roomInfo = roomManager.getRoomInfo(code);

    console.info(
      `[Room] ${result.reconnected ? 'Reconnected' : 'Joined'}: ${code} by ${playerId}`,
    );

    if (callback) callback({ room: roomInfo, reconnected: result.reconnected });

    // Notify other players in the room
    socket.to(code).emit('room:player-joined', {
      room: roomInfo,
      playerId,
      reconnected: result.reconnected,
    });

    // If reconnecting mid-game, send game state
    if (result.reconnected && result.room.activeGame) {
      const gameState = getGameSessionState(result.room.activeGame, code);
      if (gameState) {
        // Send targeted state based on player role (important for Scribble Duel)
        const stateForPlayer = { ...gameState };
        if (gameState.gameId === 'scribble-duel') {
          // Only send word if this player is the drawer
          if (playerId !== gameState.drawerId) {
            stateForPlayer.word = null;
          }
        }
        socket.emit('game:state-sync', stateForPlayer);
      }
    }
  });

  socket.on('room:leave', (data) => {
    const { roomCode } = data || {};
    if (!roomCode || !playerId) return;

    const code = roomCode.toUpperCase().trim();
    roomManager.leaveRoom(code, playerId);
    socket.leave(code);

    console.info(`[Room] Left: ${code} by ${playerId}`);

    const roomInfo = roomManager.getRoomInfo(code);
    if (roomInfo) {
      io.to(code).emit('room:player-left', { room: roomInfo, playerId });
    }
  });

  socket.on('room:select-game', (data) => {
    const { roomCode, gameId } = data || {};
    if (!roomCode || !gameId) return;

    const code = roomCode.toUpperCase().trim();
    const room = roomManager.getRoom(code);
    if (!room) return;

    roomManager.setActiveGame(code, gameId);

    io.to(code).emit('room:game-selected', {
      gameId,
      room: roomManager.getRoomInfo(code),
    });
  });

  socket.on('room:back-to-hub', (data) => {
    const { roomCode } = data || {};
    if (!roomCode) return;

    const code = roomCode.toUpperCase().trim();
    roomManager.clearActiveGame(code);

    io.to(code).emit('room:game-cleared', {
      room: roomManager.getRoomInfo(code),
    });
  });

  socket.on('room:chat-send', (data) => {
    const { roomCode, message } = data || {};
    if (!roomCode || !message || typeof message !== 'string') return;
    const trimmed = message.trim().substring(0, 300);
    if (!trimmed) return;

    const code = roomCode.toUpperCase().trim();
    const room = roomManager.getRoom(code);
    if (!room) return;

    const player = room.players.find((p) => p.id === playerId);
    if (!player) return;

    const msg = roomManager.addChatMessage(code, player.id, player.name, trimmed);
    if (msg) {
      io.to(code).emit('room:chat-message', msg);
    }
  });

  // ─── Register Game Handlers ─────────────────────────

  registerAllHandlers(io, socket);

  // ─── Disconnect Handling ────────────────────────────

  socket.on('disconnect', (reason) => {
    console.info(`[Socket] Disconnected: ${socket.id} (reason: ${reason})`);

    cleanupSocketLimit(socket.id);

    const result = roomManager.handleDisconnect(socket.id, (roomCode, player) => {
      // Grace period expired — player fully removed
      console.info(`[Room] Grace period expired for ${player.id} in ${roomCode}`);
      const roomInfo = roomManager.getRoomInfo(roomCode);
      if (roomInfo) {
        io.to(roomCode).emit('room:player-left', { room: roomInfo, playerId: player.id });
      }
    });

    if (result) {
      const { room, player } = result;
      // Notify remaining players about the disconnect
      io.to(room.code).emit('room:player-disconnected', {
        room: roomManager.getRoomInfo(room.code),
        playerId: player.id,
        gracePeriodMs: config.room.reconnectGracePeriodMs,
      });
    }
  });

  socket.on('error', (err) => {
    console.error(`[Socket] Error for ${socket.id}:`, err.message);
  });
});

// ─── Start Server ───────────────────────────────────────

httpServer.listen(config.port, () => {
  console.info(`
  ╔═══════════════════════════════════════════╗
  ║        🎮  Duo Arcade Server  🎮         ║
  ║                                           ║
  ║  Running on port ${String(config.port).padEnd(25)}║
  ║  Environment: ${config.nodeEnv.padEnd(19)}       ║
  ║  Client URL: ${config.clientUrl.padEnd(20)}      ║
  ╚═══════════════════════════════════════════╝
  `);
});
