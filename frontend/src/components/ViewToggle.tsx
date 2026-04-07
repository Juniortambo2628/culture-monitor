"use client";
import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ViewToggleProps {
  view: 'grid' | 'list';
  onViewChange: (view: 'grid' | 'list') => void;
}

export default function ViewToggle({ view, onViewChange }: ViewToggleProps) {
  return (
    <div className="flex items-center bg-muted/50 p-1 rounded-xl border border-muted/50 self-end">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('list')}
        className={cn(
          "h-8 w-10 p-0 rounded-lg transition-all",
          view === 'list' 
            ? "bg-background text-primary shadow-sm hover:bg-background" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <List size={16} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onViewChange('grid')}
        className={cn(
          "h-8 w-10 p-0 rounded-lg transition-all",
          view === 'grid' 
            ? "bg-background text-primary shadow-sm hover:bg-background" 
            : "text-muted-foreground hover:text-foreground"
        )}
      >
        <LayoutGrid size={16} />
      </Button>
    </div>
  );
}
