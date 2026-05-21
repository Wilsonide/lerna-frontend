"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { Plus } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { CategoryType } from "@/app/(public)/category/page";
import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchCategories = async () => {
      const response = await axiosPrivate.get("/categories");

      setCategories(response.data);
    };

    fetchCategories();
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories</h1>

          <p className="text-muted-foreground">Manage book categories</p>
        </div>

        <Link href="/admin/category/create">
          <Button className="bg-brand-blue hover:bg-brand-blue/90">
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardContent className="space-y-4 p-5">
              <h2 className="text-xl font-semibold">{category.name}</h2>

              <Link href={`/admin/category/${category.id}`}>
                <Button variant="outline" className="w-full">
                  Manage Category
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
