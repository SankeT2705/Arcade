import { cn } from '../lib/utils';

const pastelRings = [
  'bg-primary-50 text-primary-700 border-primary-200 ring-4 ring-primary-500/10',
  'bg-rose-50 text-rose-700 border-rose-200 ring-4 ring-rose-500/10',
  'bg-emerald-50 text-emerald-700 border-emerald-200 ring-4 ring-emerald-500/10',
  'bg-sky-50 text-sky-700 border-sky-200 ring-4 ring-sky-500/10',
  'bg-amber-50 text-amber-700 border-amber-200 ring-4 ring-amber-500/10',
  'bg-purple-50 text-purple-700 border-purple-200 ring-4 ring-purple-500/10',
];

function getColorFromId(id, role) {
  if (role === 'playerA') {
    return 'bg-primary-50 text-primary-700 border-primary-200 ring-4 ring-primary-500/10';
  }
  if (role === 'playerB') {
    return 'bg-rose-50 text-rose-700 border-rose-200 ring-4 ring-rose-500/10';
  }
  let hash = 0;
  for (let i = 0; i < (id || '').length; i++) {
    hash = ((hash << 5) - hash + (id || '').charCodeAt(i)) | 0;
  }
  return pastelRings[Math.abs(hash) % pastelRings.length];
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

export default function Avatar({ id, name, role, connected = true, size = 'md', className = '' }) {
  const sizeMap = {
    xs: 'w-7 h-7 text-[10px]',
    sm: 'w-9 h-9 text-xs',
    md: 'w-11 h-11 text-sm',
    lg: 'w-16 h-16 text-lg font-bold',
    xl: 'w-24 h-24 text-2xl font-bold',
  };

  return (
    <div className={cn('relative inline-flex shrink-0', className)}>
      <div
        className={cn(
          'rounded-full border flex items-center justify-center font-heading font-bold shadow-soft transition-transform duration-200',
          getColorFromId(id, role),
          sizeMap[size],
          !connected && 'opacity-40 grayscale',
        )}
      >
        {getInitials(name)}
      </div>
      {/* Active status dot */}
      <span
        className={cn(
          'absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white',
          connected ? 'bg-emerald-500 ring-1 ring-emerald-300' : 'bg-surface-400',
        )}
      />
    </div>
  );
}
