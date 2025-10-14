import mongoose from 'mongoose';

// Global variable to cache the connection
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB with connection pooling for Vercel serverless functions
 * This prevents multiple connections in serverless environments
 */
export async function connectDatabase() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/darkbet';
    
    cached.promise = mongoose.connect(mongoUri, opts).then((mongoose) => {
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
  if (cached.conn) {
    await cached.conn.disconnect();
    cached.conn = null;
  }
}
