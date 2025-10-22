import mongoose from 'mongoose';

interface CachedConnection {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

// Global variable to cache the connection
let cached = (global as { mongoose?: CachedConnection }).mongoose;

if (!cached) {
  cached = (global as { mongoose?: CachedConnection }).mongoose = {
    conn: null,
    promise: null,
  };
}

/**
 * Connect to MongoDB with connection pooling for Vercel serverless functions
 * This prevents multiple connections in serverless environments
 */
export async function connectDatabase() {
  if (!cached) {
    throw new Error('Cached connection not initialized');
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const mongoUri =
      process.env.MONGODB_URI || 'mongodb://localhost:27017/darkbet';

    cached.promise = mongoose.connect(mongoUri, opts).then(mongoose => {
      // eslint-disable-next-line no-console
      console.log('✅ MongoDB connected successfully');
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

/**
 * Disconnect from MongoDB (useful for testing)
 */
export async function disconnectDatabase() {
  if (cached && cached.conn) {
    await cached.conn.disconnect();
    cached.conn = null;
  }
}
