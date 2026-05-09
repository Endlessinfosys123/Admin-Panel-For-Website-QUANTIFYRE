import React from "react";
import { PageContentEditor } from "@/components/admin/modules/PageContentEditor";

export default function AdminContentPage() {
  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Page Content Manager</h2>
        <p className="text-gray-500">Edit headlines, body text, and links across your entire website.</p>
      </div>
      
      <PageContentEditor />
    </div>
  );
}
