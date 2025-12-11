// src/lib/db.ts
import mongoose, { Mongoose } from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://aminehadjismail_db_user:69sMB4Cq317AC8lz@cluster0.le3s9wg.mongodb.net/online-library?retryWrites=true&w=majority";

declare global {
  var mongoose: { conn: Mongoose | null; promise: Promise<Mongoose> | null } | undefined;
}

let cached = globalThis.mongoose ?? { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI).then((mongoose) => mongoose);
  }
  cached.conn = await cached.promise;
  globalThis.mongoose = cached;
  return cached.conn;
}

export default connectDB;