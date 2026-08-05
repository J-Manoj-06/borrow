import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Button = ({
  variant = 'primary',
  size = 'md',
  children,
  className,
  disabled = false,
  loading = false,
  fullWidth = false,
  type = 'button',
  onClick,
  icon: Icon,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium transition-colors focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed select-none';

  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5 rounded-lg',
    md: 'px-4 py-2.5 text-sm gap-2 rounded-xl',
    lg: 'px-6 py-3.5 text-base gap-2.5 rounded-xl',
  };

  const variantStyles = {
    // Primary Button: White background, Black text, Rounded XL, Hover slightly darker
    primary: 'bg-white text-black hover:bg-neutral-200 active:bg-neutral-300 font-semibold shadow-sm',
    // Secondary Button: Transparent, White border, White text
    secondary: 'bg-transparent text-white border border-[#2A2A2A] hover:border-neutral-400 hover:bg-[#1A1A1A] active:bg-[#222222]',
    // Danger Button: Dark red
    danger: 'bg-red-950/70 text-red-200 border border-red-800/50 hover:bg-red-900/80 active:bg-red-900',
    // Success Button: Dark green
    success: 'bg-emerald-950/70 text-emerald-200 border border-emerald-800/50 hover:bg-emerald-900/80 active:bg-emerald-900',
  };

  return (
    <motion.button
      whileTap={disabled || loading ? {} : { scale: 0.98 }}
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={cn(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        fullWidth ? 'w-full' : '',
        className
      )}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1" />
      ) : Icon ? (
        <Icon className="w-4 h-4 shrink-0" />
      ) : null}
      {children}
    </motion.button>
  );
};

export default Button;
