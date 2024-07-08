// app/api/relationships/relationshipCache.ts

import { CacheEntry, Relationship, PreprocessedSchema } from '../types';

/** Cache to store relationship data */
const cache: Map<string, CacheEntry> = new Map();

/** Cache expiration time in milliseconds (24 hours) */
const CACHE_EXPIRATION = 24 * 60 * 60 * 1000;

/**
 * Generates a unique cache key for a set of schemas
 * @param schemas - Array of preprocessed schemas
 * @returns A string representation of the schemas for use as a cache key
 */
function generateCacheKey(schemas: PreprocessedSchema[]): string {
  return JSON.stringify(schemas);
}

/**
 * Retrieves cached relationships for given schemas
 * @param schemas - Array of preprocessed schemas
 * @returns Cached relationships if found and not expired, otherwise null
 */
export function getCachedRelationships(schemas: PreprocessedSchema[]): Relationship[] | null {
  const cacheKey = generateCacheKey(schemas);
  const cachedEntry = cache.get(cacheKey);

  if (cachedEntry && Date.now() - cachedEntry.timestamp < CACHE_EXPIRATION) {
    return cachedEntry.relationships;
  }

  return null;
}

/**
 * Caches relationships for given schemas
 * @param schemas - Array of preprocessed schemas
 * @param relationships - Relationships to cache
 */
export function cacheRelationships(schemas: PreprocessedSchema[], relationships: Relationship[]): void {
  const cacheKey = generateCacheKey(schemas);
  cache.set(cacheKey, { relationships, timestamp: Date.now() });
}

/**
 * Clears expired entries from the cache
 */
export function clearExpiredCache(): void {
  const now = Date.now();
  cache.forEach((entry, key) => {
    if (now - entry.timestamp >= CACHE_EXPIRATION) {
      cache.delete(key);
    }
  });
}