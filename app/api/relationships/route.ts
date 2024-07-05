import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  try {

    const { schemas: requestSchemas } = await req.json();
    const schemas = preprocessSchemas(requestSchemas);
    console.log(schemas);
    const prompt = generatePrompt(schemas);


    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    const relationships = completion.choices[0].message?.content || '{}';
    return NextResponse.json(relationships);
  } catch (error) {
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}

function inferArrayContent(fieldName: string, schemaName: string, allSchemaNames: string[]): boolean {
  const singularFieldName = fieldName.replace(/s$/, '').toLowerCase();

  // Common suffixes that indicate a reference
  const referenceSuffixes = ['id', 'ids', 'ref', 'refs'];

  // Check if the field name ends with a reference suffix
  const hasReferenceSuffix = referenceSuffixes.some(suffix =>
    singularFieldName.endsWith(suffix) || fieldName.toLowerCase().endsWith(suffix)
  );

  // Check if the field name (without suffix) matches any schema name
  const matchesSchemaName = allSchemaNames.some(name => {
    const singularName = name.replace(/s$/, '').toLowerCase();
    return singularName === singularFieldName ||
      singularName === singularFieldName.replace(/(id|ref)s?$/, '');
  });

  // Check for common naming patterns
  const commonPatterns = [
    /^related/i,
    /^linked/i,
    /^associated/i,
    /^parent/i,
    /^child/i,
    /^sub/i,
    /^super/i
  ];

  const matchesCommonPattern = commonPatterns.some(pattern => pattern.test(fieldName));

  // // Special case for 'tags' and similar categorization fields
  // const categorizationFields = ['tags', 'categories', 'labels', 'types'];
  // const isCategorizationField = categorizationFields.includes(fieldName.toLowerCase());

  return hasReferenceSuffix || matchesSchemaName || matchesCommonPattern;
}

export function preprocessSchemas(schemas: any[]) {
  const allSchemaNames = schemas.map(schema => schema.name);

  return schemas.map(schema => ({
    name: schema.name,
    fields: Object.entries(schema.fields)
      .filter(([key, field]) =>
        key === '_id' ||
        field.type === 'ObjectId' ||
        field.type === 'Array'
      )
      .reduce((acc, [key, value]) => {
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

export function generatePrompt(schemas) {
  const instructions = [
    "Analyze the following MongoDB collection schemas and identify relationships between them.",
    "Focus on ObjectId fields, fields ending with 'Id', and Array fields that likely contain ObjectIds to determine connections.",
    "When determining sourceField and targetField:",
    "- For a field of type ObjectId or a field ending with 'Id', use the field name as is.",
    "- For an Array field that likely contains ObjectIds, use the field name as is.",
    "- The sourceField should be in the source collection, and the targetField should be in the target collection.",
    "- The '_id' field in each collection is the primary identifier and is often referenced in other collections.",
    "- Fields ending with 'Id' (e.g., 'userId') often reference the '_id' field of another collection.",
    "Infer the relationship type (oneToMany, manyToOne, oneToOne, manyToMany) based on field types and names:",
    "- If the sourceField is an Array, it's likely a oneToMany or manyToMany relationship.",
    "- If the targetField is an Array, it's likely a manyToOne or manyToMany relationship.",
    "- If neither field is an Array, it's likely a oneToOne or manyToOne relationship.",
    "Only include relationships that can be confidently inferred from the schema structure and field names.",
    "Exclude relationships that are uncertain or speculative.",
    "Return a JSON object with collection relationships suitable for rendering as edges in a graph visualization."
  ];

  const prompt = {
    task: "MongoDB Schema Relationship Analysis",
    instructions: instructions.join("\n"),
    schemas: schemas,
    response_format: {
      relationships: [
        {
          source: "sourceCollectionName",
          target: "targetCollectionName",
          sourceField: "actualFieldNameInSourceCollection",
          targetField: "actualFieldNameInTargetCollection",
          relationType: "oneToMany|manyToOne|oneToOne|manyToMany",
          confidence: "high|medium|low"
        }
      ]
    },
    additional_notes: [
      "Pay special attention to fields ending with 'Id' as they often indicate relationships.",
      "Include a 'confidence' level for each relationship to indicate how certain the inference is.",
      "If a relationship could be interpreted in multiple ways, choose the most likely interpretation and note it in the confidence level."
    ]
  };

  return JSON.stringify(prompt, null, 2);
}
