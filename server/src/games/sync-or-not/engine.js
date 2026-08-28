import { getRandomQuestions } from './questions.js';
import * as roomManager from '../../rooms/roomManager.js';
import db from '../../db/queries.js';

/**
 * Sync or Not — Server Engine
 *
 * Manages game sessions: question selection, answer collection,
 * reveal logic, streak tracking, and sync percentage calculation.
 * Server is the single source of truth — never trusts client answers.
 */

const DEFAULT_ROUNDS = 10;
const ROUND_TIMER_MS = 30_000; // 30 seconds

// Active game sessions keyed by room code
const sessions = new Map();

/**
 * Register Sync or Not event handlers on a socket.
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
export function registerHandlers(io, socket) {
  socket.on('sync-or-not:start', (data) => handleStart(io, socket, data));
  socket.on('sync-or-not:answer', (data) => handleAnswer(io, socket, data));
  socket.on('sync-or-not:next', (data) => handleNext(io, socket, data));
  socket.on('sync-or-not:play-again', (data) => handlePlayAgain(io, socket, data));
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
    gameId: 'sync-or-not',
    round: session.currentRound,
    totalRounds: session.totalRounds,
    phase: session.phase,
    question: session.phase === 'question' ? session.questions[session.currentRound] : null,
    streak: session.streak,
    syncPercent: session.totalAnswered > 0
      ? Math.round((session.totalMatches / session.totalAnswered) * 100)
      : 0,
    results: session.results,
  };
}

// ─── Event Handlers ────────────────────────────────────

function handleStart(io, socket, data) {
  const { roomCode, rounds } = data || {};
  const room = roomManager.getRoom(roomCode);

  if (!room) {
    socket.emit('sync-or-not:error', { message: 'Room not found.' });
    return;
  }

  const player = room.players.find((p) => p.socketId === socket.id);
  if (!player) {
    socket.emit('sync-or-not:error', { message: 'You are not in this room.' });
    return;
  }

  if (room.players.filter((p) => p.connected).length < 2) {
    socket.emit('sync-or-not:error', { message: 'Need 2 players to start.' });
    return;
  }

  // Clean up any existing session
  cleanup(roomCode);

  const totalRounds = Math.min(Math.max(rounds || DEFAULT_ROUNDS, 1), 30);
  const questions = getRandomQuestions(totalRounds);

  const session = {
    roomCode,
    questions,
    totalRounds,
    currentRound: 0,
    phase: 'question', // 'question' | 'reveal' | 'ended'
    answers: {}, // { playerId: 'A' | 'B' }
    streak: 0,
    bestStreak: 0,
    totalMatches: 0,
    totalAnswered: 0,
    results: [], // { questionId, answers: { p1: 'A', p2: 'B' }, matched }
    timer: null,
  };

  sessions.set(roomCode, session);
  roomManager.setActiveGame(roomCode, 'sync-or-not');

  // Send first question to both players
  const question = questions[0];
  emitToRoom(io, room, 'sync-or-not:round', {
    round: 0,
    totalRounds,
    question: { id: question.id, category: question.category, optionA: question.optionA, optionB: question.optionB },
    timeLimit: ROUND_TIMER_MS,
  });

  // Start round timer
  startRoundTimer(io, roomCode);
}

function handleAnswer(io, socket, data) {
  const { roomCode, answer } = data || {};

  if (!roomCode || !answer || !['A', 'B'].includes(answer)) {
    socket.emit('sync-or-not:error', { message: 'Invalid answer.' });
    return;
  }

  const session = sessions.get(roomCode);
  if (!session || session.phase !== 'question') {
    socket.emit('sync-or-not:error', { message: 'No active question.' });
    return;
  }

  const room = roomManager.getRoom(roomCode);
  if (!room) return;

  const player = room.players.find((p) => p.socketId === socket.id);
  if (!player) {
    socket.emit('sync-or-not:error', { message: 'You are not in this room.' });
    return;
  }

  // Check if already answered
  if (session.answers[player.id]) {
    socket.emit('sync-or-not:error', { message: 'Already answered this round.' });
    return;
  }

  session.answers[player.id] = answer;

  // Confirm to the player
  socket.emit('sync-or-not:answer-ack', { answer });

  // Check if both players have answered
  const connectedPlayers = room.players.filter((p) => p.connected);
  const allAnswered = connectedPlayers.every((p) => session.answers[p.id]);

  if (allAnswered) {
    // Clear the timer and reveal
    if (session.timer) {
      clearTimeout(session.timer);
      session.timer = null;
    }
    revealAnswers(io, roomCode);
  }
}

function handleNext(io, socket, data) {
  const { roomCode } = data || {};
  const session = sessions.get(roomCode);

  if (!session || session.phase !== 'reveal') return;

  const room = roomManager.getRoom(roomCode);
  if (!room) return;

  const player = room.players.find((p) => p.socketId === socket.id);
  if (!player) return;

  advanceRound(io, roomCode);
}

function handlePlayAgain(io, socket, data) {
  const { roomCode, rounds } = data || {};
  // Re-start with a fresh session
  handleStart(io, socket, { roomCode, rounds });
}

// ─── Internal Logic ────────────────────────────────────

function startRoundTimer(io, roomCode) {
  const session = sessions.get(roomCode);
  if (!session) return;

  session.timer = setTimeout(() => {
    session.timer = null;
    // Time's up — reveal whatever we have
    revealAnswers(io, roomCode);
  }, ROUND_TIMER_MS);
}

function revealAnswers(io, roomCode) {
  const session = sessions.get(roomCode);
  if (!session || session.phase !== 'question') return;

  session.phase = 'reveal';

  const room = roomManager.getRoom(roomCode);
  if (!room) return;

  const players = room.players;
  const p1 = players[0];
  const p2 = players[1];

  const answer1 = session.answers[p1?.id] || null;
  const answer2 = session.answers[p2?.id] || null;

  // Both must have answered for it to count
  const bothAnswered = answer1 !== null && answer2 !== null;
  const matched = bothAnswered && answer1 === answer2;

  if (bothAnswered) {
    session.totalAnswered++;
    if (matched) {
      session.totalMatches++;
      session.streak++;
      session.bestStreak = Math.max(session.bestStreak, session.streak);
    } else {
      session.streak = 0;
    }
  }

  const question = session.questions[session.currentRound];
  const result = {
    questionId: question.id,
    answers: {
      [p1?.id]: answer1,
      [p2?.id]: answer2,
    },
    matched,
    bothAnswered,
  };
  session.results.push(result);

  const syncPercent = session.totalAnswered > 0
    ? Math.round((session.totalMatches / session.totalAnswered) * 100)
    : 0;

  const isLastRound = session.currentRound >= session.totalRounds - 1;

  emitToRoom(io, room, 'sync-or-not:reveal', {
    round: session.currentRound,
    answers: {
      [p1?.id]: { answer: answer1, name: p1?.name },
      [p2?.id]: { answer: answer2, name: p2?.name },
    },
    question: { optionA: question.optionA, optionB: question.optionB },
    matched,
    bothAnswered,
    streak: session.streak,
    syncPercent,
    isLastRound,
  });

  // If last round, end the session
  if (isLastRound) {
    endSession(io, roomCode);
  }
}

function advanceRound(io, roomCode) {
  const session = sessions.get(roomCode);
  if (!session) return;

  session.currentRound++;
  session.answers = {};
  session.phase = 'question';

  if (session.currentRound >= session.totalRounds) {
    endSession(io, roomCode);
    return;
  }

  const room = roomManager.getRoom(roomCode);
  if (!room) return;

  const question = session.questions[session.currentRound];

  emitToRoom(io, room, 'sync-or-not:round', {
    round: session.currentRound,
    totalRounds: session.totalRounds,
    question: { id: question.id, category: question.category, optionA: question.optionA, optionB: question.optionB },
    timeLimit: ROUND_TIMER_MS,
  });

  startRoundTimer(io, roomCode);
}

async function endSession(io, roomCode) {
  const session = sessions.get(roomCode);
  if (!session) return;

  session.phase = 'ended';

  if (session.timer) {
    clearTimeout(session.timer);
    session.timer = null;
  }

  const syncPercent = session.totalAnswered > 0
    ? Math.round((session.totalMatches / session.totalAnswered) * 100)
    : 0;

  const room = roomManager.getRoom(roomCode);

  // Persist stats
  try {
    await db.upsertSyncStats(roomCode, {
      totalRounds: session.totalAnswered,
      totalMatches: session.totalMatches,
      bestStreak: session.bestStreak,
    });

    await db.saveGameSession({
      roomCode,
      gameId: 'sync-or-not',
      totalRounds: session.totalRounds,
      totalMatches: session.totalMatches,
      syncPercent,
      bestStreak: session.bestStreak,
      results: session.results,
    });
  } catch (err) {
    console.error('[Sync or Not] Failed to persist stats:', err);
  }

  if (room) {
    emitToRoom(io, room, 'sync-or-not:end', {
      totalRounds: session.totalAnswered,
      totalMatches: session.totalMatches,
      syncPercent,
      bestStreak: session.bestStreak,
      streak: session.streak,
      results: session.results,
    });
  }

  // Clean up the session (but don't clear activeGame — let client navigate away)
  if (session.timer) clearTimeout(session.timer);
  sessions.delete(roomCode);
}

// ─── Helpers ───────────────────────────────────────────

function emitToRoom(io, room, event, data) {
  for (const player of room.players) {
    if (player.connected) {
      io.to(player.socketId).emit(event, data);
    }
  }
}
