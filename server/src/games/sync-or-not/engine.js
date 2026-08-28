import { getRandomQuestions } from './questions.js';
import * as roomManager from '../../rooms/roomManager.js';
import db from '../../db/queries.js';

/**
 * Sync or Not — Server Engine
 *
 * Manages game sessions: question selection, answer collection,
 * reveal logic, streak tracking, and psychological compatibility analytics.
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
 * Compute multi-dimensional psychological & behavioral compatibility profile.
 */
function computePsychologicalProfile(results) {
  if (!results || results.length === 0) {
    return {
      dimensions: {
        emotionalIntuition: 50,
        communicationConflict: 50,
        tasteLifestyle: 50,
        riskSpontaneity: 50,
      },
      archetype: {
        name: 'Harmonious Vibe',
        tagline: 'Balanced Connection',
        description: 'You share a great mix of shared instincts and unique individuality.',
      },
      insights: ['You balance each other with unique perspectives.'],
    };
  }

  const scores = {
    emotionalIntuition: { matched: 0, total: 0 },
    communicationConflict: { matched: 0, total: 0 },
    tasteLifestyle: { matched: 0, total: 0 },
    riskSpontaneity: { matched: 0, total: 0 },
  };

  results.forEach((r) => {
    const qId = r.question?.id || 0;
    const cat = r.question?.category || 'psychological';

    // Map question into specific psychological dimension
    if (cat === 'food' || cat === 'culture' || cat === 'lifestyle') {
      scores.tasteLifestyle.total++;
      if (r.matched) scores.tasteLifestyle.matched++;
    } else if (qId >= 527 && qId <= 532) {
      // Conflict & communication
      scores.communicationConflict.total++;
      if (r.matched) scores.communicationConflict.matched++;
    } else if (qId === 305 || qId === 401 || qId === 402 || qId === 403 || qId === 404 || qId === 503 || qId === 506) {
      // Risk & spontaneity
      scores.riskSpontaneity.total++;
      if (r.matched) scores.riskSpontaneity.matched++;
    } else {
      // General psychological & intuitive alignment
      scores.emotionalIntuition.total++;
      if (r.matched) scores.emotionalIntuition.matched++;
    }
  });

  const calcPercentage = (dim) => {
    if (scores[dim].total === 0) return 75; // Baseline healthy connection
    return Math.round((scores[dim].matched / scores[dim].total) * 100);
  };

  const dimensions = {
    emotionalIntuition: calcPercentage('emotionalIntuition'),
    communicationConflict: calcPercentage('communicationConflict'),
    tasteLifestyle: calcPercentage('tasteLifestyle'),
    riskSpontaneity: calcPercentage('riskSpontaneity'),
  };

  const totalMatches = results.filter((r) => r.matched).length;
  const overallPercent = Math.round((totalMatches / results.length) * 100);

  let archetype;
  const insights = [];

  if (overallPercent >= 85) {
    archetype = {
      name: 'Unspoken Telepathy',
      tagline: 'Effortless Resonance',
      badge: '✨ Soul Link',
      description: 'You operate on the exact same wavelength. Your instincts, emotional pace, and core values match almost effortlessly.',
    };
    insights.push('Your emotional intuition and decision patterns are almost identical.');
    insights.push('You read social situations and friend dynamics through the same lens.');
  } else if (overallPercent >= 65) {
    archetype = {
      name: 'Balanced Resonance',
      tagline: 'Strong Core Alignment',
      badge: '⚡ Deep Resonance',
      description: 'Strong core alignment with enough complementary flavor to keep conversations inspiring, grounded, and engaging.',
    };
    insights.push('You share foundational life principles while bringing fresh viewpoints.');
    insights.push('Disagreements become productive discussions rather than friction.');
  } else if (overallPercent >= 45) {
    archetype = {
      name: 'Complementary Counterparts',
      tagline: 'Dynamic Yin & Yang',
      badge: '🧩 Complementary Duo',
      description: 'You bring different strengths and instincts to the table, creating a rich balance where one covers the blind spots of the other.',
    };
    insights.push('One of you brings spontaneous energy while the other adds grounding clarity.');
    insights.push('Your differing tastes keep shared experiences diverse and novel.');
  } else {
    archetype = {
      name: 'Dynamic Explorers',
      tagline: 'Unique Individual Minds',
      badge: '🔭 Independent Thinkers',
      description: 'Completely distinct individual perspectives that challenge, entertain, and surprise each other at every turn.',
    };
    insights.push('You approach life and decisions from completely independent angles.');
    insights.push('There is never a dull moment because your reactions are unpredictably fun.');
  }

  // Dimension specific insight
  if (dimensions.tasteLifestyle >= 70) {
    insights.push('Shared taste in food and culture makes casual hangouts effortless.');
  } else if (dimensions.emotionalIntuition >= 70) {
    insights.push('High emotional empathy allows you to understand each other without explanation.');
  }

  return {
    dimensions,
    archetype,
    insights,
  };
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
    analytics: computePsychologicalProfile(session.results),
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
    phase: 'question',
    answers: {},
    results: [],
    streak: 0,
    bestStreak: 0,
    totalMatches: 0,
    totalAnswered: 0,
    timer: null,
    readyForNext: new Set(),
  };

  sessions.set(roomCode, session);
  roomManager.setActiveGame(roomCode, 'sync-or-not');

  startRound(io, roomCode);
}

