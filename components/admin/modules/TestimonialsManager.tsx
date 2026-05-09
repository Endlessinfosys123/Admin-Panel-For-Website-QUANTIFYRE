"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  MessageSquare, 
  Trash2, 
  Edit2, 
  Save, 
  Loader2, 
  Eye, 
  EyeOff,
  Star,
  User as UserIcon,
  X,
  Quote
} from "lucide-react";
import { DragSortList } from "../ui/DragSortList";
import { cn } from "@/lib/utils";

interface Testimonial {
  id: string;
  client_name: string;
  designation: string;
  company: string;
  quote: string;
  rating: number;
  avatar_url: string;
  is_visible: boolean;
  is_featured: boolean;
  position: number;
}

export function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Testimonial>>({ rating: 5 });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/content/testimonials");
      const data = await response.json();
      setTestimonials(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (newItems: Testimonial[]) => {
    const updated = newItems.map((item, index) => ({ ...item, position: index }));
    setTestimonials(updated);
    
    try {
      await fetch("/api/admin/reorder-testimonials", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updated.map(t => ({ id: t.id, position: t.position })) }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/admin/save-testimonial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          ...formData,
          position: editingId ? undefined : testimonials.length
        }),
      });

      if (response.ok) {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ rating: 5 });
        fetchTestimonials();
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
      await fetch(`/api/admin/delete-testimonial?id=${id}`, { method: "DELETE" });
      setTestimonials(testimonials.filter(t => t.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleVisibility = async (t: Testimonial) => {
    try {
      await fetch("/api/admin/save-testimonial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: t.id, is_visible: !t.is_visible }),
      });
      setTestimonials(testimonials.map(item => item.id === t.id ? { ...item, is_visible: !t.is_visible } : item));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
        <p className="text-gray-500 font-medium">Loading testimonials...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <MessageSquare className="text-purple-600" />
            Testimonials Manager
          </h2>
          <p className="text-gray-500">What clients say about QUANTIFYRE.</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({ rating: 5, is_visible: true, is_featured: false });
          }}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all"
        >
          <Plus size={20} />
          Add Testimonial
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-6 rounded-2xl border-2 border-purple-100 shadow-xl space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">
              {editingId ? "Edit Testimonial" : "New Testimonial"}
            </h3>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Client Name</label>
              <input
                type="text"
                required
                value={formData.client_name || ""}
                onChange={(e) => setFormData({ ...formData, client_name: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Rating (1-5)</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setFormData({ ...formData, rating: num })}
                    className={cn(
                      "p-2 rounded-lg transition-all",
                      (formData.rating || 0) >= num ? "text-yellow-400" : "text-gray-200"
                    )}
                  >
                    <Star size={24} fill="currentColor" />
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Designation</label>
              <input
                type="text"
                value={formData.designation || ""}
                onChange={(e) => setFormData({ ...formData, designation: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Company</label>
              <input
                type="text"
                value={formData.company || ""}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-600">Quote</label>
              <textarea
                required
                value={formData.quote || ""}
                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none min-h-[100px]"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Avatar URL</label>
              <input
                type="text"
                value={formData.avatar_url || ""}
                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_featured}
                  onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-semibold text-gray-700">Featured</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.is_visible}
                  onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                  className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                />
                <span className="text-sm font-semibold text-gray-700">Visible</span>
              </label>
            </div>

            <div className="md:col-span-2 flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 disabled:opacity-50 transition-all"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {editingId ? "Update Testimonial" : "Create Testimonial"}
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

      <div className="space-y-4">
        <DragSortList
          items={testimonials}
          onReorder={handleReorder}
          renderItem={(t) => (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-full overflow-hidden flex items-center justify-center text-purple-600 border border-purple-100">
                  {t.avatar_url ? (
                    <img src={t.avatar_url} alt={t.client_name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon size={24} />
                  )}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    {t.client_name}
                    {t.is_featured && <Star size={14} className="text-yellow-400 fill-current" />}
                    {!t.is_visible && <EyeOff size={14} className="text-gray-400" />}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-1 italic max-w-md">"{t.quote}"</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleVisibility(t)}
                  className="p-2 text-gray-400 hover:text-purple-600 rounded-lg transition-colors"
                >
                  {t.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button
                  onClick={() => {
                    setEditingId(t.id);
                    setFormData(t);
                    setIsAdding(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(t.id)}
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
  );
}
