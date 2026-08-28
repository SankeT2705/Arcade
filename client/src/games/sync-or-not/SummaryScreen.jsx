import { motion } from 'framer-motion';
import Button from '../../components/Button';
import ScoreDisplay from '../../components/ScoreDisplay';
import { SparklesIcon, RefreshIcon, ArrowRightIcon } from '../../components/Icons';

export default function SummaryScreen({ data, onPlayAgain, onBackToHub }) {
  if (!data) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-lg mx-auto text-center py-4"
    >
      <div className="w-14 h-14 rounded-2xl bg-primary-50 border border-primary-200 text-primary-600 flex items-center justify-center mx-auto mb-3 shadow-xs">
        <SparklesIcon className="w-7 h-7" />
      </div>

      <h2 className="text-2xl font-heading font-black text-surface-950 mb-1 tracking-tight">
        Session Complete
      </h2>
      <p className="text-surface-600 text-xs sm:text-sm mb-6">Here is your connection compatibility breakdown:</p>

      {/* Main Score Stat */}
      <ScoreDisplay
        score={`${data.syncPercent}%`}
        label="Sync Compatibility"
        size="lg"
        className="mb-6 shadow-architect bg-white border border-surface-200"
      />

      {/* Secondary stats grid */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="glass-card py-3.5 border border-surface-200 shadow-architect">
          <p className="text-xl font-heading font-black text-amber-600">{data.bestStreak}</p>
          <p className="text-[10px] uppercase font-bold text-surface-500 mt-0.5">Best Streak</p>
        </div>
        <div className="glass-card py-3.5 border border-surface-200 shadow-architect">
          <p className="text-xl font-heading font-black text-emerald-600">{data.totalMatches}</p>
          <p className="text-[10px] uppercase font-bold text-surface-500 mt-0.5">Matches</p>
        </div>
        <div className="glass-card py-3.5 border border-surface-200 shadow-architect">
          <p className="text-xl font-heading font-black text-surface-950">{data.totalRounds}</p>
          <p className="text-[10px] uppercase font-bold text-surface-500 mt-0.5">Total Rounds</p>
        </div>
      </div>

      {/* Round Breakdown Pills */}
      {data.results && data.results.length > 0 && (
        <div className="glass-card p-4 mb-6 border border-surface-200 text-left shadow-architect">
          <h3 className="text-[11px] font-bold text-surface-500 uppercase tracking-wider mb-3">
            Round-by-Round Breakdown
          </h3>
          <div className="flex flex-wrap justify-center gap-2">
            {data.results.map((r, i) => (
              <motion.div
                key={i}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.04 }}
                className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                  r.matched
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-surface-100 text-surface-400 border border-surface-200'
                }`}
                title={r.matched ? 'Matched' : 'Different choices'}
              >
                {r.matched ? '✓' : '✗'}
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
