import React, { useEffect, useState } from 'react';
import { useSpring, useTransform } from 'framer-motion';
import Card from '../Card';
import { cn } from '../../utils/cn';
import { FiArrowUpRight } from 'react-icons/fi';

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
  indicatorColor, // 'green' | 'orange' | 'red' | null
  className,
  onClick,
}) => {
  return (
    <Card
      hoverable
      onClick={onClick}
      className={cn(
        'flex flex-col justify-between p-5 relative overflow-hidden transition-all duration-200 group',
        onClick && 'cursor-pointer hover:border-neutral-400 hover:bg-[#1A1A1A] active:scale-[0.99]',
        className
      )}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {indicatorColor === 'green' && (
            <span className="w-2 h-2 rounded-full bg-[#22C55E] animate-pulse" />
          )}
          {indicatorColor === 'orange' && (
            <span className="w-2 h-2 rounded-full bg-[#F59E0B] animate-pulse" />
          )}
          {indicatorColor === 'red' && (
            <span className="w-2 h-2 rounded-full bg-[#EF4444] animate-pulse" />
          )}
          <span className="text-xs font-semibold text-[#A1A1AA] uppercase tracking-wider group-hover:text-white transition-colors">
            {title}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {onClick && (
            <FiArrowUpRight className="w-3.5 h-3.5 text-[#A1A1AA] opacity-0 group-hover:opacity-100 group-hover:text-white transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
          {Icon && (
            <div className="p-2 rounded-lg bg-[#1E1E1E] text-[#A1A1AA] border border-[#2A2A2A] group-hover:border-neutral-500 group-hover:text-white transition-colors">
              <Icon className="w-4 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Main Stat Value & Description */}
      <div className="mt-4">
        <div className="text-3xl font-extrabold text-white tracking-tight flex items-baseline gap-1">
          <AnimatedNumber value={value} />
        </div>
        {description && (
          <p className="text-xs text-[#A1A1AA] mt-1 font-normal group-hover:text-[#D4D4D8] transition-colors">
            {description}
          </p>
        )}
      </div>
    </Card>
  );
};

export default StatCard;
