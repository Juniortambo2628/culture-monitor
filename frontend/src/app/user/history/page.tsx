"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { History, Calendar, Building2, ArrowRight, CheckCircle2, ChevronRight, Loader2, Search } from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import DashboardHero from "@/components/DashboardHero";
import { Input } from "@/components/ui/input";

export default function HistoryPage() {
  const [responses, setResponses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.get("/history");
        setResponses(res.data);
      } catch (e) {
        console.error("Failed to fetch history", e);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const filteredResponses = responses.filter(r => 
    r.poll?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.poll?.organization?.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="h-[40vh] flex flex-col items-center justify-center gap-6 animate-pulse">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-[13px] font-medium text-muted-foreground leading-none">Retrieving historical archives...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      <DashboardHero 
        title="My history" 
        description="A chronological ledger of your cultural contributions and behavioral signatures across organizational clusters."
      />

      <div className="flex flex-col md:flex-row justify-between items-center gap-6">
        <h3 className="text-[13px] font-medium text-muted-foreground ml-2 flex items-center gap-2">
            <History size={14} className="text-primary"/> Archive repository
        </h3>
        
        <div className="relative w-full md:w-80 group">
            <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
                placeholder="Filter archives..." 
                className="pl-10 h-10 rounded-xl bg-card border-border shadow-sm focus:ring-primary/10 transition-all font-medium text-xs" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
            />
        </div>
      </div>

      {filteredResponses.length === 0 ? (
        <Card className="border-2 border-dashed border-border bg-transparent rounded-[32px] p-16 text-center shadow-none">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6 text-muted-foreground/30 ring-8 ring-muted/20">
            <History size={32} />
          </div>
          <h4 className="text-lg font-medium text-muted-foreground tracking-tight">No historical records</h4>
          <p className="text-[13px] font-medium text-muted-foreground/50 mt-2 italic max-w-xs mx-auto">You haven't participated in any organizational culture scans yet.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filteredResponses.map((response) => (
            <Card key={response.id} className="group hover:border-primary/50 transition-all overflow-hidden border border-border shadow-sm rounded-3xl">
              <div className="p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
                <div className="w-14 h-14 bg-secondary flex-shrink-0 flex items-center justify-center rounded-2xl text-primary transition-transform group-hover:scale-110">
                   <CheckCircle2 size={24} />
                </div>
                
                <div className="flex-1 space-y-2 text-center md:text-left">
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-3">
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 text-primary rounded-lg">
                        <Building2 size={10} />
                        <span className="text-[13px] font-medium tracking-tight">{response.poll?.organization?.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2 py-0.5 bg-muted text-muted-foreground rounded-lg">
                        <Calendar size={10} />
                        <span className="text-[13px] font-medium tracking-tight">{new Date(response.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <h4 className="text-xl font-medium tracking-tight text-foreground transition-colors leading-none">
                    {response.poll?.title}
                  </h4>
                  <p className="text-[13px] font-medium text-muted-foreground italic opacity-70">
                    Calibration Quarter: {response.poll?.year} Q{response.poll?.quarter}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <Link href={`/survey?poll_id=${response.poll?.id}`} className="block">
                    <button className="h-10 px-6 rounded-xl bg-primary text-primary-foreground font-medium text-[13px flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/10 leading-none">
                      View details <ArrowRight size={14} strokeWidth={3} />
                    </button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
