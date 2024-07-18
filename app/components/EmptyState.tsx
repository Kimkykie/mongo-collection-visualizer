import React from 'react';
import { CircleStackIcon } from '@heroicons/react/24/solid';

interface EmptyStateProps {}

const EmptyState: React.FC<EmptyStateProps> = () => {
  return (
    <div className="text-center">
      <CircleStackIcon className="mx-auto h-12 w-12 text-gray-400" aria-hidden="true" />
      <h3 className="mt-2 text-sm font-semibold text-gray-900">No Collections Fetched</h3>
      <p className="mt-1 text-sm text-gray-500">Connect to a MongoDB database to visualize your schema.</p>
      <div className="mt-6">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
        >
          <CircleStackIcon className="-ml-0.5 mr-1.5 h-5 w-5" aria-hidden="true" />
          Connect to Database
        </button>
      </div>
    </div>
  );
};

export default EmptyState;