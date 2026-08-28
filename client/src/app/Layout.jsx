import { Outlet, useNavigate } from 'react-router-dom';
import { useRoomContext } from './RoomContext';
import ConnectionStatus from '../components/ConnectionStatus';
import RoomChat from '../components/RoomChat';
import { GamepadIcon, LogOutIcon, ArrowRightIcon } from '../components/Icons';

export default function Layout() {
  const navigate = useNavigate();
  const { room, backToHub, leaveRoom } = useRoomContext();

  const handleLogoClick = () => {
    if (room) {
      leaveRoom();
    }
    navigate('/');
  };

  const handleBackToHub = () => {
    if (room?.activeGame) {
      backToHub();
    }
    navigate(room ? `/room/${room.code}` : '/');
  };

  const handleLeaveRoom = () => {
    leaveRoom();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Top Glass Navigation */}
      <header className="sticky top-0 z-40 glass-nav">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 group transition-transform active:scale-98 text-left"
          >
            <div className="w-10 h-10 rounded-2xl bg-primary-600 flex items-center justify-center text-white shadow-soft group-hover:bg-primary-700 transition-colors">
              <GamepadIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-base tracking-tight text-surface-950 block">
                Duo<span className="text-primary-600">Arcade</span>
              </span>
              <span className="text-[10px] text-surface-500 block -mt-1 font-medium tracking-wide">
                2-Player Games
              </span>
            </div>
          </button>

          {/* Right Navigation & Room Info */}
          <div className="flex items-center gap-3">
            {room && (
              <>
                {/* Active Room Badge */}
                <div className="flex items-center gap-2 bg-white/90 border border-black/[0.06] rounded-2xl px-3.5 py-1.5 shadow-soft">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-surface-500 font-medium hidden sm:inline">Room</span>
                  <span className="font-mono font-extrabold text-primary-700 text-xs sm:text-sm tracking-wider">
                    {room.code}
                  </span>
                </div>

                {/* Back to Games Hub (if game is active) */}
                {room.activeGame && (
                  <button
                    onClick={handleBackToHub}
                    className="btn-secondary !px-3.5 !py-1.5 text-xs rounded-xl"
                    title="Back to lobby"
                  >
                    <span>Lobby</span>
                    <ArrowRightIcon className="w-3.5 h-3.5 rotate-180" />
                  </button>
                )}

                {/* Leave Room Button */}
                <button
                  onClick={handleLeaveRoom}
                  className="w-9 h-9 rounded-2xl flex items-center justify-center text-surface-400 hover:text-danger-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all shadow-soft bg-white/60"
                  title="Leave room"
                >
                  <LogOutIcon className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full relative z-10">
        <Outlet />
      </main>

      {/* Real-time Room Chat */}
      <RoomChat />

      {/* Connection status banner */}
      <ConnectionStatus />
    </div>
  );
}
