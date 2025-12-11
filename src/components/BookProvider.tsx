'use client';
import { BookStore } from '@/stores/BookStore';
import { Book as BookType } from '@/types';

export default function BookProvider({ children, initial }: { children: React.ReactNode; initial: BookType[] }) {
  return <BookStore initialBooks={initial}>{children}</BookStore>;
}