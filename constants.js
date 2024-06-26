const BSON = require('bson');

const bsonTypeMap = {
  [BSON.BSONType.DOUBLE]: 'double',
  [BSON.BSONType.STRING]: 'string',
  [BSON.BSONType.OBJECT]: 'object',
  [BSON.BSONType.ARRAY]: 'array',
  [BSON.BSONType.BINARY]: 'binData',
  [BSON.BSONType.UNDEFINED]: 'undefined',
  [BSON.BSONType.OID]: 'objectId',
  [BSON.BSONType.BOOLEAN]: 'bool',
  [BSON.BSONType.DATE]: 'date',
  [BSON.BSONType.NULL]: 'null',
  [BSON.BSONType.REGEXP]: 'regex',
  [BSON.BSONType.DBPOINTER]: 'dbPointer',
  [BSON.BSONType.JAVASCRIPT]: 'javascript',
  [BSON.BSONType.SYMBOL]: 'symbol',
  [BSON.BSONType.JAVASCRIPTWITHSCOPE]: 'javascriptWithScope',
  [BSON.BSONType.INT]: 'int',
  [BSON.BSONType.TIMESTAMP]: 'timestamp',
  [BSON.BSONType.LONG]: 'long',
  [BSON.BSONType.DECIMAL128]: 'decimal',
  [BSON.BSONType.MINKEY]: 'minKey',
  [BSON.BSONType.MAXKEY]: 'maxKey'
};

module.exports = bsonTypeMap;
