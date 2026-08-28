import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../../components/Button';
import { SparklesIcon, RefreshIcon, ArrowRightIcon, FlameIcon, CheckIcon, BrainIcon } from '../../components/Icons';

export default function SummaryScreen({ data, onPlayAgain, onBackToHub }) {
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(null);

  if (!data) return null;

  const analytics = data.analytics || {
    dimensions: {
      emotionalIntuition: data.syncPercent || 70,
      communicationConflict: Math.min(100, (data.syncPercent || 70) + 5),
      tasteLifestyle: Math.max(30, (data.syncPercent || 70) - 10),
      riskSpontaneity: 65,
    },
    archetype: {
      name: data.syncPercent >= 80 ? 'Unspoken Telepathy' : data.syncPercent >= 60 ? 'Balanced Resonance' : 'Complementary Counterparts',
      badge: data.syncPercent >= 80 ? 'Soul Link' : data.syncPercent >= 60 ? 'Deep Resonance' : 'Complementary Duo',
      description: data.syncPercent >= 80
        ? 'You operate on the same wavelength with naturally matching instincts.'
        : data.syncPercent >= 60
          ? 'Strong core alignment with inspiring complementary viewpoints.'
          : 'You bring distinct strengths that create a rich dynamic balance.',
    },
    insights: [
      'Your intuitive choices create strong mutual understanding.',
      'Complementary perspectives keep shared conversations exciting.',
    ],
  };

  const selectedRound = selectedRoundIndex !== null ? data.results?.[selectedRoundIndex] : null;

  const dimensionsList = [
    {
      title: 'Emotional Intuition',
      score: analytics.dimensions?.emotionalIntuition || 75,
      color: 'from-primary-500 to-indigo-600',
      badgeBg: 'bg-primary-50 text-primary-700 border-primary-200',
    },
    {
      title: 'Communication & Conflict',
      score: analytics.dimensions?.communicationConflict || 80,
      color: 'from-emerald-500 to-teal-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    },
    {
      title: 'Taste & Lifestyle',
      score: analytics.dimensions?.tasteLifestyle || 65,
      color: 'from-amber-500 to-orange-500',
      badgeBg: 'bg-amber-50 text-amber-700 border-amber-200',
    },
    {
      title: 'Risk & Spontaneity',
      score: analytics.dimensions?.riskSpontaneity || 70,
      color: 'from-sky-500 to-blue-600',
      badgeBg: 'bg-sky-50 text-sky-700 border-sky-200',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-2xl mx-auto text-center py-4 space-y-6 pb-20"
    >
      {/* ─── Hero Archetype Card ────────────────────────────── */}
      <div className="card-surface p-7 sm:p-9 relative overflow-hidden text-center shadow-card">
        {/* Luminous multi-pastel backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50/60 via-amber-50/30 to-rose-50/40 pointer-events-none" />

        <div className="relative z-10 space-y-3.5">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-heading font-bold uppercase tracking-wider bg-white/90 border border-black/[0.06] text-primary-700 shadow-soft">
            <SparklesIcon className="w-3.5 h-3.5 text-primary-600" />
            <span>{analytics.archetype?.badge || 'Compatibility'}</span>
          </span>

          <div>
            <span className="text-6xl sm:text-7xl font-heading font-black tracking-tight bg-gradient-to-r from-primary-700 via-indigo-700 to-pink-600 bg-clip-text text-transparent block">
              {data.syncPercent}%
            </span>
            <span className="text-xs uppercase font-heading font-bold tracking-widest text-surface-400 mt-1 block">
              Sync Score
            </span>
          </div>

          <div className="max-w-md mx-auto space-y-1">
            <h2 className="text-2xl sm:text-3xl font-heading font-black text-surface-950 tracking-tight">
              {analytics.archetype?.name}
            </h2>
            <p className="text-xs sm:text-sm text-surface-600 leading-relaxed font-medium">
              {analytics.archetype?.description}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Dimensions Breakdown ───────────────────────────── */}
      <div className="card-surface p-6 sm:p-8 text-left space-y-4 shadow-card">
        <div className="flex items-center justify-between border-b border-black/[0.04] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-primary-50 text-primary-600 flex items-center justify-center shadow-soft">
              <BrainIcon className="w-4 h-4" />
            </div>
            <h3 className="text-sm font-heading font-bold text-surface-950">
              Alignment Matrix
            </h3>
          </div>
          <span className="text-[11px] font-bold text-primary-700 bg-primary-50 px-2.5 py-0.5 rounded-full border border-primary-200">
            Analysis
          </span>
        </div>

        <div className="space-y-3.5 pt-1">
          {dimensionsList.map((dim, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-heading font-bold text-surface-900">
                <span>{dim.title}</span>
                <span className={`font-mono font-black text-xs px-2 py-0.5 rounded-md border ${dim.badgeBg}`}>
                  {dim.score}%
                </span>
              </div>

              {/* Progress Track */}
              <div className="w-full h-2 rounded-full bg-surface-100 border border-black/[0.04] overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${dim.score}%` }}
                  transition={{ duration: 0.8, delay: 0.08 * idx, ease: 'easeOut' }}
                  className={`h-full rounded-full bg-gradient-to-r ${dim.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── Insights ───────────────────────────────────────── */}
      {analytics.insights && analytics.insights.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left">
          {analytics.insights.map((insight, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl bg-white border border-black/[0.05] shadow-soft flex items-start gap-3"
            >
              <div className="w-6 h-6 rounded-lg bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0 mt-0.5">
                <SparklesIcon className="w-3.5 h-3.5" />
              </div>
              <p className="text-xs text-surface-700 font-medium leading-relaxed">
                {insight}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ─── Secondary Stats Grid ───────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
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

      {/* ─── Round Timeline ─────────────────────────────────── */}
      {data.results && data.results.length > 0 && (
        <div className="card-surface p-6 sm:p-7 text-left space-y-4 shadow-card">
          <div className="flex items-center justify-between border-b border-black/[0.04] pb-2.5">
            <h3 className="text-xs font-heading font-bold text-surface-950 uppercase tracking-wider">
              Round Timeline
            </h3>
            <span className="text-[11px] text-primary-600 font-medium">
              {data.results.filter((r) => r.matched).length}/{data.results.length} matched
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
                      ? 'ring-4 ring-primary-500/20 border-primary-500 font-black scale-105'
                      : ''
                  } ${
                    r.matched
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      : 'bg-rose-50/70 text-rose-600 border border-rose-200'
                  }`}
                  title={`Round ${i + 1}`}
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
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      selectedRound.matched
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-rose-50 text-rose-700 border border-rose-200'
                    }`}
                  >
                    {selectedRound.matched ? 'Matched ✓' : 'Different Choices'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-2xl bg-primary-50/70 border border-primary-100">
                    <span className="text-[10px] font-bold text-primary-700 uppercase block mb-1">Your Choice</span>
                    <span className="font-semibold text-surface-900 text-sm">
                      {selectedRound.answers ? Object.values(selectedRound.answers)[0]?.answer === 'A' ? selectedRound.question?.optionA : selectedRound.question?.optionB : 'Option'}
                    </span>
                  </div>
                  <div className="p-3 rounded-2xl bg-rose-50/70 border border-rose-100">
                    <span className="text-[10px] font-bold text-rose-700 uppercase block mb-1">Friend&apos;s Choice</span>
                    <span className="font-semibold text-surface-900 text-sm">
                      {selectedRound.answers && Object.values(selectedRound.answers)[1] ? Object.values(selectedRound.answers)[1]?.answer === 'A' ? selectedRound.question?.optionA : selectedRound.question?.optionB : 'Option'}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ─── Actions ────────────────────────────────────────── */}
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
