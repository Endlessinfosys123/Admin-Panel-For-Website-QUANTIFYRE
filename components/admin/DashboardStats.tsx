"use client";

import React, { useState, useEffect } from "react";
import { 
  FileText, 
  Briefcase, 
  MessageSquare, 
  Settings, 
  ImageIcon,
  Loader2
} from "lucide-react";

export function DashboardStats() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard/stats")
      .then(res => res.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm animate-pulse flex items-center gap-4">
            <div className="w-12 h-12 bg-gray-100 rounded-xl" />
            <div className="space-y-2">
              <div className="w-20 h-3 bg-gray-100 rounded" />
              <div className="w-10 h-6 bg-gray-100 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  const items = [
    { label: "Blog Posts", value: stats.blog, icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Portfolio", value: stats.portfolio, icon: Briefcase, color: "text-purple-600", bg: "bg-purple-50" },
    { label: "Testimonials", value: stats.testimonials, icon: MessageSquare, color: "text-green-600", bg: "bg-green-50" },
    { label: "Services", value: stats.services, icon: Settings, color: "text-orange-600", bg: "bg-orange-50" },
    { label: "Media Assets", value: stats.media, icon: ImageIcon, color: "text-pink-600", bg: "bg-pink-50" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
      {items.map((stat, i) => (
        <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
          <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
            <stat.icon size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">{stat.label}</p>
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
