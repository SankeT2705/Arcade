import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Button';
import { SparklesIcon, RefreshIcon, ArrowRightIcon, FlameIcon, CheckIcon } from '../../components/Icons';

export default function SummaryScreen({ data, onPlayAgain, onBackToHub }) {
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(null);

  if (!data) return null;

  const title =
    data.syncPercent >= 80
      ? "You're seriously in sync."
      : data.syncPercent >= 50
        ? 'Great connection!'
        : 'That was fun.';

  const selectedRound = selectedRoundIndex !== null ? data.results?.[selectedRoundIndex] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-xl mx-auto text-center py-4 space-y-6"
    >
      {/* Hero Title */}
      <div className="space-y-1.5">
        <div className="w-16 h-16 rounded-3xl bg-primary-50 border border-primary-200 text-primary-600 flex items-center justify-center mx-auto mb-3 shadow-soft">
          <SparklesIcon className="w-8 h-8" />
        </div>

        <h2 className="text-3xl sm:text-4xl font-heading font-black text-surface-950 tracking-tight">
          {title}
        </h2>
        <p className="text-sm text-surface-600 font-medium">
          Here is your friendship compatibility breakdown
        </p>
      </div>

      {/* Main Large Compatibility Score Card */}
      <div className="card-surface p-8 relative overflow-hidden text-center">
        {/* Soft radial glow */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-50/50 to-transparent pointer-events-none" />

        <div className="relative z-10 space-y-2">
          <div className="inline-flex flex-col items-center justify-center">
            <span className="text-6xl sm:text-7xl font-heading font-black tracking-tight text-primary-700">
              {data.syncPercent}%
            </span>
            <span className="text-xs uppercase font-heading font-extrabold tracking-widest text-surface-400 mt-1">
              Sync Score
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Stats Grid */}
      <div className="grid grid-cols-3 gap-3.5">
        <div className="card-surface p-4 text-center">
          <p className="text-2xl font-heading font-black text-amber-600 flex items-center justify-center gap-1">
            <span>{data.bestStreak}</span>
            <FlameIcon className="w-4 h-4 text-amber-500" />
          </p>
          <p className="text-[10px] uppercase font-heading font-bold text-surface-400 mt-1">Best Streak</p>
        </div>

        <div className="card-surface p-4 text-center">
          <p className="text-2xl font-heading font-black text-emerald-600">{data.totalMatches}</p>
          <p className="text-[10px] uppercase font-heading font-bold text-surface-400 mt-1">Matches</p>
        </div>

        <div className="card-surface p-4 text-center">
          <p className="text-2xl font-heading font-black text-surface-950">{data.totalRounds}</p>
          <p className="text-[10px] uppercase font-heading font-bold text-surface-400 mt-1">Rounds</p>
        </div>
      </div>

      {/* Interactive Round-by-Round Timeline */}
      {data.results && data.results.length > 0 && (
        <div className="card-surface p-6 text-left space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-heading font-bold text-surface-500 uppercase tracking-wider">
              Round Timeline
            </h3>
            <span className="text-[11px] text-primary-600 font-medium">
              Tap a round to inspect choices
            </span>
          </div>

          {/* Timeline Pills */}
          <div className="flex flex-wrap items-center gap-2 justify-center py-1">
            {data.results.map((r, i) => {
              const isSelected = selectedRoundIndex === i;
              return (
                <motion.button
                  key={i}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedRoundIndex(isSelected ? null : i)}
                  className={`w-9 h-9 rounded-2xl flex items-center justify-center text-xs font-heading font-bold transition-all shadow-soft ${
                    isSelected
                      ? 'ring-4 ring-primary-500/20 border-primary-500 font-black'
                      : ''
                  } ${
                    r.matched
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-surface-100 text-surface-500 border border-black/[0.06]'
                  }`}
                  title={`Round ${i + 1}: ${r.matched ? 'Matched' : 'Different'}`}
                >
                  {r.matched ? <CheckIcon className="w-4 h-4" /> : '✕'}
                </motion.button>
              );
            })}
          </div>

          {/* Expanded Round Inspector */}
          <AnimatePresence>
            {selectedRound && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="pt-3 border-t border-black/[0.04] space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-heading font-bold text-surface-900">
                    Round {selectedRoundIndex + 1}: {selectedRound.question?.category || 'Question'}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      selectedRound.matched
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-surface-100 text-surface-600'
                    }`}
                  >
                    {selectedRound.matched ? 'In Sync ✓' : 'Different Choices 😄'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-primary-50/70 border border-primary-100">
                    <span className="text-[10px] font-bold text-primary-700 uppercase block mb-0.5">Your Choice</span>
                    <span className="font-semibold text-surface-900">
                      {selectedRound.answers ? Object.values(selectedRound.answers)[0]?.answer === 'A' ? selectedRound.question?.optionA : selectedRound.question?.optionB : 'Option'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-rose-50/70 border border-rose-100">
                    <span className="text-[10px] font-bold text-rose-700 uppercase block mb-0.5">Friend&apos;s Choice</span>
                    <span className="font-semibold text-surface-900">
                      {selectedRound.answers && Object.values(selectedRound.answers)[1] ? Object.values(selectedRound.answers)[1]?.answer === 'A' ? selectedRound.question?.optionA : selectedRound.question?.optionB : 'Option'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-2">
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
