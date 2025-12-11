'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface HistoryItem {
    bookId: string;
    title: string;
    borrowedDate: string;
    returnedDate?: string;
}

export default function HistoryPage() {
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchHistory = async () => {
            const token = localStorage.getItem('token');
            if (!token) return router.push('/login');

            try {
                const res = await fetch('/api/user/history', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setHistory(data.history);
                }
            } catch (err) {
                console.error(err);
            }
            setLoading(false);
        };

        fetchHistory();
    }, [router]);

    if (loading) return <div className="p-10 text-center">Loading history...</div>;

    return (
        <div className="max-w-4xl mx-auto px-6 py-8">
            <h1 className="text-3xl font-bold font-serif mb-6 text-[var(--color-primary)]">Borrowing History</h1>

            {history.length === 0 ? (
                <p className="text-gray-500">You haven't borrowed any books yet.</p>
            ) : (
                <div className="card glass overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-[var(--color-border)]">
                            <tr>
                                <th className="px-6 py-3 text-sm font-medium text-gray-500">Book Title</th>
                                <th className="px-6 py-3 text-sm font-medium text-gray-500">Borrowed On</th>
                                <th className="px-6 py-3 text-sm font-medium text-gray-500">Returned On</th>
                                <th className="px-6 py-3 text-sm font-medium text-gray-500">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[var(--color-border)]">
                            {history.map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-medium">{item.title}</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(item.borrowedDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {item.returnedDate ? new Date(item.returnedDate).toLocaleDateString() : '-'}
                                    </td>
                                    <td className="px-6 py-4">
                                        {item.returnedDate ? (
                                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">Returned</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">Active</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
