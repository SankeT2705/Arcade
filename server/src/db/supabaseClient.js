import { createClient } from '@supabase/supabase-js';
import config from '../config.js';

let supabase = null;

if (config.supabase.url && config.supabase.key) {
  supabase = createClient(config.supabase.url, config.supabase.key);
  console.info('[DB] Connected to Supabase');
} else {
  console.info('[DB] No Supabase credentials found — using in-memory store');
}

export default supabase;
