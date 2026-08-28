import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export default function ScoreDisplay({ score, label, size = 'md', animated = true, className = '' }) {
  const sizeMap = {
    sm: 'text-2xl',
    md: 'text-4xl',
    lg: 'text-6xl',
  };

  return (
    <div className={cn('text-center', className)}>
      {label && <p className="text-surface-400 text-sm mb-1">{label}</p>}
      <motion.div
        key={score}
        initial={animated ? { scale: 1.3, opacity: 0 } : false}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 15 }}
        className={cn('font-black tabular-nums gradient-text', sizeMap[size])}
      >
        {typeof score === 'number' ? score : score}
      </motion.div>
    </div>
  );
}
