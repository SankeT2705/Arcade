import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { cn } from '../../lib/utils';
import { CheckIcon, SparklesIcon, ArrowRightIcon, FlameIcon } from '../../components/Icons';

export default function RevealScreen({ data, playerId, onNext }) {
  const confettiShown = useRef(false);

  useEffect(() => {
    if (data?.matched && !confettiShown.current) {
      confettiShown.current = true;
      const duration = 1500;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ['#4F46E5', '#0D9488', '#F59E0B'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ['#4F46E5', '#0D9488', '#F59E0B'],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };
      frame();
    }
  }, [data?.matched]);

  useEffect(() => {
    confettiShown.current = false;
  }, [data?.round]);

  if (!data) return null;

  const players = Object.entries(data.answers);
  const myEntry = players.find(([id]) => id === playerId);
  const partnerEntry = players.find(([id]) => id !== playerId);

  const getAnswerText = (answer) => {
    if (!answer) return 'No answer';
    if (answer === 'A') return data.question?.optionA;
    return data.question?.optionB;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-lg mx-auto text-center"
    >
      {/* Result Headline */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 14, delay: 0.08 }}
        className="mb-6"
      >
        {data.matched ? (
          <div className="space-y-1">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
              <SparklesIcon className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-heading font-black text-surface-950">
              In Sync!
            </h2>
            <p className="text-xs text-surface-500">You both chose the exact same response</p>
          </div>
        ) : (
          <div className="space-y-1">
            <div className="w-14 h-14 rounded-2xl bg-surface-100 border border-surface-200 text-surface-600 flex items-center justify-center mx-auto mb-2 shadow-xs">
              <CheckIcon className="w-7 h-7 text-surface-400 rotate-45" />
            </div>
            <h2 className="text-2xl font-heading font-bold text-surface-950">
              Different Choices
            </h2>
            <p className="text-xs text-surface-500">Different perspectives keep things interesting!</p>
          </div>
        )}
      </motion.div>

      {/* Answers side by side */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6">
        {/* My answer */}
        <motion.div
          initial={{ x: -12, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.15 }}
          className={cn(
            'p-4 rounded-2xl border text-left shadow-architect',
            data.matched
              ? 'border-emerald-300 bg-emerald-50/50'
              : 'border-surface-200 bg-white',
          )}
        >
          <span className="text-[10px] uppercase tracking-wider font-bold text-primary-700 block mb-1">
            You picked
          </span>
          <p className="font-heading font-bold text-surface-950 text-sm leading-snug">
            {myEntry ? getAnswerText(myEntry[1].answer) : 'No answer'}
          </p>
        </motion.div>

        {/* Partner answer */}
        <motion.div
          initial={{ x: 12, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className={cn(
            'p-4 rounded-2xl border text-left shadow-architect',
            data.matched
              ? 'border-emerald-300 bg-emerald-50/50'
              : 'border-surface-200 bg-white',
          )}
        >
          <span className="text-[10px] uppercase tracking-wider font-bold text-secondary-700 block mb-1">
            {partnerEntry?.[1]?.name || 'Friend'} picked
          </span>
          <p className="font-heading font-bold text-surface-950 text-sm leading-snug">
            {partnerEntry ? getAnswerText(partnerEntry[1].answer) : 'No answer'}
          </p>
        </motion.div>
      </div>

      {/* Live Connection Stats */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex items-center justify-center gap-8 mb-6 py-3.5 px-6 rounded-2xl bg-white border border-surface-200 shadow-architect"
      >
        <div className="text-center">
          <p className="text-[11px] text-surface-400 uppercase tracking-wider font-bold">Sync Streak</p>
          <p className="text-xl font-heading font-black text-amber-600 flex items-center justify-center gap-1">
            <span>{data.streak}</span>
            <FlameIcon className="w-4 h-4 text-amber-500" />
          </p>
        </div>
        <div className="w-px h-8 bg-surface-200" />
        <div className="text-center">
          <p className="text-[11px] text-surface-400 uppercase tracking-wider font-bold">Match Rate</p>
          <p className="text-xl font-heading font-black text-primary-700">{data.syncPercent}%</p>
        </div>
      </motion.div>

      {/* Continue */}
      {!data.isLastRound && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          onClick={onNext}
          className="btn-primary w-full py-3 font-heading font-bold text-sm"
        >
          <span>Next Question</span>
          <ArrowRightIcon className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
}
