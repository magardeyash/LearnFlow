import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled,
  ...props
}) => {
  return (
    <button
      disabled={disabled || isLoading}
      className={twMerge(
        clsx(
          "inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]",
          {
            "bg-brand-500 hover:bg-brand-600 text-slate-950 focus:ring-brand-500": variant === 'primary',
            "bg-slate-800 hover:bg-slate-700 text-slate-100": variant === 'secondary',
            "border border-slate-700 hover:bg-slate-800 text-slate-100": variant === 'outline',
            "bg-rose-600 hover:bg-rose-700 text-white focus:ring-rose-500": variant === 'danger',
            "hover:bg-slate-800 text-slate-300 hover:text-slate-100": variant === 'ghost',
            "text-xs px-3 py-1.5": size === 'sm',
            "text-sm px-4 py-2": size === 'md',
            "text-base px-6 py-3": size === 'lg',
          }
        ),
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
        </svg>
      ) : null}
      {children}
    </button>
  );
};
