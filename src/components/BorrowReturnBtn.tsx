'use client';

import { Book } from '@/types';
import { useRouter } from 'next/navigation';

export default function BorrowReturnBtn({ book }: { book: Book }) {
  const router = useRouter();
  const isMine = book.borrowedBy?._id === localStorage.getItem('id'); // on stockera l’id au login

  const action = async () => {
    const endpoint = book.available ? 'borrow' : 'return';
    const res = await fetch(`/api/books/${book._id}/${endpoint}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
    });
    if (res.ok) router.refresh(); // re-render server components
    else alert((await res.json()).error);
  };

  if (!book.available && !isMine) return null;

  return (
    <button
      onClick={action}
      className={`text-xs px-2 py-1 rounded ${
        book.available ? 'bg-sky-600 text-white' : 'bg-gray-200 text-gray-800'
      }`}
    >
      {book.available ? 'Borrow' : 'Return'}
    </button>
  );
}