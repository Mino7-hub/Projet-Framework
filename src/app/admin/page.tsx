// src/app/admin/page.tsx
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';
import { redirect } from 'next/navigation';
import AdminDashboard from './AdminDashboard';

export default async function AdminPage() {
  const token = (await cookies()).get('token')?.value;
  if (!token) redirect('/login');
  try {
    const { role } = jwt.verify(token, process.env.JWT_SECRET!) as { role: string };
    if (role !== 'admin') redirect('/user');
  } catch {
    redirect('/login');
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold font-serif mb-8 text-[var(--color-primary)]">Admin Dashboard</h1>
      <AdminDashboard />
    </div>
  );
}