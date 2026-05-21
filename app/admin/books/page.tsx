"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { MoreHorizontal, Plus, Pencil, Trash2 } from "lucide-react";

import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { showSuccess } from "@/lib/toast";

interface Book {
  id: number;
  title: string;
  isbn?: string;
  price: number;
  pages?: number;
  quantity?: number;
  language?: string;
  publisher?: string;
  published_date?: string;
  cover_image?: string;

  author?: { name: string };
  category?: { name: string };
}

const ITEMS_PER_PAGE = 10;

export default function AdminBooksPage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [page, setPage] = useState(1);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    async function fetchBooks() {
      const res = await axiosPrivate.get("/books");
      setBooks(res.data);
    }

    fetchBooks();
  }, []);

  const totalPages = Math.ceil(books.length / ITEMS_PER_PAGE);

  const paginatedBooks = books.slice(
    (page - 1) * ITEMS_PER_PAGE,
    page * ITEMS_PER_PAGE,
  );

  async function handleDelete(id: number) {
    try {
      await axiosPrivate.delete(`/books/${id}`);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      showSuccess("Book deleted successfully!");
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Books</h1>
          <p className="text-muted-foreground">Manage bookstore inventory</p>
        </div>

        <Link href="/admin/books/create">
          <Button className="bg-brand-blue hover:bg-brand-blue/90 w-full sm:w-auto">
            <Plus className="mr-2 h-4 w-4" />
            Add Book
          </Button>
        </Link>
      </div>

      {/* TABLE */}
      <div className="w-full overflow-x-auto rounded-2xl border bg-background">
        <Table className="min-w-[1200px]">
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>ISBN</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Pages</TableHead>
              <TableHead>Qty</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Publisher</TableHead>
              <TableHead>Published</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {paginatedBooks.length ? (
              paginatedBooks.map((book) => (
                <TableRow key={book.id}>
                  <TableCell>#{book.id}</TableCell>

                  <TableCell className="max-w-[160px] truncate">
                    {book.title}
                  </TableCell>

                  <TableCell className="text-xs text-muted-foreground">
                    {book.isbn || "-"}
                  </TableCell>

                  <TableCell>{book.author?.name || "Unknown"}</TableCell>

                  <TableCell>{book.category?.name || "-"}</TableCell>

                  <TableCell className="font-medium">${book.price}</TableCell>

                  <TableCell>{book.pages || "-"}</TableCell>

                  <TableCell>{book.quantity || "-"}</TableCell>

                  <TableCell>{book.language || "-"}</TableCell>

                  <TableCell>{book.publisher || "-"}</TableCell>

                  <TableCell className="text-xs">
                    {book.published_date || "-"}
                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button size="icon" variant="ghost">
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end">
                        {/* EDIT */}
                        <Link href={`/admin/books/${book.id}`}>
                          <DropdownMenuItem>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                        </Link>

                        {/* DELETE */}
                        <DropdownMenuItem
                          className="text-red-500"
                          onClick={() => handleDelete(book.id)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={12}
                  className="py-10 text-center text-muted-foreground"
                >
                  No books found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.max(1, p - 1));
                  }}
                />
              </PaginationItem>

              {Array.from({ length: totalPages }).map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    href="#"
                    isActive={page === i + 1}
                    onClick={(e) => {
                      e.preventDefault();
                      setPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setPage((p) => Math.min(totalPages, p + 1));
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
