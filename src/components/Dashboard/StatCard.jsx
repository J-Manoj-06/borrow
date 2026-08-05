import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import Card from '../Card';
import { cn } from '../../utils/cn';

function AnimatedNumber({ value }) {
  const spring = useSpring(0, { stiffness: 60, damping: 15 });
  const display = useTransform(spring, (current) => Math.round(current));
  const [currentValue, setCurrentValue] = useState(0);

  useEffect(() => {
    spring.set(value || 0);
  }, [value, spring]);

  useEffect(() => {
    return display.on('change', (latest) => {
      setCurrentValue(latest);
    });
  }, [display]);

  return <span>{currentValue}</span>;
}

export const StatCard = ({
  title,
  value = 0,
  icon: Icon,
  description,
  indicatorColor, // 'green' | 'orange' | null
  className,
}) => {
  return (
    <Card hoverable className={cn('flex flex-col justify-between p-5 relative overflow-hidden', className)}>
      {/* Indicator Pill if applicable */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {indicatorColor === 'green' && (
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          )}
          {indicatorColor === 'orange' && (
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
          )}
          <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider">
            {title}
          </span>
        </div>
        {Icon && (
          <div className="p-2 rounded-lg bg-[#1E1E1E] text-[#A1A1AA] border border-[#2A2A2A]">
            <Icon className="w-4 h-4" />
          </div>
        )}
      </div>

      <div className="mt-4">
        <div className="text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-1">
          <AnimatedNumber value={value} />
        </div>
        {description && (
          <p className="text-xs text-[#A1A1AA] mt-1 font-normal">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
