// app/api/connect/lib/databaseConnection.ts

import mongoose from 'mongoose';

/** Cached database connection */
let connection: mongoose.Connection | null = null;

/**
 * Connects to the MongoDB database, reusing the connection if it exists.
 * @param mongoURI - The URI of the MongoDB database.
 * @returns A Promise resolving to the mongoose Connection object.
 */
export async function connectToDatabase(mongoURI: string): Promise<mongoose.Connection> {
  if (connection) {
    return connection;
  }

  try {
    await mongoose.connect(mongoURI);

    connection = mongoose.connection;

    // Set up event listeners for the connection
    connection.on('error', (error) => {
      console.error('MongoDB connection error:', error);
    });
    connection.once('open', () => {
      console.log('Connected to MongoDB');
    });

    return connection;
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw error;
  }
}

/**
 * Disconnects from the MongoDB database if a connection exists.
 */
export async function disconnectFromDatabase(): Promise<void> {
  if (connection) {
    try {
      await mongoose.disconnect();
      connection = null;
      console.log('Disconnected from MongoDB');
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error);
      throw error;
    }
  }
}