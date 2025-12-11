'use client';

import { useState, useEffect } from 'react';

type Borrowing = {
    title: string;
    borrowedBy: {
        _id: string;
        name: string;
    } | null;
    borrowedStartDate: string;
    borrowedEndDate: string;
};

export default function AdminCalendar() {
    const [borrowings, setBorrowings] = useState<Borrowing[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentMonth, setCurrentMonth] = useState(new Date());

    useEffect(() => {
        fetch('/api/admin/calendar')
            .then(res => res.json())
            .then(data => {
                setBorrowings(data.borrowings);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    }, []);

    const daysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getDayDetails = (day: number) => {
        const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        const dateStr = date.toISOString().split('T')[0];

        return borrowings.filter(b => {
            if (!b.borrowedStartDate || !b.borrowedEndDate) return false;
            const start = b.borrowedStartDate.split('T')[0];
            const end = b.borrowedEndDate.split('T')[0];
            return dateStr >= start && dateStr <= end;
        });
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    if (loading) return <div className="p-4">Loading calendar...</div>;

    return (
        <div className="bg-[#1a1a1a] rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-serif font-bold text-white">
                    {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="p-2 hover:bg-gray-700 rounded-full text-white">←</button>
                    <button onClick={nextMonth} className="p-2 hover:bg-gray-700 rounded-full text-white">→</button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                    <div key={day} className="text-center font-bold text-gray-400 text-sm py-2">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1 border-t border-gray-700 bg-gray-800">
                {Array.from({ length: new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay() }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-32 bg-gray-900/50"></div>
                ))}
                {Array.from({ length: daysInMonth(currentMonth) }).map((_, i) => {
                    const day = i + 1;
                    const books = getDayDetails(day);
                    const isToday = new Date().toDateString() === new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day).toDateString();

                    return (
                        <div key={day} className={`h-32 bg-gray-900 p-2 border border-gray-700 overflow-y-auto ${isToday ? 'bg-blue-900' : ''}`}>
                            <div className={`text-sm font-semibold mb-1 ${isToday ? 'text-blue-400' : 'text-white'}`}>
                                {day}
                            </div>
                            <div className="flex flex-col gap-1">
                                {books.map((book, idx) => (
                                    <div key={idx} className="text-[10px] bg-red-100 text-red-800 rounded px-1 py-0.5 truncate" title={`${book.title} - ${book.borrowedBy?.name}`}>
                                        {book.title}
                                    </div>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
