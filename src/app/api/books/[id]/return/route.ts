// src/app/api/books/[id]/return/route.ts - VERIFIED
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';

function getUser(token: string | undefined): { id: string } | null {
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
  } catch {
    return null;
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const token = req.headers.get('authorization')?.split(' ')[1];
    const user = getUser(token);

    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    const Book = (await import('@/models/Book')).default();

    const book = await Book.findById(id);
    if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });

    if (book.available) return NextResponse.json({ error: 'Book was not borrowed' }, { status: 400 });

    if (book.borrowedBy?.toString() !== user.id) {
      return NextResponse.json({ error: 'Not your book' }, { status: 403 });
    }

    book.available = true;
    book.borrowedBy = null;
    await book.save();

    // Update User history - find the last entry for this book that hasn't been returned
    const User = (await import('@/models/User')).default;

    // We want to update the specific array element. 
    // However, finding the *exact* element index in a specialized array update can be tricky with just $set
    // But since we want to "close" the open borrowing session:
    await User.findOneAndUpdate(
      { _id: user.id, "history.bookId": book._id, "history.returnedDate": { $exists: false } },
      {
        $set: { "history.$.returnedDate": new Date() }
      }
    );

    return NextResponse.json({ message: 'Book returned' });
  } catch (error) {
    console.error('Return API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}