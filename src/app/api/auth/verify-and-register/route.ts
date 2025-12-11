import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import VerificationCode from '@/models/VerificationCode';
import User from '@/models/User';

export async function POST(req: NextRequest) {
  await connectDB();
  const { name, email, password, code } = await req.json();

  const record = await VerificationCode.findOne({ email, code });
  if (!record) {
    return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 });
  }

  // code OK → créer user
  const hashed = await bcrypt.hash(password, 12);
  await User.create({ name, email, password: hashed });
  await VerificationCode.deleteMany({ email }); // nettoie

  return NextResponse.json({ message: 'User created' }, { status: 201 });
}