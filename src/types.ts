export interface Book {
  _id: string;
  title: string;
  author: string;
  genre: string[];
  available: boolean;
  borrowedBy?: { _id: string; name: string } | null;
  coverImage?: string;
  endorsements?: string[]; // Array of user IDs
}