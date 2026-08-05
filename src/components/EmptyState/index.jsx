import React from 'react';
import { FiInbox } from 'react-icons/fi';
import { cn } from '../../utils/cn';

export const EmptyState = ({
  icon: Icon = FiInbox,
  title = 'No data available',
  description = 'There are no records to display at this time.',
  action,
  className,
}) => {
  return (
    <div className={cn('flex flex-col items-center justify-center p-8 text-center bg-[#171717] border border-[#2A2A2A] rounded-xl my-4', className)}>
      <div className="w-12 h-12 rounded-full bg-[#1E1E1E] border border-[#2A2A2A] flex items-center justify-center text-[#A1A1AA] mb-4">
        <Icon className="w-6 h-6" />
      </div>
      <h4 className="text-base font-semibold text-white tracking-tight">{title}</h4>
      <p className="text-xs text-[#A1A1AA] max-w-sm mt-1 mb-5">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;
