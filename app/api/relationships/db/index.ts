// app/api/relationships/database.ts

import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { Relationship } from '../types';

/** Database instance */
let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

/**
 * Get or initialize the database connection
 * @returns Promise resolving to the database instance
 * @throws Error if database connection fails
 */
async function getDb(): Promise<Database<sqlite3.Database, sqlite3.Statement>> {
  if (!db) {
    try {
      db = await open({
        filename: './relationships.sqlite',
        driver: sqlite3.Database
      });
      await db.exec(`
        CREATE TABLE IF NOT EXISTS relationships (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          schema_hash TEXT UNIQUE NOT NULL,
          relationships TEXT NOT NULL,
          created_at INTEGER NOT NULL
        )
      `);
    } catch (error) {
      throw new Error('Database initialization failed');
    }
  }
  return db;
}

/**
 * Retrieve cached relationships for a given schema hash
 * @param schemaHash - Hash of the schema to look up
 * @returns Promise resolving to cached relationships or null if not found
 * @throws Error if database query fails
 */
export async function getCachedRelationships(schemaHash: string): Promise<Relationship[] | null> {
  try {
    const db = await getDb();
    const result = await db.get<{ relationships: string, created_at: number }>(
      'SELECT relationships, created_at FROM relationships WHERE schema_hash = ?',
      [schemaHash]
    );

    if (result && (Date.now() - result.created_at < 24 * 60 * 60 * 1000)) {
      return JSON.parse(result.relationships);
    }

    return null;
  } catch (error) {
    throw new Error('Database query failed');
  }
}

/**
 * Cache relationships for a given schema hash
 * @param schemaHash - Hash of the schema to cache
 * @param relationships - Relationships to cache
 * @throws Error if database insert/update fails
 */
export async function cacheRelationships(schemaHash: string, relationships: Relationship[]): Promise<void> {
  try {
    const db = await getDb();
    await db.run(
      'INSERT OR REPLACE INTO relationships (schema_hash, relationships, created_at) VALUES (?, ?, ?)',
      [schemaHash, JSON.stringify(relationships), Date.now()]
    );
  } catch (error) {
    throw new Error('Database insert/update failed');
  }
}

/**
 * Clear expired cache entries
 * @throws Error if database delete operation fails
 */
export async function clearExpiredCache(): Promise<void> {
  try {
    const db = await getDb();
    const expirationTime = Date.now() - 24 * 60 * 60 * 1000; // 24 hours ago
    await db.run('DELETE FROM relationships WHERE created_at < ?', [expirationTime]);
  } catch (error) {
    throw new Error('Database delete operation failed');
  }
}

/**
 * Close the database connection
 * @throws Error if closing the database connection fails
 */
export async function closeDatabase(): Promise<void> {
  if (db) {
    try {
      await db.close();
      db = null;
      console.log('Database connection closed successfully');
    } catch (error) {
      console.error('Failed to close database connection:', error);
      throw new Error('Failed to close database connection');
    }
  }
}