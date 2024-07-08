import { MongoCollection, MongoField } from '../types';

/**
 * Recursively describes the fields of a MongoDB document.
 * @param fieldValue - The value of the field to describe.
 * @param fieldName - The name of the field (default is an empty string).
 * @returns A MongoField object describing the field.
 */
function describeObjectFields(fieldValue: any, fieldName: string = ''): MongoField {
  if (fieldValue === null) {
    return { name: fieldName, type: 'Null', key: false };
  }
  if (fieldValue instanceof Date) {
    return { name: fieldName, type: 'Date', key: false };
  }
  if (Array.isArray(fieldValue)) {
    return { name: fieldName, type: 'Array', key: false };
  }
  if (typeof fieldValue === 'object') {
    // Handle BSON types
    if (fieldValue._bsontype === 'ObjectId') {
      return { name: fieldName, type: 'ObjectId', key: false };
    }
    if (['Decimal128', 'Double', 'Int32', 'Long', 'Binary'].includes(fieldValue._bsontype)) {
      return { name: fieldName, type: fieldValue._bsontype, key: false };
    }

    // Handle nested objects
    const nestedFields: Record<string, MongoField> = {};
    for (const [key, value] of Object.entries(fieldValue)) {
      nestedFields[key] = describeObjectFields(value, key);
    }

    return { name: fieldName, type: 'Object', key: false, fields: nestedFields };
  }
  // Handle primitive types
  switch (typeof fieldValue) {
    case 'string':
      return { name: fieldName, type: 'String', key: false };
    case 'number':
      return { name: fieldName, type: Number.isInteger(fieldValue) ? 'Int32' : 'Double', key: false };
    case 'boolean':
      return { name: fieldName, type: 'Boolean', key: false };
    default:
      return { name: fieldName, type: 'Unknown', key: false };
  }
}

/**
 * Extracts field types from the given MongoDB collections.
 * @param collections - An array of raw collection data.
 * @returns An array of MongoCollection objects with extracted field types.
 */
export function extractFieldTypes(collections: any[]): MongoCollection[] {
  return collections.map((collection) => {
    const fields: Record<string, MongoField> = {};

    for (const [fieldName, fieldValue] of Object.entries(collection.fields)) {
      fields[fieldName] = describeObjectFields(fieldValue, fieldName);
    }

    return { name: collection.name, fields, count: collection.count };
  });
}