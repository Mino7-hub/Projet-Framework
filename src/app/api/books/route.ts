// src/app/api/books/route.ts
import { NextRequest, NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import connectDB from '@/lib/db';

/* ---------- helper : vérification admin ---------- */
function getAdmin(token: string | undefined): { id: string; role: string } | null {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string; role: string };
    return decoded.role === 'admin' ? decoded : null;
  } catch {
    return null;
  }
}

/* ------------------- GET (public) ---------------- */
export async function GET() {
  await connectDB();
  const Book = (await import('@/models/Book')).default();
  const books = await Book.find().populate('borrowedBy', 'name email').lean();
  return NextResponse.json(books);
}

/* ------------------ POST (admin) ----------------- */
export async function POST(req: NextRequest) {
  const header = req.headers.get('authorization');
  const token = header?.split(' ')[1];
  if (!getAdmin(token)) {
    return NextResponse.json({ error: 'Admin required' }, { status: 403 });
  }

  await connectDB();
  const Book = (await import('@/models/Book')).default();
  const body = await req.json();
  const book = await Book.create(body);
  return NextResponse.json(book, { status: 201 });
}