/**
 * Represents a field in a MongoDB collection.
 */
export interface MongoField {
    /** Name of the field */
    name: string;
    /** Type of the field (e.g., 'String', 'Number', 'ObjectId') */
    type: string;
    /** Indicates if the field is a key */
    key: boolean;
    /** Nested fields for Object types */
    fields?: Record<string, MongoField>;
  }

  /**
   * Represents a MongoDB collection with its fields and document count.
   */
  export interface MongoCollection {
    /** Name of the collection */
    name: string;
    /** Fields in the collection */
    fields: Record<string, MongoField>;
    /** Number of documents in the collection */
    count: number;
  }

  /**
   * Represents the result of a database connection and schema analysis.
   */
  export interface DatabaseConnectionResult {
    /** Analyzed collections */
    collections: MongoCollection[];
    /** Name of the connected database */
    databaseName: string;
  }