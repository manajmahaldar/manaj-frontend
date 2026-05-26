import React from 'react';

export const CardSkeleton = () => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
    <div className="w-full h-48 bg-gray-200"></div>
    <div className="p-4">
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
      <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
      </div>
    </div>
  </div>
);

export const PostSkeleton = () => (
  <div className="bg-white p-4 rounded-lg shadow-md animate-pulse mb-4">
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 bg-gray-200 rounded-full mr-4"></div>
      <div>
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-3 bg-gray-200 rounded w-16"></div>
      </div>
    </div>
    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-5/6 mb-4"></div>
    <div className="w-full h-64 bg-gray-200 rounded"></div>
  </div>
);

export const ProfileSkeleton = () => (
  <div className="max-w-4xl mx-auto p-4 animate-pulse">
    <div className="flex items-center gap-6 mb-8">
      <div className="w-24 h-24 bg-gray-200 rounded-full"></div>
      <div className="flex-1">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/5"></div>
      </div>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
      <div className="h-10 bg-gray-200 rounded w-full"></div>
    </div>
    <div className="mt-8">
      <div className="h-10 bg-gray-200 rounded w-32"></div>
    </div>
  </div>
);

export const PageLoaderSkeleton = () => (
  <div className="flex items-center justify-center min-h-screen bg-gray-50">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      <div className="h-4 bg-gray-200 rounded w-24 animate-pulse"></div>
    </div>
  </div>
);
