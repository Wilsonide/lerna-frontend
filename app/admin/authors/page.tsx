"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { Plus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { AuthorType } from "@/app/(public)/author/page";
import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";

export default function AuthorsPage() {
  const AxiosPrivate = useAxiosPrivate();
  const [authors, setAuthors] = useState<AuthorType[]>([]);

  useEffect(() => {
    const fetchAuthors = async () => {
      const response = await AxiosPrivate.get("/authors");

      setAuthors(response.data);
    };

    fetchAuthors();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Authors</h1>

          <p className="text-muted-foreground">Manage authors</p>
        </div>

        <Link href="/admin/authors/create">
          <Button className="bg-brand-orange hover:bg-brand-orange/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Author
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {authors.map((author) => (
          <Card key={author.id}>
            <CardContent className="space-y-4 p-5">
              <Image
                src={author.image_url || "/avatar.png"}
                alt={`Author ${author.name}`}
                width={400}
                height={208}
                className="h-52 w-full rounded-xl object-cover"
              />

              <div>
                <h2 className="text-lg font-semibold">{author.name}</h2>

                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {author.bio}
                </p>
              </div>

              <Link href={`/admin/authors/${author.id}`}>
                <Button variant="outline" className="w-full">
                  Manage Author
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
