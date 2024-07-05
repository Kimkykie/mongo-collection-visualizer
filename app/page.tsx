'use client';

import React, { useState, FormEvent } from 'react';
import { Data } from './flow-container/types';
import SchemaFlowVisualizer from './flow-container/index';

/**
 * Home component for managing MongoDB connection and visualizing schema relationships.
 * @component
 */
export default function Home() {
  const [mongoURI, setMongoURI] = useState<string>('');
  const [data, setData] = useState<Data | null>(null);
  const [relationships, setRelationships] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles form submission to connect to MongoDB.
   * @param {FormEvent<HTMLFormElement>} e - Form event.
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ mongoURI })
      });
      if (!response.ok) {
        throw new Error('Failed to connect to MongoDB');
      }
      const result: Data = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Fetches relationship data based on the provided collections.
   * @param {any[]} collections - The collections to analyze.
   */
  const fetchRelationships = async (collections: any[]) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/relationships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ schemas: collections })
      });
      if (!response.ok) {
        throw new Error('Failed to fetch relationships');
      }
      const result = await response.json();
      const responseData = JSON.parse(result);
      setRelationships(responseData?.relationships);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Sends schema data to OpenAI to fetch relationships.
   */
  const handleSendToOpenAI = async () => {
    if (data?.collections) {
      fetchRelationships(data.collections);
    }
  };

  return (
    <div className="mx-auto sm:px-6 lg:px-8">
      <h1 className="mt-4 text-4xl mb-4 font-bold">MongoDB Connection</h1>
      <div>
        <label htmlFor="mongoURI" className="block text-sm font-medium text-gray-700 mr-2">
          MongoDB URI
        </label>
        <form onSubmit={handleSubmit} className="flex items-center space-x-2">
          <div className="flex-grow">
            <div className="flex flex-grow items-center">
              <input
                type="text"
                id="mongoURI"
                className="flex-grow block rounded-l-md border-0 py-1.5 pl-2 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                value={mongoURI}
                onChange={(e) => setMongoURI(e.target.value)}
                placeholder="Enter MongoDB URI"
                required
              />
            </div>
          </div>
          <button
            className="rounded-r-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            type="submit"
            disabled={loading}
          >
            Connect
          </button>
        </form>
      </div>

      {error && <div className="text-red-600 mt-2">{error}</div>}
      {loading && <div className="mt-2">Loading...</div>}

      <div className="mt-4">
        <button
          className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          onClick={handleSendToOpenAI}
          disabled={loading}
        >
          Send to OpenAI
        </button>
      </div>

      {data && (
        <div>
          <h2>Collections and Relationships</h2>
          <SchemaFlowVisualizer collections={data.collections} relationships={relationships} />
        </div>
      )}
    </div>
  );
}
