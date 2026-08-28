import { motion } from 'framer-motion';
import { cn } from '../lib/utils';

const variants = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  ghost: 'px-4 py-2 text-surface-300 hover:text-surface-100 hover:bg-surface-700/50 rounded-xl transition-all duration-200',
  danger:
    'px-6 py-3 bg-danger-500 text-white font-semibold rounded-xl hover:bg-danger-600 active:scale-[0.98] transition-all duration-200',
};

const sizes = {
  sm: 'text-sm px-4 py-2',
  md: 'text-base',
  lg: 'text-lg px-8 py-4',
};

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  className = '',
  onClick,
  ...props
}) {
  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      className={cn(variants[variant], sizes[size], loading && 'opacity-70 cursor-wait', className)}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg
            className="animate-spin h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          {children}
        </span>
      ) : (
        children
      )}
    </motion.button>
  );
}
