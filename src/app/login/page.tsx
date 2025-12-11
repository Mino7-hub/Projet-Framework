// src/app/login/page.tsx
import LoginForm from './LoginForm';
import Link from 'next/link';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] bg-gradient-to-br from-[var(--color-bg)] to-gray-100">
      <div className="w-full max-w-md p-8 card glass">
        <h1 className="text-3xl font-bold font-serif mb-2 text-center text-[var(--color-primary)]">Welcome Back</h1>
        <p className="text-center text-[var(--color-text-light)] mb-8">Access your personalized library.</p>

        <LoginForm />

        <div className="mt-6 text-center text-sm text-[var(--color-text-light)]">
          Don’t have an account?{' '}
          <Link href="/register" className="font-semibold text-[var(--color-primary)] hover:underline">
            Register for free
          </Link>
        </div>
      </div>
    </div>
  );
}