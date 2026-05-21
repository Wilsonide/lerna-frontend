/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import Image from "next/image";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";
import { showSuccess } from "@/lib/toast";
import { uploadImage } from "@/lib/upload";

/* ---------------- TYPES ---------------- */

type CloudImage = {
  url: string;
  public_id?: string;
};

type BookType = {
  id: number;
  title: string;
  description: string;
  isbn?: string;
  price: number | string;
  cover_image?: string | CloudImage;
  images?: (string | CloudImage)[];
};

/* ---------------- COMPONENT ---------------- */

export default function SingleBookPage() {
  const axiosPrivate = useAxiosPrivate();
  const params = useParams();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    isbn: "",
    price: "",
  });

  /* ---------------- FETCH ---------------- */

  useEffect(() => {
    async function load() {
      const res = await axiosPrivate.get(`/books/${params.id}`);
      const data: BookType = res.data;

      setForm({
        title: data.title || "",
        description: data.description || "",
        isbn: data.isbn || "",
        price: data.price?.toString() ?? "",
      });

      // COVER
      if (data.cover_image) {
        setCoverPreview(
          typeof data.cover_image === "string"
            ? data.cover_image
            : data.cover_image.url,
        );
      }

      // GALLERY → ALWAYS STRING ARRAY
      if (Array.isArray(data.images)) {
        setGalleryPreview(
          data.images.map((img) => (typeof img === "string" ? img : img.url)),
        );
      }

      setHydrated(true);
    }

    load();
  }, [params.id]);

  /* ---------------- UPDATE ---------------- */

  async function updateBook() {
    try {
      setLoading(true);

      // COVER → STRING ONLY
      let cover: string | null = coverPreview;

      if (coverFile) {
        const uploaded = await uploadImage(coverFile, "bookstore/covers");

        cover = uploaded.url ?? uploaded;
      }

      // GALLERY → STRING[]
      let gallery: string[] = galleryPreview;

      if (galleryFiles.length > 0) {
        const uploaded = await Promise.all(
          galleryFiles.map((file) => uploadImage(file, "bookstore/gallery")),
        );

        gallery = uploaded.map((img: any) =>
          typeof img === "string" ? img : img.url,
        );
      }

      await axiosPrivate.patch(`/books/${params.id}`, {
        title: form.title,
        description: form.description,
        isbn: form.isbn,
        price: Number(form.price || 0),

        cover_image: cover,
        images: gallery, // ✅ ALWAYS string[]
      });

      showSuccess("Book updated");

      setTimeout(() => router.push("/admin/books"), 500);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  if (!hydrated) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Book</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <Textarea
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <Input
          type="text"
          inputMode="decimal"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        {/* COVER */}
        <Input
          type="file"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) {
              setCoverFile(file);
              setCoverPreview(URL.createObjectURL(file));
            }
          }}
        />

        {coverPreview && (
          <Image
            src={coverPreview}
            alt="cover"
            width={180}
            height={180}
            className="rounded mt-2"
          />
        )}

        {/* GALLERY */}
        <Input
          type="file"
          multiple
          onChange={(e) => {
            const files = Array.from(e.target.files || []);
            setGalleryFiles(files);
            setGalleryPreview(files.map((f) => URL.createObjectURL(f)));
          }}
        />

        <div className="grid grid-cols-4 gap-3">
          {galleryPreview.map((img, i) => (
            <Image
              key={i}
              src={img}
              alt="gallery"
              width={120}
              height={120}
              className="rounded"
            />
          ))}
        </div>

        <Button
          onClick={updateBook}
          disabled={loading}
          className="bg-brand-blue"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
