/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Axios } from "@/lib/axios";
import { BookOpen, User } from "lucide-react";

type Book = {
  id: string;
  title: string;
  cover_url?: string;
  price?: number;
};

type Author = {
  id: string;
  name: string;
  bio?: string;
  avatar_url?: string;
};

type ResponseData = {
  author: Author;
  books: Book[];
};

export default function AuthorPage() {
  const params = useParams();
  const id = params?.id as string;

  const [data, setData] = useState<ResponseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthor = async () => {
      try {
        const res = await Axios.get(`/authors/${id}`);
        setData(res.data);
      } catch (err: any) {
        setError(
          err?.response?.data?.detail || "Failed to load author profile",
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchAuthor();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-500">Loading author...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-500 text-sm">{error}</p>
      </div>
    );
  }

  const { author, books } = data;

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* AUTHOR HEADER */}
        <div className="flex flex-col md:flex-row md:items-center gap-6 bg-white p-6 rounded-2xl shadow-sm border">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-slate-200 flex items-center justify-center">
            {author?.avatar_url ? (
              <img
                src={author?.avatar_url}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <User className="text-slate-500" />
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
              {author?.name}
            </h1>

            <p className="text-sm text-slate-500 mt-1">Author Profile</p>

            {author?.bio && (
              <p className="mt-3 text-sm text-slate-600 leading-relaxed">
                {author.bio}
              </p>
            )}
          </div>
        </div>

        {/* BOOKS SECTION */}
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-4">
            <BookOpen className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-semibold text-slate-800">
              Books by {author?.name}
            </h2>
          </div>

          {books?.length === 0 ? (
            <div className="text-sm text-slate-500">
              No books available for this author.
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {books?.map((book) => (
                <div
                  key={book.id}
                  className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition"
                >
                  <div className="h-40 bg-slate-100">
                    {book.cover_url ? (
                      <img
                        src={book.cover_url}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-sm">
                        No cover
                      </div>
                    )}
                  </div>

                  <div className="p-3">
                    <h3 className="text-sm font-medium text-slate-900 line-clamp-2">
                      {book.title}
                    </h3>

                    {book.price && (
                      <p className="text-xs text-slate-500 mt-1">
                        ₦ {book.price}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
