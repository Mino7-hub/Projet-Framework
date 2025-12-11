// src/models/Book.ts
import mongoose from 'mongoose';

const BookSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    author: { type: String, required: true, index: true },
    genre: { type: [String], default: [], index: true },
    available: { type: Boolean, default: true },
    borrowedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    borrowedStartDate: { type: Date, default: null },
    borrowedEndDate: { type: Date, default: null },
    coverImage: { type: String, default: '' },
    endorsements: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

// export lazy
export default function getBookModel() {
  return mongoose.models.Book || mongoose.model('Book', BookSchema);
}