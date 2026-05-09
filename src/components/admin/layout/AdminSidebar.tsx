"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  FileText, 
  Zap, 
  Briefcase, 
  PenTool, 
  MessageSquare, 
  HelpCircle, 
  BarChart3, 
  Palette, 
  Type, 
  Compass, 
  User, 
  Settings, 
  LogOut,
  Image as ImageIcon,
  Layout,
  Search,
  Phone,
  Layers,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import { cn } from "@/lib/utils";

const menuItems = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { type: "divider", label: "CONTENT" },
  { label: "Hero Manager", href: "/admin/hero", icon: Zap },
  { label: "Services", href: "/admin/services", icon: Settings },
  { label: "Portfolio", href: "/admin/portfolio", icon: Briefcase },
  { label: "Blog Posts", href: "/admin/blog", icon: PenTool },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { label: "FAQ Manager", href: "/admin/faqs", icon: HelpCircle },
  { label: "Stats Counters", href: "/admin/stats", icon: BarChart3 },
  { type: "divider", label: "SITE" },
  { label: "Media Library", href: "/admin/media", icon: ImageIcon },
  { label: "Navigation", href: "/admin/navigation", icon: Compass },
  { label: "Page Layouts", href: "/admin/pages", icon: Layers },
  { label: "SEO Manager", href: "/admin/seo", icon: Search },
  { type: "divider", label: "SYSTEM" },
  { label: "Site Settings", href: "/admin/settings", icon: Palette },
  { label: "Admin Users", href: "/admin/users", icon: User },
  { label: "Site Analytics", href: "/admin/analytics", icon: BarChart3 },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div 
      className={cn(
        "sticky top-0 left-0 h-screen bg-white border-r border-gray-200 transition-all duration-300 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-gray-100">
        {!isCollapsed && (
          <span className="font-bold text-lg text-purple-600 truncate">
            QUANTIFYRE
          </span>
        )}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 text-gray-500"
        >
          {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
        {menuItems.map((item, index) => {
          if (item.type === "divider") {
            return !isCollapsed ? (
              <div key={index} className="pt-4 pb-2 px-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  {item.label}
                </span>
              </div>
            ) : <div key={index} className="h-px bg-gray-100 my-4 mx-2" />;
          }

          const Icon = item.icon!;
          const isActive = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href!));

          return (
            <Link
              key={item.href}
              href={item.href!}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors group",
                isActive 
                  ? "bg-purple-50 text-purple-700" 
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              )}
            >
              <Icon size={20} className={cn(isActive ? "text-purple-600" : "text-gray-400 group-hover:text-gray-600")} />
              {!isCollapsed && <span className="text-sm font-medium">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-100 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xs">
            {session?.user?.name?.[0] || "A"}
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {session?.user?.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {(session?.user as any)?.role || "Editor"}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={() => signOut()}
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut size={20} />
          {!isCollapsed && <span>Logout</span>}
        </button>
      </div>
    </div>
  );
}
