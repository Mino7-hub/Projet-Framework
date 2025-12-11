'use client';
import { useBooks } from '@/stores/BookStore';
import { useState } from 'react';
import BorrowModal from './BorrowModal';
import { useRouter } from 'next/navigation';

interface Props {
  book: any;
  className?: string;
  children?: React.ReactNode;
}

export default function BorrowBtn({ book, className, children }: Props) {
  const { updateBook } = useBooks();
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const token = localStorage.getItem('token');

    if (!token) {
      // Option: Replace with a more elegant confirmation or redirect
      if (confirm("You need to be logged in to borrow books. Go to login?")) {
        router.push('/login');
      }
      return;
    }

    setIsModalOpen(true);
  };

  const handleConfirmBorrow = async (startDate: string, endDate: string) => {
    setLoading(true);
    const token = localStorage.getItem('token');
    const userId = localStorage.getItem('id');
    const userName = localStorage.getItem('name') || 'You';

    try {
      const res = await fetch(`/api/books/${book._id}/borrow`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ startDate, endDate }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = 'Borrow failed';
        try {
          const json = JSON.parse(errorText);
          errorMessage = json.error || errorMessage;
        } catch { }
        alert(errorMessage);
        return;
      }

      // Success
      updateBook({
        ...book,
        available: false,
        borrowedBy: { _id: userId, name: userName }
      });

      setIsModalOpen(false);
      router.refresh();

    } catch (error) {
      console.error(error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={handleClick}
        disabled={loading || !book.available}
        className={className || "text-xs px-2 py-1 rounded bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] disabled:bg-gray-400 disabled:cursor-not-allowed"}
      >
        {loading ? 'Processing...' : (children || 'Borrow')}
      </button>

      {isModalOpen && (
        <div onClick={(e) => e.stopPropagation()}>
          <BorrowModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            onConfirm={handleConfirmBorrow}
            loading={loading}
          />
        </div>
      )}
    </>
  );
}