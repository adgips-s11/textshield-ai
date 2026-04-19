import { HTMLAttributes } from 'react';
import clsx from 'clsx';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'danger' | 'warning' | 'info';
}

export function Badge({ className, variant = 'info', children, ...props }: BadgeProps) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-2 px-3 py-1 rounded-lg text-sm font-semibold',
        {
          'bg-green-500/10 text-green-400 border border-green-500/20': variant === 'success',
          'bg-red-500/10 text-red-400 border border-red-500/20': variant === 'danger',
          'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20': variant === 'warning',
          'bg-blue-500/10 text-blue-400 border border-blue-500/20': variant === 'info',
        },
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}