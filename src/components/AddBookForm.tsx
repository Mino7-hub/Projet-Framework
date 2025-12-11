'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GENRE_LIST } from '@/lib/constants';

export default function AddBookForm() {
  const router = useRouter();
  const [data, setData] = useState({ title: '', author: '', genre: [] as string[], coverImage: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/books', {
      method: 'POST',
      headers: { Authorization: `Bearer ${localStorage.getItem('token')}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (res.ok) {
      router.refresh();
      setData({ title: '', author: '', genre: [], coverImage: '' });
    } else alert((await res.text()).slice(0, 100));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
        alert('File size too large (max 2MB)');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setData({ ...data, coverImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleGenre = (genre: string) => {
    if (data.genre.includes(genre)) {
      setData({ ...data, genre: data.genre.filter((g) => g !== genre) });
    } else {
      setData({ ...data, genre: [...data.genre, genre] });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <input className="px-3 py-2 border rounded dark:bg-gray-800" placeholder="Title" required value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
      <input className="px-3 py-2 border rounded dark:bg-gray-800" placeholder="Author" required value={data.author} onChange={(e) => setData({ ...data, author: e.target.value })} />

      <div className="md:col-span-3">
        <label className="block text-sm font-medium mb-2">Genres</label>
        <div className="flex flex-wrap gap-2">
          {GENRE_LIST.map((genre) => (
            <button
              key={genre}
              type="button"
              onClick={() => toggleGenre(genre)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${data.genre.includes(genre)
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'
                }`}
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <div className="md:col-span-3">
        <label className="block text-sm font-medium mb-1">Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-[var(--color-primary)] file:text-white
              hover:file:bg-[var(--color-primary-hover)]"
        />
        {data.coverImage && (
          <img src={data.coverImage} alt="Preview" className="mt-2 h-20 w-auto object-cover rounded shadow" />
        )}
      </div>

      <button className="md:col-span-3 px-4 py-2 bg-[var(--color-primary)] text-white rounded hover:bg-[var(--color-primary-hover)] transition-colors">Add book</button>
    </form>
  );
}