// app/api/books/my-books/route.ts
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

export async function GET(req: NextRequest) {
  try {
    const token = req.headers.get('authorization')?.split(' ')[1];
    const user = getUser(token);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await connectDB();
    const Book = (await import('@/models/Book')).default();
    
    // Find books borrowed by this user
    const books = await Book.find({ borrowedBy: user.id }).lean();
    
    const formattedBooks = books.map((b: any) => ({
      _id: b._id.toString(),
      title: b.title,
      author: b.author,
      genre: b.genre,
      available: b.available,
      borrowedBy: { _id: user.id, name: 'You' }
    }));

    return NextResponse.json(formattedBooks);
  } catch (error) {
    console.error('My books API error:', error);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}