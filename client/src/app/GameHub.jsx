import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useRoomContext } from './RoomContext';
import { useSocketContext } from './SocketProvider';
import { games } from '../games/gameRegistry';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import {
  SparklesIcon,
  PlusIcon,
  LinkIcon,
  BrushIcon,
  CompassIcon,
  GamepadIcon,
  UsersIcon,
  ZapIcon,
} from '../components/Icons';
import { getPlayerName, generateDefaultName, getPlayerName as savePlayerName } from '../lib/utils';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: [0.16, 1, 0.3, 1] } },
};

function renderGameIcon(iconKey) {
  if (iconKey === 'brush') return <BrushIcon className="w-6 h-6 text-primary-600" />;
  if (iconKey === 'compass') return <CompassIcon className="w-6 h-6 text-secondary-600" />;
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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      {/* Architectural Hero */}
      <div className="text-center mb-12 sm:mb-16">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary-50 border border-primary-200 text-primary-700 text-xs font-semibold uppercase tracking-wider mb-5 shadow-xs"
        >
          <SparklesIcon className="w-3.5 h-3.5 text-primary-600" />
          <span>Real-Time 2-Player Game Hub</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.08 }}
          className="text-4xl sm:text-5xl font-heading font-extrabold tracking-tight text-surface-950 mb-4 leading-tight"
        >
          Play Live Together <br />
          <span className="text-primary-600">With Real-Time Sync</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.16 }}
          className="text-surface-600 text-sm sm:text-base max-w-md mx-auto leading-relaxed"
        >
          Create a room, send the link to a friend, and pick a game to start playing instantly in your browser.
        </motion.p>
      </div>

      {/* Main Action Buttons */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.22 }}
        className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-14 max-w-md mx-auto"
      >
        <button
          onClick={() => setShowCreateModal(true)}
          disabled={!isConnected}
          className="btn-primary w-full sm:w-1/2 py-3 text-sm font-heading font-bold"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Create Room</span>
        </button>

        <button
          onClick={() => setShowJoinModal(true)}
          disabled={!isConnected}
          className="btn-secondary w-full sm:w-1/2 py-3 text-sm font-heading font-bold"
        >
          <LinkIcon className="w-4 h-4 text-surface-500" />
          <span>Join Room</span>
        </button>
      </motion.div>

      {/* Error Alert */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto mb-8 p-3.5 rounded-xl bg-danger-50 border border-danger-200 text-danger-700 text-sm flex items-center justify-between shadow-xs"
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

      {/* Games Showcase Grid */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-xl font-heading font-bold text-surface-950 tracking-tight">
              Featured Games
            </h2>
            <p className="text-xs text-surface-500">
              Select any game once both players are inside the room
            </p>
          </div>
          <span className="text-xs text-surface-600 bg-surface-100 px-2.5 py-1 rounded-lg border border-surface-200 font-medium">
            2 Games Available
          </span>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
        >
          {games.map((game) => (
            <motion.div key={game.id} variants={item}>
              <Card className="h-full relative overflow-hidden group hover:border-primary-400 transition-all">
                <div className="flex items-start gap-4">
                  {/* Clean SVG Vector Icon Tile */}
                  <div className="w-12 h-12 rounded-xl bg-surface-100 border border-surface-200 flex items-center justify-center shrink-0 group-hover:bg-primary-50 group-hover:border-primary-200 transition-colors shadow-xs">
                    {renderGameIcon(game.icon)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-base font-heading font-bold text-surface-950 tracking-tight group-hover:text-primary-700 transition-colors">
                        {game.name}
                      </h3>
                      <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <UsersIcon className="w-3 h-3" />
                        2P
                      </span>
                    </div>

                    <p className="text-surface-600 text-xs leading-relaxed mb-3">
                      {game.description}
                    </p>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-surface-500 bg-surface-100 px-2 py-0.5 rounded-md border border-surface-200 flex items-center gap-1 font-medium">
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
            className="w-full py-3 text-sm font-heading font-bold"
          >
            Launch Room
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
        <div className="space-y-3.5">
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
              className="input-base font-mono tracking-widest text-center text-lg uppercase font-bold text-primary-700"
              placeholder="ABC123"
              maxLength={6}
              onKeyDown={(e) => e.key === 'Enter' && handleJoin()}
            />
          </div>

          <Button
            onClick={handleJoin}
            loading={isLoading}
            disabled={!playerName.trim() || !joinCode.trim()}
            className="w-full py-3 text-sm font-heading font-bold mt-1"
          >
            Enter Room
          </Button>
        </div>
      </Modal>
    </div>
  );
}
