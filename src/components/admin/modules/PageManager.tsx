"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Layers, 
  Trash2, 
  Edit2, 
  Save, 
  Loader2, 
  X,
  ChevronRight,
  Eye,
  Settings,
  Layout,
  Type,
  ImageIcon,
  Grid
} from "lucide-react";
import { DragSortList } from "../ui/DragSortList";
import { RichTextEditor } from "../ui/RichTextEditor";
import { cn } from "@/lib/utils";

interface Section {
  id: string;
  type: "hero" | "content" | "features" | "cta" | "faq" | "stats";
  content: any;
  position: number;
  is_visible: boolean;
}

interface Page {
  id: string;
  title: string;
  slug: string;
}

export function PageManager() {
  const [pages, setPages] = useState<Page[]>([]);
  const [selectedPage, setSelectedPage] = useState<Page | null>(null);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSection, setEditingSection] = useState<Section | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  useEffect(() => {
    if (selectedPage) {
      fetchSections(selectedPage.id);
    }
  }, [selectedPage]);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/content/pages");
      const data = await response.json();
      setPages(data);
      if (data.length > 0) setSelectedPage(data[0]);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSections = async (pageId: string) => {
    try {
      const response = await fetch(`/api/content/sections?page_id=${pageId}`);
      const data = await response.json();
      setSections(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleReorder = async (newItems: Section[]) => {
    const updated = newItems.map((item, index) => ({ ...item, position: index }));
    setSections(updated);
    try {
      await fetch("/api/admin/sections/reorder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updated.map(s => ({ id: s.id, position: s.position })) }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSaveSection = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/admin/sections/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...editingSection,
          page_id: selectedPage?.id,
          position: editingSection?.id ? undefined : sections.length
        }),
      });
      if (response.ok) {
        setEditingSection(null);
        setIsAdding(false);
        fetchSections(selectedPage!.id);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
        <p className="text-gray-500 font-medium">Building layout engine...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Sidebar: Pages */}
      <div className="w-full lg:w-64 space-y-4">
        <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest px-2">Pages</h3>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-2 space-y-1">
          {pages.map((page) => (
            <button
              key={page.id}
              onClick={() => setSelectedPage(page)}
              className={cn(
                "w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all",
                selectedPage?.id === page.id ? "bg-purple-600 text-white shadow-lg shadow-purple-100" : "text-gray-600 hover:bg-gray-50"
              )}
            >
              {page.title}
              <ChevronRight size={14} className={cn(selectedPage?.id === page.id ? "opacity-100" : "opacity-0")} />
            </button>
          ))}
        </div>
      </div>

      {/* Main Content: Sections */}
      <div className="flex-1 space-y-6">
        <div className="flex items-center justify-between bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
          <div>
            <h2 className="text-2xl font-extrabold text-gray-900">{selectedPage?.title} Layout</h2>
            <p className="text-sm text-gray-500">Drag to reorder sections. Edit content in real-time.</p>
          </div>
          <button
            onClick={() => {
              setIsAdding(true);
              setEditingSection({ type: "content", content: {}, position: sections.length, is_visible: true } as any);
            }}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all"
          >
            <Plus size={20} />
            Add Section
          </button>
        </div>

        {/* Section Editor Modal/Panel */}
        {(isAdding || editingSection) && (
          <div className="bg-white p-8 rounded-[32px] border-2 border-purple-100 shadow-2xl space-y-8 animate-in slide-in-from-top-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-4">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <Layers className="text-purple-600" />
                {editingSection?.id ? "Edit Section" : "Add New Section"}
              </h3>
              <button onClick={() => { setEditingSection(null); setIsAdding(false); }} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveSection} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">Section Type</label>
                  <select
                    value={editingSection?.type}
                    onChange={(e) => setEditingSection({ ...editingSection!, type: e.target.value as any })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none font-bold"
                  >
                    <option value="hero">Hero Section</option>
                    <option value="content">Rich Text Content</option>
                    <option value="features">Features Grid</option>
                    <option value="cta">Call to Action</option>
                    <option value="faq">FAQ List</option>
                    <option value="stats">Stats Counter</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600">Section Title (Internal)</label>
                  <input
                    type="text"
                    value={editingSection?.content?.title || ""}
                    onChange={(e) => setEditingSection({ ...editingSection!, content: { ...editingSection?.content, title: e.target.value } })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="e.g. About Us Intro"
                  />
                </div>
              </div>

              {/* Dynamic Content based on type */}
              <div className="space-y-4">
                 <label className="text-sm font-bold text-gray-600">Body Content</label>
                 <RichTextEditor
                   content={editingSection?.content?.body || ""}
                   onChange={(body) => setEditingSection({ ...editingSection!, content: { ...editingSection?.content, body } })}
                 />
              </div>

              <div className="flex items-center gap-4 pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-10 py-4 bg-purple-600 text-white rounded-2xl font-bold shadow-xl shadow-purple-200 hover:bg-purple-700 transition-all disabled:opacity-50"
                >
                  {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                  Save Section
                </button>
              </div>
            </form>
          </div>
        )}

        <div className="space-y-4">
          <DragSortList
            items={sections}
            onReorder={handleReorder}
            renderItem={(s) => (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "p-2.5 rounded-xl",
                    s.type === "hero" ? "bg-blue-100 text-blue-600" :
                    s.type === "content" ? "bg-green-100 text-green-600" :
                    "bg-gray-100 text-gray-400"
                  )}>
                    {s.type === "hero" ? <Layout size={20} /> : s.type === "content" ? <Type size={20} /> : <Grid size={20} />}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{s.content?.title || "Untitled Section"}</h4>
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{s.type}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <button
                    onClick={() => {
                      setEditingSection(s);
                      setIsAdding(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={async () => {
                      if (!confirm("Delete this section?")) return;
                      await fetch(`/api/admin/sections/delete?id=${s.id}`, { method: "DELETE" });
                      fetchSections(selectedPage!.id);
                    }}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
}
