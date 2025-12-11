'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { HeartIcon } from '@heroicons/react/24/solid';
import { HeartIcon as HeartOutline } from '@heroicons/react/24/outline';
import { Book } from '@/types';
import AddToListBtn from './AddToListBtn';

type Props = {
  book: Book;
  mine?: boolean;
};

export default function BookCard({ book, mine = false }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Local state for endorsements to support optimistic UI or simple update
  const [endorsements, setEndorsements] = useState<string[]>(book.endorsements || []);

  useEffect(() => {
    setUserId(localStorage.getItem('id'));
  }, []);

  const isEndorsed = userId ? endorsements.includes(userId) : false;

  const handleReturn = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    if (!token) { setLoading(false); return alert('Please log in'); }

    const res = await fetch(`/api/books/${book._id}/return`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert('Return failed');
    }
    setLoading(false);
  };

  const toggleEndorsement = async () => {
    if (!userId) {
      // Redirect to login or show toast
      return router.push('/login');
    }

    // Optimistic update
    const prev = [...endorsements];
    if (isEndorsed) {
      setEndorsements(prev.filter(id => id !== userId));
    } else {
      setEndorsements([...prev, userId]);
    }

    const token = localStorage.getItem('token');
    try {
      const res = await fetch(`/api/books/${book._id}/endorse`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setEndorsements(data.endorsements);
    } catch {
      setEndorsements(prev); // Revert
    }
  };

  return (


    <div
      onClick={() => router.push(`/book/${book._id}`)}
      className="relative h-[280px] sm:h-[300px] md:h-[320px] w-full rounded-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-[0_0_20px_rgba(212,175,55,0.3)] border-2 border-transparent hover:border-[var(--color-primary)] group cursor-pointer"
    >
      {book.coverImage ? (
        <img
          src={book.coverImage}
          alt={book.title}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-900 flex items-center justify-center border-b border-[var(--color-primary)]">
          <span className="text-4xl text-[var(--color-primary)] font-serif">N</span>
        </div>
      )}

      <div className="absolute inset-0 bg-black/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        <div>
          <h4 className="font-bold text-white text-base line-clamp-2 mb-2">{book.title}</h4>
          <div className="flex flex-wrap gap-1">
            {(Array.isArray(book.genre) ? book.genre : [book.genre || 'General']).map((g, i) => (
              <span key={i} className="text-[10px] border border-gray-600 px-1.5 py-0.5 rounded text-gray-300 uppercase inline-block">{g}</span>
            ))}
          </div>
        </div>

        <div className="flex gap-3 mt-2">
          <button
            onClick={(e) => { e.stopPropagation(); router.push(`/book/${book._id}`); }}
            className="flex-1 bg-white text-black py-1.5 rounded text-xs font-bold hover:bg-gray-200 transition"
          >
            View Details
          </button>
          <AddToListBtn
            bookId={book._id}
            iconOnly={true}
            className="p-1.5 border border-gray-500 rounded hover:border-white transition text-white"
          />
        </div>
      </div>
    </div>
  );
}