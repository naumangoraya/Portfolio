import mongoose from 'mongoose';

/**
 * Cached across hot reloads (and across lambda invocations on the same
 * instance) so API routes don't open a new connection per request.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

const isDev = process.env.NODE_ENV !== 'production';

async function dbConnect() {
  // Checked here rather than at module scope: app/page.js and app/sitemap.js
  // import this file, so a top-level throw made `next build` fail outright in
  // any CI or preview environment without the variable injected.
  const MONGODB_URI = process.env.MONGODB_URI;

  if (!MONGODB_URI) {
    throw new Error('MONGODB_URI is not set. Copy .env.example to .env.local and fill it in.');
  }

  // `cached.conn` stays truthy after a network drop, and bufferCommands:false
  // means every later query throws instead of waiting for a reconnect. Check
  // the live readyState instead of just the handle.
  if (cached.conn && mongoose.connection.readyState === 1) {
    return cached.conn;
  }

  if (cached.conn) {
    cached.conn = null;
    cached.promise = null;
  }

  if (!cached.promise) {
    if (isDev) console.log('Creating new database connection');

    const opts = {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).catch(error => {
      cached.promise = null;
      throw error;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (error) {
    cached.promise = null;
    console.error('Database connection failed:', error);
    throw error;
  }

  return cached.conn;
}

export default dbConnect;
