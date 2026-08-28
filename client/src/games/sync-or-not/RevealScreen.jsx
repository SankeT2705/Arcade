import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { cn } from '../../lib/utils';
import { SparklesIcon, ArrowRightIcon, FlameIcon } from '../../components/Icons';

export default function RevealScreen({ data, playerId, onNext }) {
  const confettiShown = useRef(false);

  useEffect(() => {
    if (data?.matched && !confettiShown.current) {
      confettiShown.current = true;
      const duration = 1200;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 50,
          origin: { x: 0.1, y: 0.65 },
          colors: ['#6366F1', '#10B981', '#FB7185', '#F59E0B'],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 50,
          origin: { x: 0.9, y: 0.65 },
          colors: ['#6366F1', '#10B981', '#FB7185', '#F59E0B'],
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
      className="w-full max-w-xl mx-auto text-center space-y-6"
    >
      {/* Result Headline Banner */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 16, delay: 0.05 }}
        className="space-y-1.5"
      >
        {data.matched ? (
          <div>
            <div className="w-16 h-16 rounded-3xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center mx-auto mb-3 shadow-soft">
              <SparklesIcon className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-heading font-extrabold text-surface-950 tracking-tight">
              You&apos;re in sync.
            </h2>
            <p className="text-sm text-surface-600 font-medium">
              You both picked <span className="font-bold text-emerald-700">{myEntry ? getAnswerText(myEntry[1].answer) : 'the same option'}</span>
            </p>
          </div>
        ) : (
          <div>
            <div className="w-16 h-16 rounded-3xl bg-surface-100 border border-black/[0.06] text-surface-600 flex items-center justify-center mx-auto mb-3 shadow-soft">
              <span className="text-2xl">😄</span>
            </div>
            <h2 className="text-3xl font-heading font-extrabold text-surface-950 tracking-tight">
              Not quite 😄
            </h2>
            <p className="text-sm text-surface-600 font-medium">
              You went different ways this time.
            </p>
          </div>
        )}
      </motion.div>

      {/* Answers side by side */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* My answer */}
        <motion.div
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.12 }}
          className={cn(
            'p-5 rounded-3xl border text-left shadow-card',
            data.matched
              ? 'border-emerald-300 bg-emerald-50/60 ring-2 ring-emerald-500/10'
              : 'border-black/[0.06] bg-white',
          )}
        >
          <span className="text-[11px] uppercase tracking-wider font-heading font-bold text-primary-700 bg-primary-100/60 px-2.5 py-0.5 rounded-lg inline-block mb-2">
            You picked
          </span>
          <p className="font-heading font-bold text-surface-950 text-base leading-snug">
            {myEntry ? getAnswerText(myEntry[1].answer) : 'No answer'}
          </p>
        </motion.div>

        {/* Partner answer */}
        <motion.div
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.16 }}
          className={cn(
            'p-5 rounded-3xl border text-left shadow-card',
            data.matched
              ? 'border-emerald-300 bg-emerald-50/60 ring-2 ring-emerald-500/10'
              : 'border-black/[0.06] bg-white',
          )}
        >
          <span className="text-[11px] uppercase tracking-wider font-heading font-bold text-rose-700 bg-rose-100/60 px-2.5 py-0.5 rounded-lg inline-block mb-2">
            {partnerEntry?.[1]?.name || 'Friend'} picked
          </span>
          <p className="font-heading font-bold text-surface-950 text-base leading-snug">
            {partnerEntry ? getAnswerText(partnerEntry[1].answer) : 'No answer'}
          </p>
        </motion.div>
      </div>

      {/* Live Connection Stats Bar */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="flex items-center justify-around py-4 px-6 rounded-3xl bg-white border border-black/[0.06] shadow-card"
      >
        <div className="text-center">
          <p className="text-[11px] text-surface-400 uppercase tracking-widest font-heading font-bold">Sync Streak</p>
          <p className="text-2xl font-heading font-black text-amber-600 flex items-center justify-center gap-1 mt-0.5">
            <span>{data.streak}</span>
            <FlameIcon className="w-5 h-5 text-amber-500" />
          </p>
        </div>
        <div className="w-px h-10 bg-black/[0.06]" />
        <div className="text-center">
          <p className="text-[11px] text-surface-400 uppercase tracking-widest font-heading font-bold">Match Rate</p>
          <p className="text-2xl font-heading font-black text-primary-700 mt-0.5">{data.syncPercent}%</p>
        </div>
      </motion.div>

      {/* Next Question CTA */}
      {!data.isLastRound && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.25 }}
          onClick={onNext}
          className="btn-primary w-full py-4 text-base font-heading font-bold rounded-2xl shadow-soft"
        >
          <span>Next Question</span>
          <ArrowRightIcon className="w-4 h-4" />
        </motion.button>
      )}
    </motion.div>
  );
}
