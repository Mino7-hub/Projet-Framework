'use client';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

interface Stats {
    mostBooked: { _id: string, count: number }[];
    mostEndorsed: { title: string, endorsementCount: number }[];
    topUsers: { name: string, email: string, historyCount: number }[];
    totalBooks: number;
    totalUsers: number;
    activeRentals: number;
}

const GOLD = '#D4AF37';
const GOLD_HOVER = '#B5952F';
const BG_DARK = '#1A1A1A';
const TEXT_LIGHT = '#F5F5F5';
const TEXT_MUTED = '#A3A3A3';

const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-black/90 p-3 border border-[#333] shadow-xl rounded-lg text-sm backdrop-blur-sm">
                <p className="font-serif font-bold text-[#D4AF37] mb-1">{label || payload[0].name}</p>
                <p className="text-[#F5F5F5]">
                    {payload[0].value} {payload[0].dataKey === 'count' ? 'borrows' : payload[0].dataKey === 'endorsementCount' ? 'likes' : 'books'}
                </p>
            </div>
        );
    }
    return null;
};

export default function StatsCharts({ stats }: { stats: Stats }) {
    // Transform data for charts
    const bookData = stats.mostBooked.map(b => ({ name: b._id.length > 20 ? b._id.substring(0, 20) + '...' : b._id, count: b.count, fullTitle: b._id }));
    const rateData = stats.mostEndorsed.map(b => ({ name: b.title.length > 20 ? b.title.substring(0, 20) + '...' : b.title, endorsementCount: b.endorsementCount, fullTitle: b.title }));
    const userData = stats.topUsers.map(u => ({ name: u.name, historyCount: u.historyCount }));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in duration-500">
            {/* Most Borrowed Books - Bar Chart for better name readability */}
            <div className="bg-[#111] p-6 rounded-xl border border-[#333] h-[400px] flex flex-col shadow-lg">
                <h3 className="text-lg font-serif font-bold mb-6 text-[#F5F5F5] border-l-4 border-[#D4AF37] pl-3">Most Popular Books</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={bookData} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                        <XAxis type="number" stroke={TEXT_MUTED} tickLine={false} axisLine={false} />
                        <YAxis type="category" dataKey="name" stroke={TEXT_LIGHT} width={150} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#333', opacity: 0.4 }} />
                        <Bar dataKey="count" fill={GOLD} radius={[0, 4, 4, 0]} barSize={20} />
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Top Rated - Donut Chart */}
            <div className="bg-[#111] p-6 rounded-xl border border-[#333] h-[400px] flex flex-col shadow-lg">
                <h3 className="text-lg font-serif font-bold mb-6 text-[#F5F5F5] border-l-4 border-[#D4AF37] pl-3">Top Rated Books</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={rateData}
                            cx="50%"
                            cy="50%"
                            innerRadius={80}
                            outerRadius={110}
                            paddingAngle={5}
                            dataKey="endorsementCount"
                            stroke="none"
                        >
                            {rateData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={index === 0 ? GOLD : index === 1 ? '#C5A028' : index === 2 ? '#B5952F' : '#A68A26'} fillOpacity={1 - (index * 0.15)} />
                            ))}
                        </Pie>
                        <Tooltip content={<CustomTooltip />} />
                        <Legend iconType="circle" wrapperStyle={{ color: TEXT_MUTED }} />
                    </PieChart>
                </ResponsiveContainer>
            </div>

            {/* Top Readers - Bar Chart */}
            <div className="bg-[#111] p-6 rounded-xl border border-[#333] h-[400px] flex flex-col shadow-lg lg:col-span-2">
                <h3 className="text-lg font-serif font-bold mb-6 text-[#F5F5F5] border-l-4 border-[#D4AF37] pl-3">Most Active Readers</h3>
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={userData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#333" />
                        <XAxis dataKey="name" stroke={TEXT_MUTED} tickLine={false} axisLine={false} />
                        <YAxis stroke={TEXT_MUTED} tickLine={false} axisLine={false} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#333', opacity: 0.4 }} />
                        <Bar dataKey="historyCount" fill={GOLD} radius={[4, 4, 0, 0]} maxBarSize={50} />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}
