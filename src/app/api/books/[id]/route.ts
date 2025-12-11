import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import jwt from 'jsonwebtoken';

// Helper to check admin
function checkAdmin(req: NextRequest) {
    const header = req.headers.get('authorization');
    const token = header?.split(' ')[1];
    if (!token) return false;
    try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
        return decoded.role === 'admin';
    } catch {
        return false;
    }
}

export async function DELETE(req: NextRequest, { params }: { params: any }) {
    // await params for Next.js 15+ compatibility if needed, but safe to access generally in older versions too if strict
    // but in app router params is a promise in newer versions.
    // We'll treat it as standard object for now or await it if we were in pure v15 strict user.
    // Assuming standard Next 14 behavior for now based on file structure.

    if (!checkAdmin(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        await connectDB();
        const Book = (await import('@/models/Book')).default(); // Lazy load to ensure connection
        const { id } = params;

        const deleted = await Book.findByIdAndDelete(id);
        if (!deleted) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Deleted successfully' });
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: any }) {
    if (!checkAdmin(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        await connectDB();
        const Book = (await import('@/models/Book')).default();
        const { id } = await params; // Good practice to await params in latest Next.js
        const body = await req.json();

        const updated = await Book.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        );

        if (!updated) {
            return NextResponse.json({ error: 'Book not found' }, { status: 404 });
        }

        return NextResponse.json(updated);
    } catch (error) {
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}
