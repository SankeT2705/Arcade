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
        whileHover={{ y: -2, scale: 1.004 }}
        whileTap={{ scale: 0.985 }}
        transition={{ type: 'spring', damping: 20, stiffness: 350 }}
        className={cn(
          'glass-card p-6 cursor-pointer hover:border-primary-400 hover:shadow-card-hover transition-all duration-150',
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
    <div className={cn('glass-card p-6', className)} {...props}>
      {children}
    </div>
  );
}
