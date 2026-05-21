"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { showSuccess } from "@/lib/toast";
import { CategoryType } from "@/app/(public)/category/page";
import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";

export default function SingleCategoryPage() {
  const params = useParams();
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const [category, setCategory] = useState<CategoryType | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadCategory() {
      const response = await axiosPrivate.get(`/categories/${params.id}`);

      if (isMounted) {
        setCategory(response.data);
      }
    }

    loadCategory();

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  async function updateCategory() {
    await axiosPrivate.patch(`/categories/${params.id}`, category);

    showSuccess("Category updated");
    setTimeout(() => {
      router.push("/admin/category");
    }, 500);
  }

  if (!category) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Category</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Input
          value={category.name}
          onChange={(e) =>
            setCategory({
              ...category,
              name: e.target.value,
            })
          }
        />

        <Button
          onClick={updateCategory}
          className="bg-brand-blue hover:bg-brand-blue/90"
        >
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
