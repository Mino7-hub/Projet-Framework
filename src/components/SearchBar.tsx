
'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(searchParams.get('q') || '');

  const handleSearch = (value: string) => {
    setQ(value);
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set('q', value);
    else params.delete('q');
    router.replace(`/browse?${params.toString()}`);
  };

  return (
    <div className="mb-6 flex gap-2">
      <input
        value={q}
        onChange={(e) => handleSearch(e.target.value)}
        placeholder="Title, author or genre"
        className="flex-1 px-4 py-2 border rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
      />
      {/* CHANGE: from green-600/green-700 to match your theme (keeping green) */}
      <button
        onClick={() => handleSearch(q)}
        className="px-5 py-2 bg-[var(--color-primary)] text-white rounded-lg hover:bg-[var(--color-primary-hover)] transition-colors"
      >
        Search
      </button>
    </div>
  );
}