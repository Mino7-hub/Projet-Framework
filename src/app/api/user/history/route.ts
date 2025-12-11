import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
    try {
        const token = req.headers.get('authorization')?.split(' ')[1];
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const user = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        await connectDB();
        const User = (await import('@/models/User')).default;

        const userData = await User.findById(user.id).select('history');

        if (!userData) return NextResponse.json({ error: 'User not found' }, { status: 404 });

        return NextResponse.json({ history: userData.history.reverse() }); // Newest first

    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
