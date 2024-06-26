import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import extractFieldTypesAndRelationships from '../../utils/extractFieldTypesAndRelationships';

const connectToDatabase = async (mongoURI) => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
};

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
