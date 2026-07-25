import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="card bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col h-full animate-pulse">
            <div className="relative aspect-video w-full bg-gray-200" />
            <div className="p-5 flex-1 flex flex-col space-y-3">
                <div className="flex items-center gap-2">
                    <div className="w-16 h-3 bg-gray-200 rounded" />
                    <div className="w-8 h-3 bg-gray-200 rounded" />
                </div>
                <div className="w-full h-5 bg-gray-200 rounded" />
                <div className="w-3/4 h-5 bg-gray-200 rounded" />
                <div className="space-y-1 pt-2 flex-1">
                    <div className="w-full h-3 bg-gray-100 rounded" />
                    <div className="w-full h-3 bg-gray-100 rounded" />
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
                    <div className="flex gap-2">
                        <div className="w-10 h-3 bg-gray-200 rounded" />
                        <div className="w-10 h-3 bg-gray-200 rounded" />
                    </div>
                    <div className="w-8 h-8 bg-gray-200 rounded-xl" />
                </div>
            </div>
        </div>
    );
};

export default SkeletonCard;
