/**
 * @file errorConstants.ts
 * @description Defines error constants and their corresponding user-friendly messages for MongoDB connection issues.
 */

export interface ErrorConstant {
  code: string;
  message: string;
}

export const ERROR_CONSTANTS: Record<string, ErrorConstant> = {
  MONGO_INVALID_SCHEME: {
    code: 'MONGO_INVALID_SCHEME',
    message: 'Invalid MongoDB connection string. Please check your database configuration.',
  },
  MONGO_INVALID_URI: {
    code: 'MONGO_INVALID_URI',
    message: 'The MongoDB connection URI is invalid. Please verify your database settings.',
  },
  MONGO_CONNECTION_FAILED: {
    code: 'MONGO_CONNECTION_FAILED',
    message: 'Failed to connect to the MongoDB database. Please check your network connection and database availability.',
  },
  MONGO_AUTHENTICATION_FAILED: {
    code: 'MONGO_AUTHENTICATION_FAILED',
    message: 'MongoDB authentication failed. Please check your database credentials.',
  },
  MONGO_TIMEOUT: {
    code: 'MONGO_TIMEOUT',
    message: 'The connection to MongoDB timed out. Please try again or check your database server.',
  },
  MONGO_WRITE_ACCESS_DENIED: {
    code: 'MONGO_WRITE_ACCESS_DENIED',
    message: 'Unable to write to the database. The database might not exist or you may not have write permissions.',
  },
  MONGO_GENERIC_ERROR: {
    code: 'MONGO_GENERIC_ERROR',
    message: 'An unexpected error occurred while connecting to MongoDB. Please try again later.',
  },
};