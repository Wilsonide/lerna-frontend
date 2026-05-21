/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Axios } from "@/lib/axios";
import AuthorCard from "@/components/home/author-card";

export type BookType = {
  id: number;
  title: string;
  cover_image?: string;
};

export type AuthorType = {
  id: number;
  name: string;
  bio?: string;
  image_url?: string;
  books?: BookType[];
};

export default function AuthorsPage() {
  const [authors, setAuthors] = useState<AuthorType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAuthors = async () => {
      try {
        const res = await Axios.get("/authors");
        setAuthors(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Failed to load authors");
      } finally {
        setLoading(false);
      }
    };

    fetchAuthors();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <p className="text-center text-sm text-slate-500">Loading authors...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-12">
        <p className="text-center text-sm text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4">
      {/* HEADER */}
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-3xl md:text-5xl font-bold text-slate-900">
          Authors
        </h1>

        <p className="mt-3 text-sm md:text-base text-slate-500">
          Explore authors and their books
        </p>
      </div>

      {/* GRID */}
      {authors.length === 0 ? (
        <p className="text-center text-sm text-slate-500">No authors found.</p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {authors.map((author) => (
            <Link
              key={author.id}
              href={`/author/${author.id}`}
              className="block"
            >
              <AuthorCard author={author} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
