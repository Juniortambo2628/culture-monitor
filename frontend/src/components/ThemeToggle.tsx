"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function ThemeToggle() {
  const { setTheme, theme } = useTheme();

  return (
    <Button
      variant="outline"
      size="icon"
      className="w-10 h-10 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-card text-slate-500 dark:text-slate-400 hover:text-[#1c5951] dark:hover:text-teal-400 transition-all active:scale-95 shadow-sm"
      onClick={() => {
        const nextTheme = theme === "light" ? "dark" : "light";
        setTheme(nextTheme);
        toast.success(nextTheme === "dark" ? "Deep Teal Mode Active" : "Light Mode Active", {
          description: "System aesthetics updated successfully."
        });
      }}
    >
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
