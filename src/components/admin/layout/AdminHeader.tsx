"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Bell } from "lucide-react";

export function AdminHeader() {
  const pathname = usePathname();
  
  // Convert path to title
  const getTitle = () => {
    if (pathname === "/admin") return "Dashboard";
    const parts = pathname.split("/");
    const lastPart = parts[parts.length - 1];
    return lastPart.charAt(0).toUpperCase() + lastPart.slice(1).replace(/-/g, " ");
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 sticky top-0 z-10">
      <h1 className="text-xl font-bold text-gray-800">{getTitle()}</h1>
      
      <div className="flex items-center gap-4">
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-colors relative">
          <Bell size={20} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
      </div>
    </header>
  );
}
