import connectDB from '@/lib/db';
import BookCard from '@/components/BookCard';
import { Book as BookType } from '@/types';

export default async function BookGrid({ searchParams }: { searchParams: { q?: string } }) {
  await connectDB();
  const q = searchParams.q || '';
  const Book = (await import('@/models/Book')).default();
  const raw = await Book.find({
    $or: [
      { title: { $regex: q, $options: 'i' } },
      { author: { $regex: q, $options: 'i' } },
      { genre: { $regex: q, $options: 'i' } },
    ],
  }).lean();

  // map vers un vrai type Book
  const books: BookType[] = raw.map((b: any) => ({
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

  if (books.length === 0) return <p>No books match "{q}"</p>;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
      {books.map((b) => (
        <BookCard key={b._id} book={b} />
      ))}
    </div>
  );
}