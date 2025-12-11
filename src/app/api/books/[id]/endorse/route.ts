import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import getBookModel from '@/models/Book';
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const token = req.headers.get('Authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
        const userId = decoded.id;

        await connectDB();
        const Book = getBookModel();
        const { id } = await params;

        const book = await Book.findById(id);
        if (!book) return NextResponse.json({ error: 'Book not found' }, { status: 404 });

        const isEndorsed = book.endorsements.includes(userId);

        if (isEndorsed) {
            // Disendorse
            await Book.findByIdAndUpdate(id, { $pull: { endorsements: userId } });
        } else {
            // Endorse
            await Book.findByIdAndUpdate(id, { $addToSet: { endorsements: userId } });
        }

        // Return the updated list or count
        const updatedBook = await Book.findById(id);
        return NextResponse.json({
            endorsements: updatedBook.endorsements,
            count: updatedBook.endorsements.length
        });

    } catch (error) {
        return NextResponse.json({ error: 'Error processing endorsement' }, { status: 500 });
    }
}
