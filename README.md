# 🎮 Duo Arcade

A real-time 2-player game hub. Pick a game, share a room code, and play together live.

## Games

| Game | Description | Players |
|------|-------------|---------|
| 🔮 **Sync or Not** | Would You Rather / This or That — pick the same answer as your friend to build a Sync streak | 2 |
| 🎨 **Scribble Duel** | Pictionary-style drawing & guessing with time-based scoring | 2 |

## Architecture

```
Arcade/
├── client/          → React 18 + Vite + Tailwind CSS + Framer Motion
├── server/          → Node.js + Express + Socket.IO
├── package.json     → Root workspace config
└── README.md
```

**Pluggable game architecture**: Each game is a self-contained module in `/games/<game-name>/` on both client and server. Adding a new game means:
1. Create a new folder under `client/src/games/` and `server/src/games/`
2. Register it in both `gameRegistry.js` files
3. That's it — no changes to shell/hub code

## Local Development Setup

### Prerequisites
- **Node.js** >= 18
- **npm** >= 9

### Quick Start

```bash
# 1. Install all dependencies (root + client + server)
npm install

# 2. Start both client and server concurrently
npm run dev
```

This will start:
- **Client** on `http://localhost:5173`
- **Server** on `http://localhost:3001`

The Vite dev server proxies `/socket.io` and `/api` requests to the server automatically.

### Running Separately

```bash
# Client only
npm run dev:client

# Server only
npm run dev:server
```

## Environment Variables

### Client (`client/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_SOCKET_URL` | Socket.IO server URL. Leave empty in dev (Vite proxy handles it) | `""` |
| `VITE_APP_URL` | Public app URL | `http://localhost:5173` |

### Server (`server/.env`)

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `3001` |
| `CLIENT_URL` | Allowed CORS origin | `http://localhost:5173` |
| `SUPABASE_URL` | Supabase project URL (optional) | `""` |
| `SUPABASE_KEY` | Supabase anon/service key (optional) | `""` |
| `NODE_ENV` | Environment | `development` |

> **Note**: The app works fully without Supabase — game state and stats are stored in memory. Add Supabase credentials to enable persistence across server restarts.

## Deployment

### Client → Vercel

1. Connect your GitHub repo to Vercel
2. Set the **Root Directory** to `client`
3. Set **Build Command** to `npm run build`
4. Set **Output Directory** to `dist`
5. Add environment variables:
   - `VITE_SOCKET_URL` = your Render server URL (e.g., `https://duo-arcade-server.onrender.com`)

### Server → Render

1. Create a new **Web Service** on Render
2. Set the **Root Directory** to `server`
3. Set **Build Command** to `npm install`
4. Set **Start Command** to `npm start`
5. Add environment variables:
   - `CLIENT_URL` = your Vercel client URL (e.g., `https://duo-arcade.vercel.app`)
   - `SUPABASE_URL` and `SUPABASE_KEY` (optional)
   - `NODE_ENV` = `production`

> **Important**: Render's free tier may spin down after inactivity. For persistent WebSocket connections, use a paid plan or Fly.io.

## Adding a New Game

### Client Side

1. Create `client/src/games/<game-name>/` with:
   - `game.config.js` — exports `{ id, name, description, icon, minPlayers, maxPlayers, component }`
   - `<GameName>.jsx` — main game component (receives `roomCode` prop)
   - `use<GameName>Socket.js` — custom hook for socket events
   - Any additional components

2. Register in `client/src/games/gameRegistry.js`:
   ```js
   import myGameConfig from './<game-name>/game.config';
   export const games = [...existingGames, myGameConfig];
   ```

### Server Side

1. Create `server/src/games/<game-name>/` with:
   - `engine.js` — exports `registerHandlers(io, socket)`, `cleanup(roomCode)`, `getSessionState(roomCode)`
   - Any data files (word banks, question banks, etc.)

2. Register in `server/src/games/gameRegistry.js`:
   ```js
   import * as myGameEngine from './<game-name>/engine.js';
   // Add to the games object
   ```

### Socket Event Convention
Prefix all events with the game ID: `<game-id>:<event-name>` (e.g., `my-game:round-start`)

## Manual QA Checklist

### Core Flow
- [ ] Create a room — room code is generated and displayed
- [ ] Copy room link — link is copied to clipboard
- [ ] Join room with code — second player joins successfully
- [ ] Invalid room code — shows error message
- [ ] Full room (3rd player) — shows "room is full" error
- [ ] Leave room — player is removed, partner is notified

### Sync or Not
- [ ] Start game with 2 players — first question appears
- [ ] Both players answer — reveal screen shows both answers
- [ ] Matching answers — confetti plays, streak increments
- [ ] Mismatching answers — gentle message, streak resets
- [ ] Timer expires — auto-reveals answers
- [ ] Complete 10 rounds — summary screen with Sync %, streak, breakdown
- [ ] Play Again — starts new session
- [ ] Back to Hub — returns to game picker

### Scribble Duel
- [ ] Start game with 2 players — drawer sees word, guesser sees blanks
- [ ] Drawer draws — strokes appear on guesser's canvas in real time
- [ ] Drawing tools — color and brush width changes work
- [ ] Clear canvas — clears for both players
- [ ] Guesser guesses — correct shows ✓, close shows 🔥
- [ ] Correct guess — round ends, points awarded
- [ ] Timer expires — word revealed, next round starts
- [ ] Roles swap each round
- [ ] Complete 6 rounds — scoreboard with winner
- [ ] Play Again / Back to Hub

### Reliability
- [ ] Disconnect mid-game — "Reconnecting" shown to both
- [ ] Reconnect within 60s — game state restored
- [ ] Grace period expires — partner removed
- [ ] Mobile viewport (375px) — all UI usable, touch drawing works
- [ ] Desktop viewport (1280px+) — layout expanded properly
- [ ] Header nav — "Back to Games" from inside game works

## Tech Stack

- **Frontend**: React 18, Vite 5, Tailwind CSS 3, Framer Motion 11
- **Backend**: Node.js, Express 4, Socket.IO 4
- **Database**: Supabase (Postgres) — optional, in-memory fallback for dev
- **Code Quality**: ESLint + Prettier

## License

MIT
