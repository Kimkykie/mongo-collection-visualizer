/**
 * Extracts field types from the given MongoDB collections.
 *
 * @param {Array} collections - An array of collections.
 * @returns {Array} - An array of objects containing collection name, field types, and count.
 */
const extractFieldTypes = (collections) => {
  /**
   * Recursively determines the type of a field.
   *
   * @param {any} fieldValue - The value of the field.
   * @param {string} fieldName - The name of the field.
   * @returns {object} - An object representing the field's name, type, and key.
   */
  const describeObjectFields = (fieldValue, fieldName = '') => {
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
      if (fieldValue._bsontype === 'ObjectId') {
        return { name: fieldName, type: 'ObjectId', key: false };
      }
      if (fieldValue._bsontype === 'Decimal128') {
        return { name: fieldName, type: 'Decimal128', key: false };
      }
      if (fieldValue._bsontype === 'Double') {
        return { name: fieldName, type: 'Double', key: false };
      }
      if (fieldValue._bsontype === 'Int32') {
        return { name: fieldName, type: 'Int32', key: false };
      }
      if (fieldValue._bsontype === 'Long') {
        return { name: fieldName, type: 'Long', key: false };
      }
      if (fieldValue._bsontype === 'Binary') {
        return { name: fieldName, type: 'Binary', key: false };
      }

      const nestedFields = Object.entries(fieldValue).reduce((acc, [key, value]) => {
        acc[key] = describeObjectFields(value, key);
        return acc;
      }, {});

      return { name: fieldName, type: 'Object', key: false, fields: nestedFields };
    }
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
  };

  return collections.map((collection) => {
    const fieldTypes = {};

    Object.entries(collection.fields).forEach(([fieldName, fieldValue]) => {
      fieldTypes[fieldName] = describeObjectFields(fieldValue, fieldName);
    });

    return { name: collection.name, fields: fieldTypes, count: collection.count };
  });
};

module.exports = extractFieldTypes;
