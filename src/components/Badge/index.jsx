import React from 'react';
import { cn } from '../../utils/cn';

export const Badge = ({
  variant = 'neutral',
  children,
  className,
  size = 'md',
  ...props
}) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-[10px]',
    md: 'px-2.5 py-1 text-xs',
    lg: 'px-3 py-1.5 text-xs font-medium',
  };

  const variantStyles = {
    neutral: 'bg-[#2A2A2A] text-[#A1A1AA] border border-neutral-700/50',
    accent: 'bg-white text-black font-semibold',
    success: 'bg-emerald-950/80 text-[#22C55E] border border-emerald-800/60',
    danger: 'bg-red-950/80 text-[#EF4444] border border-red-800/60',
    warning: 'bg-amber-950/80 text-[#F59E0B] border border-amber-800/60',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full tracking-wide select-none',
        sizeStyles[size],
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
