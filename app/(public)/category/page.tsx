/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Axios } from "@/lib/axios";
import CategoryCard from "@/components/home/category-card";

export type CategoryType = {
  id: number;
  name: string;
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await Axios.get("/categories");

        setCategories(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Failed to load categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // LOADING STATE
  if (loading) {
    return (
      <div className="container mx-auto py-12">
        <p className="text-center text-sm text-slate-500">
          Loading categories...
        </p>
      </div>
    );
  }

  // ERROR STATE
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
          Categories
        </h1>

        <p className="mt-3 text-sm md:text-base text-slate-500">
          Browse categories
        </p>
      </div>

      {/* GRID */}
      {categories.length === 0 ? (
        <p className="text-center text-sm text-slate-500">
          No categories found.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.id}/books`}
              className="block"
            >
              <CategoryCard category={category.name} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
