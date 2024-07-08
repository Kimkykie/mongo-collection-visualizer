'use client';

import React, { useState, useCallback } from 'react';
import { Collection } from './flow-container/types/collections';
import { Relationship } from './flow-container/types/relationships';
import SchemaFlowVisualizer from './components/SchemaFlowVisualizer';
import MongoDBConnectionForm from './components/MongoDBConnectionForm';
import OpenAIButton from './components/OpenAIButton';
import ErrorMessage from './components/ErrorMessage';
import LoadingIndicator from './components/LoadingIndicator';

/**
 * Represents the structure of the data returned from the MongoDB connection
 */
interface Data {
  databaseName: string;
  collections: Collection[];
}

/**
 * Home component for the MongoDB Schema Visualizer
 * This component manages the state and logic for connecting to MongoDB,
 * fetching relationships, and rendering the schema visualization.
 * @returns {JSX.Element} The rendered Home component
 */
export default function Home(): JSX.Element {
  const [mongoURI, setMongoURI] = useState<string>('');
  const [data, setData] = useState<Data | null>(null);
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [isConnecting, setIsConnecting] = useState<boolean>(false);
  const [isFetchingRelationships, setIsFetchingRelationships] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * Handles the connection to MongoDB
   * @param {string} uri - The MongoDB connection URI
   */
  const handleConnect = useCallback(async (uri: string) => {
    setIsConnecting(true);
    setError(null);
    setData(null);
    setRelationships([]);

    try {
      const response = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mongoURI: uri }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to MongoDB');
      }

      const result: Data = await response.json();
      setData(result);
      setMongoURI(uri);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  /**
   * Fetches relationships between collections using OpenAI
   */
  const handleFetchRelationships = useCallback(async () => {
    if (!data?.collections.length) return;

    setIsFetchingRelationships(true);
    setError(null);

    try {
      const response = await fetch('/api/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schemas: data.collections }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch relationships');
      }

      const result: Relationship[] = await response.json();
      setRelationships(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsFetchingRelationships(false);
    }
  }, [data?.collections]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">MongoDB Schema Visualizer</h1>

      <MongoDBConnectionForm
        onSubmit={handleConnect}
        isLoading={isConnecting}
      />

      {error && <ErrorMessage message={error} />}

      {isConnecting && <LoadingIndicator message="Connecting to MongoDB..." />}

      {data && (
        <>
          <h2 className="text-2xl font-semibold mt-8 mb-4">
            Connected to: {data.databaseName}
          </h2>

          <OpenAIButton
            onClick={handleFetchRelationships}
            isLoading={isFetchingRelationships}
            isDisabled={!data.collections.length}
          />

          {isFetchingRelationships && (
            <LoadingIndicator message="Fetching relationships..." />
          )}

          {data.collections.length > 0 && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">
                Collections and Relationships
              </h3>
              <SchemaFlowVisualizer
                collections={data.collections}
                relationships={relationships}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}