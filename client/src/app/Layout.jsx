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
    <div className="min-h-screen flex flex-col relative bg-[#F8FAFC]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-surface-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          {/* Logo & Brand */}
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 group transition-transform active:scale-98 text-left"
          >
            <div className="w-9 h-9 rounded-xl bg-primary-600 flex items-center justify-center text-white shadow-sm group-hover:bg-primary-700 transition-colors">
              <GamepadIcon className="w-5 h-5" />
            </div>
            <div>
              <span className="font-heading font-extrabold text-base tracking-tight text-surface-950 block">
                Duo<span className="text-primary-600">Arcade</span>
              </span>
              <span className="text-[10px] text-surface-600 block -mt-1 font-medium tracking-wide uppercase">
                2-Player Real-Time
              </span>
            </div>
          </button>

          {/* Right Navigation & Room Info */}
          <div className="flex items-center gap-2.5">
            {room && (
              <>
                {/* Active Room Badge */}
                <div className="flex items-center gap-2 bg-surface-100 border border-surface-200 rounded-xl px-3 py-1.5 shadow-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs text-surface-500 font-medium hidden sm:inline">Room</span>
                  <span className="font-mono font-bold text-primary-700 text-xs sm:text-sm tracking-wider">
                    {room.code}
                  </span>
                </div>

                {/* Back to Games Hub (if game is active) */}
                {room.activeGame && (
                  <button
                    onClick={handleBackToHub}
                    className="btn-secondary !px-3 !py-1.5 text-xs"
                    title="Back to lobby"
                  >
                    <span>Lobby</span>
                    <ArrowRightIcon className="w-3 h-3 rotate-180" />
                  </button>
                )}

                {/* Leave Room Button */}
                <button
                  onClick={handleLeaveRoom}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-surface-400 hover:text-danger-600 hover:bg-danger-50 border border-transparent hover:border-danger-200 transition-all"
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
      <main className="flex-1 w-full">
        <Outlet />
      </main>

      {/* Real-time Room Chat */}
      <RoomChat />

      {/* Connection status banner */}
      <ConnectionStatus />
    </div>
  );
}
