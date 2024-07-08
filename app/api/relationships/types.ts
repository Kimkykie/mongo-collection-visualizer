/**
 * types.ts
 *
 * This file contains type definitions for the MongoDB schema relationship analysis tool.
 * It includes types for raw schemas, preprocessed schemas, relationships, caching, and
 * structures used in generating prompts for the OpenAI API.
 */

// Raw Schema Types

/**
 * Represents a field in a raw (unprocessed) schema.
 */
export interface RawSchemaField {
  /** Type of the field (e.g., 'String', 'Number', 'ObjectId', 'Array') */
  type: string;
  /** Any additional properties of the field */
  [key: string]: any;
}

/**
 * Represents a raw (unprocessed) MongoDB schema.
 */
export interface RawSchema {
  /** Name of the collection */
  name: string;
  /** Fields in the schema, with field names as keys */
  fields: Record<string, RawSchemaField>;
}

// Preprocessed Schema Types

/**
 * Represents a field in a preprocessed schema.
 */
export interface SchemaField {
  /** Type of the field (e.g., 'String', 'Number', 'ObjectId', 'Array') */
  type: string;
  /** Indicates if the field is an array */
  isArray: boolean;
  /**
   * Indicates if an array field likely contains ObjectIds.
   * This is inferred based on field naming conventions and context.
   */
  likelyContainsObjectIds: boolean;
  /**
   * Indicates if the field is an ID field.
   * True for '_id' fields or fields ending with 'Id' (case-insensitive).
   */
  isId: boolean;
}

/**
 * Represents a preprocessed MongoDB schema.
 */
export interface PreprocessedSchema {
  /** Name of the collection */
  name: string;
  /**
   * Fields in the schema, with field names as keys.
   * Only includes fields that are potential relationship indicators.
   */
  fields: Record<string, SchemaField>;
}

// Relationship Types

/**
 * Represents a relationship between two collections.
 */
export interface Relationship {
  /** Name of the source collection */
  source: string;
  /** Name of the target collection */
  target: string;
  /** Field name in the source collection that references the target */
  sourceField: string;
  /** Field name in the target collection that is referenced (usually '_id') */
  targetField: string;
  /**
   * Confidence level of the inferred relationship.
   * - 'high': Strong indication of a relationship
   * - 'medium': Probable relationship, but not certain
   * - 'low': Possible relationship, but needs verification
   */
  confidence: 'high' | 'medium' | 'low';
}

// Caching Types

/**
 * Represents an entry in the relationship cache.
 */
export interface CacheEntry {
  /** Array of inferred relationships */
  relationships: Relationship[];
  /** Unix timestamp (in milliseconds) when the entry was cached */
  timestamp: number;
}

// OpenAI Prompt Types

/**
 * Represents an example relationship for use in the OpenAI prompt.
 * Uses string literals to match the exact format expected in the prompt.
 */
export interface RelationshipExample {
  /** Example source collection name */
  source: "sourceCollectionName";
  /** Example target collection name */
  target: "targetCollectionName";
  /** Example source field name */
  sourceField: "fieldNameInSourceCollection";
  /** Example target field name */
  targetField: "fieldNameInTargetCollection";
  /** Example confidence level */
  confidence: "high|medium|low";
}

/**
 * Represents the structure of the prompt sent to OpenAI.
 */
export interface PromptStructure {
  /** Brief description of the task for the AI */
  task: string;
  /** Detailed instructions for the AI on how to analyze the schemas */
  instructions: string;
  /** Preprocessed schemas for the AI to analyze */
  schemas: PreprocessedSchema[];
  /** Example format for the expected response from the AI */
  response_format: RelationshipExample[];
}