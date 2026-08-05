import React from 'react';
import { FiSearch, FiX } from 'react-icons/fi';
import { cn } from '../../utils/cn';

export const SearchInput = ({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  className,
  containerClassName,
  ...props
}) => {
  return (
    <div className={cn('relative flex items-center w-full max-w-md', containerClassName)}>
      <div className="absolute left-3.5 text-[#A1A1AA] pointer-events-none">
        <FiSearch className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={cn(
          'w-full bg-[#171717] text-white text-sm rounded-xl border border-[#2A2A2A] pl-10 pr-9 py-2 outline-none transition-all placeholder:text-[#52525B]',
          'focus:border-white focus:ring-1 focus:ring-white/20',
          className
        )}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 text-[#A1A1AA] hover:text-white transition-colors"
        >
          <FiX className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default SearchInput;
