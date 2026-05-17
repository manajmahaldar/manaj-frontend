import React from 'react';

const ListingSkeleton = () => {
    return (
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-100 animate-pulse h-full">
            {/* Image Placeholder */}
            <div className="aspect-[4/3] bg-gray-200" />
            
            <div className="p-5 space-y-4">
                {/* Title and Badge */}
                <div className="flex justify-between items-start">
                    <div className="h-6 bg-gray-200 rounded-lg w-2/3" />
                    <div className="h-5 bg-gray-200 rounded-full w-12" />
                </div>
                
                {/* Details */}
                <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                </div>
                
                {/* Price */}
                <div className="pt-2">
                    <div className="h-8 bg-gray-200 rounded-xl w-1/2" />
                </div>
                
                {/* Buttons */}
                <div className="pt-4 grid grid-cols-2 gap-3">
                    <div className="h-12 bg-gray-200 rounded-xl" />
                    <div className="h-12 bg-gray-200 rounded-xl" />
                </div>
            </div>
        </div>
    );
};

export default ListingSkeleton;
