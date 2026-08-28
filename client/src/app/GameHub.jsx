import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRoomContext } from './RoomContext';
import { useSocketContext } from './SocketProvider';
import { games } from '../games/gameRegistry';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Avatar from '../components/Avatar';
import {
  PlusIcon,
  LinkIcon,
  BrushIcon,
  CompassIcon,
  GamepadIcon,
  UsersIcon,
  SparklesIcon,
  ZapIcon,
  CheckIcon,
} from '../components/Icons';
import { getPlayerName, generateDefaultName, getPlayerName as savePlayerName } from '../lib/utils';

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

export default function GameHub() {
  const navigate = useNavigate();
  const { createRoom, joinRoom, error, isLoading, clearError, room } = useRoomContext();
  const { isConnected } = useSocketContext();
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [playerName, setPlayerName] = useState(() => getPlayerName() || generateDefaultName());

  // If already in a room, redirect to lobby
  useEffect(() => {
    if (room?.code) {
      navigate(`/room/${room.code}`, { replace: true });
    }
  }, [room, navigate]);

  const handleCreate = () => {
    if (!playerName.trim()) return;
    savePlayerName(playerName.trim());
    createRoom(playerName.trim());
    setShowCreateModal(false);
  };

  const handleJoin = () => {
    if (!joinCode.trim() || !playerName.trim()) return;
    savePlayerName(playerName.trim());
    joinRoom(joinCode.trim(), playerName.trim());
    setShowJoinModal(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-14">
      {/* ─── Hero Section (Split Layout) ────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center mb-16 sm:mb-20">
        {/* Left Column: Headlines & Actions */}
        <div className="lg:col-span-7 text-left space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-primary-50 via-pink-50 to-amber-50 border border-primary-200/80 text-primary-700 text-xs font-heading font-extrabold tracking-wide shadow-soft"
          >
            <SparklesIcon className="w-3.5 h-3.5 text-primary-600" />
            <span>2-Player Real-Time Friendship Games</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.06 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-heading font-extrabold tracking-tight text-surface-950 leading-[1.12]"
          >
            Play Together. <br />
            <span className="bg-gradient-to-r from-primary-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              Stay In Sync.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.12 }}
            className="text-surface-600 text-base sm:text-lg max-w-lg leading-relaxed font-normal"
          >
            Create a room, invite a friend, and discover how well your choices and instincts match through live interactive games.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.18 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2"
          >
            <button
              onClick={() => setShowCreateModal(true)}
              disabled={!isConnected}
              className="btn-primary py-3.5 px-8 text-sm font-heading font-bold"
            >
              <PlusIcon className="w-4 h-4" />
              <span>Create Room</span>
            </button>

            <button
              onClick={() => setShowJoinModal(true)}
              disabled={!isConnected}
              className="btn-secondary py-3.5 px-8 text-sm font-heading font-bold"
            >
              <LinkIcon className="w-4 h-4 text-surface-500" />
              <span>Join Room</span>
            </button>
          </motion.div>
        </div>

        {/* Right Column: Product-Native Interactive Visual */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full max-w-md bg-white/95 border border-black/[0.06] rounded-3xl p-6 shadow-card relative overflow-hidden"
          >
            {/* Ambient inner luminous multi-pastel gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary-50/50 via-amber-50/20 to-rose-50/50 pointer-events-none" />

            {/* Room Header Pill */}
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-semibold text-surface-600 uppercase tracking-wider">
                  Live Match Room
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-primary-700 bg-primary-50 border border-primary-200 px-2.5 py-0.5 rounded-full shadow-soft">
                #SYNC-ROOM
              </span>
            </div>

            {/* Two Players Connected by Live Sync Beam */}
            <div className="flex items-center justify-between relative z-10 mb-6 py-2">
              {/* Player 1 Card */}
              <div className="flex flex-col items-center gap-1.5">
                <Avatar name="Alex" role="playerA" size="lg" connected={true} />
                <span className="text-xs font-heading font-bold text-surface-900">Alex</span>
                <span className="text-[10px] text-primary-700 font-bold bg-primary-50 border border-primary-200 px-2 py-0.5 rounded-full">
                  Host
                </span>
              </div>

              {/* Animated Sync Beam Line */}
              <div className="flex-1 flex flex-col items-center justify-center px-3 relative">
                <div className="w-full h-1 bg-gradient-to-r from-primary-400 via-amber-300 to-pink-400 rounded-full relative overflow-hidden">
                  <motion.div
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: 'linear' }}
                    className="w-10 h-full bg-white shadow-glow"
                  />
                </div>
                <div className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-black text-amber-700 bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200 px-3 py-0.5 rounded-full shadow-soft">
                  <ZapIcon className="w-3.5 h-3.5 text-amber-500" />
                  <span>90% Sync</span>
                </div>
              </div>

              {/* Player 2 Card */}
              <div className="flex flex-col items-center gap-1.5">
                <Avatar name="Sam" role="playerB" size="lg" connected={true} />
                <span className="text-xs font-heading font-bold text-surface-900">Sam</span>
                <span className="text-[10px] text-pink-700 font-bold bg-pink-50 border border-pink-200 px-2 py-0.5 rounded-full">
                  Guest
                </span>
              </div>
            </div>

            {/* Floating Choice Chips */}
            <div className="space-y-2.5 relative z-10">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-surface-50/80 border border-black/[0.04] shadow-soft">
                <span className="text-xs font-heading font-bold text-surface-700">Would you rather...</span>
                <span className="text-[10px] font-extrabold text-primary-700 uppercase tracking-wider bg-primary-50 px-2.5 py-0.5 rounded-md border border-primary-200">
                  Food & Vibe
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-center text-xs font-heading font-bold">
                <div className="p-2.5 rounded-xl bg-primary-50/80 border border-primary-200 text-primary-800 flex items-center justify-center gap-1.5 shadow-soft">
                  <CheckIcon className="w-3.5 h-3.5 text-primary-600" />
                  <span>Paneer Tikka</span>
                </div>
                <div className="p-2.5 rounded-xl bg-pink-50/80 border border-pink-200 text-pink-800 flex items-center justify-center gap-1.5 shadow-soft">
                  <CheckIcon className="w-3.5 h-3.5 text-pink-600" />
                  <span>Paneer Tikka</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto mb-8 p-4 rounded-2xl bg-danger-50 border border-danger-200 text-danger-700 text-sm flex items-center justify-between shadow-soft"
        >
          <span>{error}</span>
          <button
            onClick={clearError}
            className="text-xs text-danger-600 hover:text-danger-800 font-semibold underline ml-3"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* ─── Featured Games Section ────────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-heading font-bold text-surface-950 tracking-tight">
              Featured Games
            </h2>
            <p className="text-xs sm:text-sm text-surface-500 mt-0.5">
              Pick any game once both players are inside the room
            </p>
          </div>
          <span className="text-xs text-primary-700 bg-primary-50 px-3.5 py-1.5 rounded-xl border border-primary-200 font-bold shadow-soft">
            2 Games Available
          </span>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-5"
        >
          {games.map((game) => (
            <motion.div key={game.id} variants={item}>
              <Card className="h-full relative overflow-hidden group hover:border-primary-300 hover:shadow-card-hover transition-all p-6 sm:p-7">
                <div className="flex items-start gap-4">
                  {/* Icon Tile */}
                  <div className={`w-14 h-14 rounded-2xl border flex items-center justify-center shrink-0 shadow-soft transition-colors ${
                    game.id === 'sync-or-not'
                      ? 'bg-emerald-50 border-emerald-200 text-emerald-600 group-hover:bg-emerald-100/70'
                      : 'bg-primary-50 border-primary-200 text-primary-600 group-hover:bg-primary-100/70'
                  }`}>
                    {renderGameIcon(game.icon)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1.5">
                      <h3 className="text-lg font-heading font-bold text-surface-950 tracking-tight group-hover:text-primary-700 transition-colors">
                        {game.name}
                      </h3>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1 shadow-soft">
                        <UsersIcon className="w-3 h-3" />
                        2 Players
                      </span>
                    </div>

                    <p className="text-surface-600 text-xs sm:text-sm leading-relaxed mb-4">
                      {game.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-amber-700 bg-amber-50 px-2.5 py-1 rounded-xl border border-amber-200 flex items-center gap-1.5 font-bold shadow-soft">
                        <ZapIcon className="w-3 h-3 text-amber-500" />
                        Live Synchronized
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Create Room Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Room"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1.5">
              Player Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="input-base"
              placeholder="Your name"
              maxLength={20}
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
          </div>

          <Button
            onClick={handleCreate}
            loading={isLoading}
            disabled={!playerName.trim()}
            className="w-full py-3.5 text-sm font-heading font-bold rounded-2xl shadow-soft"
          >
            Create Room
          </Button>
        </div>
      </Modal>

      {/* Join Room Modal */}
      <Modal
        isOpen={showJoinModal}
        onClose={() => {
          setShowJoinModal(false);
          clearError();
        }}
        title="Join Room"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1.5">
              Player Name
            </label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="input-base"
              placeholder="Your name"
              maxLength={20}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-surface-700 uppercase tracking-wider mb-1.5">
              6-Character Room Code
            </label>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              className="input-base font-mono tracking-widest text-center text-xl uppercase font-extrabold text-primary-700"
              placeholder="ABC123"
              maxLength={6}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
          </div>

          <Button
            onClick={handleJoin}
            loading={isLoading}
            disabled={!playerName.trim() || !joinCode.trim()}
            className="w-full py-3.5 text-sm font-heading font-bold rounded-2xl mt-1 shadow-soft"
          >
            Enter Room
          </Button>
        </div>
      </Modal>
    </div>
  );
}
