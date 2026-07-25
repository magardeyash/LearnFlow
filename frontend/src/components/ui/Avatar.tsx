import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface AvatarProps {
  src?: string;
  name: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  className,
}) => {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const sizeClasses = clsx({
    "h-8 w-8 text-xs": size === 'sm',
    "h-10 w-10 text-sm": size === 'md',
    "h-14 w-14 text-base": size === 'lg',
    "h-20 w-20 text-xl": size === 'xl',
  });

  if (src && src.trim() !== '') {
    return (
      <img
        src={src}
        alt={name}
        className={twMerge(
          "rounded-full object-cover border border-slate-700/50",
          sizeClasses,
          className
        )}
      />
    );
  }

  return (
    <div
      className={twMerge(
        "rounded-full bg-slate-800 border border-slate-700/50 flex items-center justify-center font-bold text-slate-300 select-none",
        sizeClasses,
        className
      )}
    >
      {initials}
    </div>
  );
};
