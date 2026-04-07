"use client";
import * as React from "react";
import { X } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  description?: string;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "5xl";
}

const maxWidthMap = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
  xl: "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "5xl": "max-w-5xl",
};

export function Dialog({ 
  isOpen, 
  onClose, 
  children, 
  title, 
  description, 
  maxWidth = "xl" 
}: DialogProps) {
  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-950/60 backdrop-blur-md animate-fade-in"
        onClick={onClose}
      />
      
      {/* Dialog Content */}
      <div 
        className={cn(
          "relative w-full bg-background rounded-lg shadow-lg border-none overflow-hidden animate-slide-up",
          maxWidthMap[maxWidth]
        )}
      >
        {/* Header */}
        {(title || description) && (
          <div className="px-6 pt-6 pb-2">
            <div className="flex justify-between items-start">
              <div className="space-y-1.5">
                {title && <h3 className="text-lg font-medium leading-none tracking-tight">{title}</h3>}
                {description && <p className="text-sm text-muted-foreground">{description}</p>}
              </div>
              <button 
                onClick={onClose}
                className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="px-6 pb-6 pt-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {!title && (
              <button 
                onClick={onClose}
                className="absolute top-4 right-4 z-10 p-2 text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl transition-all"
              >
                <X size={20} />
              </button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
}

export function DialogHeader({ title, description, onClose }: { title: string; description?: string; onClose: () => void }) {
    return (
        <div className="px-6 pt-6 pb-2">
            <div className="flex justify-between items-start">
                <div className="space-y-1.5">
                    <h3 className="text-lg font-medium leading-none tracking-tight">{title}</h3>
                    {description && <p className="text-sm text-muted-foreground">{description}</p>}
                </div>
                <button 
                    onClick={onClose}
                    className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
