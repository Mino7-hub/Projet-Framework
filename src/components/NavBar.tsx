'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { SunIcon, MoonIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import Cookies from 'js-cookie'; // Need to be sure we can read cookies or rely on localStorage

export default function NavBar() {
  const router = useRouter();
  const [role, setRole] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage first
    setRole(localStorage.getItem('role'));

    // Listen for storage events (login/logout from other tabs or same tab)
    const handleStorage = () => {
      setRole(localStorage.getItem('role'));
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const logout = () => {
    localStorage.clear();
    Cookies.remove('token'); // Clear cookie too just in case
    router.push('/login');
    router.refresh();
    setRole(null);
  };

  if (!mounted) return <header className="fixed top-0 w-full h-16 bg-black border-b border-[#333] z-50" />;

  return (
    <header className="fixed top-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-[#333]">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <BookOpenIcon className="w-8 h-8 text-[#D4AF37] group-hover:scale-105 transition-transform" />
          <span className="text-xl font-bold font-serif text-[#F5F5F5] tracking-tight">
            BOOK <span className="text-[#D4AF37]">HAVEN</span>
          </span>
        </Link>

        <nav className="flex items-center gap-6 text-sm font-medium text-[#A3A3A3]">
          <Link href="/browse" className="hover:text-[#D4AF37] transition-colors">Browse</Link>
          <Link href="/chat" className="hover:text-[#D4AF37] transition-colors">AI Chat</Link>

          {role ? (
            <>
              <Link href={role === 'admin' ? '/admin' : '/user'} className="hover:text-[#D4AF37] transition-colors">Dashboard</Link>
              <Link href="/my-list" className="hover:text-[#D4AF37] transition-colors">My List</Link>
              {role === 'user' && ( // Only users have borrowing history usually
                <Link href="/history" className="hover:text-[#D4AF37] transition-colors">History</Link>
              )}
              <button
                onClick={logout}
                className="px-4 py-2 text-[#D4AF37] border border-[#D4AF37] rounded-full hover:bg-[#D4AF37] hover:text-black transition-all"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="hover:text-[#D4AF37] transition-colors">Log In</Link>
              <Link href="/register" className="px-5 py-2 bg-[#D4AF37] text-black font-bold rounded-full hover:bg-[#B5952F] shadow-[0_0_10px_rgba(212,175,55,0.3)] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transition-all">
                Get Started
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}