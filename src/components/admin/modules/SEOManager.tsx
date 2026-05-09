"use client";

import React, { useState, useEffect } from "react";
import { 
  Save, 
  Search, 
  Globe, 
  Share2, 
  Eye, 
  Loader2, 
  CheckCircle,
  AlertCircle,
  FileText,
  Image as ImageIcon
} from "lucide-react";
import { cn } from "@/lib/utils";
import { MediaPicker } from "../ui/MediaPicker";

export function SEOManager() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/content/settings");
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await fetch("/api/admin/save-settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      setToast(true);
      setTimeout(() => setToast(false), 3000);
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
        <p className="text-gray-500 font-medium">Loading SEO configurations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Search className="text-purple-600" />
            SEO & Social Manager
          </h2>
          <p className="text-gray-500">Optimize how your site appears in search engines and social media.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-8 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all disabled:opacity-50"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
          Update SEO
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Search Engine Optimization */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="p-2 bg-blue-100 text-blue-600 rounded-xl">
              <Globe size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Google Search Preview</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-gray-600">Global Meta Title</label>
                <span className={cn("text-[10px] font-bold", (settings.meta_title?.length || 0) > 60 ? "text-red-500" : "text-gray-400")}>
                  {settings.meta_title?.length || 0}/60
                </span>
              </div>
              <input
                type="text"
                value={settings.meta_title || ""}
                onChange={(e) => setSettings({ ...settings, meta_title: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                placeholder="Enter global meta title..."
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-bold text-gray-600">Global Meta Description</label>
                <span className={cn("text-[10px] font-bold", (settings.meta_description?.length || 0) > 160 ? "text-red-500" : "text-gray-400")}>
                  {settings.meta_description?.length || 0}/160
                </span>
              </div>
              <textarea
                value={settings.meta_description || ""}
                onChange={(e) => setSettings({ ...settings, meta_description: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none min-h-[120px]"
                placeholder="Enter global meta description..."
              />
            </div>

            {/* Preview Box */}
            <div className="mt-8 p-6 bg-white border border-gray-200 rounded-2xl shadow-inner space-y-2">
              <p className="text-[#1a0dab] text-xl font-medium hover:underline cursor-pointer truncate">
                {settings.meta_title || "Site Title Preview"}
              </p>
              <p className="text-[#006621] text-sm truncate">
                https://quantifyre.com
              </p>
              <p className="text-[#545454] text-sm line-clamp-2">
                {settings.meta_description || "Start typing a meta description to see how your site will look on Google search results."}
              </p>
            </div>
          </div>
        </div>

        {/* Social Media Optimization */}
        <div className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-xl space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="p-2 bg-pink-100 text-pink-600 rounded-xl">
              <Share2 size={20} />
            </div>
            <h3 className="font-bold text-gray-900">Social Sharing (OG)</h3>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-gray-600">OG Image (Social Preview)</label>
              <div 
                className="aspect-video bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200 overflow-hidden relative group cursor-pointer hover:border-purple-300 transition-all"
                onClick={() => setIsPickerOpen(true)}
              >
                {settings.og_image ? (
                  <img src={settings.og_image} alt="OG Preview" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-300">
                    <ImageIcon size={48} className="mb-2" />
                    <span className="text-xs font-bold">Select Sharing Image</span>
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <span className="bg-white text-gray-900 px-4 py-2 rounded-xl text-xs font-bold shadow-lg">Change Image</span>
                </div>
              </div>
              <input
                type="text"
                value={settings.og_image || ""}
                onChange={(e) => setSettings({ ...settings, og_image: e.target.value })}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-xs focus:ring-2 focus:ring-purple-500 outline-none mt-2"
                placeholder="Image URL..."
              />
            </div>

            <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100">
               <h4 className="text-xs font-bold text-purple-700 uppercase tracking-widest mb-2">Pro Tip</h4>
               <p className="text-xs text-purple-600 leading-relaxed">
                 Use images with 1200x630 resolution for the best display on Facebook, LinkedIn, and Twitter.
               </p>
            </div>
          </div>
        </div>
      </div>

      <MediaPicker 
        isOpen={isPickerOpen} 
        onClose={() => setIsPickerOpen(false)} 
        onSelect={(url) => setSettings({ ...settings, og_image: url })} 
      />

      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 bg-green-600 text-white rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle size={24} />
          <span className="font-bold">SEO settings updated!</span>
        </div>
      )}
    </div>
  );
}
