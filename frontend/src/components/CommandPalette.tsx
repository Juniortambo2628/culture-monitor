"use client";
import React, { useState, useEffect } from "react";
import { Search, ChevronRight } from "lucide-react";
import { Dialog } from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

interface CommandItem {
  name: string;
  path: string;
  icon: any;
  category: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  items: CommandItem[];
}

export function CommandPalette({ isOpen, onClose, items }: CommandPaletteProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredResults = items.filter(item => 
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    if (!isOpen) setSearchQuery("");
  }, [isOpen]);

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
    >
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-4 top-4 text-muted-foreground" size={20} />
          <input 
            type="text" 
            autoFocus
            placeholder="Search system, pages, help..." 
            className="w-full h-14 pl-12 pr-4 bg-secondary border-none rounded-2xl outline-none text-foreground font-medium transition-colors"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="max-h-96 overflow-y-auto custom-scrollbar p-2">
          {searchQuery && (
            <div className="mb-4 px-2">
              <p className="text-xs font-medium text-muted-foreground">Search results</p>
            </div>
          )}
          
          <div className="space-y-1">
            {filteredResults.map(item => (
              <button 
                key={item.path}
                onClick={() => {
                  router.push(item.path);
                  onClose();
                }}
                className="w-full p-4 rounded-2xl text-left hover:bg-secondary group flex items-center justify-between transition-all"
              >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-secondary group-hover:bg-primary/10 rounded-xl text-muted-foreground group-hover:text-primary transition-colors">
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="font-medium text-foreground group-hover:text-primary tracking-tight">{item.name}</p>
                    <p className="text-[13px] font-medium text-muted-foreground">{item.category}</p>
                  </div>
                </div>
                <ChevronRight size={16} className="text-muted-foreground/30 group-hover:text-primary transition-transform group-hover:translate-x-0.5" />
              </button>
            ))}
            {filteredResults.length === 0 && (
              <div className="py-10 text-center space-y-3">
                <div className="w-12 h-12 bg-secondary rounded-full flex items-center justify-center mx-auto text-muted-foreground/30">
                  <Search size={24} />
                </div>
                <p className="text-sm font-medium text-muted-foreground italic">No results found for "{searchQuery}"</p>
              </div>
            )}
          </div>
        </div>
        
        <div className="pt-4 border-t border-border flex items-center justify-between text-[13px] font-medium text-muted-foreground px-2">
          <div className="flex gap-4">
            <span><kbd className="bg-secondary px-1 rounded shadow-sm text-muted-foreground">↵</kbd> Select</span>
            <span><kbd className="bg-secondary px-1 rounded shadow-sm text-muted-foreground">↑↓</kbd> Navigate</span>
          </div>
          <span className="flex items-center gap-1.5"><kbd className="bg-secondary px-1 rounded shadow-sm text-muted-foreground">ESC</kbd> Close</span>
        </div>
      </div>
    </Dialog>
  );
}
