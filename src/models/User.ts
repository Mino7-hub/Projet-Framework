// src/models/User.ts
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    history: [
      {
        bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' },
        title: String,
        borrowedDate: Date,
        returnedDate: Date,
      }
    ],
    myList: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model('User', UserSchema);