import { cn } from '../lib/utils';

/**
 * Circular countdown timer with clean mint/emerald/amber/rose transitions.
 */
export default function Timer({ timeLeft, duration, size = 'md', className = '' }) {
  const progress = duration > 0 ? Math.max(0, timeLeft / duration) : 0;
  const seconds = Math.max(0, Math.ceil(timeLeft / 1000));

  const getColor = () => {
    if (progress > 0.4) return { stroke: 'stroke-emerald-500', text: 'text-emerald-700', bg: 'bg-emerald-50/80 border-emerald-200' };
    if (progress > 0.2) return { stroke: 'stroke-amber-500', text: 'text-amber-700', bg: 'bg-amber-50/80 border-amber-200' };
    return { stroke: 'stroke-rose-500', text: 'text-rose-700', bg: 'bg-rose-50/80 border-rose-200 animate-pulse' };
  };

  const currentTheme = getColor();

  const sizeMap = {
    sm: { wh: 40, textSize: 'text-xs', strokeWidth: 3, radius: 16 },
    md: { wh: 52, textSize: 'text-sm', strokeWidth: 3.5, radius: 21 },
    lg: { wh: 68, textSize: 'text-lg', strokeWidth: 4.5, radius: 28 },
  };

  const s = sizeMap[size];
  const circumference = 2 * Math.PI * s.radius;
  const offset = circumference * (1 - progress);

  return (
    <div className={cn('relative inline-flex items-center justify-center p-1 rounded-2xl border shadow-soft transition-colors duration-200', currentTheme.bg, className)}>
      <svg width={s.wh} height={s.wh} className="transform -rotate-90">
        {/* Background circle */}
        <circle
          cx={s.wh / 2}
          cy={s.wh / 2}
          r={s.radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={s.strokeWidth}
          className="text-black/[0.06]"
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
          className={cn('transition-all duration-300 ease-out', currentTheme.stroke)}
        />
      </svg>
      <span
        className={cn(
          'absolute font-heading font-extrabold tabular-nums tracking-tight',
          s.textSize,
          currentTheme.text
        )}
      >
        {seconds}s
      </span>
    </div>
  );
}
