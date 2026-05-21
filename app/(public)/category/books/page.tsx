"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Axios } from "@/lib/axios";
import BookCard from "@/components/books/book-card";

type Book = {
  id: number;
  title: string;
  price: number;
  image_url?: string;
  quantity: number;
};

type Category = {
  id: number;
  name: string;
  books: Book[];
};

export default function CategoryBooksPage() {
  const params = useParams();
  const id = params?.id;

  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await Axios.get(`/categories/${id}`);
        setCategory(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategory();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-12 text-center text-slate-500">
        Loading books...
      </div>
    );
  }

  if (!category) {
    return (
      <div className="container mx-auto py-12 text-center text-red-500">
        Category not found
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      {/* HEADER */}
      <div className="mb-10">
        <h1 className="text-3xl md:text-5xl font-bold">
          {category.name} Books
        </h1>

        <p className="mt-3 text-slate-500">Explore books in this category</p>
      </div>

      {/* BOOK GRID */}
      {category.books?.length === 0 ? (
        <p className="text-center text-slate-500">No books found</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {category.books.map((book) => (
            <BookCard key={book.id} book={book} />
          ))}
        </div>
      )}
    </div>
  );
}
