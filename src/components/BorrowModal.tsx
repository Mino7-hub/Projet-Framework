'use client';

import { useState } from 'react';

export default function BorrowModal({
    isOpen,
    onClose,
    onConfirm,
    loading
}: {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (start: string, end: string) => void;
    loading: boolean;
}) {
    const [viewDate, setViewDate] = useState(new Date());
    const [startDate, setStartDate] = useState<Date | null>(null);
    const [endDate, setEndDate] = useState<Date | null>(null);

    if (!isOpen) return null;

    const daysInMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const firstDayOfMonth = (date: Date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const handleDateClick = (day: number) => {
        const selectedDate = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        selectedDate.setHours(0, 0, 0, 0);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (selectedDate < today) return; // Cannot select past dates

        if (!startDate || (startDate && endDate)) {
            // Start new selection
            setStartDate(selectedDate);
            setEndDate(null);
        } else {
            // Complete selection
            if (selectedDate < startDate) {
                setEndDate(startDate);
                setStartDate(selectedDate);
            } else {
                setEndDate(selectedDate);
            }
        }
    };

    const isSelected = (day: number) => {
        if (!startDate) return false;
        const current = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        if (endDate) {
            return current >= startDate && current <= endDate;
        }
        return current.getTime() === startDate.getTime();
    };

    const isRangeStart = (day: number) => {
        if (!startDate) return false;
        const current = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        return current.getTime() === startDate.getTime();
    };

    const isRangeEnd = (day: number) => {
        if (!endDate) return false;
        const current = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
        return current.getTime() === endDate.getTime();
    };

    const handleConfirm = (e: React.FormEvent) => {
        e.preventDefault();
        if (!startDate || !endDate) return;

        // Format as YYYY-MM-DD (local time)
        const format = (d: Date) => {
            const offset = d.getTimezoneOffset();
            const local = new Date(d.getTime() - (offset * 60 * 1000));
            return local.toISOString().split('T')[0];
        };

        onConfirm(format(startDate), format(endDate));
    };

    const prevMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
            <div className="bg-[#121212] rounded-xl shadow-[0_0_50px_rgba(212,175,55,0.2)] w-full max-w-2xl p-8 border border-[#333] animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-3xl font-serif font-bold text-[var(--color-primary)]">Select Dates</h2>
                        <p className="text-gray-400 mt-1">Select check-in and check-out dates.</p>
                    </div>
                    <button onClick={onClose} className="text-gray-500 hover:text-white text-2xl">&times;</button>
                </div>

                <div className="bg-[#1a1a1a] rounded-lg p-6 border border-gray-800">
                    {/* Calendar Header */}
                    <div className="flex justify-between items-center mb-6">
                        <button onClick={prevMonth} className="text-gray-400 hover:text-white p-2">
                            ←
                        </button>
                        <h3 className="text-xl font-bold text-white">
                            {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </h3>
                        <button onClick={nextMonth} className="text-gray-400 hover:text-white p-2">
                            →
                        </button>
                    </div>

                    {/* Calendar Grid */}
                    <div className="grid grid-cols-7 gap-2 mb-2">
                        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                            <div key={day} className="text-center font-bold text-gray-500 text-sm">
                                {day}
                            </div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-2">
                        {Array.from({ length: firstDayOfMonth(viewDate) }).map((_, i) => (
                            <div key={`empty-${i}`} className="h-12"></div>
                        ))}
                        {Array.from({ length: daysInMonth(viewDate) }).map((_, i) => {
                            const day = i + 1;
                            const date = new Date(viewDate.getFullYear(), viewDate.getMonth(), day);
                            const today = new Date();
                            today.setHours(0, 0, 0, 0);
                            const isPast = date < today;
                            const isSelectedDay = isSelected(day);
                            const isStart = isRangeStart(day);
                            const isEnd = isRangeEnd(day);

                            return (
                                <button
                                    key={day}
                                    onClick={() => !isPast && handleDateClick(day)}
                                    disabled={isPast}
                                    className={`
                                        h-12 w-full rounded-md flex items-center justify-center text-sm transition-all relative
                                        ${isPast ? 'text-gray-700 cursor-not-allowed' : 'text-gray-300 hover:bg-gray-800'}
                                        ${isSelectedDay ? 'bg-[rgba(212,175,55,0.2)] text-[var(--color-primary)] font-bold' : ''}
                                        ${isStart ? '!bg-[var(--color-primary)] !text-black shadow-[0_0_10px_var(--color-primary)]' : ''}
                                        ${isEnd ? '!bg-[var(--color-primary)] !text-black shadow-[0_0_10px_var(--color-primary)]' : ''}
                                    `}
                                >
                                    {day}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="flex justify-end gap-4 mt-8">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 text-gray-400 hover:text-white transition-colors uppercase tracking-wider text-sm font-bold"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading || !startDate || !endDate}
                        className="px-8 py-3 bg-[var(--color-primary)] text-black font-bold rounded hover:bg-[#B5952F] hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                    >
                        {loading ? 'Confirming...' : 'Confirm Dates'}
                    </button>
                </div>
            </div>
        </div>
    );
}
