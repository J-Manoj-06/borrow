import React from 'react';
import { cn } from '../../utils/cn';

export const Loader = ({ size = 'md', fullScreen = false, label, className }) => {
  const sizeStyles = {
    sm: 'w-4 h-4 border-2',
    md: 'w-7 h-7 border-2',
    lg: 'w-10 h-10 border-3',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      <div
        className={cn(
          'border-white/20 border-t-white rounded-full animate-spin',
          sizeStyles[size],
          className
        )}
      />
      {label && <p className="text-xs text-[#A1A1AA] tracking-wide animate-pulse">{label}</p>}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0B0B0B]">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Loader;
