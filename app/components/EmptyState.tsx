import React from 'react';
import { CircleStackIcon } from '@heroicons/react/24/solid';

interface EmptyStateProps {
  onConnect: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onConnect }) => {
  return (
    <div className="max-w-md mx-auto">
      <div className="text-center bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl">
        <div className="p-6 space-y-6">
          <div className="flex justify-center">
            <div className="rounded-full bg-gray-100 p-3">
              <CircleStackIcon className="h-12 w-12 text-gray-400" aria-hidden="true" />
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-900">No Collections Fetched</h3>
            <p className="text-sm text-gray-500">
              Connect to a MongoDB database to visualize your schema and start exploring your data structure.
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={onConnect}
              className="inline-flex items-center justify-center w-full rounded-md bg-green-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 transition-colors duration-200"
            >
              <CircleStackIcon className="-ml-0.5 mr-2 h-5 w-5" aria-hidden="true" />
              Connect to Database
            </button>
          </div>
        </div>
        <div className="px-6 py-3 bg-gray-50 text-xs text-gray-500">
          Tip: Make sure your MongoDB server is running and accessible before connecting.
        </div>
      </div>
    </div>
  );
};

export default EmptyState;