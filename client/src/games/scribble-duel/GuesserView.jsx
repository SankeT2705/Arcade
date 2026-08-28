import { motion } from 'framer-motion';
import DrawingCanvas from './DrawingCanvas';
import GuessChat from './GuessChat';

export default function GuesserView({
  wordLength,
  hintPattern = [],
  incomingStroke,
  clearSignal,
  guesses,
  onGuess,
  disabled,
}) {
  const slots = Array.from({ length: wordLength || hintPattern.length || 0 });

  return (
    <div className="space-y-4">
      {/* Word Length & Progressive Letter Hint Slots */}
      <div className="text-center card-surface p-4 shadow-card">
        <span className="text-[11px] text-surface-400 font-heading font-bold uppercase tracking-widest block mb-2">
          Guess the Secret Word
        </span>
        <div className="flex items-center justify-center gap-1.5 py-1 flex-wrap">
          {slots.map((_, i) => {
            const letter = hintPattern[i];
            const isSpace = letter === ' ' || letter === '-';

            if (isSpace) {
              return <span key={i} className="w-3 inline-block" />;
            }

            return (
              <span
                key={i}
                className="w-8 h-10 border-b-2 border-primary-600 inline-flex items-center justify-center font-mono font-black text-primary-800 text-lg bg-surface-100/80 rounded-t-lg shadow-soft relative overflow-hidden"
              >
                {letter ? (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', damping: 15, stiffness: 300 }}
                  >
                    {letter}
                  </motion.span>
                ) : null}
              </span>
            );
          })}
          <span className="text-xs text-surface-500 font-semibold ml-2.5 self-center">
            ({wordLength} Letters)
          </span>
        </div>
      </div>

      {/* Read-only Live Canvas Stream */}
      <DrawingCanvas
        isDrawer={false}
        incomingStroke={incomingStroke}
        clearSignal={clearSignal}
      />

      {/* Chat Guess Input Stream */}
      <GuessChat
        guesses={guesses}
        onSubmit={onGuess}
        disabled={disabled}
      />
    </div>
  );
}
