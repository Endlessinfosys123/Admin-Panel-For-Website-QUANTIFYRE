"use client";

import React, { useState, useEffect } from "react";
import { 
  Save, 
  Settings, 
  Palette, 
  Type, 
  Globe, 
  Shield, 
  Mail, 
  Phone, 
  MapPin,
  Loader2,
  CheckCircle,
  Smartphone
} from "lucide-react";
import { cn } from "@/lib/utils";

export function SettingsManager() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "theme" | "contact">("general");
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
        <p className="text-gray-500 font-medium">Loading site configurations...</p>
      </div>
    );
  }

  const tabs = [
    { id: "general", label: "General Info", icon: Globe },
    { id: "theme", label: "Branding & Theme", icon: Palette },
    { id: "contact", label: "Contact & Links", icon: Mail },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="text-purple-600" />
            Site Settings
          </h2>
          <p className="text-gray-500">Configure global identity and theme.</p>
        </div>
      </div>

      <div className="bg-white rounded-[32px] border border-gray-100 shadow-xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 bg-gray-50/50 border-r border-gray-100 p-6 space-y-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-purple-600 text-white shadow-lg shadow-purple-100" 
                    : "text-gray-500 hover:bg-gray-100"
                )}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-8">
          <form onSubmit={handleSave} className="space-y-8">
            {activeTab === "general" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Site Name</label>
                    <input
                      type="text"
                      value={settings.site_name || ""}
                      onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Site Tagline</label>
                    <input
                      type="text"
                      value={settings.site_tagline || ""}
                      onChange={(e) => setSettings({ ...settings, site_tagline: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 uppercase tracking-wider">Logo URL (Dark)</label>
                  <input
                    type="text"
                    value={settings.logo_url || ""}
                    onChange={(e) => setSettings({ ...settings, logo_url: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}

            {activeTab === "theme" && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Brand Colors</h4>
                    <div className="space-y-4">
                      {["primary", "secondary", "accent"].map((color) => (
                        <div key={color} className="flex items-center justify-between gap-4 p-4 bg-gray-50 rounded-2xl border border-gray-100">
                          <div className="capitalize font-bold text-gray-700">{color}</div>
                          <div className="flex items-center gap-3">
                            <input
                              type="text"
                              value={settings[`${color}_color`] || "#000000"}
                              onChange={(e) => setSettings({ ...settings, [`${color}_color`]: e.target.value })}
                              className="w-24 text-right bg-transparent border-none outline-none font-mono text-sm text-gray-500"
                            />
                            <input
                              type="color"
                              value={settings[`${color}_color`] || "#000000"}
                              onChange={(e) => setSettings({ ...settings, [`${color}_color`]: e.target.value })}
                              className="w-8 h-8 rounded-lg overflow-hidden border-none cursor-pointer"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                     <h4 className="text-sm font-bold text-gray-400 uppercase tracking-widest">Typography</h4>
                     <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500">Font Family (Heading)</label>
                          <input
                            type="text"
                            value={settings.font_family_heading || "Inter"}
                            onChange={(e) => setSettings({ ...settings, font_family_heading: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-bold text-gray-500">Font Family (Body)</label>
                          <input
                            type="text"
                            value={settings.font_family_body || "Inter"}
                            onChange={(e) => setSettings({ ...settings, font_family_body: e.target.value })}
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none"
                          />
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "contact" && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 flex items-center gap-2">
                      <Mail size={14} className="text-purple-500" /> Support Email
                    </label>
                    <input
                      type="email"
                      value={settings.contact_email || ""}
                      onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-600 flex items-center gap-2">
                      <Phone size={14} className="text-purple-500" /> Phone Number
                    </label>
                    <input
                      type="text"
                      value={settings.contact_phone || ""}
                      onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })}
                      className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-600 flex items-center gap-2">
                    <MapPin size={14} className="text-purple-500" /> Office Address
                  </label>
                  <textarea
                    value={settings.contact_address || ""}
                    onChange={(e) => setSettings({ ...settings, contact_address: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none min-h-[100px]"
                  />
                </div>
              </div>
            )}

            <div className="pt-8 border-t border-gray-100 flex items-center justify-between">
               <p className="text-xs text-gray-400">Changes are applied in real-time across the platform.</p>
               <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-10 py-4 bg-purple-600 text-white rounded-2xl font-bold shadow-xl shadow-purple-200 hover:bg-purple-700 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Save Site Configurations
              </button>
            </div>
          </form>
        </div>
      </div>

      {toast && (
        <div className="fixed bottom-8 right-8 z-50 flex items-center gap-3 px-6 py-4 bg-green-600 text-white rounded-2xl shadow-2xl animate-in fade-in slide-in-from-bottom-5">
          <CheckCircle size={24} />
          <span className="font-bold">Settings updated successfully!</span>
        </div>
      )}
    </div>
  );
}
