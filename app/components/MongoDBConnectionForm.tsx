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
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="rounded-r-md bg-green-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-green-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600 disabled:opacity-50"
      >
        Connect
      </button>
    </form>
  );
};

export default MongoDBConnectionForm;