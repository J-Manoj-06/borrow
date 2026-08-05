import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Card = ({
  children,
  className,
  hoverable = false,
  onClick,
  animate = true,
  ...props
}) => {
  const Component = animate ? motion.div : 'div';
  const animationProps = animate
    ? {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.25, ease: 'easeOut' },
      }
    : {};

  return (
    <Component
      onClick={onClick}
      className={cn(
        'bg-[#171717] border border-[#2A2A2A] rounded-xl p-5 text-white shadow-none transition-colors duration-150',
        hoverable ? 'hover:bg-[#1E1E1E] cursor-pointer' : '',
        className
      )}
      {...animationProps}
      {...props}
    >
      {children}
    </Component>
  );
};

export const CardHeader = ({ children, className }) => (
  <div className={cn('flex flex-col gap-1 pb-4 mb-4 border-b border-[#2A2A2A]', className)}>
    {children}
  </div>
);

export const CardTitle = ({ children, className }) => (
  <h3 className={cn('text-base font-semibold text-white tracking-tight', className)}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className }) => (
  <p className={cn('text-xs text-[#A1A1AA]', className)}>
    {children}
  </p>
);

export const CardContent = ({ children, className }) => (
  <div className={cn('', className)}>{children}</div>
);

export const CardFooter = ({ children, className }) => (
  <div className={cn('pt-4 mt-4 border-t border-[#2A2A2A] flex items-center justify-between', className)}>
    {children}
  </div>
);

export default Card;
