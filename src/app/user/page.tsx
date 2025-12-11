// app/user/page.tsx - WITH DEBUGGING
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

type Book = {
  _id: string;
  title: string;
  author: string;
  genre: string;
  available: boolean;
};

export default function UserPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const router = useRouter();

  useEffect(() => {
    async function fetchMyBooks() {
      try {
        const token = localStorage.getItem('token');
        console.log('Token:', token); // Debug
        if (!token) {
          router.push('/login');
          return;
        }

        const res = await fetch('/api/books/my-books', {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log('API Response status:', res.status); // Debug

        if (res.ok) {
          const myBooks = await res.json();
          console.log('Fetched books:', myBooks); // Debug
          setBooks(myBooks);
        } else {
          const errorData = await res.json();
          setError(errorData.error || 'Failed to fetch books');
        }
      } catch (error) {
        console.error('Failed to fetch books:', error);
        setError('Network error');
      } finally {
        setLoading(false);
      }
    }

    fetchMyBooks();
  }, [router]);

  const handleReturn = async (bookId: string) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const res = await fetch(`/api/books/${bookId}/return`, {
        method: 'PATCH',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        // Remove the returned book from the list
        setBooks(books.filter(book => book._id !== bookId));
      } else {
        const errorData = await res.json();
        alert(errorData.error || 'Return failed');
      }
    } catch (error) {
      console.error('Return error:', error);
      alert('Network error during return');
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center">Loading your books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="text-center text-red-500">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">Check the browser console for details</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-2">My Shelf</h1>
      <p className="text-gray-600 dark:text-gray-400 mb-8">Manage your borrowed books</p>

      <div className="mb-6 grid grid-cols-3 gap-4 text-center">
        <div className="p-4 bg-white dark:bg-gray-900 rounded-lg shadow">
          <p className="text-2xl font-bold text-[var(--color-primary)]">{books.length}</p>
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

      {books.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {books.map((book) => (
            <div key={book._id} className="border rounded-lg p-3 bg-white dark:bg-gray-900 shadow-sm">
              <h4 className="font-semibold text-sm truncate">{book.title}</h4>
              <p className="text-xs text-gray-500 dark:text-gray-400">{book.author}</p>
              <p className="text-xs text-gray-400 dark:text-gray-500">{book.genre}</p>
              <div className="mt-2 flex justify-between items-center">
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-700">
                  Borrowed
                </span>
                <button
                  onClick={() => handleReturn(book._id)}
                  className="text-xs px-2 py-1 rounded bg-gray-200 text-gray-800 hover:bg-gray-300"
                >
                  Return
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            You haven't borrowed any books yet
          </p>
          <button
            onClick={() => router.push('/browse')}
            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary-hover)] transition-colors"
          >
            Browse Books
          </button>
        </div>
      )}
    </div>
  );
}