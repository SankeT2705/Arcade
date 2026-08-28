import { motion, AnimatePresence } from 'framer-motion';
import { useSocketContext } from '../app/SocketProvider';

export default function ConnectionStatus() {
  const { isConnected, isReconnecting } = useSocketContext();

  const showOverlay = !isConnected;

  return (
    <AnimatePresence>
      {showOverlay && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-slate-900/30 backdrop-blur-md flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-2xl border border-surface-200 shadow-modal text-center p-8 max-w-sm w-full"
          >
            {/* Animated connection icon */}
            <div className="relative mx-auto w-14 h-14 mb-5">
              <div className="absolute inset-0 rounded-full bg-primary-100 animate-ping" />
              <div className="relative flex items-center justify-center w-14 h-14 rounded-full bg-primary-50 border border-primary-200 text-primary-600">
                <svg className="w-6 h-6 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.858 15.355-5.858 21.213 0"
                  />
                </svg>
              </div>
            </div>

            <h2 className="text-lg font-heading font-bold text-surface-950 mb-1.5">
              {isReconnecting ? 'Reconnecting…' : 'Connection Lost'}
            </h2>
            <p className="text-surface-600 text-xs leading-relaxed max-w-xs mx-auto">
              {isReconnecting
                ? "Hang tight! Reconnecting you to the game server…"
                : 'Connection dropped. Reconnecting automatically…'}
            </p>

            {/* Loading dots */}
            <div className="flex justify-center gap-1.5 mt-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="w-2 h-2 rounded-full bg-primary-400"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
