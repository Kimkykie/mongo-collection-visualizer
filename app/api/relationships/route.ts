// app/api/relationships/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { OpenAI } from 'openai';
import { preprocessSchemas, generateSchemaHash } from './lib/schemaProcessor';
import { generatePrompt } from './lib/promptGenerator';
import { getCachedRelationships, cacheRelationships, clearExpiredCache } from './db';
import { Relationship } from './types';

const openai = new OpenAI();

export async function POST(req: NextRequest) {
  try {
    const { schemas: requestSchemas } = await req.json();
    const schemas = preprocessSchemas(requestSchemas);
    const schemaHash = generateSchemaHash(requestSchemas);

    // Check cache for existing relationships
    const cachedRelationships = await getCachedRelationships(schemaHash);
    if (cachedRelationships) {
      console.log('Returning cached relationships')
      return NextResponse.json(cachedRelationships);
    }

    const prompt = generatePrompt(schemas);

    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.2,
    });

    let relationships: Relationship[] = [];
    try {
      const content = completion.choices[0].message?.content || '[]';
      const parsedContent = JSON.parse(content);
      if (Array.isArray(parsedContent)) {
        relationships = parsedContent;
      } else {
        throw new Error('Response is not an array');
      }
    } catch (error) {
      console.error('Error parsing OpenAI response:', error);
      return NextResponse.json({ error: 'Invalid response from OpenAI' }, { status: 500 });
    }

    // Cache the new relationships
    await cacheRelationships(schemaHash, relationships);

    // Clear expired cache entries
    await clearExpiredCache();

    return NextResponse.json(relationships);
  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json({ error: 'Error processing request' }, { status: 500 });
  }
}