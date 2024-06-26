'use client';

import { useState } from 'react';

export default function Home() {
  const [mongoURI, setMongoURI] = useState('');
  const [data, setData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await fetch('/api/connect', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ mongoURI })
    });
    const result = await response.json();
    setData(result);
  };

  return (
    <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
      <h1 className='mt-4 text-4xl mb-4 font-bold'>MongoDB Connection</h1>
      <div>
        <label htmlFor="mongoURI" className="block text-sm font-medium text-gray-700 mr-2">
          MongoDB URI
        </label>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="flex-grow">
            <div className='flex flex-grow items-center'>
              <input
                type="text"
                id="mongoURI"
                className="flex-grow block rounded-l-md border-0 py-1.5 pl-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={mongoURI}
                onChange={(e) => setMongoURI(e.target.value)}
                placeholder="Enter MongoDB URI"
              />
            </div>

          </div>
          <button
            className="rounded-r-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            type="submit"
          >
            Connect
          </button>
        </form>
      </div>


      {data && (
        <div>
          <h2>Collections and Relationships</h2>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
