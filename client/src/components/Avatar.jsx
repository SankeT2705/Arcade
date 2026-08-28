import { cn } from '../lib/utils';

const colors = [
  'bg-primary-50 text-primary-700 border-primary-200',
  'bg-secondary-50 text-secondary-700 border-secondary-200',
  'bg-emerald-50 text-emerald-700 border-emerald-200',
  'bg-amber-50 text-amber-700 border-amber-200',
  'bg-purple-50 text-purple-700 border-purple-200',
  'bg-sky-50 text-sky-700 border-sky-200',
  'bg-rose-50 text-rose-700 border-rose-200',
];

function getColorFromId(id) {
  let hash = 0;
  for (let i = 0; i < (id || '').length; i++) {
    hash = ((hash << 5) - hash + (id || '').charCodeAt(i)) | 0;
  }
  return colors[Math.abs(hash) % colors.length];
}

function getInitials(name) {
  if (!name) return '?';
  return name
    .split(/[\s_-]+/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);
}

export default function Avatar({ id, name, connected = true, size = 'md', className = '' }) {
  const sizeMap = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-base font-bold',
    xl: 'w-20 h-20 text-xl font-bold',
  };

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          'rounded-full border flex items-center justify-center font-heading font-semibold shadow-xs',
          getColorFromId(id),
          sizeMap[size],
          !connected && 'opacity-50 grayscale',
        )}
      >
        {getInitials(name)}
      </div>
      {/* Active status dot */}
      <span
        className={cn(
          'absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white',
          connected ? 'bg-emerald-500' : 'bg-slate-400',
        )}
      />
    </div>
  );
}
