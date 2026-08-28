import { cn } from '../lib/utils';

export function SkeletonText({ width = 'w-full', className = '' }) {
  return <div className={cn('skeleton h-4 rounded', width, className)} />;
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={cn('glass rounded-2xl p-6 space-y-4', className)}>
      <div className="skeleton h-6 w-2/3 rounded" />
      <div className="skeleton h-4 w-full rounded" />
      <div className="skeleton h-4 w-4/5 rounded" />
      <div className="skeleton h-10 w-1/3 rounded-xl mt-4" />
    </div>
  );
}

export function SkeletonCircle({ size = 'w-10 h-10', className = '' }) {
  return <div className={cn('skeleton rounded-full', size, className)} />;
}

export default function LoadingSkeleton({ type = 'card', count = 1, className = '' }) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <div className={cn('space-y-4', className)}>
      {items.map((i) => {
        switch (type) {
          case 'card':
            return <SkeletonCard key={i} />;
          case 'text':
            return <SkeletonText key={i} />;
          case 'circle':
            return <SkeletonCircle key={i} />;
          default:
            return <SkeletonCard key={i} />;
        }
      })}
    </div>
  );
}
