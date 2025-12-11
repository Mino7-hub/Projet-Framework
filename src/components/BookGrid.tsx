// TEMPORARY: components/BookGrid.tsx - TEST VERSION
import connectDB from '@/lib/db';
import BookCard from './BookCard';

async function getBooks(search: string, page: number = 1) {
  await connectDB();
  const getBookModel = (await import('@/models/Book')).default;
  const Book = getBookModel();
  const limit = 24;
  const skip = (page - 1) * limit;

  let query = {};
  if (search.trim()) {
    query = {
      $or: [
        { title: { $regex: search, $options: 'i' } },
        { author: { $regex: search, $options: 'i' } },
        { genre: { $regex: search, $options: 'i' } },
      ],
    };
  }

  const totalDocs = await Book.countDocuments(query);

  const raw = await Book.find(query)
    .skip(skip)
    .limit(limit)
    .lean();

  console.log('Found books:', raw.length, 'Total:', totalDocs); // Debug log

  const books = raw.map((b: any) => ({
    _id: b._id.toString(),
    title: b.title,
    author: b.author,
    genre: b.genre,
    available: b.available,
    coverImage: b.coverImage,
    endorsements: b.endorsements?.map((id: any) => id.toString()) || [],
  }));

  return { books, totalDocs };
}

export default async function BookGrid({ q, page = 1 }: { q: string; page?: number }) {
  try {
    const { books, totalDocs } = await getBooks(q, page);
    console.log('BookGrid rendering with:', books.length, 'books'); // Debug

    if (books.length === 0) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500 dark:text-gray-400">No books match "{q}"</p>
          <a href="/browse" className="text-[var(--color-primary)] hover:underline">Clear search</a>
        </div>
      );
    }

    const totalPages = Math.ceil(totalDocs / 24);

    return (
      <>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {books.map((book) => (
            <BookCard key={book._id} book={book} />
          ))}
        </div>

        {/* Pagination Controls */}
        <div className="flex justify-center items-center gap-4 mt-8">
          {page > 1 && (
            <a
              href={`/browse?q=${q}&page=${page - 1}`}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              Previous
            </a>
          )}

          <span className="text-sm text-gray-500">
            Page {page} of {totalPages}
          </span>

          {page < totalPages && (
            <a
              href={`/browse?q=${q}&page=${page + 1}`}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-800 rounded hover:bg-gray-300 dark:hover:bg-gray-700 transition"
            >
              Next
            </a>
          )}
        </div>
      </>
    );
  } catch (error) {
    console.error('BookGrid error:', error);
    return (
      <div className="text-center py-10 text-red-500">
        Error loading books. Check console.
      </div>
    );
  }
}