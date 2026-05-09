"use client";

import React, { useState, useEffect } from "react";
import { 
  Plus, 
  Briefcase, 
  Trash2, 
  Edit2, 
  Save, 
  Loader2, 
  Eye, 
  EyeOff,
  Search,
  Star,
  Globe,
  Filter,
  X
} from "lucide-react";
import { DragSortList } from "../ui/DragSortList";
import { TagInput } from "../ui/TagInput";
import { RichTextEditor } from "../ui/RichTextEditor";
import { cn } from "@/lib/utils";

interface Project {
  id: string;
  title: string;
  client: string;
  industry: string;
  description: string;
  full_case_study: string;
  tech_stack: string[];
  image_url: string;
  project_url: string;
  is_featured: boolean;
  is_visible: boolean;
  position: number;
}

const industries = ["Web", "Mobile", "AI", "ERP", "Marketing", "Other"];

export function PortfolioManager() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Partial<Project>>({ tech_stack: [] });
  const [saving, setSaving] = useState(false);
  const [filter, setFilter] = useState<"all" | "featured" | "hidden">("all");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/content/portfolio");
      const data = await response.json();
      setProjects(data);
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
      const response = await fetch("/api/admin/save-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId,
          ...formData,
          position: editingId ? undefined : projects.length
        }),
      });

      if (response.ok) {
        setIsAdding(false);
        setEditingId(null);
        setFormData({ tech_stack: [] });
        fetchProjects();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this project?")) return;
    try {
      await fetch(`/api/admin/delete-project?id=${id}`, { method: "DELETE" });
      setProjects(projects.filter(p => p.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleVisibility = async (project: Project) => {
    try {
      await fetch("/api/admin/save-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: project.id, is_visible: !project.is_visible }),
      });
      setProjects(projects.map(p => p.id === project.id ? { ...p, is_visible: !p.is_visible } : p));
    } catch (error) {
      console.error(error);
    }
  };

  const filteredProjects = projects.filter(p => {
    if (filter === "featured") return p.is_featured;
    if (filter === "hidden") return !p.is_visible;
    return true;
  });

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <Loader2 className="animate-spin text-purple-600 mb-4" size={40} />
        <p className="text-gray-500 font-medium">Loading portfolio projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Briefcase className="text-purple-600" />
            Portfolio Manager
          </h2>
          <p className="text-gray-500">Showcase your best work to the world.</p>
        </div>
        <button
          onClick={() => {
            setIsAdding(true);
            setEditingId(null);
            setFormData({ tech_stack: [], is_visible: true, is_featured: false, industry: "Web" });
          }}
          className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl font-bold shadow-lg shadow-purple-100 hover:bg-purple-700 transition-all"
        >
          <Plus size={20} />
          Add New Project
        </button>
      </div>

      {(isAdding || editingId) && (
        <div className="bg-white p-8 rounded-2xl border-2 border-purple-100 shadow-2xl space-y-8 animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-xl font-bold text-gray-800">
              {editingId ? "Edit Project Details" : "Create New Portfolio Entry"}
            </h3>
            <button onClick={() => { setIsAdding(false); setEditingId(null); }} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Basic Info */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Project Title</label>
                <input
                  type="text"
                  required
                  value={formData.title || ""}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="e.g. AI-Powered CRM for Fintech"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600">Client Name</label>
                  <input
                    type="text"
                    value={formData.client || ""}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                    placeholder="Acme Corp"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-gray-600">Industry</label>
                  <select
                    value={formData.industry || ""}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none font-medium"
                  >
                    {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Short Description</label>
                <textarea
                  required
                  value={formData.description || ""}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-purple-500 outline-none min-h-[80px]"
                  placeholder="One or two sentences summarizing the project..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Tech Stack</label>
                <TagInput 
                  tags={formData.tech_stack || []} 
                  onChange={(tags) => setFormData({ ...formData, tech_stack: tags })}
                  placeholder="Next.js, Supabase, Tailwind..."
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Project URL (Live Link)</label>
                <input
                  type="url"
                  value={formData.project_url || ""}
                  onChange={(e) => setFormData({ ...formData, project_url: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="https://example.com"
                />
              </div>

              <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">Featured Project</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={formData.is_visible}
                    onChange={(e) => setFormData({ ...formData, is_visible: e.target.checked })}
                    className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
                  />
                  <span className="text-sm font-semibold text-gray-700 group-hover:text-purple-600 transition-colors">Visible on Site</span>
                </label>
              </div>
            </div>

            {/* Right Column: Case Study & Image */}
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Project Cover Image URL</label>
                <input
                  type="text"
                  value={formData.image_url || ""}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-purple-500 outline-none"
                  placeholder="Paste URL or use Media Picker..."
                />
                {formData.image_url && (
                  <div className="mt-2 aspect-video rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                    <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-600">Full Case Study (Rich Text)</label>
                <RichTextEditor
                  content={formData.full_case_study || ""}
                  onChange={(content) => setFormData({ ...formData, full_case_study: content })}
                  placeholder="Deep dive into the challenges, solutions, and results..."
                />
              </div>
            </div>

            <div className="md:col-span-2 flex items-center gap-4 pt-6 border-t border-gray-100">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-10 py-4 bg-purple-600 text-white rounded-xl font-bold shadow-xl shadow-purple-100 hover:bg-purple-700 disabled:opacity-50 transition-all text-lg"
              >
                {saving ? <Loader2 className="animate-spin" size={24} /> : <Save size={24} />}
                {editingId ? "Update Project" : "Publish Project"}
              </button>
              <button
                type="button"
                onClick={() => { setIsAdding(false); setEditingId(null); }}
                className="px-10 py-4 bg-white border border-gray-200 text-gray-600 rounded-xl font-bold hover:bg-gray-50 transition-all text-lg"
              >
                Discard Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filters & List */}
      <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-400 mr-2" />
          {["all", "featured", "hidden"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={cn(
                "px-4 py-1.5 rounded-lg text-sm font-bold capitalize transition-all",
                filter === f ? "bg-purple-100 text-purple-700" : "text-gray-500 hover:bg-gray-50"
              )}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="text-sm text-gray-400 font-medium">
          Showing {filteredProjects.length} projects
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filteredProjects.map((project) => (
          <div 
            key={project.id}
            className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-purple-200 transition-all group flex items-center gap-6"
          >
            <div className="w-32 aspect-video rounded-xl bg-gray-100 overflow-hidden relative border border-gray-100">
              {project.image_url ? (
                <img src={project.image_url} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300">
                  <ImageIcon size={32} />
                </div>
              )}
              {project.is_featured && (
                <div className="absolute top-1 left-1 bg-yellow-400 text-white p-1 rounded-lg shadow-sm">
                  <Star size={12} fill="currentColor" />
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold text-purple-600 bg-purple-50 px-2 py-0.5 rounded uppercase tracking-wider">
                  {project.industry}
                </span>
                <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-0.5 rounded uppercase tracking-wider">
                  {project.client}
                </span>
              </div>
              <h4 className="font-bold text-gray-900 text-lg truncate">{project.title}</h4>
              <p className="text-sm text-gray-500 line-clamp-1">{project.description}</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleVisibility(project)}
                className={cn(
                  "p-2.5 rounded-xl transition-colors",
                  project.is_visible ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-50"
                )}
                title={project.is_visible ? "Hide from site" : "Show on site"}
              >
                {project.is_visible ? <Eye size={20} /> : <EyeOff size={20} />}
              </button>
              <button
                onClick={() => {
                  setEditingId(project.id);
                  setFormData(project);
                  setIsAdding(false);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="p-2.5 text-blue-600 hover:bg-blue-50 rounded-xl transition-colors"
              >
                <Edit2 size={20} />
              </button>
              <button
                onClick={() => handleDelete(project.id)}
                className="p-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { Image as ImageIcon } from "lucide-react";
