'use client';

import { Book } from '@/types';
import Link from 'next/link';

export default function HeroSection({ book }: { book: Book }) {
    if (!book) return <div className="relative h-[80vh] w-full bg-[#141414]" />;

    return (
        <div className="relative h-[80vh] w-full">
            {/* Background Image */}
            <div className="absolute inset-0">
                <img
                    src={book.coverImage || 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=2070&auto=format&fit=crop'}
                    alt="Hero Background"
                    className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#141414] via-[#141414]/60 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-transparent to-transparent"></div>
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col justify-center h-full px-4 md:px-12 max-w-2xl pt-20">
                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-lg font-serif">
                    {book.title}
                </h1>
                <p className="text-lg text-gray-200 mb-8 font-medium drop-shadow-md line-clamp-3">
                    {/* Simulation of a description since we don't have one in schema yet */}
                    Dive into the world of {book.author} with this masterpiece of {Array.isArray(book.genre) ? book.genre.join(', ') : book.genre}.
                    A compelling narrative that will keep you on the edge of your seat.
                </p>

                <div className="flex gap-4">
                    <Link href={`/book/${book._id}`} className="px-8 py-3 bg-[#D4AF37] text-black font-bold rounded hover:bg-[#B5952F] transition flex items-center gap-2 shadow-[0_0_15px_rgba(212,175,55,0.4)] hover:scale-105 transform duration-200">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                        </svg>
                        Read
                    </Link>
                    <button className="px-8 py-3 bg-gray-500/70 text-white font-bold rounded hover:bg-gray-500/50 transition flex items-center gap-2 backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                        </svg>
                        More Info
                    </button>
                </div>
            </div>
        </div>
    );
}
