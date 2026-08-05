import React from 'react';
import { cn } from '../../utils/cn';

export const SectionHeader = ({
  title,
  subtitle,
  children,
  badge,
  className,
}) => {
  return (
    <div className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b border-[#2A2A2A]', className)}>
      <div className="flex flex-col gap-1">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
          {badge && <div>{badge}</div>}
        </div>
        {subtitle && <p className="text-sm text-[#A1A1AA] font-normal">{subtitle}</p>}
      </div>
      {children && <div className="flex items-center gap-3 shrink-0">{children}</div>}
    </div>
  );
};

export default SectionHeader;
