"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  BarChart3, 
  Trash2, 
  Edit2, 
  Save, 
  Loader2, 
  X,
  Type,
  Hash,
  Smile,
  Zap,
  Briefcase
} from "lucide-react";
import { DragSortList } from "../ui/DragSortList";
import { cn } from "@/lib/utils";

interface Stat {
  id: string;
  label: string;
  value: string;
  suffix: string;
  icon: string;
  position: number;
}

const availableIcons = [
  { name: "Zap", icon: Zap },
  { name: "Smile", icon: Smile },
  { name: "Briefcase", icon: Briefcase },
  { name: "BarChart", icon: BarChart3 },
];

export function StatsManager() {
  const [stats, setStats] = useState<Stat[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Stat>>({ icon: "Zap" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/content/stats");
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleReorder = async (newItems: Stat[]) => {
    const updated = newItems.map((item, index) => ({ ...item, position: index }));
    setStats(updated);
    
    try {
      await fetch("/api/admin/reorder-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items: updated.map(s => ({ id: s.id, position: s.position })) }),
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const response = await fetch("/api/admin/save-stat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          ...formData,
          position: editingId ? undefined : stats.length
        }),
      });

      if (response.ok) {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ icon: "Zap" });
        fetchStats();
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
      await fetch(`/api/admin/delete-stat?id=${id}`, { method: "DELETE" });
      setStats(stats.filter(s => s.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
        <p className="text-gray-500 font-medium">Loading stats...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="text-purple-600" />
            Stats Counters
          </h2>
          <p className="text-gray-500">Impress visitors with your impact numbers.</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({ icon: "Zap" });
          }}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all"
        >
          <Plus size={20} />
          Add Counter
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-6 rounded-2xl border-2 border-purple-100 shadow-xl space-y-6 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">
              {editingId ? "Edit Counter" : "New Counter"}
            </h3>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Label</label>
              <input
                type="text"
                required
                value={formData.label || ""}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Projects Completed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Value (Number)</label>
              <input
                type="text"
                required
                value={formData.value || ""}
                onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-600">Suffix</label>
              <input
                type="text"
                value={formData.suffix || ""}
                onChange={(e) => setFormData({ ...formData, suffix: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="+"
              />
            </div>
            <div className="md:col-span-3 space-y-2">
              <label className="text-sm font-semibold text-gray-600">Select Icon</label>
              <div className="flex gap-4">
                {availableIcons.map(({ name, icon: Icon }) => (
                  <button
                    key={name}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: name })}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2",
                      formData.icon === name ? "border-purple-600 bg-purple-50 text-purple-600" : "border-gray-100 text-gray-400 hover:border-purple-200"
                    )}
                  >
                    <Icon size={24} />
                    <span className="text-[10px] font-bold uppercase">{name}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-3 flex items-center gap-4 pt-4">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 disabled:opacity-50 transition-all"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                {editingId ? "Update Stat" : "Create Stat"}
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DragSortList
          items={stats}
          onReorder={handleReorder}
          renderItem={(s) => {
            const Icon = availableIcons.find(i => i.name === s.icon)?.icon || Zap;
            return (
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-purple-100 text-purple-600 rounded-xl">
                    <Icon size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{s.value}{s.suffix}</h4>
                    <p className="text-xs text-gray-500">{s.label}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setEditingId(s.id);
                      setFormData(s);
                      setIsAdding(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(s.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          }}
        />
      </div>
    </div>
  );
}
