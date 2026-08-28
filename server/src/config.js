import 'dotenv/config';

const config = {
  port: parseInt(process.env.PORT, 10) || 3001,
  clientUrl: process.env.CLIENT_URL || 'http://localhost:5173',
  nodeEnv: process.env.NODE_ENV || 'development',
  supabase: {
    url: process.env.SUPABASE_URL || '',
    key: process.env.SUPABASE_KEY || '',
  },
  room: {
    maxPlayers: 2,
    reconnectGracePeriodMs: 60_000, // 60 seconds
    codeLength: 6,
  },
  rateLimit: {
    roomCreationMax: 5, // max room creations per minute per IP
    roomCreationWindowMs: 60_000,
    socketEventMax: 100, // max events per second per socket
    socketEventWindowMs: 1_000,
  },
};

export default config;
