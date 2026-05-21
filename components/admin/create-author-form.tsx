"use client";

import { useState } from "react";

import { uploadImage } from "@/lib/upload";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import { showSuccess } from "@/lib/toast";
import { useRouter } from "next/navigation";
import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";

export default function CreateAuthorForm() {
  const axiosPrivate = useAxiosPrivate();
  const router = useRouter();
  const [name, setName] = useState("");

  const [bio, setBio] = useState("");

  const [image, setImage] = useState<File | null>(null);

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    try {
      setLoading(true);

      let uploaded = null;

      if (image) {
        uploaded = await uploadImage(image, "bookstore/authors");
      }

      await axiosPrivate.post("/authors", {
        name,
        bio,
        image_url: uploaded?.url || null,
      });

      showSuccess("Author created");

      setTimeout(() => {
        router.push("/admin/authors");
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
        <CardTitle>Create Author</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Input
          placeholder="Author Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <Textarea
          placeholder="Author Bio"
          className="min-h-45"
          value={bio}
          onChange={(e) => setBio(e.target.value)}
        />

        <Input
          type="file"
          onChange={(e) => setImage(e.target.files?.[0] || null)}
        />

        <Button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-brand-orange hover:bg-brand-orange/90"
        >
          Create Author
        </Button>
      </CardContent>
    </Card>
  );
}
