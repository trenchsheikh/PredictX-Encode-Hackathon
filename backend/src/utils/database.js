const mongoose = require('mongoose');

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

/**
 * Connect to MongoDB with connection pooling
 */
async function connectDatabase() {
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
 * Disconnect from MongoDB
 */
async function disconnectDatabase() {
  if (cached && cached.conn) {
    await cached.conn.disconnect();
    cached.conn = null;
  }
}

module.exports = {
  connectDatabase,
  disconnectDatabase,
};
