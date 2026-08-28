import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { CheckIcon } from '../../components/Icons';

export default function QuestionCard({ question, onAnswer, myAnswer, disabled }) {
  const [dragDirection, setDragDirection] = useState(null);

  const handleDragEnd = (_, info) => {
    const threshold = 80;
    if (info.offset.x > threshold) {
      onAnswer('B');
    } else if (info.offset.x < -threshold) {
      onAnswer('A');
    }
    setDragDirection(null);
  };

  if (!question) return null;

  return (
    <div className="w-full max-w-xl mx-auto space-y-6">
      {/* Category Pill */}
      <div className="text-center">
        <span className="text-xs font-heading font-extrabold uppercase tracking-widest text-primary-700 bg-primary-50 border border-primary-200/80 px-3.5 py-1 rounded-full shadow-soft inline-block">
          {question.category || 'Connection & Vibe'}
        </span>
      </div>

      {/* Main Question Card Area */}
      <motion.div
        drag={!disabled && !myAnswer ? 'x' : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDrag={(_, info) => {
          if (info.offset.x > 40) setDragDirection('B');
          else if (info.offset.x < -40) setDragDirection('A');
          else setDragDirection(null);
        }}
        onDragEnd={handleDragEnd}
        className="relative touch-none select-none"
      >
        {/* Drag indicators */}
        {!myAnswer && !disabled && (
          <>
            <div
              className={cn(
                'absolute -left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-primary-700 bg-primary-50 px-2.5 py-1 rounded-xl border border-primary-200 transition-opacity z-10 shadow-soft',
                dragDirection === 'A' ? 'opacity-100 scale-105' : 'opacity-20',
              )}
            >
              ← Option A
            </div>
            <div
              className={cn(
                'absolute -right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-rose-700 bg-rose-50 px-2.5 py-1 rounded-xl border border-rose-200 transition-opacity z-10 shadow-soft',
                dragDirection === 'B' ? 'opacity-100 scale-105' : 'opacity-20',
              )}
            >
              Option B →
            </div>
          </>
        )}

        <div className="card-surface text-center py-9 px-6 sm:px-8 cursor-grab active:cursor-grabbing relative overflow-hidden">
          <span className="text-xs font-heading font-bold text-surface-400 uppercase tracking-widest block mb-4">
            Would You Rather
          </span>
          <div className="space-y-4">
            <p className="text-xl sm:text-2xl font-heading font-extrabold text-surface-950 leading-tight">
              {question.optionA}
            </p>
            <div className="flex items-center gap-3 justify-center max-w-xs mx-auto">
              <div className="h-px flex-1 bg-black/[0.06]" />
              <span className="text-xs font-black text-surface-400 bg-surface-100 px-3 py-0.5 rounded-full border border-black/[0.04]">
                OR
              </span>
              <div className="h-px flex-1 bg-black/[0.06]" />
            </div>
            <p className="text-xl sm:text-2xl font-heading font-extrabold text-surface-950 leading-tight">
              {question.optionB}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tap Select Choice Cards (Option A vs Option B) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Option A (Lavender Tone) */}
        <motion.button
          whileHover={!disabled && !myAnswer ? { scale: 1.015, y: -2 } : {}}
          whileTap={!disabled && !myAnswer ? { scale: 0.985 } : {}}
          onClick={() => !disabled && !myAnswer && onAnswer('A')}
          disabled={disabled || !!myAnswer}
          className={cn(
            'relative p-5 rounded-3xl font-semibold transition-all text-left flex flex-col justify-between min-h-[110px] shadow-card',
            myAnswer === 'A'
              ? 'bg-primary-50 border-2 border-primary-600 text-primary-950 ring-4 ring-primary-500/10 shadow-card-hover'
              : 'bg-white border border-black/[0.06] hover:border-primary-300 hover:bg-primary-50/20 text-surface-800',
            disabled && !myAnswer && 'opacity-40 cursor-not-allowed',
          )}
        >
          {myAnswer === 'A' && (
            <span className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-soft">
              <CheckIcon className="w-4 h-4" />
            </span>
          )}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-primary-700 bg-primary-100/60 px-2.5 py-0.5 rounded-lg">
              Option A
            </span>
          </div>
          <span className="text-base font-heading font-bold text-surface-950 leading-snug">
            {question.optionA}
          </span>
        </motion.button>

        {/* Option B (Peach/Rose Tone) */}
        <motion.button
          whileHover={!disabled && !myAnswer ? { scale: 1.015, y: -2 } : {}}
          whileTap={!disabled && !myAnswer ? { scale: 0.985 } : {}}
          onClick={() => !disabled && !myAnswer && onAnswer('B')}
          disabled={disabled || !!myAnswer}
          className={cn(
            'relative p-5 rounded-3xl font-semibold transition-all text-left flex flex-col justify-between min-h-[110px] shadow-card',
            myAnswer === 'B'
              ? 'bg-rose-50 border-2 border-rose-600 text-rose-950 ring-4 ring-rose-500/10 shadow-card-hover'
              : 'bg-white border border-black/[0.06] hover:border-rose-300 hover:bg-rose-50/20 text-surface-800',
            disabled && !myAnswer && 'opacity-40 cursor-not-allowed',
          )}
        >
          {myAnswer === 'B' && (
            <span className="absolute -top-2.5 -right-2.5 w-7 h-7 bg-rose-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-soft">
              <CheckIcon className="w-4 h-4" />
            </span>
          )}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-heading font-bold uppercase tracking-wider text-rose-700 bg-rose-100/60 px-2.5 py-0.5 rounded-lg">
              Option B
            </span>
          </div>
          <span className="text-base font-heading font-bold text-surface-950 leading-snug">
            {question.optionB}
          </span>
        </motion.button>
      </div>

      {/* Waiting for friend indicator */}
      {myAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center p-4 rounded-2xl bg-white border border-black/[0.05] shadow-soft"
        >
          <p className="text-xs text-primary-700 font-heading font-bold flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary-600 animate-pulse" />
            Choice locked in. Waiting for your friend…
          </p>
        </motion.div>
      )}
    </div>
  );
}
