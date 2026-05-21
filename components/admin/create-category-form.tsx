"use client";

import { useState } from "react";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { showSuccess } from "@/lib/toast";
import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";

export default function CreateCategoryForm() {
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      setLoading(true);

      await axiosPrivate.post("/categories", {
        name,
      });

      showSuccess("Category created");

      setTimeout(() => {
        router.push("/admin/category");
      }, 500);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Category</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Input
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-brand-blue hover:bg-brand-blue/90"
        >
          Create Category
        </Button>
      </CardContent>
    </Card>
  );
}
