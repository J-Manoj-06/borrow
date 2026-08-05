import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../utils/cn';

export const Dropdown = ({
  trigger,
  items = [],
  align = 'right',
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignmentStyles = {
    left: 'left-0 origin-top-left',
    right: 'right-0 origin-top-right',
  };

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -5 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -5 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={cn(
              'absolute z-50 mt-2 w-48 rounded-xl bg-[#171717] border border-[#2A2A2A] shadow-xl py-1 text-sm text-white overflow-hidden',
              alignmentStyles[align],
              className
            )}
          >
            {items.map((item, index) => {
              if (item.divider) {
                return <div key={index} className="my-1 border-t border-[#2A2A2A]" />;
              }

              const Icon = item.icon;
              return (
                <button
                  key={index}
                  onClick={() => {
                    if (item.onClick) item.onClick();
                    setIsOpen(false);
                  }}
                  disabled={item.disabled}
                  className={cn(
                    'w-full text-left px-3.5 py-2 flex items-center gap-2.5 transition-colors text-xs font-medium',
                    item.danger
                      ? 'text-[#EF4444] hover:bg-red-950/40'
                      : 'text-white hover:bg-[#1E1E1E]',
                    item.disabled ? 'opacity-50 cursor-not-allowed' : ''
                  )}
                >
                  {Icon && <Icon className="w-4 h-4 shrink-0 text-[#A1A1AA]" />}
                  <span>{item.label}</span>
                </button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dropdown;
