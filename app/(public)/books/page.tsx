"use client";

import { useEffect, useState } from "react";
import { Axios } from "@/lib/axios";
import BookCard from "@/components/books/book-card";

export type BookType = {
  id: number;
  title: string;
  price: number;
  image_url?: string;
  quantity: number;
  author?: {
    name: string;
  };
  cover_image?: string;
  description?: string;
  pages?: number;
  language?: string;
  publisher?: string;
};

export default function BooksPage() {
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBooks = async () => {
      try {
        const res = await Axios.get("/books");
        setBooks(res.data);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Failed to load books");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center text-sm text-slate-500">
        Loading books...
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12 text-center text-sm text-red-500">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      {/* HEADER */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900">Books</h1>

        <p className="mt-3 text-sm md:text-base text-slate-500">
          Explore our collection
        </p>
      </div>

      {/* GRID */}
      {books.length === 0 ? (
        <p className="text-center text-sm text-slate-500">No books found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
