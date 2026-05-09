"use client";

import React, { useState, useEffect } from "react";
import { 
  Save, 
  Edit3, 
  Eye, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  ChevronRight,
  Monitor
} from "lucide-react";
import { RichTextEditor } from "../ui/RichTextEditor";
import { cn } from "@/lib/utils";

interface ContentField {
  id: string;
  page: string;
  section: string;
  field_key: string;
  field_value: string;
  field_type: "text" | "html" | "url" | "image";
}

const pages = [
  { id: "homepage", label: "Homepage" },
  { id: "services", label: "Services" },
  { id: "portfolio", label: "Portfolio" },
  { id: "about", label: "About Us" },
  { id: "blog", label: "Blog" },
  { id: "contact", label: "Contact" },
];

export function PageContentEditor() {
  const [selectedPage, setSelectedPage] = useState(pages[0].id);
  const [fields, setFields] = useState<ContentField[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempValues, setTempValues] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    fetchFields();
  }, [selectedPage]);

  const fetchFields = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/content/${selectedPage}`);
      const data = await response.json();
      setFields(data);
      
      // Initialize temp values
      const values: Record<string, string> = {};
      data.forEach((f: ContentField) => {
        values[f.id] = f.field_value;
      });
      setTempValues(values);
    } catch (error) {
      showToast("Failed to fetch fields", "error");
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message: string, type: "success" | "error") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async (id: string) => {
    setSavingId(id);
    try {
      const response = await fetch("/api/admin/save-content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, value: tempValues[id] }),
      });

      if (!response.ok) throw new Error();

      showToast("Content updated — live in under 1 second", "success");
      setEditingId(null);
      
      // Update local state
      setFields(fields.map(f => f.id === id ? { ...f, field_value: tempValues[id] } : f));
    } catch (error) {
      showToast("Failed to save changes", "error");
    } finally {
      setSavingId(null);
    }
  };

  const groupedFields = fields.reduce((acc: Record<string, ContentField[]>, field) => {
    if (!acc[field.section]) acc[field.section] = [];
    acc[field.section].push(field);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {/* Page Selector */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-4">
          <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            Selected Page:
          </label>
          <select
            value={selectedPage}
            onChange={(e) => setSelectedPage(e.target.value)}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 text-sm font-bold text-gray-900 focus:ring-2 focus:ring-purple-500 outline-none"
          >
            {pages.map((p) => (
              <option key={p.id} value={p.id}>
                {p.label}
              </option>
            ))}
          </select>
        </div>
        
        <Link 
          href={`/${selectedPage === "homepage" ? "" : selectedPage}`} 
          target="_blank"
          className="flex items-center gap-2 text-sm font-semibold text-purple-600 hover:bg-purple-50 px-4 py-2 rounded-xl transition-colors"
        >
          <Monitor size={18} />
          View Live Page
        </Link>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
          <p className="text-gray-500 font-medium">Loading content fields...</p>
        </div>
      ) : Object.keys(groupedFields).length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-400">No content fields found for this page.</p>
          <button className="mt-4 text-purple-600 font-bold hover:underline">
            + Initialize default fields
          </button>
        </div>
      ) : (
        <div className="space-y-10 pb-20">
          {Object.entries(groupedFields).map(([section, sectionFields]) => (
            <section key={section} className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 px-2">
                <ChevronRight size={20} className="text-purple-600" />
                {section.replace(/_/g, " ").toUpperCase()}
              </h3>
              
              <div className="grid grid-cols-1 gap-4">
                {sectionFields.map((field) => (
                  <div 
                    key={field.id}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group transition-all hover:border-purple-200"
                  >
                    <div className="p-5 flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                            {field.field_key.replace(/_/g, " ")}
                          </span>
                        </div>
                        
                        {editingId === field.id ? (
                          <div className="mt-4 space-y-4">
                            {field.field_type === "html" ? (
                              <RichTextEditor 
                                content={tempValues[field.id]} 
                                onChange={(val) => setTempValues({ ...tempValues, [field.id]: val })} 
                              />
                            ) : (
                              <textarea
                                value={tempValues[field.id]}
                                onChange={(e) => setTempValues({ ...tempValues, [field.id]: e.target.value })}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm font-medium focus:ring-2 focus:ring-purple-500 outline-none min-h-[100px]"
                              />
                            )}
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => handleSave(field.id)}
                                disabled={savingId === field.id}
                                className="flex items-center gap-2 px-6 py-2.5 bg-purple-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-purple-100 hover:bg-purple-700 disabled:opacity-50"
                              >
                                {savingId === field.id ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                                Save Changes
                              </button>
                              <button
                                onClick={() => {
                                  setEditingId(null);
                                  setTempValues({ ...tempValues, [field.id]: field.field_value });
                                }}
                                className="px-6 py-2.5 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold text-sm hover:bg-gray-50"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="mt-2">
                            {field.field_type === "html" ? (
                              <div 
                                className="prose prose-sm max-w-none text-gray-600 line-clamp-3 bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200"
                                dangerouslySetInnerHTML={{ __html: field.field_value }}
                              />
                            ) : (
                              <p className="text-gray-700 font-medium bg-gray-50/50 p-4 rounded-xl border border-dashed border-gray-200 leading-relaxed">
                                {field.field_value}
                              </p>
                            )}
                          </div>
                        )}
                      </div>

                      {editingId !== field.id && (
                        <div className="flex md:flex-col gap-2">
                          <button 
                            onClick={() => setEditingId(field.id)}
                            className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl text-sm font-bold hover:border-purple-300 hover:text-purple-600 transition-all"
                          >
                            <Edit3 size={16} />
                            Edit
                          </button>
                          <button className="flex items-center justify-center gap-2 px-4 py-2 text-gray-400 hover:text-gray-600 transition-all">
                            <Eye size={16} />
                            <span className="text-xs font-bold">History</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

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

// Dummy Link component if not imported correctly, but next/link should be used.
import Link from "next/link";
