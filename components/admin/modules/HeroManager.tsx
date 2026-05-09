"use client";

import React, { useState, useEffect } from "react";
import { 
  Save, 
  Zap, 
  PlayCircle, 
  Image as ImageIcon, 
  Layers, 
  PlusCircle, 
  Loader2,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

const heroFields = [
  { key: "hero_headline", label: "Main Headline (H1)", type: "text" },
  { key: "hero_subheadline", label: "Sub-headline", type: "textarea" },
  { key: "hero_bg_type", label: "Background Type", type: "select", options: ["Gradient", "Video", "Image", "Particles"] },
  { key: "hero_bg_value", label: "Background Value (URL or Color)", type: "text" },
  { key: "hero_cta_primary_text", label: "Primary CTA Text", type: "text" },
  { key: "hero_cta_primary_link", label: "Primary CTA Link", type: "text" },
  { key: "hero_cta_secondary_text", label: "Secondary CTA Text", type: "text" },
  { key: "hero_cta_secondary_link", label: "Secondary CTA Link", type: "text" },
  { key: "hero_trust_line", label: "Trust Line (below CTAs)", type: "text" },
];

const statFields = [1, 2, 3, 4];

export function HeroManager() {
  const [data, setData] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchHeroData();
  }, []);

  const fetchHeroData = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/content/homepage");
      const content = await response.json();
      
      const heroData: Record<string, any> = {};
      content.forEach((item: any) => {
        if (item.section === "hero" || item.field_key.startsWith("hero_")) {
          heroData[item.field_key] = { id: item.id, value: item.field_value };
        }
      });
      setData(heroData);
    } catch (error) {
      showToast("Failed to load hero data", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpdate = (key: string, value: string) => {
    setData({
      ...data,
      [key]: { ...data[key], value }
    });
  };

  const saveAll = async () => {
    setSaving(true);
    try {
      const promises = Object.entries(data).map(([key, item]) => {
        return fetch("/api/admin/save-content", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: item.id, value: item.value }),
        });
      });

      await Promise.all(promises);
      showToast("Hero section updated successfully!", "success");
    } catch (error) {
      showToast("Failed to save some fields", "error");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
        <p className="text-gray-500 font-medium">Loading hero configuration...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="text-purple-600" />
            Hero Manager
          </h2>
          <p className="text-gray-500">Control the first impression of your website.</p>
        </div>
        <button
          onClick={saveAll}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Save All Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Content Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
          <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3">Text & CTAs</h3>
          
          <div className="space-y-4">
            {heroFields.filter(f => !f.key.includes("bg")).map((field) => (
              <div key={field.key} className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">{field.label}</label>
                {field.type === "textarea" ? (
                  <textarea
                    value={data[field.key]?.value || ""}
                    onChange={(e) => handleUpdate(field.key, e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none min-h-[80px]"
                  />
                ) : (
                  <input
                    type="text"
                    value={data[field.key]?.value || ""}
                    onChange={(e) => handleUpdate(field.key, e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Visuals Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3">Background & Style</h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Background Type</label>
                <div className="grid grid-cols-2 gap-2">
                  {["Gradient", "Video", "Image", "Particles"].map((type) => (
                    <button
                      key={type}
                      onClick={() => handleUpdate("hero_bg_type", type)}
                      className={cn(
                        "flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-sm font-bold border transition-all",
                        data["hero_bg_type"]?.value === type 
                          ? "bg-purple-600 border-purple-600 text-white shadow-md" 
                          : "bg-gray-50 border-gray-200 text-gray-600 hover:border-purple-300"
                      )}
                    >
                      {type === "Video" && <PlayCircle size={16} />}
                      {type === "Image" && <ImageIcon size={16} />}
                      {type === "Particles" && <Zap size={16} />}
                      {type === "Gradient" && <Layers size={16} />}
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Background Value (URL / CSS)</label>
                <input
                  type="text"
                  value={data["hero_bg_value"]?.value || ""}
                  onChange={(e) => handleUpdate("hero_bg_value", e.target.value)}
                  placeholder={data["hero_bg_type"]?.value === "Video" ? "https://..." : "linear-gradient(...)"}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Hero Stats Card */}
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6">
            <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-3 flex items-center justify-between">
              Hero Stats
              <span className="text-[10px] bg-purple-100 text-purple-700 px-2 py-0.5 rounded">4 Items Max</span>
            </h3>
            
            <div className="grid grid-cols-2 gap-4">
              {statFields.map((num) => (
                <div key={num} className="p-3 bg-gray-50 rounded-xl border border-gray-100 space-y-2">
                  <span className="text-[10px] font-bold text-gray-400">STAT #{num}</span>
                  <input
                    type="text"
                    placeholder="Value (e.g. 100)"
                    value={data[`hero_stat_${num}_value`]?.value || ""}
                    onChange={(e) => handleUpdate(`hero_stat_${num}_value`, e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs font-bold outline-none focus:border-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Suffix (e.g. +)"
                    value={data[`hero_stat_${num}_suffix`]?.value || ""}
                    onChange={(e) => handleUpdate(`hero_stat_${num}_suffix`, e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-purple-500"
                  />
                  <input
                    type="text"
                    placeholder="Label (e.g. Clients)"
                    value={data[`hero_stat_${num}_label`]?.value || ""}
                    onChange={(e) => handleUpdate(`hero_stat_${num}_label`, e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs outline-none focus:border-purple-500"
                  />
                </div>
              ))}
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
