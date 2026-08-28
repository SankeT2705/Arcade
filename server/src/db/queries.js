import supabase from './supabaseClient.js';
import { memoryStore } from './memoryStore.js';

/**
 * Database abstraction layer.
 * Uses Supabase when credentials are available, otherwise falls back to in-memory store.
 */

const useSupabase = supabase !== null;

const db = {
  // ─── Rooms ────────────────────────────────────────────
  async saveRoom(room) {
    if (useSupabase) {
      const { data, error } = await supabase.from('rooms').insert(room).select().single();
      if (error) throw error;
      return data;
    }
    return memoryStore.saveRoom(room);
  },

  async getRoom(code) {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('code', code)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    }
    return memoryStore.getRoom(code);
  },

  async updateRoom(code, updates) {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('rooms')
        .update(updates)
        .eq('code', code)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    return memoryStore.updateRoom(code, updates);
  },

  async deleteRoom(code) {
    if (useSupabase) {
      const { error } = await supabase.from('rooms').delete().eq('code', code);
      if (error) throw error;
      return;
    }
    return memoryStore.deleteRoom(code);
  },

  // ─── Game Sessions ────────────────────────────────────
  async saveGameSession(session) {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('game_sessions')
        .insert(session)
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    return memoryStore.saveGameSession(session);
  },

  async getGameSessions(roomCode, gameId) {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('game_sessions')
        .select('*')
        .eq('room_code', roomCode)
        .eq('game_id', gameId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data || [];
    }
    return memoryStore.getGameSessions(roomCode, gameId);
  },

  // ─── Sync Stats ───────────────────────────────────────
  async getSyncStats(roomCode) {
    if (useSupabase) {
      const { data, error } = await supabase
        .from('sync_stats')
        .select('*')
        .eq('room_code', roomCode)
        .single();
      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    }
    return memoryStore.getSyncStats(roomCode);
  },

  async upsertSyncStats(roomCode, stats) {
    if (useSupabase) {
      const existing = await db.getSyncStats(roomCode);
      const merged = {
        room_code: roomCode,
        total_rounds: (existing?.total_rounds || 0) + (stats.totalRounds || 0),
        total_matches: (existing?.total_matches || 0) + (stats.totalMatches || 0),
        best_streak: Math.max(existing?.best_streak || 0, stats.bestStreak || 0),
        updated_at: new Date().toISOString(),
      };
      const { data, error } = await supabase
        .from('sync_stats')
        .upsert(merged, { onConflict: 'room_code' })
        .select()
        .single();
      if (error) throw error;
      return data;
    }
    return memoryStore.upsertSyncStats(roomCode, stats);
  },
};

export default db;
