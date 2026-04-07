"use client";
import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { FileText, Sparkles, Clock, ArrowRight, CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import Link from "next/link";
import axiosInstance from "@/lib/axios";
import DashboardHero from "@/components/DashboardHero";

export default function ActiveSurveysPage() {
  const [activePolls, setActivePolls] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivePolls = async () => {
      try {
        // Standardized polls endpoint handles role-based scoping
        const res = await axiosInstance.get("/polls");
        setActivePolls(res.data.filter((p: any) => p.status === 'active'));
      } catch (e) {
        console.error("Failed to fetch active polls", e);
      } finally {
        setLoading(false);
      }
    };
    fetchActivePolls();
  }, []);

  if (loading) {
    return (
      <div className="h-[40vh] flex flex-col items-center justify-center gap-6 animate-pulse">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-[13px] font-medium text-muted-foreground leading-none">Scanning active channels...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      <DashboardHero 
        title="Active surveys" 
        description="Live organizational diagnostics currently accepting behavioral contributions from your sector."
      />

      <div className="flex items-center gap-2 ml-2">
        <div className="w-1 h-5 bg-primary rounded-full"></div>
        <h2 className="text-[13px] font-medium text-muted-foreground">Live deployment clusters</h2>
      </div>

      {activePolls.length === 0 ? (
        <Card className="border-2 border-dashed border-border bg-transparent rounded-[32px] p-16 text-center shadow-none">
          <div className="w-16 h-16 bg-muted rounded-2xl flex items-center justify-center mx-auto mb-6 text-muted-foreground/30 ring-8 ring-muted/20">
            <CheckCircle2 size={32} />
          </div>
          <h4 className="text-lg font-medium text-muted-foreground tracking-tight">No active deployments</h4>
          <p className="text-[13px] font-medium text-muted-foreground/50 mt-2 italic max-w-xs mx-auto">All organizational diagnostics are currently in equilibrium or closed for processing.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {activePolls.map((poll) => (
            <Card key={poll.id} className="p-8 shadow-md transition-all group relative overflow-hidden flex flex-col border-none rounded-[40px] hover:shadow-xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full transition-transform group-hover:scale-125"></div>
              
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 relative z-10">
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full">
                    <Sparkles size={12}/>
                    <span className="text-[13px] font-medium tracking-tight">Live diagnostic</span>
                </div>
                <span className="text-[13px] font-medium text-muted-foreground flex items-center gap-2 bg-muted px-2.5 py-1 rounded-lg">
                  <Clock size={12} className="text-primary"/> {poll.year} Q{poll.quarter}
                </span>
              </div>

              <div className="flex-1 space-y-3 relative z-10">
                <h4 className="text-2xl text-foreground tracking-tight max-w-md group-hover:text-primary transition-colors leading-tight">
                  {poll.title}
                </h4>
                <p className="text-[13px] font-medium text-muted-foreground opacity-80 leading-relaxed italic line-clamp-3">
                  {poll.description || "Experimental organizational heartbeat survey deployed for sector-wide calibration."}
                </p>
              </div>

              <div className="pt-8 relative z-10 mt-auto">
                <Link href={`/survey?poll_id=${poll.id}`}>
                  <button className="w-full h-12 bg-primary text-primary-foreground rounded-2xl font-medium text-[12px flex items-center justify-center gap-3 transition-all hover:scale-[1.01 active:scale-95 shadow-xl shadow-primary/20 leading-none">
                    Engage diagnostic <ArrowRight size={18} strokeWidth={2.5} />
                  </button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Card className="p-10 bg-muted/30 border-none shadow-none rounded-[48px] flex flex-col md:flex-row items-center gap-8 group">
          <div className="w-16 h-16 bg-background rounded-2xl flex items-center justify-center text-primary shadow-xl group-hover:rotate-6 transition-transform">
              <AlertCircle size={28} />
          </div>
          <div className="flex-1 text-center md:text-left space-y-1">
              <h5 className="font-medium text-sm tracking-tight">Participate responsibly</h5>
              <p className="text-[13px] font-medium text-muted-foreground italic leading-relaxed max-w-lg">
                  Active surveys are time-sensitive deployments. Your contributions directly affect the real-time cultural mapping of your organization.
              </p>
          </div>
      </Card>
    </div>
  );
}
