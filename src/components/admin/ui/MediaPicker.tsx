"use client";

import React, { useState } from "react";
import { X, ImageIcon, Search, Upload } from "lucide-react";
import { MediaLibrary } from "../modules/MediaLibrary";
import { cn } from "@/lib/utils";

interface MediaPickerProps {
  onSelect: (url: string) => void;
  onClose: () => void;
  isOpen: boolean;
}

export function MediaPicker({ onSelect, onClose, isOpen }: MediaPickerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-6xl h-full bg-[#F8F7FF] rounded-[32px] shadow-2xl border border-white/20 flex flex-col overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
        <div className="p-6 border-b border-gray-100 flex items-center justify-between bg-white">
          <div>
            <h3 className="text-xl font-extrabold text-gray-900">Select Asset</h3>
            <p className="text-sm text-gray-500">Choose an image from your library or upload a new one.</p>
          </div>
          <button 
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-2xl transition-colors text-gray-400 hover:text-gray-900"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <MediaLibrary 
            onSelect={(url) => {
              onSelect(url);
              onClose();
            }} 
          />
        </div>

        <div className="p-6 border-t border-gray-100 bg-white flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-8 py-3 text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
