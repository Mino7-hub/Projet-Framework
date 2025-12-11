// components/QuickSearch.tsx - UPDATED COLORS
'use client';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function QuickSearch() {
  const [q, setQ] = useState('');
  const router = useRouter();
  const handle = (e: FormEvent) => {
    e.preventDefault();
    router.push(`/browse?q=${encodeURIComponent(q)}`);
  };
  return (
    <form onSubmit={handle} className="flex gap-2">
      <input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Title, author or genre"
        className="flex-1 px-4 py-2 border rounded"
      />
      {/* CHANGE: from sky-600/sky-700 to green-600/green-700 */}
      <button className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary-hover)] transition-colors">
        Search
      </button>
    </form>
  );
}