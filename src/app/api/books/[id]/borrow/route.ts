// src/app/api/books/[id]/borrow/route.ts - WITH DEBUGGING
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';

function getUser(token: string | undefined): { id: string } | null {
  if (!token) return null;
  try {
    console.log('Verifying token...'); // Debug
    const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    console.log('Token verified for user:', user.id); // Debug
    return user;
  } catch (error) {
    console.error('Token verification failed:', error); // Debug
    return null;
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('Borrow request for book:', id); // Debug

    const token = req.headers.get('authorization')?.split(' ')[1];
    console.log('Token received:', !!token); // Debug

    const user = getUser(token);
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    await connectDB();
    console.log('Database connected'); // Debug

    // Get the Book model correctly
    const Book = (await import('@/models/Book')).default();
    const book = await Book.findById(id);

    const body = await req.json();
    const { startDate, endDate } = body;

    if (!startDate || !endDate) {
      return NextResponse.json({ error: 'Start and end dates are required' }, { status: 400 });
    }

    if (new Date(startDate) > new Date(endDate)) {
      return NextResponse.json({ error: 'End date must be after start date' }, { status: 400 });
    }

    if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });
    if (!book.available) return NextResponse.json({ error: 'Already borrowed' }, { status: 400 });

    book.available = false;
    book.borrowedBy = user.id;
    book.borrowedStartDate = new Date(startDate);
    book.borrowedEndDate = new Date(endDate);
    await book.save();

    // Update User history
    const User = (await import('@/models/User')).default; // Note: Check export in User.ts, it might be default export of model or function
    // In User.ts: export default mongoose.models.User || mongoose.model('User', UserSchema);
    // So default import is the model.

    await User.findByIdAndUpdate(user.id, {
      $push: {
        history: {
          bookId: book._id,
          title: book.title,
          borrowedDate: new Date(),
        }
      }
    });

    console.log('Book borrowed successfully'); // Debug
    return NextResponse.json({ message: 'Book borrowed' });

  } catch (error) {
    console.error('Borrow API error:', error); // Debug
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}