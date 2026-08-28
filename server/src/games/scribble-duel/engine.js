import { getRandomWords, levenshteinDistance } from './wordList.js';
import * as roomManager from '../../rooms/roomManager.js';
import db from '../../db/queries.js';

/**
 * Scribble Duel — Server Engine
 *
 * Manages drawing sessions: role assignment, word selection,
 * stroke relaying, guess checking with typo tolerance, scoring,
 * and round management.
 */

const DEFAULT_ROUNDS = 6;
const ROUND_TIMER_MS = 90_000; // 90 seconds
const MAX_POINTS_PER_ROUND = 1000;

// Active game sessions keyed by room code
const sessions = new Map();

/**
 * Register Scribble Duel event handlers on a socket.
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
export function registerHandlers(io, socket) {
  socket.on('scribble-duel:start', (data) => handleStart(io, socket, data));
  socket.on('scribble-duel:stroke', (data) => handleStroke(io, socket, data));
  socket.on('scribble-duel:clear', (data) => handleClear(io, socket, data));
  socket.on('scribble-duel:guess', (data) => handleGuess(io, socket, data));
  socket.on('scribble-duel:play-again', (data) => handlePlayAgain(io, socket, data));
}

/**
 * Clean up session on disconnect/game-end.
 * @param {string} roomCode
 */
export function cleanup(roomCode) {
  const session = sessions.get(roomCode);
  if (session?.timer) {
    clearTimeout(session.timer);
  }
  sessions.delete(roomCode);
}

/**
 * Get current session state for reconnection.
 * @param {string} roomCode
 * @returns {object|null}
 */
export function getSessionState(roomCode) {
  const session = sessions.get(roomCode);
  if (!session) return null;

  return {
    gameId: 'scribble-duel',
    round: session.currentRound,
    totalRounds: session.totalRounds,
    phase: session.phase,
    drawerId: session.drawerId,
    guesserId: session.guesserId,
    word: session.word, // Only send to drawer on reconnect
    scores: session.scores,
    strokes: session.strokes, // For canvas replay on reconnect
    guesses: session.guesses,
    roundStartTime: session.roundStartTime,
    results: session.results,
  };
}

// ─── Event Handlers ────────────────────────────────────

function handleStart(io, socket, data) {
  const { roomCode, rounds } = data || {};
  const room = roomManager.getRoom(roomCode);

  if (!room) {
    socket.emit('scribble-duel:error', { message: 'Room not found.' });
    return;
  }

  const player = room.players.find((p) => p.socketId === socket.id);
  if (!player) {
    socket.emit('scribble-duel:error', { message: 'You are not in this room.' });
    return;
  }

  if (room.players.filter((p) => p.connected).length < 2) {
    socket.emit('scribble-duel:error', { message: 'Need 2 players to start.' });
    return;
  }

  cleanup(roomCode);

  const totalRounds = Math.min(Math.max(rounds || DEFAULT_ROUNDS, 2), 20);
  const words = getRandomWords(totalRounds);

  // Randomly assign who draws first
  const players = room.players.filter((p) => p.connected);
  const firstDrawerIndex = Math.floor(Math.random() * 2);

  const session = {
    roomCode,
    words,
    totalRounds,
    currentRound: 0,
    phase: 'drawing', // 'drawing' | 'round-end' | 'ended'
    drawerId: players[firstDrawerIndex].id,
    guesserId: players[1 - firstDrawerIndex].id,
    word: words[0].word,
    scores: {
      [players[0].id]: 0,
      [players[1].id]: 0,
    },
    playerNames: {
      [players[0].id]: players[0].name,
      [players[1].id]: players[1].name,
    },
    strokes: [], // accumulated strokes for canvas replay
    guesses: [], // guess history for this round
    timer: null,
    roundStartTime: Date.now(),
    results: [],
  };

  sessions.set(roomCode, session);
  roomManager.setActiveGame(roomCode, 'scribble-duel');

  startRound(io, roomCode);
}

