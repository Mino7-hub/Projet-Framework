'use client';

import { useEffect, useState } from 'react';
import EditBookModal from './EditBookModal';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function BookManagementTable() {
    const [books, setBooks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [editingBook, setEditingBook] = useState<any | null>(null);

    const fetchBooks = async () => {
        setLoading(true);
        try {
            // Re-using public GET for list, but in real app might want specific admin GET
            // For now this is sufficient as we filter on client or server
            const res = await fetch('/api/books');
            if (res.ok) {
                setBooks(await res.json());
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, []);

    const handleDelete = async (id: string, e: React.MouseEvent) => {
        e.stopPropagation(); // Prevent row click
        if (!confirm('Are you sure you want to delete this book?')) return;

        const token = localStorage.getItem('token');
        try {
            const res = await fetch(`/api/books/${id}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            if (res.ok) {
                setBooks(books.filter(b => b._id !== id));
            } else {
                alert('Failed to delete');
            }
        } catch (err) {
            alert('Error deleting book');
        }
    };

    const filteredBooks = books.filter(b =>
        b.title.toLowerCase().includes(search.toLowerCase()) ||
        b.author.toLowerCase().includes(search.toLowerCase()) ||
        (Array.isArray(b.genre) ? b.genre.some((g: string) => g.toLowerCase().includes(search.toLowerCase())) : b.genre?.toLowerCase().includes(search.toLowerCase()))
    );

    return (
        <div>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search books..."
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-[var(--color-primary)] outline-none"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="text-center py-8">Loading books...</div>
            ) : (
                <div className="overflow-x-auto bg-[#1a1a1a] rounded-lg border border-[var(--color-border)]">
                    <table className="w-full text-left border-collapse">
                        <thead className="bg-gray-800 text-sm text-white uppercase">
                            <tr>
                                <th className="px-6 py-3 font-medium">Cover</th>
                                <th className="px-6 py-3 font-medium">Title</th>
                                <th className="px-6 py-3 font-medium">Author</th>
                                <th className="px-6 py-3 font-medium">Genre</th>
                                <th className="px-6 py-3 font-medium">Status</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {filteredBooks.map((book) => (
                                <tr
                                    key={book._id}
                                    onClick={() => setEditingBook(book)}
                                    className="hover:bg-gray-800 cursor-pointer transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        {book.coverImage ? (
                                            <img src={book.coverImage} alt="" className="h-10 w-8 object-cover rounded border" />
                                        ) : (
                                            <div className="h-10 w-8 bg-gray-200 rounded flex items-center justify-center text-xs">📖</div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 font-medium text-white">{book.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-300">{book.author}</td>
                                    <td className="px-6 py-4 text-sm text-gray-400">
                                        {Array.isArray(book.genre) ? book.genre.join(', ') : book.genre}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded-full text-xs ${book.available ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                                            {book.available ? 'Available' : 'Borrowed'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button
                                            onClick={(e) => handleDelete(book._id, e)}
                                            className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                                            title="Delete Book"
                                        >
                                            <TrashIcon className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {filteredBooks.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-8 text-gray-400">
                                        No books found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}

            {editingBook && (
                <EditBookModal
                    book={editingBook}
                    onClose={() => setEditingBook(null)}
                    onUpdate={fetchBooks}
                />
            )}
        </div>
    );
}
