'use client';

import { useEffect, useState } from 'react';
import AddBookForm from '@/components/AddBookForm';
import UsersTable from '@/components/UsersTable';
import BookManagementTable from '@/components/BookManagementTable';
import StatsCharts from '@/components/StatsCharts';
import AdminCalendar from '@/components/AdminCalendar';
import { ChartBarIcon, BookOpenIcon, UserGroupIcon, StarIcon, ListBulletIcon, ChartPieIcon, CalendarIcon } from '@heroicons/react/24/outline';

interface Stats {
    mostBooked: { _id: string, count: number }[];
    mostEndorsed: { title: string, endorsementCount: number }[];
    topUsers: { name: string, email: string, historyCount: number }[];
    totalBooks: number;
    totalUsers: number;
    activeRentals: number;
}

export default function AdminDashboard() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [activeTab, setActiveTab] = useState<'overview' | 'books' | 'users' | 'calendar'>('overview');
    const [viewMode, setViewMode] = useState<'list' | 'chart'>('list');

    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;
            try {
                const res = await fetch('/api/admin/stats', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                if (res.ok) {
                    setStats(await res.json());
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchStats();
    }, []);

    return (
        <div>
            {/* Tabs */}
            <div className="flex border-b border-[var(--color-border)] mb-8 overflow-x-auto">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'overview' ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Overview
                </button>
                <button
                    onClick={() => setActiveTab('books')}
                    className={`px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'books' ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Manage Books
                </button>
                <button
                    onClick={() => setActiveTab('users')}
                    className={`px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap ${activeTab === 'users' ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Users
                </button>
                <button
                    onClick={() => setActiveTab('calendar')}
                    className={`px-6 py-3 font-medium text-sm transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'calendar' ? 'border-b-2 border-[var(--color-primary)] text-[var(--color-primary)]' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    <CalendarIcon className="w-4 h-4" />
                    Calendar
                </button>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="space-y-8 animate-in fade-in duration-300">
                    <div className="flex justify-end gap-2">
                        {/* View toggle (keep this if we still want list view option, but maybe just chart is fine now. Let's keep it simple and just show everything nicely) */}
                    </div>

                    {!stats ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#D4AF37]"></div>
                        </div>
                    ) : (
                        <>
                            {/* Key Metrics Cards */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                                <div className="bg-[#111] p-6 rounded-xl border border-[#333] shadow-lg flex items-center gap-4 hover:border-[#D4AF37] transition-colors group">
                                    <div className="p-4 bg-[#D4AF37]/10 rounded-full group-hover:bg-[#D4AF37] transition-colors">
                                        <BookOpenIcon className="w-8 h-8 text-[#D4AF37] group-hover:text-black transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-[#A3A3A3] text-sm uppercase tracking-wider font-medium">Total Books</p>
                                        <h3 className="text-3xl font-serif font-bold text-[#F5F5F5]">{stats.totalBooks}</h3>
                                    </div>
                                </div>
                                <div className="bg-[#111] p-6 rounded-xl border border-[#333] shadow-lg flex items-center gap-4 hover:border-[#D4AF37] transition-colors group">
                                    <div className="p-4 bg-[#D4AF37]/10 rounded-full group-hover:bg-[#D4AF37] transition-colors">
                                        <UserGroupIcon className="w-8 h-8 text-[#D4AF37] group-hover:text-black transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-[#A3A3A3] text-sm uppercase tracking-wider font-medium">Total Users</p>
                                        <h3 className="text-3xl font-serif font-bold text-[#F5F5F5]">{stats.totalUsers}</h3>
                                    </div>
                                </div>
                                <div className="bg-[#111] p-6 rounded-xl border border-[#333] shadow-lg flex items-center gap-4 hover:border-[#D4AF37] transition-colors group">
                                    <div className="p-4 bg-[#D4AF37]/10 rounded-full group-hover:bg-[#D4AF37] transition-colors">
                                        <ChartBarIcon className="w-8 h-8 text-[#D4AF37] group-hover:text-black transition-colors" />
                                    </div>
                                    <div>
                                        <p className="text-[#A3A3A3] text-sm uppercase tracking-wider font-medium">Active Rentals</p>
                                        <h3 className="text-3xl font-serif font-bold text-[#F5F5F5]">{stats.activeRentals}</h3>
                                    </div>
                                </div>
                            </div>

                            {/* Charts Section */}
                            <StatsCharts stats={stats} />
                        </>
                    )}
                </div>
            )}

            {/* Books Tab */}
            {activeTab === 'books' && (
                <div className="animate-in fade-in duration-300">
                    <div className="mb-6 p-6 bg-[#1a1a1a] rounded-lg border border-dashed border-gray-600">
                        <h2 className="text-lg font-semibold mb-4 text-white">Add New Book</h2>
                        <AddBookForm />
                    </div>
                    <BookManagementTable />
                </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
                <div className="animate-in fade-in duration-300">
                    <UsersTable />
                </div>
            )}

            {/* Calendar Tab */}
            {activeTab === 'calendar' && (
                <div className="animate-in fade-in duration-300">
                    <AdminCalendar />
                </div>
            )}
        </div>
    );
}
