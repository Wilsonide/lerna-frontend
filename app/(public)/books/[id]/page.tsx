/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Axios } from "@/lib/axios";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { showSuccess } from "@/lib/toast";
import { addToCart } from "@/app/features/cart/cartSlice";

type AuthorType = {
  id: number;
  name: string;
};

type BookType = {
  id: number;
  title: string;
  price: number;
  description?: string;
  cover_image: string;
  author?: AuthorType;

  quantity: number;
};

export default function SingleBookPage() {
  const dispatch = useDispatch();
  const params = useParams();
  const id = params?.id;

  const [book, setBook] = useState<BookType | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await Axios.get(`/books/${id}`);
        setBook(res.data);
      } catch (err: any) {
        setError(err?.response?.data?.detail || "Failed to load book");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchBook();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto py-16 text-center text-sm text-slate-500">
        Loading book...
      </div>
    );
  }

  if (error || !book) {
    return (
      <div className="container mx-auto py-16 text-center text-sm text-red-500">
        {error || "Book not found"}
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4">
      <div className="grid gap-10 lg:grid-cols-2 items-start">
        {/* IMAGE */}
        <div>
          <Image
            src={book?.cover_image}
            alt={book.title}
            width={800}
            height={600}
            className="w-full rounded-2xl shadow-xl object-cover"
          />
        </div>

        {/* CONTENT */}
        <div className="space-y-6">
          {/* TITLE */}
          <div>
            <h1 className="text-3xl md:text-5xl font-bold text-slate-900">
              {book.title}
            </h1>

            <p className="mt-2 text-sm md:text-base text-slate-500">
              by {book.author?.name || "Unknown Author"}
            </p>
          </div>

          {/* PRICE */}
          <div className="text-2xl md:text-4xl font-bold text-slate-900">
            ${book.price}
          </div>

          {/* DESCRIPTION */}
          <p className="text-sm md:text-base leading-7 text-slate-600">
            {book.description || "No description available for this book."}
          </p>

          {/* ACTIONS */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              className="w-full sm:w-auto"
              size="lg"
              onClick={() => {
                dispatch(
                  addToCart({
                    id: book.id,
                    title: book.title,
                    price: book.price,
                    image_url: book.cover_image,
                  }),
                );

                showSuccess("Book added to cart!");
              }}
            >
              Add To Cart
            </Button>

            <Button variant="outline" size="lg" className="w-full sm:w-auto">
              Buy Now
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
