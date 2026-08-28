import * as syncOrNotEngine from './sync-or-not/engine.js';
import * as scribbleDuelEngine from './scribble-duel/engine.js';

/**
 * Server-side Game Registry
 * Maps game IDs to their engine modules.
 * Adding a new game = import + register it here.
 */

const games = {
  'sync-or-not': {
    id: 'sync-or-not',
    name: 'Sync or Not',
    description: 'Pick the same answer as your friend — are you in sync?',
    minPlayers: 2,
    maxPlayers: 2,
    engine: syncOrNotEngine,
  },
  'scribble-duel': {
    id: 'scribble-duel',
    name: 'Scribble Duel',
    description: 'Draw, guess, and outscore your friend!',
    minPlayers: 2,
    maxPlayers: 2,
    engine: scribbleDuelEngine,
  },
};

/**
 * Get a game engine by ID.
 * @param {string} gameId
 * @returns {object|null} The game entry with engine
 */
export function getGame(gameId) {
  return games[gameId] || null;
}

/**
 * Get all registered games (metadata only, no engine functions).
 * @returns {Array}
 */
export function getAllGames() {
  return Object.values(games).map(({ id, name, description, minPlayers, maxPlayers }) => ({
    id,
    name,
    description,
    minPlayers,
    maxPlayers,
  }));
}

/**
 * Register all game event handlers on a socket.
 * @param {import('socket.io').Server} io
 * @param {import('socket.io').Socket} socket
 */
export function registerAllHandlers(io, socket) {
  for (const game of Object.values(games)) {
    game.engine.registerHandlers(io, socket);
  }
}

/**
 * Get session state for a game (used during reconnection).
 * @param {string} gameId
 * @param {string} roomCode
 * @returns {object|null}
 */
export function getGameSessionState(gameId, roomCode) {
  const game = games[gameId];
  if (!game) return null;
  return game.engine.getSessionState(roomCode);
}

/**
 * Clean up a game session.
 * @param {string} gameId
 * @param {string} roomCode
 */
export function cleanupGame(gameId, roomCode) {
  const game = games[gameId];
  if (game) {
    game.engine.cleanup(roomCode);
  }
}

export default games;
