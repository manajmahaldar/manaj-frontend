import React from 'react';

export const CardSkeleton = () => (
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

export const PostSkeleton = () => (
  <div className="card p-4 animate-pulse space-y-4">
    <div className="w-full aspect-[4/3] bg-surface-2 rounded-lg shimmer-bg" />
    <div className="space-y-2">
      <div className="h-4 bg-surface-2 rounded-md w-3/4 shimmer-bg" />
      <div className="h-8 bg-surface-2 rounded-lg w-full shimmer-bg" />
      <div className="h-4 bg-surface-2 rounded-md w-1/2 shimmer-bg" />
    </div>
    <div className="pt-2 border-t border-border flex gap-2">
      <div className="h-9 bg-surface-2 rounded-lg flex-1 shimmer-bg" />
      <div className="h-9 bg-surface-2 rounded-lg flex-1 shimmer-bg" />
    </div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto p-6 animate-pulse space-y-8">
    <div className="flex items-center gap-6">
      <div className="w-20 h-20 bg-surface-2 rounded-full shimmer-bg" />
      <div className="flex-1 space-y-2">
        <div className="h-6 bg-surface-2 rounded-md w-1/3 shimmer-bg" />
        <div className="h-4 bg-surface-2 rounded-md w-1/4 shimmer-bg" />
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="h-12 bg-surface-2 rounded-lg shimmer-bg" />
      <div className="h-12 bg-surface-2 rounded-lg shimmer-bg" />
      <div className="h-12 bg-surface-2 rounded-lg shimmer-bg" />
      <div className="h-12 bg-surface-2 rounded-lg shimmer-bg" />
    </div>
  </div>
);

export const PageLoaderSkeleton = () => (
  <div className="flex items-center justify-center min-h-screen bg-surface-1">
    <div className="flex flex-col items-center gap-3">
      <div className="w-10 h-10 border-3 border-primary border-t-transparent rounded-full animate-spin" />
      <div className="h-4 bg-surface-2 rounded-md w-24 animate-pulse shimmer-bg" />
    </div>
  </div>
);
