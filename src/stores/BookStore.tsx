'use client';
import { createContext, useContext, useReducer, ReactNode, useEffect } from 'react';
import toast from 'react-hot-toast';

type Book = {
  _id: string;
  title: string;
  author: string;
  genre?: string;
  available: boolean;
  borrowedBy?: { _id: string; name: string } | null;
};

type State = { books: Book[] };
type Action =
  | { type: 'SET_BOOKS'; books: Book[] }
  | { type: 'UPDATE_BOOK'; book: Book };

const BookContext = createContext<{
  books: Book[];
  setBooks: (b: Book[]) => void;
  updateBook: (b: Book) => void;
} | null>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_BOOKS':
      return { books: action.books };
    case 'UPDATE_BOOK':
      const idx = state.books.findIndex((b) => b._id === action.book._id);
      if (idx === -1) return state;
      const next = [...state.books];
      next[idx] = action.book;
      return { books: next };
    default:
      return state;
  }
}

export function BookStore({ children, initialBooks }: { children: ReactNode; initialBooks: Book[] }) {
  const [state, dispatch] = useReducer(reducer, { books: initialBooks });

  // Sync state with props when router.refresh() updates initialBooks
  useEffect(() => {
    dispatch({ type: 'SET_BOOKS', books: initialBooks });
  }, [initialBooks]);

  const setBooks = (books: Book[]) => dispatch({ type: 'SET_BOOKS', books });
  const updateBook = (book: Book) => {
    dispatch({ type: 'UPDATE_BOOK', book });
    toast.success(book.available ? 'Book returned' : 'Book borrowed');
  };

  return <BookContext.Provider value={{ books: state.books, setBooks, updateBook }}>{children}</BookContext.Provider>;
}

export const useBooks = () => {
  const ctx = useContext(BookContext);
  if (!ctx) throw new Error('useBooks outside BookStore');
  return ctx;
};