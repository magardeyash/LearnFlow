import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  glass?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  glass = true,
  ...props
}) => {
  return (
    <div
      className={twMerge(
        "rounded-xl border border-slate-700/50 p-6 transition-all duration-300",
        glass 
          ? "bg-slate-900/60 backdrop-blur-md shadow-xl hover:shadow-2xl hover:border-slate-600/60" 
          : "bg-slate-900 shadow-md",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
