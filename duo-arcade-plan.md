# Duo Arcade — Project Plan & Architecture

A single extensible "game hub" web app. Users land on a home screen, pick a game
from a menu, and play in real time with a friend. Built to support adding new
games later without re-architecting anything.

**Phase 1 games:**
1. **Sync or Not** — swipe-based "Would You Rather / This or That", tracks a running Sync % over time
2. **Scribble Duel** — Pictionary-style live drawing + guessing, timer + score

---

## 1. Product Overview

### Core loop
1. User opens the app → sees a **Game Hub** (grid of game cards, more added over time)
2. User creates a **Room** (gets a short code / shareable link) or joins one
3. Both players land in the same room lobby → pick a game → play
4. Results/stats persist per room and per game (sync %, win history, streaks)
5. After a game ends, players can rematch, switch games, or go back to the hub

### Non-negotiable qualities (per your ask)
- Feels **professional and polished**, not like a hackathon demo
- **Fully responsive** — laptop and mobile both first-class, not "mobile as an afterthought"
- **Bug-free / functional** — real error handling, reconnect handling, no dead-end states
- **Extensible** — adding "Game #3" later should mean adding a folder, not touching core code

---

## 2. Architecture

### High-level diagram
```
┌─────────────────────────────┐        WebSocket        ┌──────────────────────────────┐
│   Frontend (React + Vite)   │◄───────────────────────►│   Realtime Server (Node.js)   │
│   Deployed on Vercel        │        Socket.IO         │   Deployed on Render/Fly.io   │
│                              │                          │                                │
│  - Game Hub                 │        REST (fallback)   │  - Room manager               │
│  - Room Lobby                │◄───────────────────────►│  - Game engines (per game)     │
│  - Game modules (plug-in)   │                          │  - Socket event router         │
└──────────────┬───────────────┘                          └───────────────┬────────────────┘
               │                                                            │
               ▼                                                            ▼
       ┌───────────────┐                                          ┌───────────────────┐
       │  Supabase Auth │ (optional, or room-code only)            │  Supabase / Mongo  │
       └───────────────┘                                          │  (persist stats,    │
                                                                    │   rooms, results)   │
                                                                    └───────────────────┘
```

### Why two separate deployments
Vercel's serverless functions **do not hold persistent WebSocket connections** —
they spin down between requests. Socket.IO needs a long-lived Node process, so:

- **Frontend (React/Vite)** → **Vercel** (static + edge, perfect for this)
- **Realtime backend (Node + Express + Socket.IO)** → **Render, Railway, or Fly.io** (free tier is fine to start)

This split is standard practice and keeps each part doing what it's best at.

### Tech stack

| Layer | Choice | Why |
|---|---|---|
| Frontend framework | React 18 + Vite | Fast dev loop, works cleanly with Antigravity |
| Styling | Tailwind CSS | Fast, consistent, responsive-by-default utility classes |
| Animation | Framer Motion | Card swipes, drawing feedback, score pop-ins — this is what makes it feel "fun" not "functional" |
| Realtime | Socket.IO (client + server) | Rooms, reconnection handling, broad browser support out of the box |
| Backend | Node.js + Express | Hosts Socket.IO, minimal REST endpoints (room creation, stats fetch) |
| Drawing canvas | HTML5 Canvas API (native) or `react-konva` | Konva gives you object-based drawing which is easier to sync and undo |
| Database | Supabase (Postgres) | Free tier, has auth built-in if you want it later, easy relational schema for rooms/games/stats |
| Room identity | 6-character room codes, no login required initially | Lowers friction — click a link, you're in |
| Deployment | Vercel (frontend) + Render (backend) | Free tiers, both trivial to wire to GitHub for auto-deploy |

### Making it "one base app, many games" (the important part)

Structure the app so each game is a **self-contained module** that plugs into a
shared shell. The shell owns: room/lobby logic, socket connection, player
presence, and the game-selector UI. Each game owns: its own UI, its own socket
event namespace, and its own state.

