// app/api/relationships/schemaProcessor.ts

import { createHash } from 'crypto';
import { PreprocessedSchema, SchemaField, RawSchema} from '../types';

/**
 * Infers if an array field likely contains ObjectIds based on its name and context
 * @param fieldName - Name of the field
 * @param schemaName - Name of the schema containing the field
 * @param allSchemaNames - Array of all schema names
 * @returns Boolean indicating if the array likely contains ObjectIds
 */
function inferArrayContent(fieldName: string, schemaName: string, allSchemaNames: string[]): boolean {
  const singularFieldName = fieldName.replace(/s$/, '').toLowerCase();
  const referenceSuffixes = ['id', 'ids', 'ref', 'refs'];

  const hasReferenceSuffix = referenceSuffixes.some(suffix =>
    singularFieldName.endsWith(suffix) || fieldName.toLowerCase().endsWith(suffix)
  );

  const matchesSchemaName = allSchemaNames.some(name => {
    const singularName = name.replace(/s$/, '').toLowerCase();
    return singularName === singularFieldName ||
      singularName === singularFieldName.replace(/(id|ref)s?$/, '');
  });

  const commonPatterns = [/^related/i, /^linked/i, /^associated/i, /^parent/i, /^child/i, /^sub/i, /^super/i];
  const matchesCommonPattern = commonPatterns.some(pattern => pattern.test(fieldName));

  return hasReferenceSuffix || matchesSchemaName || matchesCommonPattern;
}


/**
 * Preprocesses raw schemas into a format suitable for relationship analysis
 * @param schemas - Array of raw schemas
 * @returns Array of preprocessed schemas
 */
export function preprocessSchemas(schemas: RawSchema[]): PreprocessedSchema[] {
  const allSchemaNames = schemas.map(schema => schema.name);

  return schemas.map(schema => ({
    name: schema.name,
    fields: Object.entries(schema.fields)
      .filter(([key, field]) =>
        key === '_id' ||
        field.type === 'ObjectId' ||
        field.type === 'Array'
      )
      .reduce<Record<string, SchemaField>>((acc, [key, value]) => {
        if (key !== '__v') {
          acc[key] = {
            type: value.type,
            isArray: value.type === 'Array',
            likelyContainsObjectIds: value.type === 'Array' ?
              inferArrayContent(key, schema.name, allSchemaNames) : false,
            isId: key === '_id' || key.toLowerCase().endsWith('id')
          };
        }
        return acc;
      }, {})
  }));
}

/**
 * Generates a hash for a set of schemas
 * @param schemas - Array of raw schemas
 * @returns A hash string representing the schemas
 */
export function generateSchemaHash(schemas: RawSchema[]): string {
  const hash = createHash('sha256');
  hash.update(JSON.stringify(schemas));
  return hash.digest('hex');
}