"use client";

import { useEffect, useState } from "react";

import { Loader2, Upload, X } from "lucide-react";
import Image from "next/image";

import { uploadImage } from "@/lib/upload";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";

import { Label } from "@/components/ui/label";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { showSuccess } from "@/lib/toast";
import { useRouter } from "next/navigation";
import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";

interface Author {
  id: number;
  name: string;
}

interface Category {
  id: number;
  name: string;
}

export default function CreateBookForm() {
  const router = useRouter();
  const axiosPrivate = useAxiosPrivate();
  const [loading, setLoading] = useState(false);

  const [authors, setAuthors] = useState<Author[]>([]);

  const [categories, setCategories] = useState<Category[]>([]);

  const [coverFile, setCoverFile] = useState<File | null>(null);

  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);

  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [galleryPreview, setGalleryPreview] = useState<string[]>([]);

  const [form, setForm] = useState({
    title: "",
    description: "",
    isbn: "",
    price: "",
    pages: "",
    quantity: "",
    language: "",
    publisher: "",
    published_date: "",
    author_id: "",
    category_id: "",
  });

  async function fetchAuthors() {
    try {
      const response = await axiosPrivate.get("/authors");

      setAuthors(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchCategories() {
    try {
      const response = await axiosPrivate.get("/categories");

      setCategories(response.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    async function loadData() {
      await Promise.all([fetchAuthors(), fetchCategories()]);
    }

    loadData();
  }, []);

  async function handleSubmit() {
    try {
      setLoading(true);

      if (!coverFile) {
        return;
      }

      const cover = await uploadImage(coverFile, "bookstore/covers");

      const gallery = await Promise.all(
        galleryFiles.map((file) => uploadImage(file, "bookstore/gallery")),
      );

      const payload = {
        title: form.title,
        description: form.description,
        isbn: form.isbn,

        price: Number(form.price),

        pages: Number(form.pages),

        quantity: Number(form.quantity),

        language: form.language,

        publisher: form.publisher,

        published_date: form.published_date,

        author_id: Number(form.author_id),

        category_id: Number(form.category_id),

        cover_image: cover,

        images: gallery,
      };

      await axiosPrivate.post("/books", payload);

      showSuccess("Book created");

      setTimeout(() => {
        router.push("/admin/books");
      }, 500);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Create Book</CardTitle>

          <CardDescription>Add a new book</CardDescription>
        </CardHeader>

        <CardContent className="space-y-8">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Title</Label>

              <Input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>ISBN</Label>

              <Input
                value={form.isbn}
                onChange={(e) =>
                  setForm({
                    ...form,
                    isbn: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Description</Label>

            <Textarea
              className="min-h-45"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="grid gap-6 md:grid-cols-4">
            <div className="space-y-2">
              <Label>Price</Label>

              <Input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Quantity</Label>

              <Input
                type="number"
                value={form.quantity}
                onChange={(e) =>
                  setForm({
                    ...form,
                    quantity: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Pages</Label>

              <Input
                type="number"
                value={form.pages}
                onChange={(e) =>
                  setForm({
                    ...form,
                    pages: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Author</Label>

              <Select
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    author_id: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select author" />
                </SelectTrigger>

                <SelectContent>
                  {authors.map((author) => (
                    <SelectItem key={author.id} value={String(author.id)}>
                      {author.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Category</Label>

              <Select
                onValueChange={(value) =>
                  setForm({
                    ...form,
                    category_id: value,
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>

                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Language</Label>

              <Input
                value={form.language}
                onChange={(e) =>
                  setForm({
                    ...form,
                    language: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Publisher</Label>

              <Input
                value={form.publisher}
                onChange={(e) =>
                  setForm({
                    ...form,
                    publisher: e.target.value,
                  })
                }
              />
            </div>

            <div className="space-y-2">
              <Label>Published Date</Label>

              <Input
                type="date"
                value={form.published_date}
                onChange={(e) =>
                  setForm({
                    ...form,
                    published_date: e.target.value,
                  })
                }
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cover Image</CardTitle>
        </CardHeader>

        <CardContent>
          <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed p-10">
            <Upload className="mb-4 h-10 w-10 text-brand-blue" />

            <p className="font-medium">Upload Cover</p>

            <Input
              type="file"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];

                if (file) {
                  setCoverFile(file);

                  setCoverPreview(URL.createObjectURL(file));
                }
              }}
            />
          </label>

          {coverPreview && (
            <div className="relative mt-6 w-52">
              <Image
                src={coverPreview}
                alt="Cover preview"
                width={208}
                height={300}
                className="rounded-2xl border object-cover"
              />

              <button
                onClick={() => {
                  setCoverPreview(null);
                  setCoverFile(null);
                }}
                className="absolute right-2 top-2 rounded-full bg-black p-1 text-white"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gallery Images</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <Input
            type="file"
            multiple
            onChange={(e) => {
              const files = Array.from(e.target.files || []);

              setGalleryFiles(files);

              setGalleryPreview(files.map((file) => URL.createObjectURL(file)));
            }}
          />

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {galleryPreview.map((image) => (
              <Image
                key={image}
                src={image}
                alt="Gallery preview"
                width={240}
                height={240}
                className="rounded-2xl border object-cover"
              />
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-brand-blue hover:bg-brand-blue/90"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Create Book
        </Button>
      </div>
    </div>
  );
}