```
/client
  /src
    /app                      # shell: routing, room lobby, socket provider
      SocketProvider.jsx
      RoomLobby.jsx
      GameHub.jsx              # the game-picker grid
    /games
      /sync-or-not             # Game 1
        SyncOrNot.jsx
        useSyncOrNotSocket.js
        questions.js
        game.config.js         # metadata: name, icon, min players, description
      /scribble-duel            # Game 2
        ScribbleDuel.jsx
        Canvas.jsx
        useScribbleSocket.js
        wordList.js
        game.config.js
      gameRegistry.js           # imports every game.config.js, feeds GameHub grid
    /components                 # shared UI: Button, Card, Avatar, Timer, Scoreboard
    /hooks
    /lib

/server
  /src
    index.js                    # Express + Socket.IO bootstrap
    /rooms
      roomManager.js             # create/join/leave, presence tracking
    /games
      /sync-or-not
        engine.js                 # game-specific socket event handlers
        questions.js
      /scribble-duel
        engine.js
        wordList.js
      gameRegistry.js             # maps game id -> engine, mirrors client registry
    /db
      supabaseClient.js
      queries.js
```

Adding **Game #3** later = new folder in `/games` on both client and server,
register it in the two `gameRegistry.js` files, done. Nothing else changes.

---

## 3. Game Specs

### Game 1 — Sync or Not (Would You Rather / This or That)

