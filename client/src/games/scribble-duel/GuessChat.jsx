import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';
import { CheckIcon, FlameIcon, SendIcon } from '../../components/Icons';

export default function GuessChat({ guesses, onSubmit, disabled, className = '' }) {
  const [input, setInput] = useState('');
  const scrollRef = useRef(null);
  const inputRef = useRef(null);

  // Auto-scroll to bottom on new guess
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [guesses.length]);

  // Auto-focus input
  useEffect(() => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  }, [disabled]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!input.trim() || disabled) return;
    onSubmit(input.trim());
    setInput('');
  };

  return (
    <div className={cn('flex flex-col card-surface !p-4 shadow-card', className)}>
      {/* Guess history feed */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto custom-scrollbar space-y-2 mb-3 max-h-36 min-h-[50px] pr-1"
      >
        <AnimatePresence mode="popLayout">
          {guesses.map((g, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              className={cn(
                'px-3.5 py-2 rounded-2xl text-xs sm:text-sm flex items-center justify-between shadow-soft font-medium',
                g.isCorrect
                  ? 'bg-emerald-50 border border-emerald-200 text-emerald-800 font-bold'
                  : g.isClose
                    ? 'bg-amber-50 border border-amber-200 text-amber-800 font-bold'
                    : 'bg-surface-100/80 border border-black/[0.04] text-surface-800',
              )}
            >
              <div className="flex items-center gap-2">
                <span className="font-semibold text-surface-950">{g.text}</span>
                <span className="text-[10px] text-surface-400 font-normal">by {g.playerName}</span>
              </div>
              {g.isCorrect && (
                <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                  <CheckIcon className="w-3.5 h-3.5" /> Correct!
                </span>
              )}
              {g.isClose && !g.isCorrect && (
                <span className="text-amber-700 font-bold text-xs flex items-center gap-1">
                  <FlameIcon className="w-3.5 h-3.5" /> Very close!
                </span>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        {guesses.length === 0 && (
          <p className="text-surface-400 text-xs text-center py-2.5 font-medium">
            Type your guess below and press Enter
          </p>
        )}
      </div>

      {/* Input submission form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="input-base flex-1 !py-2.5 text-sm"
          placeholder={disabled ? 'Waiting for drawer…' : 'Type your guess…'}
          disabled={disabled}
          maxLength={50}
          autoComplete="off"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="btn-primary !px-5 !py-2.5 text-xs sm:text-sm font-heading font-bold shrink-0 rounded-2xl shadow-soft"
        >
          <span>Guess</span>
          <SendIcon className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
