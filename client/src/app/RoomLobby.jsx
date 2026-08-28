import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomContext } from './RoomContext';
import { useSocketContext } from './SocketProvider';
import { games, getGameById } from '../games/gameRegistry';
import GameErrorBoundary from '../games/GameErrorBoundary';
import Card from '../components/Card';
import Button from '../components/Button';
import Avatar from '../components/Avatar';
import { useToast } from '../components/Toast';
import {
  CopyIcon,
  CheckIcon,
  ZapIcon,
  RefreshIcon,
  LinkIcon,
  BrushIcon,
  CompassIcon,
  GamepadIcon,
  ArrowRightIcon,
} from '../components/Icons';
import { copyToClipboard, getPlayerName, generateDefaultName } from '../lib/utils';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

function renderGameIcon(iconKey) {
  if (iconKey === 'brush') return <BrushIcon className="w-6 h-6 text-primary-600" />;
  if (iconKey === 'compass') return <CompassIcon className="w-6 h-6 text-emerald-600" />;
  return <GamepadIcon className="w-6 h-6 text-primary-600" />;
}

export default function RoomLobby() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const {
    room,
    selectGame,
    backToHub,
    partnerDisconnected,
    joinRoom,
    error,
    clearError,
  } = useRoomContext();
  const { playerId } = useSocketContext();
  const { addToast } = useToast();
  const [GameComponent, setGameComponent] = useState(null);
  const [copied, setCopied] = useState(false);
  const [tempName, setTempName] = useState(() => getPlayerName() || generateDefaultName());

  const handleJoinWithName = (e) => {
    e.preventDefault();
    if (!tempName.trim()) return;
    getPlayerName(tempName.trim());
    joinRoom(roomCode, tempName.trim());
  };

  // Load game component when active game changes
  useEffect(() => {
    if (room?.activeGame) {
      const game = getGameById(room.activeGame);
      if (game) {
        game.component().then((mod) => {
          setGameComponent(() => mod.default);
        });
      }
    } else {
      setGameComponent(null);
    }
  }, [room?.activeGame]);

  const handleCopyLink = async () => {
    const url = `${window.location.origin}/room/${room?.code || roomCode}`;
    const success = await copyToClipboard(url);
    if (success) {
      setCopied(true);
      addToast('Invite link copied!', 'success');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleCopyCode = async () => {
    const success = await copyToClipboard(room?.code || roomCode || '');
    if (success) {
      addToast('Room code copied!', 'success');
    }
  };

  const handleSelectGame = (gameId) => {
    selectGame(gameId);
  };

  // Error state
  if (error) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>
          <div className="w-14 h-14 rounded-2xl bg-danger-50 border border-danger-200 text-danger-600 flex items-center justify-center mx-auto mb-4">
            <RefreshIcon className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-heading font-bold text-surface-950 mb-2">Room Error</h2>
          <p className="text-surface-600 text-sm mb-6">{error}</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              variant="primary"
              onClick={() => {
                clearError();
                const name = tempName || getPlayerName() || generateDefaultName();
                joinRoom(roomCode, name);
              }}
            >
              Try Again
            </Button>
            <Button variant="secondary" onClick={() => navigate('/')}>
              Return Home
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  // Not in room yet? (Joined via direct URL)
  if (!room) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center">
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card-surface p-8 shadow-card">
          <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-200 text-primary-600 flex items-center justify-center mx-auto mb-4 shadow-soft">
            <LinkIcon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-heading font-black text-surface-950 mb-1">
            Join Room
          </h2>
          <p className="text-surface-500 text-xs font-mono mb-6">
            Room #{roomCode}
          </p>

          <form onSubmit={handleJoinWithName} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1.5">
                Your Name
              </label>
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="input-base"
                placeholder="Enter your name"
                maxLength={20}
                autoFocus
              />
            </div>
            <Button type="submit" disabled={!tempName.trim()} className="w-full py-3.5 text-sm font-heading font-bold rounded-2xl shadow-soft">
              Enter Room
            </Button>
          </form>
        </motion.div>
      </div>
    );
  }

  // If a game is active, render the game
  if (room?.activeGame && GameComponent) {
    return (
      <GameErrorBoundary onReset={backToHub}>
        <GameComponent roomCode={room.code} />
      </GameErrorBoundary>
    );
  }

  const me = room?.players?.find((p) => p.id === playerId);
  const partner = room?.players?.find((p) => p.id !== playerId);
  const isReady = room?.players?.length >= 2;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
        {/* Top Header: Back Link + Room Code Card */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <button
            onClick={() => navigate('/')}
            className="btn-ghost text-xs text-surface-600 self-start sm:self-center"
          >
            ← Home
          </button>

          {/* Room Code Card */}
          <div className="inline-flex items-center gap-3 bg-white rounded-2xl p-2.5 sm:px-5 sm:py-2.5 border border-black/[0.06] shadow-card">
            <span className="text-xs text-surface-500 font-semibold uppercase tracking-wider">Room Code</span>
            <button
              onClick={handleCopyCode}
              className="font-mono font-black text-2xl tracking-[0.2em] text-primary-700 hover:text-primary-800 transition-colors"
              title="Click to copy code"
            >
              {room?.code}
            </button>
            <button
              onClick={handleCopyLink}
              className="btn-secondary !py-1.5 !px-3.5 text-xs flex items-center gap-1.5 rounded-xl shadow-soft"
            >
              {copied ? <CheckIcon className="w-3.5 h-3.5 text-emerald-600" /> : <CopyIcon className="w-3.5 h-3.5 text-surface-500" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Players Identity & Live Connection Slot Card */}
        <div className="card-surface p-7 sm:p-9 relative overflow-hidden">
          {/* Ambient inner soft background */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary-50/20 via-transparent to-rose-50/20 pointer-events-none" />

          <div className="flex items-center justify-between mb-7 relative z-10">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xs font-bold text-surface-600 uppercase tracking-wider">
                Players ({room?.players?.length || 0}/2)
              </h3>
            </div>

            {isReady ? (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full flex items-center gap-1.5 shadow-soft">
                <ZapIcon className="w-3.5 h-3.5 text-emerald-500" />
                Both Players Ready
              </span>
            ) : (
              <span className="text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1 rounded-full animate-pulse shadow-soft">
                Waiting for friend…
              </span>
            )}
          </div>

          {/* Social Player Cards & Connection Stream */}
          <div className="flex items-center justify-between gap-2 sm:gap-6 py-4 relative z-10">
            {/* Player 1 (Me) */}
            {me && (
              <motion.div
                initial={{ scale: 0.94 }}
                animate={{ scale: 1 }}
                className="flex-1 flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-primary-50/50 border border-primary-100 shadow-soft"
              >
                <div className="mb-2.5">
                  <Avatar id={me.id} name={me.name} role="playerA" connected={me.connected} size="lg" />
                </div>
                <p className="text-base font-heading font-bold text-surface-950 max-w-[140px] truncate">{me.name}</p>
                <span className="text-[11px] text-primary-700 bg-primary-100/70 border border-primary-200 px-2.5 py-0.5 rounded-full font-semibold mt-1">
                  You
                </span>
              </motion.div>
            )}

            {/* Connecting Stream Line */}
            <div className="flex flex-col items-center justify-center px-2 sm:px-4">
              <div className="w-12 sm:w-24 h-1 rounded-full bg-surface-200 relative overflow-hidden">
                {isReady && (
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: 'linear' }}
                    className="w-8 h-full bg-gradient-to-r from-primary-500 to-rose-500 rounded-full"
                  />
                )}
              </div>
              <span className="text-[11px] font-heading font-black text-surface-400 mt-2">
                VS
              </span>
            </div>

            {/* Player 2 (Friend) */}
            <div className="flex-1 flex flex-col items-center text-center p-4 sm:p-5 rounded-2xl bg-rose-50/50 border border-rose-100 shadow-soft">
              {partner ? (
                <motion.div initial={{ scale: 0.94 }} animate={{ scale: 1 }} className="flex flex-col items-center">
                  <div className="mb-2.5">
                    <Avatar
                      id={partner.id}
                      name={partner.name}
                      role="playerB"
                      connected={partner.connected}
                      size="lg"
                    />
                  </div>
                  <p className="text-base font-heading font-bold text-surface-950 max-w-[140px] truncate">{partner.name}</p>
                  {partnerDisconnected ? (
                    <span className="text-[11px] text-amber-700 bg-amber-100 px-2.5 py-0.5 rounded-full font-semibold animate-pulse mt-1">
                      Reconnecting…
                    </span>
                  ) : (
                    <span className="text-[11px] text-rose-700 bg-rose-100/70 border border-rose-200 px-2.5 py-0.5 rounded-full font-semibold mt-1">
                      Friend
                    </span>
                  )}
                </motion.div>
              ) : (
                <div className="flex flex-col items-center py-2">
                  <div className="w-16 h-16 rounded-full bg-white border-2 border-dashed border-rose-200 flex items-center justify-center mb-2.5 shadow-soft animate-pulse">
                    <LinkIcon className="w-6 h-6 text-rose-400" />
                  </div>
                  <p className="text-xs font-heading font-bold text-surface-700">Waiting for friend…</p>
                  <button
                    onClick={handleCopyLink}
                    className="text-[11px] text-primary-600 hover:text-primary-800 font-semibold underline mt-1"
                  >
                    Share link
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Partner Disconnected Notification */}
        <AnimatePresence>
          {partnerDisconnected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs text-center font-medium shadow-soft"
            >
              Your friend disconnected. Reconnecting…
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Picker */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-heading font-bold text-surface-950">
              Select Game
            </h3>
            {!isReady && (
              <span className="text-xs text-surface-500 font-medium">
                Unlocks when friend joins
              </span>
            )}
          </div>

          <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {games.map((game) => (
              <motion.div key={game.id} variants={item}>
                <Card
                  interactive={isReady}
                  onClick={() => isReady && handleSelectGame(game.id)}
                  className={!isReady ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:border-primary-300'}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-surface-100 border border-black/[0.04] flex items-center justify-center shrink-0 shadow-soft">
                      {renderGameIcon(game.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-bold text-surface-950 text-base">{game.name}</h4>
                      <p className="text-surface-600 text-xs truncate mt-0.5">{game.description}</p>
                    </div>
                    {isReady && (
                      <div className="w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center shrink-0">
                        <ArrowRightIcon className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