function handleAnswer(io, socket, data) {
  const { roomCode, answer } = data || {};

  if (!roomCode || (answer !== 'A' && answer !== 'B')) {
    socket.emit('sync-or-not:error', { message: 'Invalid answer. Must be A or B.' });
    return;
  }

  const session = sessions.get(roomCode);
  if (!session || session.phase !== 'question') {
    socket.emit('sync-or-not:error', { message: 'Not accepting answers right now.' });
    return;
  }

  const room = roomManager.getRoom(roomCode);
  if (!room) return;

  const player = room.players.find((p) => p.socketId === socket.id);
  if (!player) {
    socket.emit('sync-or-not:error', { message: 'You are not in this room.' });
    return;
  }

  // Record answer (prevent duplicate submissions)
  if (session.answers[player.id]) {
    return;
  }

  session.answers[player.id] = {
    answer,
    name: player.name,
    timestamp: Date.now(),
  };

  // Notify other player that this player has answered (without revealing the choice)
  emitToRoom(io, room, 'sync-or-not:player-answered', {
    playerId: player.id,
    playerName: player.name,
  });

  // Check if both players answered
  const connectedPlayers = room.players.filter((p) => p.connected);
  const answeredCount = Object.keys(session.answers).length;

  if (answeredCount >= connectedPlayers.length && connectedPlayers.length >= 2) {
    // Both answered — clear timer and reveal
    if (session.timer) {
      clearTimeout(session.timer);
      session.timer = null;
    }
    revealRound(io, roomCode);
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

  session.readyForNext.add(player.id);

  // If both players clicked next, advance
  const connectedPlayers = room.players.filter((p) => p.connected);
  if (session.readyForNext.size >= connectedPlayers.length) {
    advanceRound(io, roomCode);
  }
}

function handlePlayAgain(io, socket, data) {
  const { roomCode, rounds } = data || {};
  handleStart(io, socket, { roomCode, rounds });
}

// ─── Internal Logic ────────────────────────────────────

function startRoundTimer(io, roomCode) {
  const session = sessions.get(roomCode);
  if (!session) return;

  if (session.timer) clearTimeout(session.timer);

  session.timer = setTimeout(() => {
    session.timer = null;
    revealRound(io, roomCode);
  }, ROUND_TIMER_MS);
}

function revealRound(io, roomCode) {
  const session = sessions.get(roomCode);
  if (!session || session.phase !== 'question') return;

  session.phase = 'reveal';
  session.readyForNext = new Set();

  const room = roomManager.getRoom(roomCode);
  if (!room) return;

  const playerIds = Object.keys(session.answers);
  const isMatch =
    playerIds.length >= 2 &&
    session.answers[playerIds[0]]?.answer === session.answers[playerIds[1]]?.answer;

  session.totalAnswered++;

  if (isMatch) {
    session.streak++;
    session.totalMatches++;
    if (session.streak > session.bestStreak) {
      session.bestStreak = session.streak;
    }
  } else {
    session.streak = 0;
  }

  const syncPercent = session.totalAnswered > 0
    ? Math.round((session.totalMatches / session.totalAnswered) * 100)
    : 0;

  const currentQuestion = session.questions[session.currentRound];
  const roundResult = {
    round: session.currentRound,
    question: currentQuestion,
    answers: session.answers,
    matched: isMatch,
    streak: session.streak,
    bestStreak: session.bestStreak,
    totalMatches: session.totalMatches,
    totalRounds: session.totalRounds,
    syncPercent,
    isLastRound: session.currentRound >= session.totalRounds - 1,
  };

  session.results.push(roundResult);

  emitToRoom(io, room, 'sync-or-not:reveal', roundResult);

  if (roundResult.isLastRound) {
    setTimeout(() => {
      endSession(io, roomCode);
    }, 4000);
  }
}

function advanceRound(io, roomCode) {
  const session = sessions.get(roomCode);
  if (!session) return;

  session.currentRound++;

  if (session.currentRound >= session.totalRounds) {
    endSession(io, roomCode);
  } else {
    startRound(io, roomCode);
  }
}

function startRound(io, roomCode) {
  const session = sessions.get(roomCode);
  if (!session) return;

  session.phase = 'question';
  session.answers = {};
  session.readyForNext = new Set();

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

  const analytics = computePsychologicalProfile(session.results);
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
      analytics,
    });
  }

  if (session.timer) clearTimeout(session.timer);
  sessions.delete(roomCode);
}

// ─── Helpers ───────────────────────────────────────────

function emitToRoom(io, room, event, data) {
  for (const player of room.players) {
    if (player.connected && player.socketId) {
      io.to(player.socketId).emit(event, data);
    }
  }
}
