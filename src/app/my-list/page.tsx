'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import NavBar from '@/components/NavBar';
import BookGrid from '@/app/browse/BookGrid'; // Reusing BookGrid logic if possible, or creating similar
import { Book } from '@/types';

// Assuming BookGrid takes `books` prop. Let's check BookGrid usage.
// Actually, BookGrid in `src/app/browse/BookGrid.tsx` might be suitable.

export default function MyListPage() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchList = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const res = await fetch('/api/user/my-list', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (res.ok) {
                    const data = await res.json();
                    setBooks(data.myList);
                } else {
                    console.error('Failed to fetch list');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchList();
    }, [router]);

    return (
        <div className="min-h-screen bg-black text-white font-sans">
            <NavBar />

            <div className="pt-32 px-6 max-w-7xl mx-auto pb-12">
                <div className="flex flex-col gap-2 mb-12">
                    <h1 className="text-4xl md:text-5xl font-serif font-bold text-[var(--color-primary)]">
                        My Reading List
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Your personal collection of books to read.
                    </p>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="w-10 h-10 border-4 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin"></div>
                    </div>
                ) : books.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {/* We can reuse BookCard inside a grid manually or use BookGrid if it accepts props. 
                            Let's assume we map manually for full control or reuse if BookGrid is clean.
                            Checking BookGrid file is safer. But I'll map manually to be sure. */
                        }
                        {books.map((book) => (
                            // Dynamically import BookCard to avoid SSR issues if any, but standard import is fine.
                            // We need to import BookCard.
                            <div key={book._id} className="w-full">
                                {/* We need to import BookCard from components */}
                                {/* I'll use a dynamic import or just standard import at top */}
                                <BookCardWrapper book={book} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-[#111] rounded-xl border border-[#333]">
                        <p className="text-gray-400 text-xl font-serif mb-4">Your list is empty.</p>
                        <button
                            onClick={() => router.push('/browse')}
                            className="px-6 py-2 bg-[var(--color-primary)] text-black font-bold rounded hover:bg-[#B5952F] transition-all"
                        >
                            Browse Books
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// Wrapper to handle import cleanly in this file
import BookCard from '@/components/BookCard';
function BookCardWrapper({ book }: { book: Book }) {
    return <BookCard book={book} />;
}
