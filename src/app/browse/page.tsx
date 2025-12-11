// app/browse/page.tsx - CLEAN VERSION
import { Suspense } from 'react';
import SearchBar from '@/components/SearchBar';
import BookGrid from '@/components/BookGrid';
import BookGridSkeleton from '@/components/BookGridSkeleton';

export default async function BrowsePage(props: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const searchParams = await props.searchParams;
  const q = searchParams.q || '';
  const page = Number(searchParams.page) || 1;

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Books</h1>

      <SearchBar />

      <Suspense fallback={<BookGridSkeleton />}>
        <BookGrid q={q} page={page} />
      </Suspense>
    </div>
  );
}