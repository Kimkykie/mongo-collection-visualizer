// components/MongoDBConnectionForm.tsx
import React, { useState, FormEvent } from 'react';

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
    <form onSubmit={handleSubmit} className="flex items-center space-x-2">
      <input
        type="text"
        value={uri}
        onChange={(e) => setUri(e.target.value)}
        placeholder="Enter MongoDB URI"
        className="flex-grow rounded-l-md border-0 py-1.5 pl-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        required
      />
      <button
        type="submit"
        disabled={isLoading}
        className="rounded-r-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-50"
      >
        Connect
      </button>
    </form>
  );
};

export default MongoDBConnectionForm;