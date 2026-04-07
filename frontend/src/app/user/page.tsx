"use client";
import React, { useState, useEffect } from "react";
import { 
  ArrowRight, 
  FileText, 
  CheckCircle2, 
  Trophy,
  Target,
  Sparkles,
  Clock,
  ShieldCheck,
  HelpCircle
} from "lucide-react";
import Link from "next/link";
import DashboardHero from "@/components/DashboardHero";
import SummaryCards from "@/components/SummaryCards";
import axiosInstance from "@/lib/axios";
import { Card } from "@/components/ui/card";

export default function UserWelcomePage() {
  const [user, setUser] = useState<any>(null);
  const [activePoll, setActivePoll] = useState<any>(null);
  const [userResponse, setUserResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [userRes, pollRes] = await Promise.all([
          axiosInstance.get("/user"),
          axiosInstance.get("/polls/active").catch(() => ({ data: null }))
        ]);
        setUser(userRes.data);
        if (pollRes.data) {
            setActivePoll(pollRes.data.poll);
            setUserResponse(pollRes.data.user_response);
        }
      } catch (e) {
        console.error("Failed to fetch user dashboard data", e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const userSummaryCards = [
    {
      title: "Active scans",
      value: activePoll ? (userResponse ? "0" : "1") : "0",
      icon: FileText,
      description: "Pending Cultural Contributions",
      variant: activePoll && !userResponse ? "teal" as const : "default" as const
    },
    {
      title: "Completed",
      value: userResponse ? "1" : "0", // Simplified for now, will be updated by real history count if needed
      icon: CheckCircle2,
      description: "Historical Submissions",
      variant: "default" as const
    },
    {
      title: "Tier status",
      value: "Lvl 4",
      icon: Trophy,
      description: "Engagement Multiplier",
      variant: "default" as const
    }
  ];

    if (loading) {
    return (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-6 animate-pulse">
            <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[13px] font-medium text-slate-400">Initializing participant portal...</p>
        </div>
    );
  }

  const pollStatus = activePoll ? (
    userResponse ? (
        activePoll.can_update_responses ? "recalibrate" : "view"
    ) : "new"
  ) : "none";

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      <DashboardHero 
        title={`Welcome back, ${user?.name?.split(' ')[0] || 'Member'}`}
        description="Your unique behavioral signatures help calibrate the organizational culture model. Contribute to active scans below."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {userSummaryCards.map((card, i) => (
            <Card key={i} className={`p-6 border-none shadow-md transition-all hover:scale-[1.02] group transition-colors duration-300 rounded-[32px] ${card.variant === 'teal' ? 'bg-primary text-primary-foreground' : 'bg-card text-card-foreground'}`}>
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-2.5 rounded-xl ${card.variant === 'teal' ? 'bg-primary-foreground/20 text-primary-foreground' : 'bg-secondary text-primary group-hover:rotate-6 transition-transform'}`}>
                        <card.icon size={18} strokeWidth={2.5} />
                    </div>
                    {card.variant === 'teal' && <div className="px-2.5 py-0.5 bg-primary-foreground/10 rounded-full text-[13px] font-medium animate-pulse">Critical input</div>}
                </div>
                <h3 className="text-3xl font-bold tracking-tight mb-1 leading-none">{card.value}</h3>
                <p className={`text-[13px] font-medium ${card.variant === 'teal' ? 'text-primary-foreground/60' : 'text-slate-500'}`}>{card.title}</p>
            </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-7 space-y-6">
          <div className="flex items-center gap-2 ml-2">
            <div className="w-1 h-5 bg-primary rounded-full"></div>
            <h2 className="text-[13px] font-medium text-slate-500">Active culture scans</h2>
          </div>
          
          <div className="space-y-4">
            {activePoll ? (
              <Card className="p-8 shadow-md transition-all group relative overflow-hidden border-none rounded-[40px] hover:shadow-xl">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full transition-transform group-hover:scale-125"></div>
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5">
                  <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${userResponse ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>
                      {userResponse ? <CheckCircle2 size={12}/> : <Sparkles size={12}/>}
                      <span className="text-[13px] font-medium">
                        {userResponse ? 'Response Recorded' : 'Action Required'}
                      </span>
                  </div>
                  <span className="text-[13px] font-medium text-slate-400 flex items-center gap-2">
                    <Clock size={12} className="text-primary"/> {activePoll.year} Q{activePoll.quarter}
                  </span>
                </div>
                <h4 className="text-2xl font-medium text-foreground tracking-tight mb-3 max-w-md group-hover:text-primary transition-colors leading-tight">
                  {activePoll.title}
                </h4>
                <p className="text-[13px] font-medium opacity-80 mb-8 max-w-xl leading-relaxed italic line-clamp-2">
                  {activePoll.description || "Your contribution is requested for this organizational calibration."}
                </p>
                <Link href={`/survey?poll_id=${activePoll.id}`}>
                  <button className="w-full h-11 bg-primary text-primary-foreground rounded-xl font-medium text-[13px flex items-center justify-center gap-3 transition-all hover:scale-[1.01 active:scale-95 shadow-lg shadow-primary/10 leading-none">
                    {pollStatus === 'new' && "Begin diagnostic scan"}
                    {pollStatus === 'recalibrate' && "Update calibration scan"}
                    {pollStatus === 'view' && "View your submission"}
                     <ArrowRight size={16} strokeWidth={2.5} />
                  </button>
                </Link>
              </Card>
            ) : (
                <Card className="bg-muted/30 border-none p-12 rounded-[40px] text-center shadow-none">
                    <CheckCircle2 className="mx-auto text-emerald-500/10 mb-4" size={48} />
                    <h4 className="text-lg font-medium text-muted-foreground">No active scans</h4>
                    <p className="text-[13px] font-medium text-muted-foreground/60 mt-2 italic">Your organizational cluster is currently in a state of equilibrium.</p>
                </Card>
            )}
          </div>
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-2 ml-2">
            <div className="w-1 h-5 bg-primary rounded-full"></div>
            <h2 className="text-[13px] font-medium text-slate-500">System intelligence</h2>
          </div>
          
          <Card className="p-8 relative overflow-hidden shadow-md group border-none rounded-[40px] hover:shadow-xl">
             <div className="absolute top-0 right-0 w-48 h-48 bg-primary-foreground/5 rounded-bl-full transition-transform group-hover:scale-110"></div>
             <div className="relative z-10">
                <div className="w-11 h-11 bg-primary/10 backdrop-blur-xl rounded-xl flex items-center justify-center mb-6 border border-primary/10 shadow-lg">
                    <Target size={22} className="text-current" />
                </div>
                <h3 className="text-2xl font-medium tracking-tight mb-3 leading-none text-current">Diagnostic anonymity</h3>
                <p className="text-[13px] font-medium opacity-70 mb-8 max-w-sm leading-relaxed italic">
                  All survey vectors are high-entropy and multi-layered. Your behavioral responses are aggregated at the segment level to ensure total anonymity.
                </p>
                <div className="flex flex-wrap gap-4">
                    <Link href="/guide" className="flex-1">
                        <button className="w-full px-5 h-11 bg-primary-foreground text-primary rounded-xl font-medium text-[13px hover:bg-secondary transition-all shadow-md active:scale-95 leading-none">
                            Transparency guide
                        </button>
                    </Link>
                    <div className="h-11 w-11 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-primary/5"><ShieldCheck size={18}/></div>
                </div>
             </div>
             </Card>

          <div className="grid grid-cols-1 gap-4">
             <Card className="p-5 flex items-center gap-4 group transition-all border-none rounded-[24px] hover:shadow-lg">
                <div className="p-2.5 bg-secondary text-primary rounded-xl transition-transform group-hover:rotate-6"><HelpCircle size={20} /></div>
                <div>
                    <h5 className="font-medium text-[13px text-primary mb-0.5">Support cluster</h5>
                    <p className="text-[13px] font-medium text-slate-500 italic opacity-60">Technical liaison active</p>
                </div>
                <ArrowRight size={16} className="ml-auto text-slate-300 transition-transform group-hover:translate-x-1.5" />
             </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
