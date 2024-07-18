'use client';

import React from 'react';
import { useMongoStore } from './store/mongoStore';
import { useRelationshipStore } from './store/relationshipStore';
import SchemaFlowVisualizer from './components/SchemaFlowVisualizer';
import ErrorMessage from './components/ErrorMessage';
import LoadingIndicator from './components/LoadingIndicator';
import Navbar from './components/Navbar/Navbar';
import EmptyState from './components/EmptyState';

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

  const renderContent = () => {
    if (isConnecting) {
      return <LoadingIndicator message="Connecting to MongoDB..." />;
    }

    if (isFetchingRelationships) {
      return <LoadingIndicator message="Fetching relationships..." />;
    }

    if (collections.length === 0) {
      return (
        <div className="flex-grow flex items-center justify-center">
          <EmptyState />
        </div>
      );
    }

    if (databaseName && collections.length > 0) {
      return (
        <>
          <div className="text-center">
            <h2 className="text-2xl font-semibold">
              Connected to: <span className="text-green-600">{databaseName}</span>
            </h2>
          </div>
          <div>
            <SchemaFlowVisualizer />
          </div>
        </>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar
        onSubmit={handleConnect}
        isLoading={isConnecting}
        onFetchRelationships={handleFetchRelationships}
        isFetchingRelationships={isFetchingRelationships}
        isRelationshipsDisabled={!collections.length}
      />

      <main className="flex-grow flex flex-col mx-auto px-2 py-4 w-full">
        {(mongoError || relationshipError) && <ErrorMessage message={mongoError || relationshipError} />}
        {renderContent()}
      </main>
    </div>
  );
}