function handleStroke(io, socket, data) {
  const { roomCode, stroke } = data || {};

  if (!roomCode || !stroke) return;

  const session = sessions.get(roomCode);
  if (!session || session.phase !== 'drawing') return;

  const room = roomManager.getRoom(roomCode);
  if (!room) return;

  const player = room.players.find((p) => p.socketId === socket.id);
  if (!player || player.id !== session.drawerId) {
    // Only the drawer can send strokes
    return;
  }

  // Validate based on action type
  const type = stroke.type || 'stroke';
  let strokeData;

  if (type === 'stroke' || type === 'fill') {
    if (
      typeof stroke.x !== 'number' ||
      typeof stroke.y !== 'number' ||
      stroke.x < 0 || stroke.x > 1 ||
      stroke.y < 0 || stroke.y > 1
    ) {
      return;
    }
    strokeData = {
      type,
      x: stroke.x,
      y: stroke.y,
      color: typeof stroke.color === 'string' ? stroke.color : '#000000',
      width: typeof stroke.width === 'number' ? Math.min(Math.max(stroke.width, 1), 50) : 3,
      isNewStroke: !!stroke.isNewStroke,
    };
  } else if (type === 'shape') {
    if (
      typeof stroke.x1 !== 'number' ||
      typeof stroke.y1 !== 'number' ||
      typeof stroke.x2 !== 'number' ||
      typeof stroke.y2 !== 'number' ||
      (stroke.shape !== 'rectangle' && stroke.shape !== 'circle')
    ) {
      return;
    }
    strokeData = {
      type,
      shape: stroke.shape,
      x1: stroke.x1,
      y1: stroke.y1,
      x2: stroke.x2,
      y2: stroke.y2,
      color: typeof stroke.color === 'string' ? stroke.color : '#000000',
      width: typeof stroke.width === 'number' ? Math.min(Math.max(stroke.width, 1), 50) : 3,
    };
  } else {
    return;
  }

  session.strokes.push(strokeData);

  // Relay to guesser
  const guesser = room.players.find((p) => p.id === session.guesserId);
  if (guesser?.connected) {
    io.to(guesser.socketId).emit('scribble-duel:stroke', { stroke: strokeData });
  }
}

function handleClear(io, socket, data) {
  const { roomCode } = data || {};
  const session = sessions.get(roomCode);

  if (!session || session.phase !== 'drawing') return;

  const room = roomManager.getRoom(roomCode);
  if (!room) return;

  const player = room.players.find((p) => p.socketId === socket.id);
  if (!player || player.id !== session.drawerId) return;

  session.strokes = [];

  // Relay to guesser
  const guesser = room.players.find((p) => p.id === session.guesserId);
  if (guesser?.connected) {
    io.to(guesser.socketId).emit('scribble-duel:clear', {});
  }
}

function handleGuess(io, socket, data) {
  const { roomCode, guess } = data || {};

  if (!roomCode || typeof guess !== 'string' || guess.trim().length === 0) {
    socket.emit('scribble-duel:error', { message: 'Invalid guess.' });
    return;
  }

  const session = sessions.get(roomCode);
  if (!session || session.phase !== 'drawing') {
    socket.emit('scribble-duel:error', { message: 'Not accepting guesses right now.' });
    return;
  }

  const room = roomManager.getRoom(roomCode);
  if (!room) return;

  const player = room.players.find((p) => p.socketId === socket.id);
  if (!player || player.id !== session.guesserId) {
    socket.emit('scribble-duel:error', { message: 'Only the guesser can submit guesses.' });
    return;
  }

  const normalizedGuess = guess.trim().toLowerCase();
  const normalizedWord = session.word.toLowerCase();

  const distance = levenshteinDistance(normalizedGuess, normalizedWord);
  const isCorrect = distance === 0;
  const isClose = distance >= 1 && distance <= 2;

  const guessResult = {
    text: guess.trim(),
    playerId: player.id,
    playerName: player.name,
    isCorrect,
    isClose,
    timestamp: Date.now(),
  };

  session.guesses.push(guessResult);

  // Emit to both players
  emitToRoom(io, room, 'scribble-duel:guess-result', {
    guess: guessResult,
  });

  if (isCorrect) {
    // Calculate points based on time remaining
    const elapsed = Date.now() - session.roundStartTime;
    const timeRatio = Math.max(0, 1 - elapsed / ROUND_TIMER_MS);
    const points = Math.round(MAX_POINTS_PER_ROUND * timeRatio);

    // Award points to both drawer and guesser
    session.scores[session.guesserId] += points;
    session.scores[session.drawerId] += Math.round(points * 0.5); // drawer gets half

    endRound(io, roomCode, true, points);
  }
}

