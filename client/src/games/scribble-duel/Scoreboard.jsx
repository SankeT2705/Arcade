import { motion } from 'framer-motion';
import Button from '../../components/Button';
import { TrophyIcon, RefreshIcon, ArrowRightIcon } from '../../components/Icons';

export default function Scoreboard({ data, playerId, onPlayAgain, onBackToHub }) {
  if (!data) return null;

  const { scores, playerNames, winnerId, results } = data;
  const playerIds = Object.keys(scores);

  const isTie = !winnerId;
  const isWinner = winnerId === playerId;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto text-center py-4"
    >
      <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
        <TrophyIcon className="w-8 h-8" />
      </div>

      <h2 className="text-2xl font-heading font-black text-surface-950 mb-1">
        {isTie ? "It's a Tie!" : isWinner ? 'Victory!' : 'Game Over'}
      </h2>
      <p className="text-surface-600 text-xs sm:text-sm mb-6">
        {isTie ? 'Both players tied with identical scores!' : `${playerNames[winnerId]} won the match!`}
      </p>

      {/* Score comparison */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        {playerIds.map((pid) => (
          <div
            key={pid}
            className={`glass-card p-5 border text-center ${
              pid === winnerId ? 'border-amber-400 bg-amber-50/40 shadow-xs' : 'border-surface-200'
            }`}
          >
            <p className="text-3xl font-heading font-black text-surface-950 mb-1">{scores[pid]}</p>
            <p className="text-xs font-semibold text-surface-600 truncate">{playerNames[pid]}</p>
            {pid === playerId && (
              <span className="text-[10px] text-primary-700 font-bold uppercase tracking-wider">(You)</span>
            )}
          </div>
        ))}
      </div>

      {/* Round breakdown */}
      {results && results.length > 0 && (
        <div className="glass-card p-4 mb-6 border border-surface-200 text-left">
          <h3 className="text-[11px] font-bold text-surface-500 uppercase tracking-wider mb-3">
            Round Summary
          </h3>
          <div className="space-y-2">
            {results.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-surface-50 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs border border-surface-200"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-surface-400 font-mono text-[11px]">R{i + 1}</span>
                  <span className="font-semibold text-surface-800">&quot;{r.word}&quot;</span>
                </div>
                <div className="flex items-center gap-2">
                  {r.guessedCorrectly ? (
                    <>
                      <span className="text-emerald-700 font-medium">✓ Solved</span>
                      <span className="text-amber-700 font-bold">+{r.points}</span>
                    </>
                  ) : (
                    <span className="text-surface-400">✗ Expired</span>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button onClick={onPlayAgain} className="flex-1 py-3 text-sm font-heading font-bold">
          <RefreshIcon className="w-4 h-4" />
          <span>Play Again</span>
        </Button>
        <Button variant="secondary" onClick={onBackToHub} className="flex-1 py-3 text-sm font-heading font-bold">
          <span>Return to Lobby</span>
          <ArrowRightIcon className="w-3.5 h-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}
