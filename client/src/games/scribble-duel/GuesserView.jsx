import DrawingCanvas from './DrawingCanvas';
import GuessChat from './GuessChat';

export default function GuesserView({
  wordLength,
  incomingStroke,
  clearSignal,
  guesses,
  onGuess,
  disabled,
}) {
  return (
    <div className="space-y-4">
      {/* Word Length Hint Underlines */}
      <div className="text-center bg-white p-3.5 rounded-2xl border border-surface-200 shadow-architect">
        <span className="text-[11px] text-surface-500 font-semibold uppercase tracking-wider block mb-1.5">
          Guess the Secret Word
        </span>
        <div className="flex items-center justify-center gap-1.5 py-1">
          {Array.from({ length: wordLength }).map((_, i) => (
            <span
              key={i}
              className="w-6 h-8 border-b-2 border-primary-500 inline-flex items-center justify-center font-mono font-bold text-surface-950 text-lg bg-surface-50 rounded-t"
            />
          ))}
          <span className="text-xs text-surface-500 font-semibold ml-2">
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
