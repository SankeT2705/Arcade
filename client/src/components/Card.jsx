import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

export default function Card({
  children,
  interactive = false,
  className = '',
  onClick,
  ...props
}) {
  if (interactive) {
    return (
      <motion.div
        whileHover={{ y: -3, scale: 1.006 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: 'spring', damping: 22, stiffness: 380 }}
        className={cn(
          'card-interactive p-6 md:p-8',
          className,
        )}
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && onClick?.()}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div className={cn('card-surface p-6 md:p-8', className)} {...props}>
      {children}
    </div>
  );
}
