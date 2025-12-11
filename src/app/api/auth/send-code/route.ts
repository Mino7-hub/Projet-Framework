import { NextRequest, NextResponse } from 'next/server';
import { randomInt } from 'crypto';
import connectDB from '@/lib/db';
import { sendCode } from '@/lib/mail';
import VerificationCode from '@/models/VerificationCode';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email } = await req.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const code = randomInt(100_000, 1_000_000).toString(); // 6 chiffres
    const expires = new Date(Date.now() + 5 * 60 * 1000);  // +5 min

    // supprime anciens codes
    await VerificationCode.deleteMany({ email });
    await VerificationCode.create({ email, code, expiresAt: expires });

    await sendCode(email, code);

    return NextResponse.json({ message: 'Code sent' });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}