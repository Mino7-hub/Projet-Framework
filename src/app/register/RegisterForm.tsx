'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const [step, setStep] = useState<1 | 2>(1);
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  /* ---------- STEP 1 : Send Code ---------- */
  const handleSendCode = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/send-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Error sending code');
        setLoading(false);
        return;
      }
      setStep(2);
    } catch {
      setError('Failed to send code.');
    }
    setLoading(false);
  };

  /* ---------- STEP 2 : Create Account ---------- */
  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/verify-and-register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, code }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Creation failed');
        setLoading(false);
        return;
      }
      router.push('/login');
    } catch {
      setError('Failed to register.');
    }
    setLoading(false);
  };

  /* ---------- RENDER STEP 1 ---------- */
  if (step === 1)
    return (
      <form onSubmit={handleSendCode} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Email Address</label>
          <input
            className="w-full px-4 py-2 border border-[var(--color-border)] rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
            type="email"
            placeholder="name@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">{error}</div>}
        <button
          disabled={loading}
          className="w-full btn-primary py-2.5 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Continue'}
        </button>
      </form>
    );

  /* ---------- RENDER STEP 2 ---------- */
  return (
    <form onSubmit={handleCreate} className="space-y-4">
      <div className="bg-blue-50 p-4 rounded-md border border-blue-100 mb-4">
        <p className="text-sm text-blue-800">We sent a 6-digit code to <b className="font-semibold">{email}</b>.</p>
        <button
          type="button"
          onClick={() => setStep(1)}
          className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
        >
          Change email
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Verification Code</label>
        <input
          className="w-full px-4 py-2 border border-[var(--color-border)] rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all text-center tracking-widest font-mono text-lg"
          placeholder="000000"
          required
          maxLength={6}
          value={code}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Full Name</label>
        <input
          className="w-full px-4 py-2 border border-[var(--color-border)] rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
          placeholder="John Doe"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[var(--color-text)] mb-1">Password</label>
        <input
          className="w-full px-4 py-2 border border-[var(--color-border)] rounded-md focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent outline-none transition-all"
          type="password"
          placeholder="Create a strong password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded border border-red-100">{error}</div>}

      <button
        disabled={loading}
        className="w-full btn-primary py-2.5 flex justify-center items-center disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {loading ? 'Creating Account...' : 'Create Account'}
      </button>
    </form>
  );
}