/**
 * Client-side Game Registry
 *
 * Imports all game configs and provides them to the GameHub grid.
 * Adding a new game = import its config here. No other files need to change.
 */

import syncOrNotConfig from './sync-or-not/game.config';
import scribbleDuelConfig from './scribble-duel/game.config';

export const games = [syncOrNotConfig, scribbleDuelConfig];

/**
 * Get a game config by ID.
 * @param {string} id
 * @returns {object|undefined}
 */
export function getGameById(id) {
  return games.find((g) => g.id === id);
}
