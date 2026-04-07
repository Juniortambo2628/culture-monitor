"use client";
import React, { useState, useEffect } from "react";
import { useOrganization } from "@/context/OrganizationContext";
import { Building2, ChevronUp, Globe, Settings, Server, Activity, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import axiosInstance from "@/lib/axios";

export function ContextIndicator() {
  const { organizations, activeOrganization, setActiveOrganization, activePoll, setActivePoll } = useOrganization();
  const [isOpen, setIsOpen] = useState(false);
  const [availablePolls, setAvailablePolls] = useState<any[]>([]);

  useEffect(() => {
    if (!activeOrganization) return;
    const fetchPolls = async () => {
      try {
        const res = await axiosInstance.get(`/polls?organization_id=${activeOrganization.id}`);
        setAvailablePolls(res.data || []);
      } catch (e) {
        console.error("Context poll fetch failed", e);
      }
    };
    fetchPolls();
  }, [activeOrganization]);

  if (!activeOrganization) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3 group">
      {/* Dropdown Menu */}
      <div className={cn(
        "bg-card border shadow-2xl rounded-2xl overflow-hidden transition-all duration-300 transform origin-bottom-right w-72",
        isOpen ? "scale-100 opacity-100 translate-y-0" : "scale-95 opacity-0 translate-y-4 pointer-events-none"
      )}>
        <div className="p-4 border-b bg-muted/30">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Server size={10} /> Cluster Repository
          </p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
            {organizations.map((org) => (
              <button
                key={org.id}
                onClick={() => {
                  setActiveOrganization(org);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group/item",
                  activeOrganization.id === org.id 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "hover:bg-muted text-foreground/70 hover:text-foreground"
                )}
              >
                <div className="flex items-center gap-3">
                  <Building2 size={14} className={activeOrganization.id === org.id ? "text-primary-foreground" : "text-primary"} />
                  <span className="text-[13px] font-medium truncate max-w-[140px] tracking-tight">{org.name}</span>
                </div>
                {activeOrganization.id === org.id && <div className="w-1.5 h-1.5 bg-primary-foreground rounded-full animate-pulse" />}
              </button>
            ))}
          </div>
        </div>

        {/* New Version Switcher Section */}
        <div className="p-4 border-b bg-muted/5">
          <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3 flex items-center gap-2">
            <Calendar size={10} /> Analysis Version
          </p>
          <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1 custom-scrollbar">
            {availablePolls.map((poll) => (
              <button
                key={poll.id}
                onClick={() => {
                  setActivePoll(poll);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full text-left p-3 rounded-xl transition-all flex items-center justify-between group/item",
                  activePoll?.id === poll.id 
                    ? "bg-secondary text-secondary-foreground shadow-sm" 
                    : "hover:bg-muted text-foreground/70 hover:text-foreground border border-transparent"
                )}
              >
                <div className="flex items-center gap-3">
                  <Activity size={14} className={activePoll?.id === poll.id ? "text-secondary-foreground" : "text-primary/40"} />
                  <span className="text-[12px] font-medium truncate max-w-[140px] tracking-tight">
                    {poll.year} Q{poll.quarter} - {poll.title}
                  </span>
                </div>
                {activePoll?.id === poll.id && <div className="w-1.5 h-1.5 bg-secondary-foreground rounded-full animate-bounce" />}
              </button>
            ))}
            {availablePolls.length === 0 && (
                <p className="text-[11px] font-medium text-muted-foreground/40 italic p-2">No versions discovered.</p>
            )}
          </div>
        </div>

        <div className="p-3 bg-card flex items-center justify-between">
           <Button variant="ghost" size="sm" className="h-8 rounded-lg text-[11px] font-medium gap-2 text-muted-foreground">
             <Settings size={12} /> System Admin
           </Button>
           <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-500 bg-emerald-500/10 px-2 py-1 rounded-md">
             <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse" />
             Live Sync
           </div>
        </div>
      </div>

      {/* Main Trigger Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "h-16 pl-5 pr-7 rounded-2xl flex items-center gap-5 transition-all duration-300 border shadow-2xl active:scale-95 group",
          isOpen 
            ? "bg-primary border-primary text-primary-foreground shadow-primary/30" 
            : "bg-background/90 backdrop-blur-xl border-muted text-foreground hover:border-primary/50"
        )}
      >
        <div className={cn(
          "w-10 h-10 rounded-xl flex items-center justify-center transition-colors shadow-sm",
          isOpen ? "bg-white/20" : "bg-primary text-primary-foreground"
        )}>
          <Globe size={20} className={cn("transition-transform duration-700", isOpen && "rotate-180")} />
        </div>
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-bold tracking-tight leading-none truncate max-w-[150px]">
              {activeOrganization.name}
            </span>
            <ChevronUp size={14} className={cn("transition-transform duration-300", isOpen && "rotate-180")} />
          </div>
          <div className="flex items-center gap-1.5 mt-1.5 opacity-70">
            <Activity size={10} className={activePoll?.status === 'active' ? "text-emerald-500" : "text-muted-foreground"} />
            <p className="text-[11px] font-medium leading-none">
              {activePoll ? `${activePoll.year} Q${activePoll.quarter} Profile` : "Initializing Cluster..."}
            </p>
          </div>
        </div>
      </button>
    </div>
  );
}
