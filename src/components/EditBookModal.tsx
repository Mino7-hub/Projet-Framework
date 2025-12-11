'use client';
import { useState } from 'react';
import { GENRE_LIST } from '@/lib/constants';

type Book = {
    _id: string;
    title: string;
    author: string;
    genre: string[] | string; // Handle legacy string genre
    available: boolean;
    coverImage?: string;
};

interface EditBookModalProps {
    book: Book;
    onClose: () => void;
    onUpdate: () => void;
}

export default function EditBookModal({ book, onClose, onUpdate }: EditBookModalProps) {
    const [formData, setFormData] = useState({
        title: book.title,
        author: book.author,
        genre: Array.isArray(book.genre) ? book.genre : (book.genre ? [book.genre] : []),
        available: book.available,
        coverImage: book.coverImage || '',
    });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('token');

        try {
            const res = await fetch(`/api/books/${book._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                onUpdate();
                onClose();
            } else {
                alert('Failed to update book');
            }
        } catch (error) {
            console.error(error);
            alert('Error updating book');
        } finally {
            setLoading(false);
        }
    };

    const toggleGenre = (genre: string) => {
        const currentGenres = formData.genre;
        if (currentGenres.includes(genre)) {
            setFormData({ ...formData, genre: currentGenres.filter(g => g !== genre) });
        } else {
            setFormData({ ...formData, genre: [...currentGenres, genre] });
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl">
                <h2 className="text-xl font-bold mb-4">Edit Book</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Title</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1">Author</label>
                        <input
                            type="text"
                            required
                            className="w-full px-3 py-2 border rounded dark:bg-gray-700"
                            value={formData.author}
                            onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Genres</label>
                        <div className="flex flex-wrap gap-2">
                            {GENRE_LIST.map((genre) => (
                                <button
                                    key={genre}
                                    type="button"
                                    onClick={() => toggleGenre(genre)}
                                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${formData.genre.includes(genre)
                                            ? 'bg-[var(--color-primary)] text-white'
                                            : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                                        }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Cover Image</label>
                        <div className="flex items-center gap-4">
                            {formData.coverImage && (
                                <img src={formData.coverImage} alt="Cover" className="h-16 w-12 object-cover rounded border" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => {
                                    const file = e.target.files?.[0];
                                    if (file) {
                                        if (file.size > 2 * 1024 * 1024) return alert('File size too large (max 2MB)');
                                        const reader = new FileReader();
                                        reader.onloadend = () => setFormData({ ...formData, coverImage: reader.result as string });
                                        reader.readAsDataURL(file);
                                    }
                                }}
                                className="block w-full text-sm text-gray-500
                                file:mr-4 file:py-2 file:px-4
                                file:rounded-full file:border-0
                                file:text-sm file:font-semibold
                                file:bg-[var(--color-primary)] file:text-white
                                hover:file:bg-[var(--color-primary-hover)]"
                            />
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="available"
                            className="w-4 h-4"
                            checked={formData.available}
                            onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                        />
                        <label htmlFor="available" className="text-sm">Available for borrowing</label>
                    </div>

                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary-hover)] disabled:opacity-50"
                        >
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
