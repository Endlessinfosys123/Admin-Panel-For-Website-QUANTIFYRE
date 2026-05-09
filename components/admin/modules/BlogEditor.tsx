"use client";

import React, { useState, useEffect } from "react";
import { 
  Save, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Loader2, 
  Eye, 
  Settings, 
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  Globe,
  Lock,
  Clock,
  Search
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { RichTextEditor } from "../ui/RichTextEditor";
import { TagInput } from "../ui/TagInput";
import { cn } from "@/lib/utils";

interface BlogPost {
  id?: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string[];
  author: string;
  status: "draft" | "published" | "scheduled";
  published_at: string | null;
  meta_title: string;
  meta_description: string;
  og_image: string;
}

const categories = ["Technology", "AI & Machine Learning", "Enterprise", "Case Studies", "Industry News", "Updates"];

export function BlogEditor({ id }: { id?: string }) {
  const router = useRouter();
  const [post, setPost] = useState<Partial<BlogPost>>({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Technology",
    tags: [],
    author: "QUANTIFYRE Team",
    status: "draft",
    meta_title: "",
    meta_description: "",
  });
  const [loading, setLoading] = useState(!!id);
  const [saving, setSaving] = useState(false);
  const [showSEO, setShowSEO] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (id && id !== "new") {
      fetchPost();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      const response = await fetch(`/api/content/blog/${id}`);
      const data = await response.json();
      setPost(data);
    } catch (error) {
      showToast("Failed to load post", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleTitleChange = (title: string) => {
    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setPost({ ...post, title, slug });
  };

  const handleSave = async (statusOverride?: BlogPost["status"]) => {
    setSaving(true);
    const finalStatus = statusOverride || post.status;
    const finalPost = { 
      ...post, 
      status: finalStatus,
      published_at: finalStatus === "published" && !post.published_at ? new Date().toISOString() : post.published_at
    };

    try {
      const response = await fetch("/api/admin/save-blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalPost),
      });

      if (!response.ok) throw new Error();
      
      const savedPost = await response.json();
      showToast("Blog post saved successfully", "success");
      
      if (!id || id === "new") {
        router.push(`/admin/blog/${savedPost.id}`);
      } else {
        setPost(savedPost);
      }
    } catch (error) {
      showToast("Failed to save post", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
        <p className="text-gray-500 font-medium">Loading editor...</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* Top Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/blog"
            className="p-2 bg-white border border-gray-200 text-gray-500 rounded-xl hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft size={24} />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              {id === "new" ? "Create New Post" : "Edit Blog Post"}
            </h2>
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <span className={cn(
                "w-2 h-2 rounded-full",
                post.status === "published" ? "bg-green-500" : post.status === "scheduled" ? "bg-blue-500" : "bg-gray-400"
              )} />
              {post.status?.toUpperCase()} • {post.author}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleSave("draft")}
            disabled={saving}
            className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50 transition-all disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSave("published")}
            disabled={saving}
            className="flex items-center gap-2 px-8 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
            Publish Now
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <input
              type="text"
              value={post.title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Post Title..."
              className="w-full text-4xl font-extrabold text-gray-900 border-none outline-none placeholder:text-gray-200"
            />
            
            <div className="flex items-center gap-2 text-sm text-gray-400 font-mono bg-gray-50 px-3 py-1.5 rounded-lg w-fit">
              <span>quantifyre.com/blog/</span>
              <input
                type="text"
                value={post.slug}
                onChange={(e) => setPost({ ...post, slug: e.target.value })}
                className="bg-transparent border-none outline-none text-purple-600 font-bold"
              />
            </div>

            <div className="space-y-4">
              <label className="text-sm font-bold text-gray-400 uppercase tracking-widest">Main Content</label>
              <RichTextEditor
                content={post.content || ""}
                onChange={(content) => setPost({ ...post, content })}
                placeholder="Start writing your masterpiece..."
              />
            </div>
          </div>

          {/* SEO Section */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <button 
              onClick={() => setShowSEO(!showSEO)}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2 font-bold text-gray-800">
                <Search size={18} className="text-purple-600" />
                SEO & Metadata Settings
              </div>
              <ChevronRight size={20} className={cn("text-gray-400 transition-transform", showSEO && "rotate-90")} />
            </button>
            
            {showSEO && (
              <div className="p-6 border-t border-gray-100 space-y-6 animate-in slide-in-from-top-2">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-gray-600">Meta Title</label>
                    <span className={cn("text-[10px] font-bold", (post.meta_title?.length || 0) > 60 ? "text-red-500" : "text-gray-400")}>
                      {post.meta_title?.length || 0}/60
                    </span>
                  </div>
                  <input
                    type="text"
                    value={post.meta_title || ""}
                    onChange={(e) => setPost({ ...post, meta_title: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Enter meta title..."
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-semibold text-gray-600">Meta Description</label>
                    <span className={cn("text-[10px] font-bold", (post.meta_description?.length || 0) > 160 ? "text-red-500" : "text-gray-400")}>
                      {post.meta_description?.length || 0}/160
                    </span>
                  </div>
                  <textarea
                    value={post.meta_description || ""}
                    onChange={(e) => setPost({ ...post, meta_description: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none min-h-[100px]"
                    placeholder="Enter meta description..."
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Settings */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
              <Settings size={18} className="text-purple-600" />
              Post Settings
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Category</label>
                <select
                  value={post.category}
                  onChange={(e) => setPost({ ...post, category: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none font-medium"
                >
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Tags</label>
                <TagInput
                  tags={post.tags || []}
                  onChange={(tags) => setPost({ ...post, tags })}
                  placeholder="Enter tags..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Author Name</label>
                <input
                  type="text"
                  value={post.author || ""}
                  onChange={(e) => setPost({ ...post, author: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>

              <div className="pt-4 space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                   <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                    <Clock size={16} className="text-purple-500" />
                    Status
                   </div>
                   <select 
                    value={post.status}
                    onChange={(e) => setPost({ ...post, status: e.target.value as any })}
                    className="bg-transparent border-none outline-none text-sm font-bold text-purple-600 cursor-pointer"
                   >
                     <option value="draft">Draft</option>
                     <option value="published">Published</option>
                     <option value="scheduled">Scheduled</option>
                   </select>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-800 flex items-center gap-2 border-b border-gray-100 pb-3">
              <ImageIcon size={18} className="text-purple-600" />
              Featured Image
            </h3>
            
            <div className="space-y-4">
              <div className="aspect-video bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer hover:border-purple-300 transition-all">
                {post.featured_image ? (
                  <>
                    <img src={post.featured_image} alt="Featured" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button 
                        onClick={() => setPost({ ...post, featured_image: "" })}
                        className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition-colors"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <ImageIcon size={32} className="text-gray-300 mb-2" />
                    <span className="text-xs font-bold text-gray-400">Add Image</span>
                  </>
                )}
              </div>
              <input
                type="text"
                placeholder="Paste Image URL..."
                value={post.featured_image || ""}
                onChange={(e) => setPost({ ...post, featured_image: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={cn(
          "fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all animate-in fade-in slide-in-from-bottom-5",
          toast.type === "success" ? "bg-green-600 border-green-500 text-white" : "bg-red-600 border-red-500 text-white"
        )}>
          {toast.type === "success" ? <CheckCircle size={24} /> : <AlertCircle size={24} />}
          <span className="font-bold">{toast.message}</span>
        </div>
      )}
    </div>
  );
}
