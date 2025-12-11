import Link from 'next/link';
import connectDB from '@/lib/db';
import { Book as BookType } from '@/types';
import HeroSection from '@/components/HeroSection';
import BookRow from '@/components/BookRow';

export const dynamic = 'force-dynamic';

async function getFeatured(): Promise<BookType[]> {
  await connectDB();
  const Book = (await import('@/models/Book')).default();
  const raw = await Book.find({ available: true }).limit(6).lean();
  return raw.map((b: any) => ({
    _id: b._id.toString(),
    title: b.title,
    author: b.author,
    genre: b.genre,
    available: b.available,
    coverImage: b.coverImage,
    borrowedBy: b.borrowedBy
      ? { _id: b.borrowedBy._id.toString(), name: b.borrowedBy.name }
      : null,
  }));
}



export default async function HomePage() {
  const books = await getFeatured();
  const featuredBook = books[0]; // Simple selection for now

  // Checking hydration

  // Categorize books for rows (mock categorization)
  const trending = books.slice(0, 10);
  const newReleases = books.slice(2, 8);
  const sciFi = books.filter(b => {
    const genres = Array.isArray(b.genre) ? b.genre : [b.genre || ''];
    return genres.some(g => g.toLowerCase().includes('sci-fi') || g.toLowerCase().includes('science'));
  });
  const fantasy = books.filter(b => {
    const genres = Array.isArray(b.genre) ? b.genre : [b.genre || ''];
    return genres.some(g => g.toLowerCase().includes('fantasy'));
  });


  return (
    <div className="bg-[#141414] min-h-screen text-white pb-20 overflow-x-hidden">
      <HeroSection book={featuredBook} />

      <div className="-mt-32 relative z-20 pl-4 md:pl-12">
        {/* First row overlaps hero */}
        <BookRow title="Trending Now" books={trending} />
        <BookRow title="New Releases" books={newReleases} />
        {sciFi.length > 0 && <BookRow title="Sci-Fi & Cyberpunk" books={sciFi} />}
        {fantasy.length > 0 && <BookRow title="Fantasy Worlds" books={fantasy} />}
      </div>
    </div>
  );
}