import React from 'react';

const DealCardSkeleton = () => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-4">
        <div className="h-6 bg-gray-300 rounded w-3/4 mb-2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2 mb-4"></div>
        <div className="flex justify-between">
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
          <div className="h-8 bg-gray-300 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );
};

export default DealCardSkeleton;