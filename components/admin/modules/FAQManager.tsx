"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  HelpCircle, 
  Trash2, 
  Edit2, 
  Save, 
  Loader2, 
  Eye, 
  EyeOff,
  X,
  ChevronDown,
  Layout
} from "lucide-react";
import { DragSortList } from "../ui/DragSortList";
import { cn } from "@/lib/utils";

interface FAQ {
  id: string;
  question: string;
  answer: string;
  page: string;
  is_visible: boolean;
  position: number;
}

const pages = ["Homepage", "Services", "About", "Contact", "Enterprise"];

export function FAQManager() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState("Homepage");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<FAQ>>({ page: "Homepage" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchFAQs();
  }, [activePage]);

  const fetchFAQs = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/content/faq?page=${activePage}`);
      const data = await response.json();
      setFaqs(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (newItems: FAQ[]) => {
    const updated = newItems.map((item, index) => ({ ...item, position: index }));
    setFaqs(updated);
    
    try {
      await fetch("/api/admin/reorder-faqs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updated.map(f => ({ id: f.id, position: f.position })) }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/admin/save-faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          ...formData,
          page: activePage,
          position: editingId ? undefined : faqs.length
        }),
      });

      if (response.ok) {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ page: activePage });
        fetchFAQs();
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
      await fetch(`/api/admin/delete-faq?id=${id}`, { method: "DELETE" });
      setFaqs(faqs.filter(f => f.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleVisibility = async (f: FAQ) => {
    try {
      await fetch("/api/admin/save-faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: f.id, is_visible: !f.is_visible }),
      });
      setFaqs(faqs.map(item => item.id === f.id ? { ...item, is_visible: !f.is_visible } : item));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <HelpCircle className="text-purple-600" />
            FAQ Manager
          </h2>
          <p className="text-gray-500">Manage frequently asked questions by page.</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({ is_visible: true, page: activePage });
          }}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all"
        >
          <Plus size={20} />
          Add Question
        </button>
      </div>

      {/* Page Selector Tabs */}
      <div className="bg-white p-2 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-2 overflow-x-auto">
        {pages.map((p) => (
          <button
            key={p}
            onClick={() => setActivePage(p)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap",
              activePage === p ? "bg-purple-600 text-white shadow-lg shadow-purple-100" : "text-gray-500 hover:bg-gray-50"
            )}
          >
            <Layout size={16} />
            {p}
          </button>
        ))}
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-6 rounded-2xl border-2 border-purple-100 shadow-xl space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">
              {editingId ? "Edit FAQ" : "New FAQ Entry"}
            </h3>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Question</label>
              <input
                type="text"
                required
                value={formData.question || ""}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none font-bold"
                placeholder="How do we get started?"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Answer</label>
              <textarea
                required
                value={formData.answer || ""}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none min-h-[120px]"
                placeholder="Describe the answer in detail..."
              />
            </div>
            <div className="flex items-center gap-6">
               <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_visible}
                  onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-semibold text-gray-700">Visible on Site</span>
              </label>
            </div>

            <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 disabled:opacity-50 transition-all"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {editingId ? "Update FAQ" : "Save FAQ"}
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
          <p className="text-gray-500 font-medium">Loading FAQs...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {faqs.length === 0 ? (
             <div className="bg-white p-12 rounded-2xl border border-dashed border-gray-200 text-center text-gray-400">
                No FAQs found for this page.
             </div>
          ) : (
            <DragSortList
              items={faqs}
              onReorder={handleReorder}
              renderItem={(f) => (
                <div className="flex items-center justify-between w-full">
                  <div className="flex-1 min-w-0 pr-8">
                    <h4 className="font-bold text-gray-900 truncate flex items-center gap-2">
                      {f.question}
                      {!f.is_visible && <EyeOff size={14} className="text-gray-400" />}
                    </h4>
                    <p className="text-xs text-gray-500 line-clamp-1">{f.answer}</p>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleVisibility(f)}
                      className="p-2 text-gray-400 hover:text-purple-600 rounded-lg transition-colors"
                    >
                      {f.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                    </button>
                    <button
                      onClick={() => {
                        setEditingId(f.id);
                        setFormData(f);
                        setIsAdding(false);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(f.id)}
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
