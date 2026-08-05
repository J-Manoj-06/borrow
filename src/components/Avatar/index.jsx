import React, { useState } from 'react';
import { FiUser } from 'react-icons/fi';
import { cn } from '../../utils/cn';

export const Avatar = ({
  src,
  alt = 'User Avatar',
  name,
  size = 'md',
  className,
}) => {
  const [imageError, setImageError] = useState(false);

  const sizeStyles = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
  };

  const getInitials = (str) => {
    if (!str) return '';
    const parts = str.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return str.substring(0, 2).toUpperCase();
  };

  const initials = getInitials(name);

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-[#1E1E1E] text-white border border-[#2A2A2A] overflow-hidden select-none shrink-0 font-medium',
        sizeStyles[size],
        className
      )}
    >
      {src && !imageError ? (
        <img
          src={src}
          alt={alt}
          onError={() => setImageError(true)}
          className="w-full h-full object-cover rounded-full"
        />
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <FiUser className="w-1/2 h-1/2 text-[#A1A1AA]" />
      )}
    </div>
  );
};

export default Avatar;
