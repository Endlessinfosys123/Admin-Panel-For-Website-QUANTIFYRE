import React from "react";
import { BlogEditor } from "@/components/admin/modules/BlogEditor";

export default function AdminBlogEditPage({ params }: { params: { id: string } }) {
  return (
    <div>
      <BlogEditor id={params.id} />
    </div>
  );
}
