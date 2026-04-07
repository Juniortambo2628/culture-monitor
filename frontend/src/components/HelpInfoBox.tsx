"use client";
import { Info } from "lucide-react";
import { useState } from "react";
import { Dialog } from "./ui/dialog";
import { cn } from "@/lib/utils";

interface HelpInfoBoxProps {
  title: string;
  content: React.ReactNode;
  className?: string;
}

export default function HelpInfoBox({ title, content, className }: HelpInfoBoxProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("inline-flex items-center", className)}>
      <button 
        onClick={() => setIsOpen(true)} 
        className="group relative flex items-center justify-center h-6 w-6 rounded-full bg-primary/5 hover:bg-primary/10 transition-all active:scale-95"
      >
        <Info size={14} className="text-primary opacity-60 group-hover:opacity-100 transition-opacity" />
      </button>

      <Dialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={title}
        description="Analysis Breakdown"
        maxWidth="md"
      >
        <div className="text-[13px] font-medium text-foreground/80 leading-relaxed py-6 px-1 animate-fade-in max-h-[60vh] overflow-y-auto">
          {content}
        </div>
        <div className="mt-10 flex justify-end">
            <button 
                onClick={() => setIsOpen(false)}
                className="px-8 h-10 bg-muted hover:bg-primary hover:text-primary-foreground text-foreground text-[13px] font-medium rounded-lg transition-all shadow-sm active:scale-95"
            >
                Dismiss Guidance
            </button>
        </div>
      </Dialog>
    </div>
  );
}