**Flow:**
1. Host starts round → server picks a question (or host picks category)
2. Both clients show the same two options as swipeable/tappable cards
3. Both players answer within a time limit (e.g. 10s)
4. Server reveals both answers simultaneously (no peeking early — server withholds the partner's answer until both have submitted)
5. If matched → +1 to Sync streak, confetti/animation. If not → streak resets, still shown warmly (not punishing)
6. Running **Sync %** = (matched answers / total answered), persisted per room pair
7. After N rounds (e.g. 10), show a summary screen with Sync % and a shareable result card

**Socket events (namespace: `sync-or-not`):**
- `round:start` (server → clients): sends question + options
- `answer:submit` (client → server): player's choice
- `round:reveal` (server → clients): both answers + match result
- `session:end` (server → clients): final stats

**Data model:**
```
Room { id, code, players[], activeGame, createdAt }
SyncSession { roomId, rounds: [{ questionId, answers: {playerA, playerB}, matched }], syncPercent }
Question { id, category, optionA, optionB }
```

### Game 2 — Scribble Duel (Pictionary-style)

**Flow:**
1. Server assigns Drawer and Guesser roles (swap each round)
2. Drawer gets a secret word (with difficulty/category filter), timer starts (e.g. 60s)
3. Drawer draws on canvas → strokes streamed live via socket to Guesser (low-latency stroke events, not full image frames)
4. Guesser types guesses in a chat-like input → server checks against the word (fuzzy match ok)
5. Correct guess → round ends early, points awarded based on time remaining
6. Timer runs out → reveal word, no points, next round (roles swap)
7. Best-of-N rounds → final scoreboard

**Socket events (namespace: `scribble-duel`):**
- `round:start` (server → drawer only): the secret word
- `round:start` (server → guesser): "drawing has started", no word
- `draw:stroke` (drawer → server → guesser): stroke point data `{x, y, color, width, isNewLine}`
- `draw:clear` (drawer → server → guesser): canvas cleared
- `guess:submit` (guesser → server): text guess
- `guess:correct` / `guess:wrong` (server → both): result + points
- `round:timeout` (server → both): reveal word
- `session:end` (server → both): final scores

**Data model:**
```
ScribbleSession { roomId, rounds: [{ word, drawerId, correctGuesserId, timeTaken, points }], scores: {playerA, playerB} }
WordBank { id, word, category, difficulty }
```

**Important technical note:** stream individual stroke *points* (not canvas
snapshots) over the socket — much lower bandwidth, smoother on mobile
connections, and lets you replay/save drawings later if you want a gallery
feature.

---

## 4. Mobile + Laptop Compatibility Plan

- Build **mobile-first** with Tailwind breakpoints (`sm:`, `md:`, `lg:`) — design for a 375px-wide screen first, then expand
- Canvas game: use pointer events (`onPointerDown/Move/Up`), not just mouse events, so touch and stylus work identically to mouse
- Swipe game: implement swipe via a touch/drag library (Framer Motion's `drag` prop works well) but always include tap-to-select buttons as a fallback — never make a feature *only* work via gesture
- Test viewport targets: 375px (phone), 768px (tablet), 1280px+ (laptop/desktop)
- Avoid fixed pixel widths anywhere in game UI; use `flex`/`grid` with relative sizing
- Safe-area insets for iOS (notch/home-indicator) via `env(safe-area-inset-*)` in the root layout

---

## 5. "Bug-Free & Professional" Checklist

Build these in from day one, not as an afterthought:

- **Reconnection handling**: if a player's socket drops, show "Reconnecting..." not a broken screen; server holds their room slot for a grace period (e.g. 60s)
- **Empty/edge states**: what does the UI show if you're the only one in the room? If the partner disconnects mid-round? Design these screens explicitly, don't leave them blank
- **Input validation**: server-side validation on every socket event (never trust client-submitted scores/answers)
- **Loading states**: skeleton loaders for room join, game load — never a blank white flash
- **Error boundaries**: React error boundary around each game module so one game crashing doesn't kill the whole app
- **Rate limiting** on room creation / socket events to prevent spam
- **Environment separation**: `.env` for dev vs prod socket URLs, never hardcode `localhost`
- **Linting/formatting**: ESLint + Prettier configured from the start
- **Manual test pass** before each deploy: 2 devices (1 phone + 1 laptop), full game loop, disconnect/reconnect, room-full scenarios

---

## 6. Suggested Build Order

1. Scaffold shell: React + Vite + Tailwind, routing, Socket.IO client provider
2. Scaffold server: Express + Socket.IO, room manager (create/join/leave/presence)
3. Build Game Hub screen (static grid, even with just 1 game registered) + Room Lobby
4. Build **Sync or Not** end-to-end (simplest game — good for proving the plumbing works)
5. Build **Scribble Duel** end-to-end (proves canvas streaming works)
6. Add Supabase persistence for stats/history
7. Polish pass: animations, mobile testing, error/empty states
8. Deploy: frontend → Vercel, backend → Render; wire env vars; test cross-device

---

## 7. Antigravity Build Prompt

Copy the block below into Antigravity as your project brief. It's written to
be specific enough to avoid generic scaffolding, while leaving room for the
agent to make sensible implementation calls.

```
Build a web app called "Duo Arcade" — a real-time 2-player game hub. It is a
single base application where users pick a game from a hub screen and play
live with one other person via a shared room code/link. Must be architected
so new games can be added later as self-contained modules without touching
core app logic.

STACK
- Frontend: React 18 + Vite + Tailwind CSS + Framer Motion, structured for
  deployment on Vercel.
- Backend: Node.js + Express + Socket.IO, structured for deployment on
  Render (or Fly.io) as a persistent process — do NOT assume serverless.
- Database: Supabase (Postgres) for persisting rooms, sessions, and stats.
- No login required — rooms are joined via a 6-character room code /
  shareable link. Support up to 2 players per room for now.

ARCHITECTURE REQUIREMENTS
- Client structure: /src/app (shell: socket provider, room lobby, game hub
  grid), /src/games/<game-name> (one folder per game, fully self-contained:
  its own components, its own socket hook, its own game.config.js with
  {id, name, description, icon, minPlayers, maxPlayers}), and a
  gameRegistry.js that imports every game's config to render the hub grid.
- Server structure: mirrors the client — /src/rooms (room manager: create,
  join, leave, presence, reconnection grace period), /src/games/<game-name>
  (engine.js with that game's socket event handlers), and a matching
  gameRegistry.js.
- Every game communicates over its own Socket.IO namespace or event prefix
  so games never collide.
- Server is the source of truth for all game state and scoring — never trust
  client-submitted results; validate everything server-side.

GAME 1: "Sync or Not" (Would You Rather / This or That)
- Server presents a question with two options to both players simultaneously.
- Both players answer within a time limit (default 10s); answers are hidden
  from the other player until both have submitted.
- On reveal, show both answers and whether they matched, with a satisfying
  animation on a match (e.g. confetti) and a gentle non-punishing state on a
  mismatch.
- Track a running "Sync %" = matched answers / total rounds, persisted per
  room pair across sessions.
- Run a configurable number of rounds (default 10), then show a summary
  screen with final Sync % and an option to play again or return to the hub.
- Include a starter question bank of at least 30 varied would-you-rather /
  this-or-that questions across a couple of categories.

GAME 2: "Scribble Duel" (Pictionary-style)
- Each round, server assigns one player as Drawer and one as Guesser, and
  swaps roles each round.
- Drawer receives a secret word from a word bank; Guesser does not see it.
- Drawer draws on an HTML5 canvas (support both mouse and touch/pointer
  events equally). Stream individual stroke points over the socket in real
  time to the Guesser's canvas (do not send full image snapshots — stream
  incremental stroke data for performance).
- Guesser submits text guesses; server checks against the word (allow minor
  typo tolerance) and awards points based on time remaining when guessed
  correctly.
- Round has a timer (default 60s); if it expires, reveal the word with no
  points awarded, then move to the next round.
- Run a configurable number of rounds (default 6, 3 each as drawer), then
  show a final scoreboard.
- Include a starter word bank of at least 40 words across at least 2
  difficulty levels.

UI/UX REQUIREMENTS
- Fully responsive: must work equally well on mobile (375px width) and
  laptop/desktop (1280px+). Design mobile-first, then scale up.
- Use pointer events (not just mouse events) for the drawing canvas so touch
  input works identically to mouse input.
- For the swipe-based game, implement drag/swipe gestures via Framer Motion
  but ALSO provide visible tap-to-select buttons as a non-gesture fallback.
- Respect iOS safe-area insets in the root layout.
- Polished visual design: consistent color system and spacing via Tailwind
  config (not default Tailwind colors used ad hoc), smooth transitions
  between screens, loading skeletons (no blank white flashes), and empty/
  error states designed explicitly for: partner disconnected, room full,
  invalid room code, reconnecting.
- Add a persistent header/nav allowing return to the Game Hub from inside
  any game without losing room context.

RELIABILITY REQUIREMENTS
- Handle socket disconnects gracefully: show a "Reconnecting..." state,
  hold the player's room slot for a 60-second grace period before releasing
  it, and resync game state on reconnect rather than resetting the game.
- Wrap each game module in a React error boundary so a crash in one game
  does not take down the whole app.
- Validate all socket event payloads server-side (types, expected shape,
  room membership) before acting on them.
- Set up ESLint + Prettier for the project.
- Use environment variables for the Socket.IO server URL (never hardcode
  localhost), with separate dev/prod configs.

DELIVERABLES
- A working monorepo (or two clearly separated /client and /server folders)
  with clear README instructions for local dev and for deploying the
  client to Vercel and the server to Render.
- Both games fully playable end-to-end between two browser tabs/devices
  connected to the same room.
- A visible, working Game Hub with both games listed as selectable cards,
  built so a third game folder could be added later by following the same
  pattern as the existing two.
```

---

## 8. Next Steps

If you'd like, I can now generate the actual **starter code** — the shared
shell (Socket provider, Room Lobby, Game Hub) plus one working game end-to-end
— as real files you can drop straight into Antigravity, rather than just this
plan. Just say the word and which game to wire up first (Sync or Not is the
simpler one to prove the architecture with).
