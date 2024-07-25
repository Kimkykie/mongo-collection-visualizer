/**
 * @file errorHandler.ts
 * @description Provides utility functions for handling MongoDB connection errors.
 */

import { ERROR_CONSTANTS, ErrorConstant } from '../constants/errorConstants';

interface ErrorResponse {
  code: string;
  message: string;
  details?: string;
}

/**
 * Processes a MongoDB connection error and returns a user-friendly error response.
 * @param {Error} error - The error object to process.
 * @returns {ErrorResponse} The processed error response.
 */
export function processMongoDBError(error: Error): ErrorResponse {
  const errorMessage = error.message.toLowerCase();
  console.log('***************************')
  console.log(errorMessage)
  console.log('************************)')

  if (errorMessage.includes('invalid scheme') || errorMessage.includes('invalid connection string')) {
    return createErrorResponse(ERROR_CONSTANTS.MONGO_INVALID_SCHEME);
  }

  if (errorMessage.includes('invalid uri')) {
    return createErrorResponse(ERROR_CONSTANTS.MONGO_INVALID_URI);
  }

  if (errorMessage.includes('connect econnrefused') || errorMessage.includes('failed to connect')) {
    return createErrorResponse(ERROR_CONSTANTS.MONGO_CONNECTION_FAILED);
  }

  if (errorMessage.includes('authentication failed') || errorMessage.includes('auth failed')) {
    return createErrorResponse(ERROR_CONSTANTS.MONGO_AUTHENTICATION_FAILED);
  }

  if (errorMessage.includes('unable to write to database')) {
    return createErrorResponse(ERROR_CONSTANTS.MONGO_WRITE_ACCESS_DENIED);
  }

  if (errorMessage.includes('timed out')) {
    return createErrorResponse(ERROR_CONSTANTS.MONGO_TIMEOUT);
  }

  // Default to generic MongoDB error for unhandled cases
  return createErrorResponse(ERROR_CONSTANTS.MONGO_GENERIC_ERROR, error.message);
}

/**
 * Creates an error response object based on the error constant and optional details.
 * @param {ErrorConstant} errorConstant - The error constant to use.
 * @param {string} [details] - Optional additional error details.
 * @returns {ErrorResponse} The formatted error response.
 */
function createErrorResponse(errorConstant: ErrorConstant, details?: string): ErrorResponse {
  return {
    code: errorConstant.code,
    message: errorConstant.message,
    details: details,
  };
}

/**
 * Logs a MongoDB error with additional context information.
 * @param {Error} error - The error object to log.
 * @param {Record<string, unknown>} context - Additional context information.
 */
export function logMongoDBError(error: Error, context: Record<string, unknown> = {}): void {
  console.error('MongoDB Error:', {
    message: error.message,
    stack: error.stack,
    ...context,
  });
}

/**
 * Wraps an async function with MongoDB error handling.
 * @template T The return type of the wrapped function
 * @param {(...args: any[]) => Promise<T>} fn - The async function to wrap.
 * @returns {(...args: any[]) => Promise<T | ErrorResponse>} A wrapped function that catches and processes MongoDB errors.
 */
export function withMongoDBErrorHandling<T>(fn: (...args: any[]) => Promise<T>): (...args: any[]) => Promise<T | ErrorResponse> {
  return async (...args: any[]): Promise<T | ErrorResponse> => {
    try {
      return await fn(...args);
    } catch (error) {
      return processMongoDBError(error as Error);
    }
  };
}