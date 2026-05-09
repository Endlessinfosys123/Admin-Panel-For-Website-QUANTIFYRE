"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  PenTool, 
  Trash2, 
  Edit2, 
  Loader2, 
  Search,
  Filter,
  Calendar,
  User as UserIcon,
  ChevronRight,
  ExternalLink
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  status: "draft" | "published" | "scheduled";
  category: string;
  author: string;
  published_at: string | null;
  created_at: string;
}

export function BlogManager() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "published" | "draft" | "scheduled">("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/content/blog");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await fetch(`/api/admin/delete-blog?id=${id}`, { method: "DELETE" });
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredPosts = posts.filter(p => {
    const matchesFilter = filter === "all" || p.status === filter;
    const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.slug.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
        <p className="text-gray-500 font-medium">Loading blog posts...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <PenTool className="text-purple-600" />
            Blog Posts Manager
          </h2>
          <p className="text-gray-500">Share your thoughts and expertise.</p>
        </div>
        <Link
          href="/admin/blog/new"
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all"
        >
          <Plus size={20} />
          Write New Post
        </Link>
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400 mr-2" />
          {["all", "published", "draft", "scheduled"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all",
                filter === f ? "bg-purple-100 text-purple-700" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-gray-50/50 border-b border-gray-100">
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Post Details</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Category</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Published Date</th>
              <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredPosts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-gray-400 font-medium">
                  No blog posts found.
                </td>
              </tr>
            ) : (
              filteredPosts.map((post) => (
                <tr key={post.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="font-bold text-gray-900 group-hover:text-purple-600 transition-colors">{post.title}</p>
                      <p className="text-xs text-gray-400 flex items-center gap-2">
                        <UserIcon size={12} /> {post.author} • /{post.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2 py-1 rounded uppercase">
                      {post.category || "Uncategorized"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider",
                      post.status === "published" ? "bg-green-100 text-green-700" :
                      post.status === "scheduled" ? "bg-blue-100 text-blue-700" :
                      "bg-gray-100 text-gray-600"
                    )}>
                      {post.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {post.published_at ? (
                      <div className="flex items-center gap-1.5">
                        <Calendar size={14} />
                        {format(new Date(post.published_at), "MMM d, yyyy")}
                      </div>
                    ) : (
                      <span className="italic text-gray-300">Not published</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                        title="View Live"
                      >
                        <ExternalLink size={18} />
                      </Link>
                      <Link
                        href={`/admin/blog/${post.id}`}
                        className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Post"
                      >
                        <Edit2 size={18} />
                      </Link>
                      <button
                        onClick={() => handleDelete(post.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete Post"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
