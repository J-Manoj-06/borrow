import React from 'react';
import { Skeleton } from '../Skeleton';

export const InventorySkeleton = ({ viewMode = 'grid' }) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-[#171717] border border-[#2A2A2A] rounded-xl p-4 space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-[#2A2A2A]/40">
            <div className="flex items-center gap-3">
              <Skeleton className="w-10 h-14 rounded-md" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3 w-28" />
              </div>
            </div>
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
        <div key={i} className="bg-[#171717] border border-[#2A2A2A] rounded-xl p-5 h-80 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-3">
            <Skeleton className="h-4 w-20 rounded-full" />
            <Skeleton className="h-4 w-16 rounded-full" />
          </div>
          <Skeleton className="w-full h-40 rounded-xl mb-4" />
          <div className="space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
          <div className="pt-3 border-t border-[#2A2A2A] flex justify-between">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default InventorySkeleton;
