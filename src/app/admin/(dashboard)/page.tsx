import React from "react";
import { 
  FileText, 
  Briefcase, 
  MessageSquare, 
  Settings, 
  ImageIcon, 
  TrendingUp, 
  Clock,
  PlusCircle
} from "lucide-react";
import { DashboardStats } from "@/components/admin/DashboardStats";
import Link from "next/link";

const quickActions = [
  { label: "New Blog Post", href: "/admin/blog", icon: PlusCircle },
  { label: "New Project", href: "/admin/portfolio", icon: PlusCircle },
  { label: "New Testimonial", href: "/admin/testimonials", icon: PlusCircle },
  { label: "Upload Media", href: "/admin/media", icon: ImageIcon },
];

const activities = [
  { user: "Tishy Patel", action: "published a new blog post", target: "The Future of AI in Fintech", time: "2 hours ago" },
  { user: "Editor User", action: "updated service", target: "ERP Solutions", time: "4 hours ago" },
  { user: "Tishy Patel", action: "uploaded 4 new images", target: "Media Library", time: "5 hours ago" },
  { user: "SEO Manager", action: "updated SEO metadata", target: "Homepage", time: "1 day ago" },
  { user: "Editor User", action: "added a new testimonial", target: "John Doe (Acme Corp)", time: "1 day ago" },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <p className="text-gray-500">Welcome back! Here's what's happening with your site today.</p>
      </div>

      {/* Stats Grid */}
      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <Clock size={20} className="text-purple-600" />
              Recent Activity
            </h3>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="divide-y divide-gray-100">
              {activities.map((activity, i) => (
                <div key={i} className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                      {activity.user[0]}
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">
                        <span className="font-semibold text-gray-900">{activity.user}</span> {activity.action}{" "}
                        <span className="font-medium text-purple-600 italic">"{activity.target}"</span>
                      </p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                  <TrendingUp size={16} className="text-gray-300" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-gray-800">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-3">
            {quickActions.map((action, i) => (
              <Link
                key={i}
                href={action.href}
                className="flex items-center gap-3 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:border-purple-200 hover:shadow-md transition-all group"
              >
                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <action.icon size={20} />
                </div>
                <span className="font-semibold text-gray-700">{action.label}</span>
              </Link>
            ))}
          </div>
          
          <div className="mt-8 p-6 bg-purple-600 rounded-2xl text-white shadow-lg shadow-purple-200">
            <h4 className="font-bold mb-2">Need help?</h4>
            <p className="text-sm text-purple-100 mb-4">Check out our CMS documentation for tutorials on how to manage your content.</p>
            <button className="px-4 py-2 bg-white text-purple-600 rounded-lg text-sm font-bold hover:bg-purple-50 transition-colors">
              Read Docs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
