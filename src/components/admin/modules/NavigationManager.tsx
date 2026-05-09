"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Menu, 
  Trash2, 
  Edit2, 
  Save, 
  Loader2, 
  X,
  ExternalLink,
  Link as LinkIcon,
  ChevronRight,
  Layout
} from "lucide-react";
import { DragSortList } from "../ui/DragSortList";
import { cn } from "@/lib/utils";

interface NavLink {
  id: string;
  label: string;
  url: string;
  type: "header" | "footer";
  parent_id: string | null;
  position: number;
}

export function NavigationManager() {
  const [links, setLinks] = useState<NavLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<"header" | "footer">("header");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<NavLink>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLinks();
  }, [activeType]);

  const fetchLinks = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/content/navigation?type=${activeType}`);
      const data = await response.json();
      setLinks(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (newItems: NavLink[]) => {
    const updated = newItems.map((item, index) => ({ ...item, position: index }));
    setLinks(updated);
    
    try {
      await fetch("/api/admin/reorder-navigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updated.map(l => ({ id: l.id, position: l.position })) }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/admin/save-navigation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          ...formData,
          type: activeType,
          position: editingId ? undefined : links.length
        }),
      });

      if (response.ok) {
        setIsAdding(false);
        setEditingId(null);
        setFormData({});
        fetchLinks();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure?")) return;
    try {
      await fetch(`/api/admin/delete-navigation?id=${id}`, { method: "DELETE" });
      setLinks(links.filter(l => l.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Menu className="text-purple-600" />
            Menu Manager
          </h2>
          <p className="text-gray-500">Customize header and footer navigation.</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({ type: activeType });
          }}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all"
        >
          <Plus size={20} />
          Add Link
        </button>
      </div>

      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2">
        <button
          onClick={() => setActiveType("header")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
            activeType === "header" ? "bg-purple-600 text-white shadow-lg shadow-purple-100" : "text-gray-500 hover:bg-gray-50"
          )}
        >
          Header Menu
        </button>
        <button
          onClick={() => setActiveType("footer")}
          className={cn(
            "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all",
            activeType === "footer" ? "bg-purple-600 text-white shadow-lg shadow-purple-100" : "text-gray-500 hover:bg-gray-50"
          )}
        >
          Footer Menu
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-6 rounded-2xl border-2 border-purple-100 shadow-xl space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">
              {editingId ? "Edit Link" : "New Link"}
            </h3>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Label</label>
              <input
                type="text"
                required
                value={formData.label || ""}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="e.g. Services"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">URL</label>
              <div className="relative">
                <LinkIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  required
                  value={formData.url || ""}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="/services"
                />
              </div>
            </div>

            <div className="md:col-span-2 flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 disabled:opacity-50 transition-all"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {editingId ? "Update Link" : "Create Link"}
              </button>
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="px-8 py-3 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
          <p className="text-gray-500 font-medium">Fetching menu items...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {links.length === 0 ? (
             <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400">
                No links found in {activeType}.
             </div>
          ) : (
            <DragSortList
              items={links}
              onReorder={handleReorder}
              renderItem={(l) => (
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-4">
                    <div className="p-2 bg-gray-50 rounded-lg text-gray-400">
                      <LinkIcon size={16} />
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900">{l.label}</h4>
                      <p className="text-xs text-gray-500 font-mono">{l.url}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <a
                      href={l.url}
                      target="_blank"
                      className="p-2 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                    >
                      <ExternalLink size={18} />
                    </a>
                    <button
                      onClick={() => {
                        setEditingId(l.id);
                        setFormData(l);
                        setIsAdding(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(l.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              )}
            />
          )}
        </div>
      )}
    </div>
  );
}
