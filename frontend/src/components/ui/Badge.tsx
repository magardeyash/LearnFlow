import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'brand' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'secondary',
  className,
}) => {
  return (
    <span
      className={twMerge(
        clsx(
          "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider",
          {
            "bg-brand-900/60 text-brand-500 border border-brand-600/30": variant === 'brand',
            "bg-slate-800 text-slate-300 border border-slate-700/50": variant === 'secondary',
            "bg-emerald-950/60 text-emerald-400 border border-emerald-600/30": variant === 'success',
            "bg-amber-950/60 text-amber-400 border border-amber-600/30": variant === 'warning',
            "bg-rose-950/60 text-rose-400 border border-rose-600/30": variant === 'danger',
            "bg-sky-950/60 text-sky-400 border border-sky-600/30": variant === 'info',
          }
        ),
        className
      )}
    >
      {children}
    </span>
  );
};
