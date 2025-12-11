// app/providers.tsx
'use client';
import { ThemeProvider, ThemeProviderProps } from 'next-themes';
import { BookStore } from '@/stores/BookStore';
import { Book } from '@/types';

// You'll need to fetch initial books somehow - either:
// - From server component and pass down
// - Or let components fetch their own data

export function Providers({ 
  children, 
  initialBooks = [] 
}: { 
  children: React.ReactNode; 
  initialBooks?: Book[]; 
}) {
  const themeProps: ThemeProviderProps = {
    attribute: 'class',
    defaultTheme: 'system',
    enableSystem: true,
  };

  return (
    <ThemeProvider {...themeProps}>
      <BookStore initialBooks={initialBooks}>
        {children}
      </BookStore>
    </ThemeProvider>
  );
}