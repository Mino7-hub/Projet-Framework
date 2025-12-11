import connectDB from '@/lib/db';
import { Book as BookType } from '@/types';
import NavBar from '@/components/NavBar';
import BookRow from '@/components/BookRow';
import BorrowBtn from '@/components/BorrowBtn';
import AddToListBtn from '@/components/AddToListBtn';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getBook(id: string): Promise<BookType | null> {
    try {
        await connectDB();
        const Book = (await import('@/models/Book')).default();
        const book = await Book.findById(id).lean() as any;
        if (!book) return null;
        return {
            _id: book._id.toString(),
            title: book.title,
            author: book.author,
            genre: book.genre,
            available: book.available,
            coverImage: book.coverImage,
            borrowedBy: book.borrowedBy ? { _id: book.borrowedBy._id.toString(), name: book.borrowedBy.name } : null,
            endorsements: book.endorsements?.map((e: any) => e.toString()) || []
        };
    } catch {
        return null;
    }
}

async function getSimilarBooks(genres: string[] | string, excludeId: string): Promise<BookType[]> {
    try {
        await connectDB();
        const Book = (await import('@/models/Book')).default();

        // Handle both array and single string for backward compatibility
        const genreList = Array.isArray(genres) ? genres : [genres];

        // Find books that have at least one matching genre
        const books = await Book.find({
            genre: { $in: genreList },
            _id: { $ne: excludeId }
        }).limit(10).lean() as any[];

        return books.map((b: any) => ({
            _id: b._id.toString(),
            title: b.title,
            author: b.author,
            genre: b.genre,
            available: b.available,
            coverImage: b.coverImage,
            borrowedBy: b.borrowedBy ? { _id: b.borrowedBy._id.toString(), name: b.borrowedBy.name } : null,
            endorsements: b.endorsements?.map((e: any) => e.toString()) || []
        }));
    } catch {
        return [];
    }
}

export default async function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const book = await getBook(id);
    if (!book) notFound();

    const similarBooks = book.genre ? await getSimilarBooks(book.genre, book._id) : [];
    const genreDisplay = Array.isArray(book.genre) ? book.genre.join(', ') : book.genre;

    return (
        <div className="bg-black min-h-screen text-white font-sans">
            {/* Background Blur */}
            <div className="fixed inset-0 z-0 opacity-30 select-none pointer-events-none">
                {book.coverImage && (
                    <img src={book.coverImage} alt="" className="w-full h-full object-cover blur-3xl scale-125" />
                )}
                <div className="absolute inset-0 bg-black/80"></div>
            </div>

            <div className="relative z-10">

                <div className="max-w-6xl mx-auto px-6 pt-32 pb-12">
                    <div className="flex flex-col md:flex-row gap-12 items-start">
                        {/* Left: Poster */}
                        <div className="w-full md:w-1/3 max-w-[320px] rounded-lg shadow-[0_0_30px_rgba(212,175,55,0.2)] overflow-hidden border border-gray-800">
                            {book.coverImage ? (
                                <img src={book.coverImage} alt={book.title} className="w-full h-auto" />
                            ) : (
                                <div className="h-96 bg-gray-800 flex items-center justify-center text-4xl">📚</div>
                            )}
                        </div>

                        {/* Right: Info */}
                        <div className="flex-1">
                            <h1 className="text-4xl md:text-6xl font-serif font-bold mb-2 text-[var(--color-primary)]">{book.title}</h1>
                            <p className="text-xl text-gray-300 italic mb-6">by {book.author}</p>

                            <div className="flex items-center gap-4 text-sm text-gray-400 mb-8 border-y border-gray-800 py-4">
                                <span className="uppercase tracking-widest">{genreDisplay}</span>
                                <span>•</span>
                                <span>2024</span>
                                <span>•</span>
                                <span className={book.available ? "text-green-500 font-bold" : "text-red-500 font-bold"}>
                                    {book.available ? 'AVAILABLE' : 'BORROWED'}
                                </span>
                            </div>

                            <p className="text-gray-300 leading-relaxed text-lg mb-8 max-w-2xl">
                                Immerse yourself in this captivating story. A journey through the mind of {book.author} that explores themes of matching tags.
                                Perfect for readers who enjoy {genreDisplay} and compelling narratives.
                            </p>

                            <div className="flex gap-4">
                                {book.available ? (
                                    <BorrowBtn
                                        book={book}
                                        className="px-8 py-3 bg-[var(--color-primary)] text-black font-bold rounded hover:bg-[#B5952F] hover:scale-105 transition-all shadow-[0_0_15px_rgba(212,175,55,0.5)]"
                                    >
                                        Borrow Book
                                    </BorrowBtn>
                                ) : (
                                    <button disabled className="px-8 py-3 bg-red-900/20 border border-red-900 text-red-500 font-bold rounded cursor-not-allowed">
                                        Currently Unavailable
                                    </button>
                                )}

                                <AddToListBtn
                                    bookId={book._id}
                                    className="px-8 py-3 border border-gray-600 rounded text-white hover:border-white hover:bg-white/5 transition-all flex items-center gap-2 cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Similar Section */}
                    <div className="mt-24">
                        <BookRow title="Similar Titles" books={similarBooks} />
                    </div>
                </div>
            </div>
        </div>
    );
}
