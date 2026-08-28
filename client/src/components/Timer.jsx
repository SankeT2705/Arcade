import { cn } from '../lib/utils';

/**
 * Circular countdown timer with color transitions.
 */
export default function Timer({ timeLeft, duration, size = 'md', className = '' }) {
  const progress = duration > 0 ? Math.max(0, timeLeft / duration) : 0;
  const seconds = Math.max(0, Math.ceil(timeLeft / 1000));

  // Color transitions: green → yellow → red
  const getColor = () => {
    if (progress > 0.5) return 'text-success-400 stroke-success-400';
    if (progress > 0.25) return 'text-accent-400 stroke-accent-400';
    return 'text-danger-400 stroke-danger-400';
  };

  const sizeMap = {
    sm: { wh: 48, textSize: 'text-sm', strokeWidth: 3, radius: 20 },
    md: { wh: 64, textSize: 'text-lg', strokeWidth: 4, radius: 26 },
    lg: { wh: 80, textSize: 'text-2xl', strokeWidth: 5, radius: 34 },
  };

  const s = sizeMap[size];
  const circumference = 2 * Math.PI * s.radius;
  const offset = circumference * (1 - progress);

  return (
    <div className={cn('relative inline-flex items-center justify-center', className)}>
      <svg width={s.wh} height={s.wh} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={s.wh / 2}
          cy={s.wh / 2}
          r={s.radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={s.strokeWidth}
          className="text-surface-200"
        />
        {/* Progress circle */}
        <circle
          cx={s.wh / 2}
          cy={s.wh / 2}
          r={s.radius}
          fill="none"
          strokeWidth={s.strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn('transition-all duration-200', getColor())}
        />
      </svg>
      <span
        className={cn(
          'absolute font-bold tabular-nums',
          s.textSize,
          getColor().split(' ')[0],
          progress <= 0.25 && 'animate-bounce-subtle',
        )}
      >
        {seconds}
      </span>
    </div>
  );
}
