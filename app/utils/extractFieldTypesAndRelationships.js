/**
 * Extracts field types and relationships from the given collections.
 *
 * @param {Array} collections - An array of collections.
 * @returns {Array} - An array of objects containing collection name, field types, and relationships.
 */
const extractFieldTypesAndRelationships = (collections) => {
  const collectionNames = collections.map(col => col.name);

  const describeObjectFields = (fieldValue, parentPath) => {
      // Check for null immediately
      if (fieldValue === null) {
          return 'null';
      }
      // Checking for Date type first
      if (fieldValue instanceof Date) {
          return 'Date';
      }
      // Handle arrays
      if (Array.isArray(fieldValue)) {
          return 'Array';
      }
      // Handle objects, including nested objects
      if (typeof fieldValue === 'object') {
          // Special handling for MongoDB ObjectId
          if (fieldValue._bsontype === 'ObjectId') {
              return 'ObjectId';
          }
          // Recursive handling for nested objects
          return Object.entries(fieldValue).reduce((acc, [key, value]) => {
              const path = parentPath ? `${parentPath}.${key}` : key;
              acc[key] = describeObjectFields(value, path);  // Flatten structure by not adding parent path
              return acc;
          }, {});
      }
      // Fallback for other types
      return typeof fieldValue;
  };

  return collections.map((collection) => {
      const fieldTypes = {};
      const relationships = [];

      Object.entries(collection.fields).forEach(([fieldName, fieldValue]) => {
          const basicFieldType = describeObjectFields(fieldValue, '');

          if (fieldName !== '_id') {
              fieldTypes[fieldName] = basicFieldType;
              if (basicFieldType === 'ObjectId') {
                  const potentialReference = collectionNames.find(name =>
                      name !== collection.name && name.endsWith('s') && name.slice(0, -1) === fieldName
                  );
                  relationships.push({
                      field: fieldName,
                      reference: potentialReference || 'Unknown (requires additional context or AI inference)'
                  });
              }
          } else {
              fieldTypes[fieldName] = basicFieldType;
          }
      });

      return { name: collection.name, fieldTypes, relationships };
  });
};





module.exports = extractFieldTypesAndRelationships;
