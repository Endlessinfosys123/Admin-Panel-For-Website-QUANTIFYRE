import React from "react";
import { BlogEditor } from "@/components/admin/modules/BlogEditor";

export default async function AdminBlogEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <BlogEditor id={id} />
    </div>
  );
}
