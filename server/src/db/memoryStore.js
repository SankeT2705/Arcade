/**
 * In-memory store for local development.
 * Implements the same interface as the Supabase-backed queries
 * so the app works fully without a database connection.
 */

const rooms = new Map();
const gameSessions = new Map();
const syncStats = new Map();

export const memoryStore = {
  // ─── Rooms ────────────────────────────────────────────
  async saveRoom(room) {
    rooms.set(room.code, { ...room, createdAt: new Date().toISOString() });
    return room;
  },

  async getRoom(code) {
    return rooms.get(code) || null;
  },

  async updateRoom(code, updates) {
    const room = rooms.get(code);
    if (!room) return null;
    const updated = { ...room, ...updates };
    rooms.set(code, updated);
    return updated;
  },

  async deleteRoom(code) {
    rooms.delete(code);
  },

  // ─── Game Sessions ────────────────────────────────────
  async saveGameSession(session) {
    const id = `${session.roomCode}-${session.gameId}-${Date.now()}`;
    const record = { ...session, id, createdAt: new Date().toISOString() };
    gameSessions.set(id, record);
    return record;
  },

  async getGameSessions(roomCode, gameId) {
    const results = [];
    for (const session of gameSessions.values()) {
      if (session.roomCode === roomCode && session.gameId === gameId) {
        results.push(session);
      }
    }
    return results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  // ─── Sync Stats (Sync or Not cumulative stats) ───────
  async getSyncStats(roomCode) {
    return syncStats.get(roomCode) || null;
  },

  async upsertSyncStats(roomCode, stats) {
    const existing = syncStats.get(roomCode) || {
      roomCode,
      totalRounds: 0,
      totalMatches: 0,
      bestStreak: 0,
    };
    const updated = {
      ...existing,
      totalRounds: existing.totalRounds + (stats.totalRounds || 0),
      totalMatches: existing.totalMatches + (stats.totalMatches || 0),
      bestStreak: Math.max(existing.bestStreak, stats.bestStreak || 0),
      updatedAt: new Date().toISOString(),
    };
    syncStats.set(roomCode, updated);
    return updated;
  },

  // ─── Utility ──────────────────────────────────────────
  async clear() {
    rooms.clear();
    gameSessions.clear();
    syncStats.clear();
  },
};
