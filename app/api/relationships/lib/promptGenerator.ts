// app/api/relationships/promptGenerator.ts

import { PreprocessedSchema, PromptStructure } from '../types';

/**
 * Generates a prompt for the OpenAI API to analyze MongoDB schema relationships
 * @param schemas - Array of preprocessed MongoDB schemas
 * @returns A JSON string containing the prompt for relationship analysis
 */
export function generatePrompt(schemas: PreprocessedSchema[]): string {
  const prompt: PromptStructure = {
    task: "MongoDB Schema Relationship Analysis",
    instructions: [
      "Analyze the provided MongoDB collection schemas and identify relationships between all collections.",
      "Focus on ObjectId fields, fields ending with 'Id', and Array fields likely containing ObjectIds.",
      "For sourceField and targetField, use the actual field names from the collections.",
      "Infer relationships based on field types and names.",
      "Include relationships between all collections in the provided schemas.",
      "Only include relationships that can be confidently inferred from the schema structures and field names.",
      "Exclude uncertain or speculative relationships.",
      "IMPORTANT: Respond ONLY with a valid JSON array of relationship objects. Do not include any explanations, comments, or additional text outside of the JSON structure.",
    ].join(" "),
    schemas,
    response_format: [
      {
        source: "sourceCollectionName",
        target: "targetCollectionName",
        sourceField: "fieldNameInSourceCollection",
        targetField: "fieldNameInTargetCollection",
        confidence: "high|medium|low"
      }
    ]
  };

  return JSON.stringify(prompt);
}