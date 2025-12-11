import { NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { headers } from 'next/headers';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(
    req: Request,
    { params }: { params: Promise<{ bookId: string }> }
) {
    try {
        await connectDB();
        const headersList = await headers();
        const token = headersList.get('authorization')?.split(' ')[1];

        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const decoded: any = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { bookId } = await params;

        // Check if book is already in list
        const isIndex = user.myList.indexOf(bookId);

        let isAdded = false;
        if (isIndex === -1) {
            // Add to list
            user.myList.push(bookId);
            isAdded = true;
        } else {
            // Remove from list
            user.myList.splice(isIndex, 1);
            isAdded = false;
        }

        await user.save();

        return NextResponse.json({
            success: true,
            isAdded,
            myList: user.myList
        });

    } catch (error) {
        console.error('MyList toggle error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
