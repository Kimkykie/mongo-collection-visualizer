'use client';

import React from 'react';
import { useMongoStore } from './store/mongoStore';
import { useRelationshipStore } from './store/relationshipStore';
import SchemaFlowVisualizer from './components/SchemaFlowVisualizer';
import ErrorMessage from './components/ErrorMessage';
import LoadingIndicator from './components/LoadingIndicator';
import Navbar from './components/Navbar/Navbar';

export default function Home(): JSX.Element {
  const {
    mongoURI, databaseName, collections, isConnecting, error: mongoError,
    setMongoURI, setDatabaseInfo, setIsConnecting, setError: setMongoError, reset: resetMongo
  } = useMongoStore();

  const {
    relationships, isFetchingRelationships, error: relationshipError,
    setRelationships, setIsFetchingRelationships, setError: setRelationshipError, reset: resetRelationships
  } = useRelationshipStore();

  const handleConnect = async (uri: string) => {
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
  };

  const handleFetchRelationships = async () => {
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
  };

  return (
    <>
      <Navbar
        onSubmit={handleConnect}
        isLoading={isConnecting}
        onFetchRelationships={handleFetchRelationships}
        isFetchingRelationships={isFetchingRelationships}
        isRelationshipsDisabled={!collections.length}
      />

      <main className="mx-auto px-2 py-4 w-full">
        {(mongoError || relationshipError) && <ErrorMessage message={mongoError || relationshipError} />}

        {isConnecting && <LoadingIndicator message="Connecting to MongoDB..." />}

        {databaseName && (
          <div className="text-center mb-4">
            <h2 className="text-2xl font-semibold">
              Connected to: <span className="text-green-600">{databaseName}</span>
            </h2>
          </div>
        )}

        {isFetchingRelationships && (
          <LoadingIndicator message="Fetching relationships..." />
        )}

        {databaseName && collections.length > 0 && (
          <div className="mt-8">
            <SchemaFlowVisualizer />
          </div>
        )}
      </main>
    </>
  );
}