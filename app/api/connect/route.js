import { NextResponse } from 'next/server';
import mongoose from 'mongoose';

/**
 * Connects to the MongoDB database using the provided mongoURI.
 * If the connection is not already established, it will establish a new connection.
 *
 * @param {string} mongoURI - The MongoDB connection URI.
 * @returns {Promise<void>} - A promise that resolves when the connection is established.
 */
const connectToDatabase = async (mongoURI) => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

/**
 * Extracts field types and relationships from the given collections.
 *
 * @param {Array} collections - An array of collections.
 * @returns {Array} - An array of objects containing collection name, field types, and relationships.
 */
const extractFieldTypesAndRelationships = (collections) => {
  const collectionNames = collections.map(col => col.name);

  return collections.map((collection) => {
    const fieldTypes = {};
    const relationships = [];

    for (const field in collection.fields) {
      const fieldType = typeof collection.fields[field];
      fieldTypes[field] = fieldType;

      if (field !== '_id' && fieldType === 'object' && collection.fields[field] && collection.fields[field]._bsontype === 'ObjectId') {
        const potentialReference = collectionNames.find(name => name !== collection.name && name.endsWith('s') && name.slice(0, -1) === field);
        relationships.push({ field, reference: potentialReference || 'Unknown (requires additional context or AI inference)' });
      }
    }

    return { name: collection.name, fieldTypes, relationships };
  });
};

/**
 * Handles the POST request to connect to the MongoDB database and retrieve collection data.
 * @param {import('next').NextApiRequest} req - The Next.js API request object.
 * @returns {import('next').NextApiResponse} The Next.js API response object.
 */
export async function POST(req) {
  const { mongoURI } = await req.json();

  try {
    await connectToDatabase(mongoURI);

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionData = await Promise.all(
      collections.map(async (collection) => {
        const collName = collection.name;
        const coll = db.collection(collName);
        const firstDoc = await coll.findOne();

        return { name: collName, fields: firstDoc || {} };
      })
    );

    const processedCollections = extractFieldTypesAndRelationships(collectionData);

    return NextResponse.json({ collections: processedCollections });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to connect to MongoDB' }, { status: 500 });
  }
}
