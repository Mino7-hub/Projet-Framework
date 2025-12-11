import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const userPayload = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
        if (userPayload.role !== 'admin') return NextResponse.json({ error: 'Forbidden' }, { status: 403 });

        await connectDB();
        const Book = (await import('@/models/Book')).default();
        const User = (await import('@/models/User')).default;

        // 1. Most Booked Books (counted via User History aggregation)
        const mostBooked = await User.aggregate([
            { $unwind: "$history" },
            { $group: { _id: "$history.title", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 5 }
        ]);

        // 2. Most Endorsed Books
        // Book.endorsements is array of IDs. We can project size.
        const mostEndorsed = await Book.aggregate([
            { $project: { title: 1, endorsementCount: { $size: { $ifNull: ["$endorsements", []] } } } },
            { $sort: { endorsementCount: -1 } },
            { $limit: 5 }
        ]);

        // 3. Users with most books borrowed
        const topUsers = await User.aggregate([
            { $project: { name: 1, email: 1, historyCount: { $size: { $ifNull: ["$history", []] } } } },
            { $sort: { historyCount: -1 } },
            { $limit: 5 }
        ]);

        // 4. Totals
        const totalBooks = await Book.countDocuments();
        const totalUsers = await User.countDocuments();

        // Active Rentals: Count of users who have at least one book in 'borrowedBooks' (if that's how it's stored)
        // Or if 'available: false' implies active rental. Let's check Book model.
        // Based on previous file views, Book has 'available' boolean and 'borrowedBy' field.
        const activeRentals = await Book.countDocuments({ available: false });

        return NextResponse.json({
            mostBooked,
            mostEndorsed,
            topUsers,
            totalBooks,
            totalUsers,
            activeRentals
        });

    } catch (error) {
        console.error('Stats Error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
