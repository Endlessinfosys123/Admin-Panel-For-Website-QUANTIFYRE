"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Upload, 
  Trash2, 
  Copy, 
  Check, 
  Image as ImageIcon, 
  File, 
  MoreVertical, 
  Search,
  Grid,
  List,
  Loader2,
  X,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MediaFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  metadata: any;
}

export function MediaLibrary({ onSelect }: { onSelect?: (url: string) => void }) {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [copied, setCopied] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/media/list");
      const data = await response.json();
      setFiles(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/admin/media/upload", {
        method: "POST",
        body: formData,
      });
      if (response.ok) {
        fetchFiles();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm("Delete this file forever?")) return;
    try {
      await fetch(`/api/admin/media/delete?name=${name}`, { method: "DELETE" });
      setFiles(files.filter(f => f.name !== name));
    } catch (error) {
      console.error(error);
    }
  };

  const getPublicUrl = (name: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    return `${baseUrl}/storage/v1/object/public/content/${name}`;
  };

  const copyUrl = (name: string) => {
    const url = getPublicUrl(name);
    navigator.clipboard.writeText(url);
    setCopied(name);
    setTimeout(() => setCopied(null), 2000);
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(search.toLowerCase()));

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
        <p className="text-gray-500 font-medium">Scanning media storage...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ImageIcon className="text-purple-600" />
            Media Library
          </h2>
          <p className="text-gray-500">Manage assets for your website.</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all disabled:opacity-50"
        >
          {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
          Upload Asset
        </button>
        <input type="file" ref={fileInputRef} onChange={handleUpload} className="hidden" />
      </div>

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search assets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-purple-500 outline-none"
          />
        </div>
        <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-xl">
          <button
            onClick={() => setView("grid")}
            className={cn("p-2 rounded-lg transition-all", view === "grid" ? "bg-white text-purple-600 shadow-sm" : "text-gray-400")}
          >
            <Grid size={18} />
          </button>
          <button
            onClick={() => setView("list")}
            className={cn("p-2 rounded-lg transition-all", view === "list" ? "bg-white text-purple-600 shadow-sm" : "text-gray-400")}
          >
            <List size={18} />
          </button>
        </div>
      </div>

      {filteredFiles.length === 0 ? (
        <div className="bg-white p-20 rounded-3xl border-2 border-dashed border-gray-100 flex flex-col items-center text-gray-400">
           <ImageIcon size={64} className="mb-4 opacity-20" />
           <p className="font-bold text-lg">No assets found</p>
           <p className="text-sm">Upload your first image or video to get started.</p>
        </div>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredFiles.map((file) => {
            const isImage = file.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i);
            const url = getPublicUrl(file.name);
            return (
              <div 
                key={file.id} 
                className={cn(
                  "group relative bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl hover:border-purple-200 transition-all cursor-pointer",
                  onSelect && "hover:ring-4 hover:ring-purple-100"
                )}
                onClick={() => onSelect?.(url)}
              >
                <div className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-50">
                  {isImage ? (
                    <img src={url} alt={file.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                    <File size={40} className="text-gray-300" />
                  )}
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold text-gray-700 truncate">{file.name}</p>
                </div>
                
                {/* Overlay Controls */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                  <button
                    onClick={(e) => { e.stopPropagation(); copyUrl(file.name); }}
                    className="w-full py-2 bg-white rounded-lg text-xs font-bold text-gray-900 flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
                  >
                    {copied === file.name ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
                    {copied === file.name ? "Copied!" : "Copy URL"}
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDelete(file.name); }}
                    className="w-full py-2 bg-red-600 rounded-lg text-xs font-bold text-white flex items-center justify-center gap-2 hover:bg-red-700 transition-colors"
                  >
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
           <table className="w-full text-left">
             <thead>
               <tr className="bg-gray-50 border-b border-gray-100">
                 <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Preview</th>
                 <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Name</th>
                 <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase">Type</th>
                 <th className="px-6 py-3 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
               </tr>
             </thead>
             <tbody className="divide-y divide-gray-100">
               {filteredFiles.map((file) => {
                 const url = getPublicUrl(file.name);
                 return (
                   <tr key={file.id} className="hover:bg-gray-50 transition-colors group">
                     <td className="px-6 py-4">
                       <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden border border-gray-200">
                         {file.name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i) ? (
                           <img src={url} alt={file.name} className="w-full h-full object-cover" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-gray-300">
                             <File size={20} />
                           </div>
                         )}
                       </div>
                     </td>
                     <td className="px-6 py-4">
                       <p className="text-sm font-bold text-gray-900">{file.name}</p>
                     </td>
                     <td className="px-6 py-4">
                       <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded uppercase">
                         {file.name.split('.').pop()}
                       </span>
                     </td>
                     <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                           <button onClick={() => copyUrl(file.name)} className="p-2 text-gray-400 hover:text-purple-600 transition-colors">
                              {copied === file.name ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                           </button>
                           <button onClick={() => handleDelete(file.name)} className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                              <Trash2 size={18} />
                           </button>
                        </div>
                     </td>
                   </tr>
                 );
               })}
             </tbody>
           </table>
        </div>
      )}
    </div>
  );
}
