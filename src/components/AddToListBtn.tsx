'use client';

import { useState, useEffect } from 'react';
import { PlusIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface Props {
    bookId: string;
    className?: string;
    onToggle?: (added: boolean) => void;
    iconOnly?: boolean;
}

export default function AddToListBtn({ bookId, className, onToggle, iconOnly = false }: Props) {
    const [added, setAdded] = useState(false);
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Optimistically check local storage or fetch (optional, for now we can just assume false or check if we want)
        // Ideally, we'd pass `isInList` as a prop if we have it from the parent. 
        // For accurate state, we might need to fetch `my-list` ids on mount or in a parent provider.
        // For this iteration, let's keep it simple and just allow toggling or we can check via a small fetch if we want to be perfect.
        // Let's check via a lightweight fetch or just rely on user interaction for now to save bandwidth, 
        // BUT for a "book details" page, we really want to know if it is already added.

        const checkStatus = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                // This is a bit heavy to do for every button if we have many on a page (like browse)
                // but okay for details page. 
                // For a grid, it's better if the parent passes `isAdded`.
                // Let's stick to a simple toggle for now unless we are sure.

                // Actually, let's fetch the list once in the provider or just fetch status here if it's the details page.
                // Or better, let's just make the button toggle-able.
            } catch (e) {
                console.error(e);
            }
        };
        // checkStatus();
    }, [bookId]);

    // Better approach: We should probably fetch the user's list context, but we don't have one user context.
    // Let's just assume for now we click to add/remove. 
    // To be cleaner, let's allow passing `initialAdded` if known.

    const handleClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem('token');
        if (!token) {
            if (confirm("Login to access My List?")) {
                router.push('/login');
            }
            return;
        }

        setLoading(true);
        // Optimistic UI
        const previousState = added;
        setAdded(!added);

        try {
            const res = await fetch(`/api/user/my-list/${bookId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!res.ok) throw new Error('Failed to toggle');

            const data = await res.json();
            setAdded(data.isAdded);
            if (onToggle) onToggle(data.isAdded);

            // If we are on the my-list page, we might want to refresh
            if (window.location.pathname === '/my-list') {
                router.refresh();
            }

        } catch (error) {
            console.error(error);
            setAdded(previousState); // Revert
            alert('Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleClick}
            disabled={loading}
            className={className || "flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-600 hover:border-white transition-all text-sm"}
        >
            {loading ? (
                <span className="w-4 h-4 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
            ) : added ? (
                <CheckIcon className="w-5 h-5 text-green-500" />
            ) : (
                <PlusIcon className="w-5 h-5" />
            )}
            {!iconOnly && <span>{added ? 'Added' : 'My List'}</span>}
        </button>
    );
}
