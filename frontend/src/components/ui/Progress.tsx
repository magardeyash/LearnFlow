import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ProgressProps {
  value: number; // 0 to 100
  max?: number;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  type?: 'linear' | 'circular';
}

export const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  className,
  size = 'md',
  type = 'linear',
}) => {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  if (type === 'circular') {
    const radius = 18;
    const strokeWidth = size === 'sm' ? 3 : size === 'md' ? 4 : 5;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;
    const sizePixels = size === 'sm' ? 40 : size === 'md' ? 56 : 72;

    return (
      <div className={twMerge("relative inline-flex items-center justify-center", className)}>
        <svg width={sizePixels} height={sizePixels} className="transform -rotate-90">
          <circle
            cx={sizePixels / 2}
            cy={sizePixels / 2}
            r={radius}
            className="stroke-slate-800"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          <circle
            cx={sizePixels / 2}
            cy={sizePixels / 2}
            r={radius}
            className="stroke-brand-500 transition-all duration-300 ease-in-out"
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>
        <span className={twMerge(
          "absolute text-slate-100 font-semibold",
          size === 'sm' ? 'text-[10px]' : size === 'md' ? 'text-xs' : 'text-sm'
        )}>
          {percentage}%
        </span>
      </div>
    );
  }

  return (
    <div className={twMerge("w-full flex flex-col gap-1", className)}>
      <div className={twMerge(
        "w-full bg-slate-800 rounded-full overflow-hidden",
        size === 'sm' ? 'h-1.5' : size === 'md' ? 'h-2.5' : 'h-4'
      )}>
        <div
          className="bg-brand-500 h-full rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
