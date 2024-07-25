'use client';

import React, { useState } from 'react';
import { useMongoStore } from './store/mongoStore';
import { useRelationshipStore } from './store/relationshipStore';
import SchemaFlowVisualizer from './components/SchemaFlowVisualizer';
import ErrorMessage from './components/ErrorMessage';
import SuccessMessage from './components/SuccessMessage';
import LoadingIndicator from './components/LoadingIndicator';
import Navbar from './components/Navbar/Navbar';
import EmptyState from './components/EmptyState';
import { useModal } from './hooks/useModal';
import Modal from './components/Modal';
import MongoDBConnectionForm from './components/MongoDBConnectionForm';
import { CircleStackIcon } from '@heroicons/react/24/outline';
import { AnimatePresence } from 'framer-motion';

/**
 * Home component for the MongoDB Schema Visualizer application.
 * This component manages the main application state and renders the primary UI.
 *
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

  const { isOpen, openModal, closeModal } = useModal();
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  /**
   * Closes the connection modal and resets the state.
   */
  const closeConnectionModal = () => {
    closeModal();
    setMongoError(null);
    setIsConnecting(false);
  }

  const handleNewConnection = () => {
    // Clear previous connection data
    setSuccessMessage(null);
    openModal();
  }

  /**
   * Handles the connection to a MongoDB database.
   *
   * @param {string} uri - The MongoDB connection URI
   * @returns {Promise<void>}
   */
  const handleConnect = async (uri: string): Promise<void> => {
    setIsConnecting(true);
    setMongoError(null);
    setSuccessMessage(null);
    resetMongo();
    resetRelationships();

    try {
      const response = await fetch('/api/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mongoURI: uri }),
      });

      const result = await response.json();

      if (!response.ok) {
        setMongoError(result.error.message || 'Failed to connect to MongoDB');
        return;
      }
      setDatabaseInfo(result.databaseName, result.collections);
      setMongoURI(uri);
      closeConnectionModal();
      setSuccessMessage(`Successfully connected to database: ${result.databaseName}`);
    } catch (err) {
      setMongoError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setIsConnecting(false);
    }
  };

  /**
   * Fetches relationships between collections in the connected database.
   *
   * @returns {Promise<void>}
   */
  const handleFetchRelationships = async (): Promise<void> => {
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

  /**
   * Renders the main content of the application based on the current state.
   *
   * @returns {JSX.Element | null} The rendered content
   */
  const renderContent = (): JSX.Element | null => {
    if (isConnecting) {
      return <LoadingIndicator message="Connecting to MongoDB..." />;
    }

    if (isFetchingRelationships) {
      return <LoadingIndicator message="Fetching relationships..." />;
    }

    if (collections.length === 0) {
      return (
        <div className="flex-grow flex items-center justify-center">
          <EmptyState onConnect={openModal} />
        </div>
      );
    }

    if (databaseName && collections.length > 0) {
      return <SchemaFlowVisualizer />;
    }

    return null;
  };

  return (
    <div className="flex flex-col min-h-screen">
       <Navbar
        databaseName={databaseName}
        onFetchRelationships={handleFetchRelationships}
        onNewConnection={handleNewConnection}
        isFetchingRelationships={isFetchingRelationships}
        isRelationshipsDisabled={!collections.length}
      />

      <main className="flex-grow flex flex-col mx-auto px-2 py-4 w-full">
      <AnimatePresence>
        {successMessage && (
          <div className='w-1/3 mx-auto'>
            <SuccessMessage
              message={successMessage}
              onDismiss={() => setSuccessMessage(null)}
              duration={5000}
            />
          </div>
        )}
      </AnimatePresence>
        {renderContent()}
      </main>

      <Modal isOpen={isOpen} onClose={closeConnectionModal} title="">
        <div className="space-y-6">
          <div className="text-center">
            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
              <CircleStackIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
            </div>
            <h2 className="mt-3 text-lg font-medium text-gray-900">Connect to Your MongoDB Database</h2>
            <p className="mt-2 text-sm text-gray-500">
              Enter your MongoDB connection details below. You can use a standard MongoDB URI or connect to a specific database.
            </p>
          </div>

          {mongoError && (
            <ErrorMessage
              onDismiss={() => setMongoError(null)}
              message={mongoError}
            />
          )}

          <div className="mt-5">
            <MongoDBConnectionForm onSubmit={handleConnect} isLoading={isConnecting} />
          </div>

          <div className="px-4 py-3 bg-gray-100 sm:px-6 sm:rounded-lg">
            <div className="text-sm">
              <h4 className="font-medium text-gray-900">Need help?</h4>
              <ul className="mt-2 list-disc list-inside text-gray-500 space-y-1">
                <li>Make sure your MongoDB server is running and accessible.</li>
                <li>Double-check your connection string for any typos.</li>
                <li>Ensure your IP address is whitelisted if using Atlas or a remote server.</li>
              </ul>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}