import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import extractFieldTypes from '../../utils/extractFieldTypes';

/**
 * Connects to the MongoDB database.
 *
 * @param {string} mongoURI - The URI of the MongoDB database.
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
 * Handles the POST request to fetch and process MongoDB collections.
 *
 * @param {Request} req - The HTTP request object.
 * @returns {Promise<Response>} - The HTTP response object.
 */
export async function POST(req) {
  const { mongoURI } = await req.json();

  try {
    await connectToDatabase(mongoURI || process.env.MONGODB_URI);

    const db = mongoose.connection.db;
    const collections = await db.listCollections().toArray();
    const collectionData = await Promise.all(
      collections.map(async (collection) => {
        const collName = collection.name;
        const coll = db.collection(collName);
        const firstDoc = await coll.findOne();
        const recordCount = await coll.countDocuments();

        return { name: collName, fields: firstDoc || {}, count: recordCount };
      })
    );

    const processedCollections = extractFieldTypes(collectionData);

    return NextResponse.json({ collections: processedCollections, databaseName: db.databaseName});
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to connect to MongoDB' }, { status: 500 });
  }
}
