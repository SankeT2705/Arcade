import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoomContext } from './RoomContext';
import { useSocketContext } from './SocketProvider';
import { games, getGameById } from '../games/gameRegistry';
import GameErrorBoundary from '../games/GameErrorBoundary';
import Button from '../components/Button';
import Card from '../components/Card';
import Avatar from '../components/Avatar';
import LoadingSkeleton from '../components/LoadingSkeleton';
import {
  CopyIcon,
  CheckIcon,
  LinkIcon,
  BrushIcon,
  CompassIcon,
  GamepadIcon,
  ArrowRightIcon,
  RefreshIcon,
} from '../components/Icons';
import { copyToClipboard, getPlayerName, generateDefaultName } from '../lib/utils';
import { useToast } from '../components/Toast';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] } },
};

function renderGameIcon(iconKey) {
  if (iconKey === 'brush') return <BrushIcon className="w-5 h-5 text-primary-600" />;
  if (iconKey === 'compass') return <CompassIcon className="w-5 h-5 text-secondary-600" />;
  return <GamepadIcon className="w-5 h-5 text-primary-600" />;
}

export default function RoomLobby() {
  const { roomCode } = useParams();
  const navigate = useNavigate();
  const { room, joinRoom, isLoading, error, partnerDisconnected, selectGame, backToHub, clearError } =
    useRoomContext();
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
      addToast('Invite link copied to clipboard!', 'success');
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

  // If user is not yet in room (e.g. visiting via invite link)
  if (!room) {
    if (isLoading) {
      return (
        <div className="max-w-md mx-auto px-4 py-16 text-center">
          <LoadingSkeleton type="card" count={2} />
          <p className="text-surface-500 text-sm mt-4 animate-pulse">
            Connecting to room {roomCode}…
          </p>
        </div>
      );
    }

    return (
      <div className="max-w-md mx-auto px-4 py-12 sm:py-16">
        <motion.div initial={{ opacity: 0, scale: 0.98, y: 12 }} animate={{ opacity: 1, scale: 1, y: 0 }}>
          <div className="glass-panel rounded-2xl p-6 sm:p-8 text-center border border-surface-200">
            <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-200 text-primary-600 flex items-center justify-center mx-auto mb-4 shadow-xs">
              <GamepadIcon className="w-7 h-7" />
            </div>

            <h2 className="text-2xl font-heading font-bold text-surface-950 mb-1">Join Room</h2>
            <p className="text-surface-600 text-xs sm:text-sm mb-6">
              You&apos;ve been invited to room{' '}
              <span className="font-mono font-bold text-primary-700 bg-primary-50 px-2 py-0.5 rounded border border-primary-200">
                {roomCode}
              </span>
            </p>

            <form onSubmit={handleJoinWithName} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1.5">
                  Enter Your Name
                </label>
                <input
                  type="text"
                  value={tempName}
                  onChange={(e) => setTempName(e.target.value)}
                  placeholder="Your name"
                  className="input-base text-base py-3"
                  autoFocus
                  maxLength={15}
                  required
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-full justify-center py-3 font-heading font-bold text-sm"
                disabled={!tempName.trim()}
              >
                Enter Game Lobby
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t border-surface-200">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-xs text-surface-500 hover:text-surface-800 transition-colors"
              >
                ← Return to Home
              </button>
            </div>
          </div>
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
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
        {/* Room Code & Invite Card */}
        <div className="text-center mb-8">
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-white rounded-2xl p-2.5 sm:px-5 sm:py-3 border border-surface-200 shadow-architect">
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
              className="btn-secondary !py-1.5 !px-3 text-xs flex items-center gap-1.5"
            >
              {copied ? <CheckIcon className="w-3.5 h-3.5 text-emerald-600" /> : <CopyIcon className="w-3.5 h-3.5 text-surface-500" />}
              <span>{copied ? 'Copied' : 'Copy Link'}</span>
            </button>
          </div>
        </div>

        {/* Players Battle Slot Card */}
        <div className="glass-card p-6 sm:p-7 mb-7 border border-surface-200">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider">
              Connected Players ({room?.players?.length || 0}/2)
            </h3>
            {isReady ? (
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Both players ready
              </span>
            ) : (
              <span className="text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
                Waiting for second player
              </span>
            )}
          </div>

          <div className="flex items-center justify-around gap-4 py-2">
            {/* Player 1 (me) */}
            {me && (
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="text-center">
                <div className="relative inline-block mb-2">
                  <Avatar id={me.id} name={me.name} connected={me.connected} size="lg" />
                </div>
                <p className="text-sm font-heading font-bold text-surface-950 max-w-[120px] truncate">{me.name}</p>
                <span className="text-[10px] text-primary-700 bg-primary-50 border border-primary-200 px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider">
                  You
                </span>
              </motion.div>
            )}

            {/* VS Badge */}
            <div className="w-9 h-9 rounded-full bg-surface-100 border border-surface-200 flex items-center justify-center font-heading font-black text-xs text-surface-500 shadow-xs">
              VS
            </div>

            {/* Player 2 (partner) */}
            {partner ? (
              <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} className="text-center">
                <div className="relative inline-block mb-2">
                  <Avatar
                    id={partner.id}
                    name={partner.name}
                    connected={partner.connected}
                    size="lg"
                  />
                </div>
                <p className="text-sm font-heading font-bold text-surface-950 max-w-[120px] truncate">{partner.name}</p>
                {partnerDisconnected ? (
                  <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold animate-pulse">Reconnecting…</span>
                ) : (
                  <span className="text-[10px] text-secondary-700 bg-secondary-50 border border-secondary-200 px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider">
                    Friend
                  </span>
                )}
              </motion.div>
            ) : (
              <div className="text-center">
                <div className="w-14 h-14 rounded-full bg-surface-50 border-2 border-dashed border-surface-300 flex items-center justify-center mb-2 mx-auto">
                  <LinkIcon className="w-5 h-5 text-surface-400" />
                </div>
                <p className="text-xs text-surface-600 font-medium">Waiting…</p>
                <span className="text-[10px] text-surface-400">Share link</span>
              </div>
            )}
          </div>
        </div>

        {/* Partner Disconnected Alert */}
        <AnimatePresence>
          {partnerDisconnected && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs text-center font-medium"
            >
              Your friend disconnected. Room will stay open for 60 seconds…
            </motion.div>
          )}
        </AnimatePresence>

        {/* Game Picker */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-bold text-surface-500 uppercase tracking-wider">
              Select Game
            </h3>
            {!isReady && (
              <span className="text-[11px] text-surface-500 font-medium">
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
                  className={!isReady ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'hover:border-primary-400'}
                >
                  <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-xl bg-surface-100 border border-surface-200 flex items-center justify-center shrink-0">
                      {renderGameIcon(game.icon)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-heading font-bold text-surface-950 text-sm">{game.name}</h4>
                      <p className="text-surface-600 text-xs truncate">{game.description}</p>
                    </div>
                    {isReady && (
                      <ArrowRightIcon className="w-4 h-4 text-primary-600 shrink-0" />
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
