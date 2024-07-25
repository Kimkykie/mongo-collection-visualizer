// components/MongoDBConnectionForm.tsx
import React, { useState, FormEvent } from 'react';
import { ComputerDesktopIcon } from '@heroicons/react/20/solid';

interface Props {
  onSubmit: (uri: string) => void;
  isLoading: boolean;
}

const MongoDBConnectionForm: React.FC<Props> = ({ onSubmit, isLoading }) => {
  const [uri, setUri] = useState('');

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(uri);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex items-center">
      <div className="relative flex-grow">
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <ComputerDesktopIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </div>
        <input
          type="text"
          value={uri}
          onChange={(e) => setUri(e.target.value)}
          placeholder="Enter MongoDB URI"
          className="block w-full rounded-l-md border-0 py-2 pl-10 pr-3 text-gray-600 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6"
          required
          disabled={isLoading}
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className={`rounded-r-md px-4 py-2.5 text-sm font-semibold text-white shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 ${
          isLoading
            ? 'bg-green-400 cursor-not-allowed'
            : 'bg-green-600 hover:bg-green-500'
        }`}
      >
        {isLoading ? (
          <div className="flex items-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Connecting...
          </div>
        ) : (
          'Connect'
        )}
      </button>
    </form>
  );
};

export default MongoDBConnectionForm;