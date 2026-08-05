import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export const Input = forwardRef(({
  label,
  error,
  helperText,
  icon: Icon,
  rightElement,
  className,
  containerClassName,
  id,
  type = 'text',
  ...props
}, ref) => {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={cn('w-full flex flex-col gap-1.5', containerClassName)}>
      {label && (
        <label 
          htmlFor={inputId} 
          className="text-xs font-medium text-[#A1A1AA] tracking-wide"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-[#A1A1AA] pointer-events-none">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'w-full bg-[#171717] text-white text-sm rounded-xl border border-[#2A2A2A] px-3.5 py-2.5 outline-none transition-all placeholder:text-[#52525B]',
            'focus:border-white focus:ring-1 focus:ring-white/20',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            Icon ? 'pl-10' : '',
            rightElement ? 'pr-10' : '',
            error ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20' : '',
            className
          )}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-3 text-[#A1A1AA]">
            {rightElement}
          </div>
        )}
      </div>
      {error ? (
        <p className="text-xs text-[#EF4444] mt-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[#A1A1AA] mt-0.5">{helperText}</p>
      ) : null}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
