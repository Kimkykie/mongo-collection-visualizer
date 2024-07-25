import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, disconnectFromDatabase } from './lib/databaseConnection';
import { extractFieldTypes } from './lib/extractFieldTypes';
import { DatabaseConnectionResult } from './types';
import { logMongoDBError, processMongoDBError } from '@/app/utils/errorUtils';

/**
 * Handles POST requests to connect to a MongoDB database and analyze its schema.
 * @param req - The incoming Next.js request object.
 * @returns A NextResponse object with the analyzed database schema or an error message.
 */
export async function POST(req: NextRequest): Promise<NextResponse> {
  try {
    // Extract MongoDB URI from request body
    const { mongoURI } = await req.json();
    const connection = await connectToDatabase(mongoURI || process.env.MONGODB_URI);

    const db = connection.db;
    const collections = await db.listCollections().toArray();

    // Process each collection in parallel
    const collectionData = await Promise.all(
      collections.map(async (collection) => {
        const collName = collection.name;
        const coll = db.collection(collName);

        // Fetch first document and count in parallel
        const [firstDoc, recordCount] = await Promise.all([
          coll.findOne(),
          coll.countDocuments()
        ]);

        return { name: collName, fields: firstDoc || {}, count: recordCount };
      })
    );

    // Extract field types from the collected data
    const processedCollections = extractFieldTypes(collectionData);

    const result: DatabaseConnectionResult = {
      collections: processedCollections,
      databaseName: db.databaseName
    };

    return NextResponse.json(result);
  } catch (error) {
    const errorResponse = processMongoDBError(error as Error);
    logMongoDBError(error as Error, { route: 'POST /api/analyze-db' });
    return NextResponse.json({ error: errorResponse }, { status: 500 });
  } finally {
    // Ensure database connection is closed after operation
    await disconnectFromDatabase();
  }
}