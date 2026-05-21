"use client";

import { useEffect, useState } from "react";

import { useParams, useRouter } from "next/navigation";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";

import { Button } from "@/components/ui/button";
import { AuthorType } from "@/app/(public)/author/page";
import useAxiosPrivate from "@/app/hooks/useAxiosPrivate";
import { showSuccess } from "@/lib/toast";

export default function SingleAuthorPage() {
  const params = useParams();
  const AxiosPrivate = useAxiosPrivate();
  const router = useRouter();

  const [author, setAuthor] = useState<AuthorType | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadAuthor() {
      const response = await AxiosPrivate.get(`/authors/${params.id}`);

      if (isMounted) {
        setAuthor(response.data);
      }
    }

    loadAuthor();

    return () => {
      isMounted = false;
    };
  }, [params.id]);

  async function updateAuthor() {
    await AxiosPrivate.patch(`/authors/${params.id}`, author);

    showSuccess("Author updated");
    setTimeout(() => {
      router.push("/admin/authors");
    }, 500);
  }

  if (!author) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Author</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        <Input
          value={author.name}
          onChange={(e) =>
            setAuthor({
              ...author,
              name: e.target.value,
            })
          }
        />

        <Textarea
          value={author.bio}
          onChange={(e) =>
            setAuthor({
              ...author,
              bio: e.target.value,
            })
          }
        />

        <Button
          onClick={updateAuthor}
          className="bg-brand-orange hover:bg-brand-orange/90"
        >
          Save Changes
        </Button>
      </CardContent>
    </Card>
  );
}