function handlePlayAgain(io, socket, data) {
  const { roomCode, rounds } = data || {};
  handleStart(io, socket, { roomCode, rounds });
}

// ─── Internal Logic ────────────────────────────────────

function startRound(io, roomCode) {
  const session = sessions.get(roomCode);
  if (!session) return;

  const room = roomManager.getRoom(roomCode);
  if (!room) return;

  session.phase = 'drawing';
  session.strokes = [];
  session.guesses = [];
  session.word = session.words[session.currentRound].word;
  session.roundStartTime = Date.now();

  const drawer = room.players.find((p) => p.id === session.drawerId);
  const guesser = room.players.find((p) => p.id === session.guesserId);

  // Send word to drawer only
  if (drawer?.connected) {
    io.to(drawer.socketId).emit('scribble-duel:round-start', {
      round: session.currentRound,
      totalRounds: session.totalRounds,
      role: 'drawer',
      word: session.word,
      wordLength: session.word.length,
      timeLimit: ROUND_TIMER_MS,
      scores: session.scores,
      playerNames: session.playerNames,
    });
  }

  // Send round info to guesser (without the word)
  if (guesser?.connected) {
    io.to(guesser.socketId).emit('scribble-duel:round-start', {
      round: session.currentRound,
      totalRounds: session.totalRounds,
      role: 'guesser',
      word: null,
      wordLength: session.word.length,
      timeLimit: ROUND_TIMER_MS,
      scores: session.scores,
      playerNames: session.playerNames,
    });
  }

  // Start round timer
  session.timer = setTimeout(() => {
    session.timer = null;
    endRound(io, roomCode, false, 0);
  }, ROUND_TIMER_MS);
}

function endRound(io, roomCode, guessedCorrectly, points) {
  const session = sessions.get(roomCode);
  if (!session || session.phase !== 'drawing') return;

  session.phase = 'round-end';

  if (session.timer) {
    clearTimeout(session.timer);
    session.timer = null;
  }

  const room = roomManager.getRoom(roomCode);
  if (!room) return;

  const elapsed = Date.now() - session.roundStartTime;

  const roundResult = {
    round: session.currentRound,
    word: session.word,
    drawerId: session.drawerId,
    drawerName: session.playerNames[session.drawerId],
    guesserId: session.guesserId,
    guesserName: session.playerNames[session.guesserId],
    guessedCorrectly,
    points,
    timeTaken: elapsed,
  };

  session.results.push(roundResult);

  const isLastRound = session.currentRound >= session.totalRounds - 1;

  emitToRoom(io, room, 'scribble-duel:round-end', {
    ...roundResult,
    scores: session.scores,
    isLastRound,
  });

  if (isLastRound) {
    // End session after a brief delay
    setTimeout(() => endSession(io, roomCode), 2000);
  } else {
    // Advance to next round after delay
    setTimeout(() => {
      session.currentRound++;
      // Swap roles
      const temp = session.drawerId;
      session.drawerId = session.guesserId;
      session.guesserId = temp;
      startRound(io, roomCode);
    }, 3000);
  }
}

async function endSession(io, roomCode) {
  const session = sessions.get(roomCode);
  if (!session) return;

  session.phase = 'ended';

  const room = roomManager.getRoom(roomCode);

  // Determine winner
  const playerIds = Object.keys(session.scores);
  const winnerId =
    session.scores[playerIds[0]] > session.scores[playerIds[1]]
      ? playerIds[0]
      : session.scores[playerIds[1]] > session.scores[playerIds[0]]
        ? playerIds[1]
        : null; // tie

  // Persist
  try {
    await db.saveGameSession({
      roomCode,
      gameId: 'scribble-duel',
      totalRounds: session.totalRounds,
      scores: session.scores,
      winnerId,
      results: session.results,
    });
  } catch (err) {
    console.error('[Scribble Duel] Failed to persist session:', err);
  }

  if (room) {
    emitToRoom(io, room, 'scribble-duel:end', {
      scores: session.scores,
      playerNames: session.playerNames,
      winnerId,
      results: session.results,
    });
  }

  cleanup(roomCode);
}

// ─── Helpers ───────────────────────────────────────────

function emitToRoom(io, room, event, data) {
  for (const player of room.players) {
    if (player.connected) {
      io.to(player.socketId).emit(event, data);
    }
  }
}
