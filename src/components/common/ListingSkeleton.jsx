import React from 'react';

const ListingSkeleton = () => {
  return (
    <div className="card animate-pulse overflow-hidden">
      <div className="w-full aspect-[4/3] bg-surface-2 shimmer-bg" />
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-start">
          <div className="h-4 bg-surface-2 rounded-md w-2/3 shimmer-bg" />
          <div className="h-4 bg-surface-2 rounded-md w-1/4 shimmer-bg" />
        </div>
        <div className="h-3 bg-surface-2 rounded-md w-1/2 shimmer-bg" />
        <div className="pt-2 flex gap-2">
          <div className="h-9 bg-surface-2 rounded-lg flex-1 shimmer-bg" />
          <div className="h-9 bg-surface-2 rounded-lg flex-1 shimmer-bg" />
        </div>
      </div>
    </div>
  );
};

export default ListingSkeleton;
