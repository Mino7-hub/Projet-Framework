// app/layout.tsx
import type { Metadata } from 'next';
import NavBar from '@/components/NavBar';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from 'react-hot-toast';
import connectDB from '@/lib/db';
import { Book as BookType } from '@/types';

// Fetch initial books on the server
// function getInitialBooks removed for performance

export const metadata: Metadata = {
  title: 'Book Haven',
  description: 'Access a world of knowledge with our modern library platform.',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Removed blocking data fetch to improve TTFB
  const initialBooks: any[] = [];

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&family=Merriweather:wght@300;400;700&display=swap" rel="stylesheet" />
      </head>
      <body className="flex flex-col min-h-screen overflow-x-hidden">
        <Providers initialBooks={initialBooks}>
          <NavBar />
          <main className="flex-grow pt-24 pb-12 w-full">
            {children}
          </main>

          <footer className="py-8 text-center text-sm text-[var(--color-text-light)] border-t border-[#333] bg-black">
            <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
              <p>&copy; {new Date().getFullYear()} Book Haven.</p>
              <div className="flex gap-4">
                <span className="cursor-pointer hover:text-[var(--color-primary)]">Terms</span>
                <span className="cursor-pointer hover:text-[var(--color-primary)]">Privacy</span>
              </div>
            </div>
          </footer>

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: 'var(--color-surface)',
                color: 'var(--color-text)',
                border: '1px solid var(--color-border)',
                fontFamily: 'var(--font-sans)',
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}