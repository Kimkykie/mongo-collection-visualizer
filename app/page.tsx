'use client';

import React, { useState, useCallback } from 'react';
import { useMongoStore } from './store/mongoStore';
import { useRelationshipStore } from './store/relationshipStore';
import SchemaFlowVisualizer from './components/SchemaFlowVisualizer';
import MongoDBConnectionForm from './components/MongoDBConnectionForm';
import OpenAIButton from './components/OpenAIButton';
import ErrorMessage from './components/ErrorMessage';
import LoadingIndicator from './components/LoadingIndicator';


/**
 * Home component for the MongoDB Schema Visualizer
 * This component manages the state and logic for connecting to MongoDB,
 * fetching relationships, and rendering the schema visualization.
 * @returns {JSX.Element} The rendered Home component
 */
export default function Home(): JSX.Element {
  const {
    mongoURI, databaseName, collections, isConnecting, error: mongoError,
    setMongoURI, setDatabaseInfo, setIsConnecting, setError: setMongoError, reset: resetMongo
  } = useMongoStore();

  const {
    relationships, isFetchingRelationships, error: relationshipError,
    setRelationships, setIsFetchingRelationships, setError: setRelationshipError, reset: resetRelationships
  } = useRelationshipStore();

  /**
   * Handles the connection to MongoDB
   * @param {string} uri - The MongoDB connection URI
   */
  const handleConnect = useCallback(async (uri: string) => {
    setIsConnecting(true);
    setMongoError(null);
    resetMongo();
    resetRelationships();

    try {
      const response = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mongoURI: uri }),
      });

      if (!response.ok) {
        throw new Error('Failed to connect to MongoDB');
      }

      const result = await response.json();
      setDatabaseInfo(result.databaseName, result.collections);
      setMongoURI(uri);
    } catch (err) {
      setMongoError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsConnecting(false);
    }
  }, []);

  /**
   * Fetches relationships between collections using OpenAI
   */
  const handleFetchRelationships = useCallback(async () => {
    if (!collections.length) return;

    setIsFetchingRelationships(true);
    setRelationshipError(null);

    try {
      const response = await fetch('/api/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schemas: collections }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch relationships');
      }

      const result = await response.json();
      setRelationships(result);
    } catch (err) {
      setRelationshipError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsFetchingRelationships(false);
    }
  }, [collections, setIsFetchingRelationships, setRelationshipError, setRelationships]);

  return (
    <>
      <div className="relative w-full h-16 bg-gray-100">
        <h1 className="absolute top-4 left-4 text-2xl font-bold">
          <span className="text-green-600">Mongo</span>
          <span className="text-gray-600">Schema</span>
        </h1>
      </div>

      <div className="container mx-auto px-4 py-4">
        <MongoDBConnectionForm
          onSubmit={handleConnect}
          isLoading={isConnecting}
        />

        {(mongoError || relationshipError) && <ErrorMessage message={mongoError || relationshipError} />}

        {isConnecting && <LoadingIndicator message="Connecting to MongoDB..." />}

        {databaseName && (
          <>
            <h2 className="text-2xl font-semibold mt-4">
              Connected to: {databaseName}
            </h2>

            <OpenAIButton
              onClick={handleFetchRelationships}
              isLoading={isFetchingRelationships}
              isDisabled={!collections.length}
            />

            {isFetchingRelationships && (
              <LoadingIndicator message="Fetching relationships..." />
            )}
          </>
        )}
      </div>
      <div className='w-full'>
        {databaseName && (
          <>
            {collections.length > 0 && (
              <div className="mt-8">
                <SchemaFlowVisualizer />
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}