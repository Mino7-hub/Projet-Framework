'use client';
export default function UserStats({ count }: { count: number }) {
  return (
    <div className="mb-6 grid grid-cols-3 gap-4 text-center">
      <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
        <p className="text-2xl font-bold text-[var(--color-primary)]">{count}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Books borrowed</p>
      </div>
      <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
        <p className="text-2xl font-bold text-[var(--color-primary)]">∞</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">No late fees</p>
      </div>
      <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
        <p className="text-2xl font-bold text-[var(--color-primary)]">0</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">Fines</p>
      </div>
    </div>
  );
}