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
    <div className="w-full max-w-lg mx-auto">
      {/* Category Pill */}
      <div className="text-center mb-3">
        <span className="text-[11px] font-semibold uppercase tracking-wider text-primary-700 bg-primary-50 border border-primary-200 px-3 py-1 rounded-full shadow-xs">
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
        className="relative touch-none select-none mb-4"
      >
        {/* Drag indicators */}
        {!myAnswer && !disabled && (
          <>
            <div
              className={cn(
                'absolute -left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-primary-700 bg-primary-50 px-2 py-1 rounded-lg border border-primary-200 transition-opacity z-10 shadow-xs',
                dragDirection === 'A' ? 'opacity-100 scale-105' : 'opacity-30',
              )}
            >
              ← Option A
            </div>
            <div
              className={cn(
                'absolute -right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-secondary-700 bg-secondary-50 px-2 py-1 rounded-lg border border-secondary-200 transition-opacity z-10 shadow-xs',
                dragDirection === 'B' ? 'opacity-100 scale-105' : 'opacity-30',
              )}
            >
              Option B →
            </div>
          </>
        )}

        <div className="glass-card text-center py-8 px-6 border border-surface-200 shadow-architect cursor-grab active:cursor-grabbing">
          <span className="text-xs font-semibold text-surface-500 uppercase tracking-widest block mb-2">
            Would You Rather
          </span>
          <div className="space-y-4">
            <p className="text-lg sm:text-xl font-heading font-bold text-surface-950 leading-snug">
              {question.optionA}
            </p>
            <div className="flex items-center gap-3 justify-center">
              <div className="h-px flex-1 bg-surface-200" />
              <span className="text-xs font-black text-surface-500 bg-surface-100 px-2.5 py-0.5 rounded-full border border-surface-200">
                OR
              </span>
              <div className="h-px flex-1 bg-surface-200" />
            </div>
            <p className="text-lg sm:text-xl font-heading font-bold text-surface-950 leading-snug">
              {question.optionB}
            </p>
          </div>
        </div>
      </motion.div>

      {/* Tap Select Choice Buttons */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        {/* Option A */}
        <motion.button
          whileHover={!disabled && !myAnswer ? { scale: 1.02, y: -2 } : {}}
          whileTap={!disabled && !myAnswer ? { scale: 0.98 } : {}}
          onClick={() => !disabled && !myAnswer && onAnswer('A')}
          disabled={disabled || !!myAnswer}
          className={cn(
            'relative p-4 rounded-2xl font-semibold transition-all text-left flex flex-col justify-between min-h-[95px] shadow-xs',
            myAnswer === 'A'
              ? 'bg-primary-50 border-2 border-primary-600 text-primary-950 ring-2 ring-primary-100'
              : 'bg-white border border-surface-200 hover:border-primary-300 text-surface-700',
            disabled && !myAnswer && 'opacity-50 cursor-not-allowed',
          )}
        >
          {myAnswer === 'A' && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-primary-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-xs">
              <CheckIcon className="w-3.5 h-3.5" />
            </span>
          )}
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary-700 block mb-1">
            Option A
          </span>
          <span className="text-xs sm:text-sm font-heading font-semibold text-surface-900 leading-snug">
            {question.optionA}
          </span>
        </motion.button>

        {/* Option B */}
        <motion.button
          whileHover={!disabled && !myAnswer ? { scale: 1.02, y: -2 } : {}}
          whileTap={!disabled && !myAnswer ? { scale: 0.98 } : {}}
          onClick={() => !disabled && !myAnswer && onAnswer('B')}
          disabled={disabled || !!myAnswer}
          className={cn(
            'relative p-4 rounded-2xl font-semibold transition-all text-left flex flex-col justify-between min-h-[95px] shadow-xs',
            myAnswer === 'B'
              ? 'bg-secondary-50 border-2 border-secondary-600 text-secondary-950 ring-2 ring-secondary-100'
              : 'bg-white border border-surface-200 hover:border-secondary-300 text-surface-700',
            disabled && !myAnswer && 'opacity-50 cursor-not-allowed',
          )}
        >
          {myAnswer === 'B' && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-secondary-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-xs">
              <CheckIcon className="w-3.5 h-3.5" />
            </span>
          )}
          <span className="text-[11px] font-bold uppercase tracking-wider text-secondary-700 block mb-1">
            Option B
          </span>
          <span className="text-xs sm:text-sm font-heading font-semibold text-surface-900 leading-snug">
            {question.optionB}
          </span>
        </motion.button>
      </div>

      {/* Waiting for partner */}
      {myAnswer && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mt-5 p-3 rounded-xl bg-primary-50 border border-primary-200"
        >
          <p className="text-xs text-primary-800 font-semibold animate-pulse">
            ✓ Your choice is locked in. Waiting for friend…
          </p>
        </motion.div>
      )}
    </div>
  );
}
