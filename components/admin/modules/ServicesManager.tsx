"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Settings, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  Save, 
  Loader2, 
  Eye, 
  EyeOff,
  Search,
  ExternalLink
} from "lucide-react";
import { DragSortList } from "../ui/DragSortList";
import { cn } from "@/lib/utils";

interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
  cta_text: string;
  cta_link: string;
  position: number;
  is_visible: boolean;
}

export function ServicesManager() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Service>>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/content/services");
      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (newItems: Service[]) => {
    const updated = newItems.map((item, index) => ({ ...item, position: index }));
    setServices(updated);
    
    // Batch update positions in DB
    try {
      await fetch("/api/admin/reorder-services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updated.map(s => ({ id: s.id, position: s.position })) }),
      });
    } catch (error) {
      console.error("Reorder failed", error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const url = "/api/admin/save-service";
      const method = "POST";
      const body = editingId ? { id: editingId, ...formData } : { ...formData, position: services.length };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        setIsAdding(false);
        setEditingId(null);
        setFormData({});
        fetchServices();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await fetch(`/api/admin/delete-service?id=${id}`, { method: "DELETE" });
      setServices(services.filter(s => s.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleVisibility = async (service: Service) => {
    try {
      await fetch("/api/admin/save-service", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: service.id, is_visible: !service.is_visible }),
      });
      setServices(services.map(s => s.id === service.id ? { ...s, is_visible: !s.is_visible } : s));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
        <p className="text-gray-500 font-medium">Loading services...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="text-purple-600" />
            Services Manager
          </h2>
          <p className="text-gray-500">Manage what you offer to your clients.</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({ is_visible: true, cta_text: "Learn More", cta_link: "/contact" });
          }}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all"
        >
          <Plus size={20} />
          Add New Service
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-6 rounded-2xl border-2 border-purple-100 shadow-xl space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">
              {editingId ? "Edit Service" : "Create New Service"}
            </h3>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Service Title</label>
              <input
                type="text"
                required
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="e.g. Enterprise AI"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Icon Name (Lucide)</label>
              <input
                type="text"
                required
                value={formData.icon || ""}
                onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="e.g. Zap, Cpu, Code"
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-gray-600">Description</label>
              <textarea
                required
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none min-h-[100px]"
                placeholder="Briefly describe this service..."
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">CTA Button Text</label>
              <input
                type="text"
                value={formData.cta_text || ""}
                onChange={(e) => setFormData({ ...formData, cta_text: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">CTA Button Link</label>
              <input
                type="text"
                value={formData.cta_link || ""}
                onChange={(e) => setFormData({ ...formData, cta_link: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>

            <div className="flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 disabled:opacity-50 transition-all shadow-lg shadow-purple-100"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {editingId ? "Update Service" : "Create Service"}
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
          items={services}
          onReorder={handleReorder}
          renderItem={(service) => (
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                  <Search size={24} /> {/* Placeholder for icon preview */}
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 flex items-center gap-2">
                    {service.title}
                    {!service.is_visible && (
                      <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded flex items-center gap-1">
                        <EyeOff size={10} /> Hidden
                      </span>
                    )}
                  </h4>
                  <p className="text-xs text-gray-500 line-clamp-1 max-w-md">{service.description}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleVisibility(service)}
                  className={cn(
                    "p-2 rounded-lg transition-colors",
                    service.is_visible ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"
                  )}
                  title={service.is_visible ? "Hide from site" : "Show on site"}
                >
                  {service.is_visible ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
                <button
                  onClick={() => {
                    setEditingId(service.id);
                    setFormData(service);
                    setIsAdding(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Edit2 size={18} />
                </button>
                <button
                  onClick={() => handleDelete(service.id)}
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
