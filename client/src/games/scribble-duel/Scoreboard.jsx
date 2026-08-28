import { motion } from 'framer-motion';
import Button from '../../components/Button';
import { TrophyIcon, RefreshIcon, ArrowRightIcon, SparklesIcon, CheckIcon } from '../../components/Icons';

export default function Scoreboard({ endData, data, playerId, onPlayAgain, onBackToHub }) {
  const matchData = endData || data;
  if (!matchData) return null;

  const { scores = {}, playerNames = {}, winnerId, results = [] } = matchData;
  const playerIds = Object.keys(scores);

  const isTie = !winnerId;
  const isWinner = winnerId === playerId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto text-center py-4 space-y-6 pb-20"
    >
      {/* Trophy & Result Header */}
      <div className="card-surface p-7 sm:p-9 relative overflow-hidden text-center shadow-card">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50/60 via-primary-50/40 to-pink-50/40 pointer-events-none" />

        <div className="relative z-10 space-y-3">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-100 to-amber-200 border border-amber-300 text-amber-700 flex items-center justify-center mx-auto shadow-soft">
            <TrophyIcon className="w-8 h-8" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-heading font-extrabold uppercase tracking-wider bg-white/90 border border-black/[0.06] text-amber-700 shadow-soft">
            <SparklesIcon className="w-3.5 h-3.5 text-amber-500" />
            <span>Match Complete</span>
          </span>

          <h2 className="text-3xl sm:text-4xl font-heading font-black text-surface-950 tracking-tight">
            {isTie ? "It's a Tie!" : isWinner ? 'You Won!' : `${playerNames[winnerId] || 'Friend'} Won!`}
          </h2>

          <p className="text-xs sm:text-sm text-surface-600 font-medium">
            {isTie
              ? 'Both players tied with identical scores!'
              : isWinner
                ? 'Great guessing and lightning fast sketching!'
                : 'Awesome match! Ready for a rematch?'}
          </p>
        </div>
      </div>

      {/* Score Comparison Cards */}
      <div className="grid grid-cols-2 gap-4">
        {playerIds.map((pid) => {
          const isCurrentPlayerWinner = pid === winnerId;
          const isMe = pid === playerId;

          return (
            <div
              key={pid}
              className={`p-5 rounded-3xl border text-center transition-all shadow-card ${
                isCurrentPlayerWinner
                  ? 'bg-gradient-to-b from-amber-50/70 to-white border-amber-300 ring-2 ring-amber-400/20'
                  : 'bg-white border-black/[0.06]'
              }`}
            >
              <span className="text-[10px] uppercase font-heading font-bold text-surface-400 tracking-wider block mb-1">
                {isMe ? 'You' : playerNames[pid] || 'Friend'}
              </span>
              <p className="text-4xl font-heading font-black text-surface-950 mb-1">
                {scores[pid]}
              </p>
              <span
                className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full inline-block ${
                  isCurrentPlayerWinner
                    ? 'bg-amber-100 text-amber-800 border border-amber-300'
                    : 'bg-surface-100 text-surface-600'
                }`}
              >
                {isCurrentPlayerWinner ? 'Winner 🏆' : 'Runner-Up'}
              </span>
            </div>
          );
        })}
      </div>

      {/* Round Breakdown Summary */}
      {results && results.length > 0 && (
        <div className="card-surface p-6 text-left space-y-3.5 shadow-card">
          <div className="flex items-center justify-between border-b border-black/[0.04] pb-2.5">
            <h3 className="text-xs font-heading font-extrabold text-surface-950 uppercase tracking-wider">
              Round Breakdown
            </h3>
            <span className="text-[11px] text-surface-500 font-medium">
              {results.length} Rounds Played
            </span>
          </div>

          <div className="space-y-2">
            {results.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="bg-surface-50/70 rounded-2xl px-4 py-2.5 flex items-center justify-between text-xs border border-black/[0.04] shadow-soft"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-lg bg-surface-200 text-surface-700 font-mono font-bold text-[10px] flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="font-heading font-bold text-surface-900 uppercase tracking-wider text-xs">
                    &quot;{r.word}&quot;
                  </span>
                </div>

                <div className="flex items-center gap-2 font-semibold">
                  {r.guessedCorrectly ? (
                    <>
                      <span className="text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                        <CheckIcon className="w-3 h-3 text-emerald-600" /> Solved ({Math.round(r.timeTaken / 1000)}s)
                      </span>
                      <span className="text-amber-700 font-bold font-mono">+{r.points}</span>
                    </>
                  ) : (
                    <span className="text-surface-400 bg-surface-100 px-2 py-0.5 rounded-md">
                      Time Expired
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
        <Button onClick={onPlayAgain} className="flex-1 py-3.5 text-sm font-heading font-bold rounded-2xl shadow-soft">
          <RefreshIcon className="w-4 h-4" />
          <span>Play Again</span>
        </Button>
        <Button variant="secondary" onClick={onBackToHub} className="flex-1 py-3.5 text-sm font-heading font-bold rounded-2xl">
          <span>Return to Lobby</span>
          <ArrowRightIcon className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
  );
}
