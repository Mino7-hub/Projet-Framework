import { NextRequest, NextResponse } from 'next/server';
import connectDB from '@/lib/db';
import User from '@/models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

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
    if (!checkAdmin(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        await connectDB();
        const { id } = await params;
        await User.findByIdAndDelete(id);
        return NextResponse.json({ message: 'User deleted' });
    } catch (err) {
        return NextResponse.json({ error: 'Error deleting user' }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: any }) {
    if (!checkAdmin(req)) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    try {
        await connectDB();
        const { id } = await params;
        const body = await req.json();

        const updateData: any = {};
        if (body.password) {
            updateData.password = await bcrypt.hash(body.password, 12);
        }
        if (body.role) {
            updateData.role = body.role;
        }

        const updated = await User.findByIdAndUpdate(id, updateData, { new: true }).select('-password');
        return NextResponse.json(updated);
    } catch (err) {
        return NextResponse.json({ error: 'Error updating user' }, { status: 500 });
    }
}
