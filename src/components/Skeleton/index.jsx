import React from 'react';
import { cn } from '../../utils/cn';

export const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-[#2A2A2A]/60', className)}
      {...props}
    />
  );
};

export const StatSkeleton = () => (
  <div className="bg-[#171717] border border-[#2A2A2A] rounded-xl p-5 flex flex-col justify-between h-32">
    <div className="flex items-center justify-between">
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-5 w-5 rounded-md" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  </div>
);

export const ChartSkeleton = () => (
  <div className="bg-[#171717] border border-[#2A2A2A] rounded-xl p-6 h-80 flex flex-col justify-between">
    <div className="flex items-center justify-between pb-4 border-b border-[#2A2A2A]">
      <div className="space-y-2">
        <Skeleton className="h-5 w-36" />
        <Skeleton className="h-3 w-48" />
      </div>
      <Skeleton className="h-4 w-20" />
    </div>
    <div className="flex items-end gap-3 h-48 pt-4">
      {[40, 65, 30, 85, 55, 70, 45, 90, 60, 75, 50, 80].map((h, i) => (
        <Skeleton key={i} className="flex-1 rounded-t-md" style={{ height: `${h}%` }} />
      ))}
    </div>
  </div>
);

export const TableSkeleton = () => (
  <div className="bg-[#171717] border border-[#2A2A2A] rounded-xl p-6 space-y-4">
    <div className="flex justify-between items-center pb-3 border-b border-[#2A2A2A]">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-16" />
    </div>
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="flex items-center justify-between py-2 border-b border-[#2A2A2A]/40">
          <div className="flex items-center gap-3">
            <Skeleton className="w-8 h-8 rounded-full" />
            <div className="space-y-1">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="h-2.5 w-20" />
            </div>
          </div>
          <Skeleton className="h-6 w-16 rounded-full" />
          <div className="flex gap-2">
            <Skeleton className="h-7 w-16 rounded-lg" />
            <Skeleton className="h-7 w-16 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const ActivitySkeleton = () => (
  <div className="bg-[#171717] border border-[#2A2A2A] rounded-xl p-6 space-y-4">
    <Skeleton className="h-5 w-32 pb-2" />
    <div className="space-y-4 pt-2">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="flex items-start gap-3">
          <Skeleton className="w-3 h-3 rounded-full mt-1.5 shrink-0" />
          <div className="flex-1 space-y-1">
            <Skeleton className="h-3.5 w-3/4" />
            <Skeleton className="h-2.5 w-1/3" />
          </div>
        </div>
      ))}
    </div>
  </div>
);

export const BookCardSkeleton = () => (
  <div className="bg-[#171717] border border-[#2A2A2A] rounded-xl p-4 flex items-center gap-4">
    <Skeleton className="w-14 h-20 rounded-lg shrink-0" />
    <div className="flex-1 space-y-2">
      <Skeleton className="h-4 w-32" />
      <Skeleton className="h-3 w-24" />
      <Skeleton className="h-3 w-16 rounded-full" />
    </div>
  </div>
);

export default Skeleton;
