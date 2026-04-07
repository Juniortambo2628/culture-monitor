"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Target, Users, Zap, Gavel, TrendingUp, Handshake, Loader2, CheckCircle2, FileText } from "lucide-react";
import DashboardHero from "@/components/DashboardHero";
import SummaryCards from "@/components/SummaryCards";
import { toast } from "sonner";
import axiosInstance from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useOrganization } from "@/context/OrganizationContext";

export default function TargetedApplicationsPage() {
  const { activeOrganization } = useOrganization();
  const [stats, setStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      if (!activeOrganization) return;
      setLoadingStats(true);
      try {
        const res = await axiosInstance.get(`/analytics/stats?module=applications&organization_id=${activeOrganization.id}`);
        setStats(res.data);
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoadingStats(false);
      }
    };
    fetchStats();
  }, [activeOrganization]);

    const handleGenerateReport = async (title: string) => {
        if (!activeOrganization) return;
        setGeneratingFor(title);
        toast.info(`Initializing targeted analysis: ${title}`);
        
        try {
            const res = await axiosInstance.post("/analytics/generate-report", { 
                type: title,
                organization_id: activeOrganization.id
            });
            
            if (res.data.success) {
                toast.success(`${title} Report Generated`, {
                    description: `Reference: ${res.data.report_id}. Ready for download.`,
                    icon: <CheckCircle2 className="text-emerald-500" size={18} />
                });
            }
        } catch (error) {
            toast.error("Failed to generate report.");
        } finally {
            setGeneratingFor(null);
        }
    };

  const applications = [
    {
      title: "M&A Cultural Audit",
      description: "Assess cultural compatibility and integration risk during mergers or acquisitions.",
      icon: Handshake,
      color: "text-primary",
      bg: "bg-primary/10"
    },
    {
      title: "Talent Attrition Risk",
      description: "Identify segments with high culture-exit correlation before critical loss occurs.",
      icon: Users,
      color: "text-destructive",
      bg: "bg-destructive/10"
    },
    {
      title: "Leadership Succession",
      description: "Align future leadership profiles with the organization's target cultural evolution.",
      icon: TrendingUp,
      color: "text-emerald-600",
      bg: "bg-emerald-500/10"
    },
    {
      title: "Operational Agility",
      description: "Pinpoint bureaucratic bottlenecks that hinder innovation and speed to market.",
      icon: Zap,
      color: "text-amber-600",
      bg: "bg-amber-500/10"
    },
    {
      title: "Legal & Compliance",
      description: "Monitor behavioral alignment with regulatory requirements and ethical standards.",
      icon: Gavel,
      color: "text-muted-foreground",
      bg: "bg-muted"
    },
    {
      title: "Strategic Realignment",
      description: "Measure the success of large-scale cultural change initiatives against benchmarks.",
      icon: Target,
      color: "text-indigo-600",
      bg: "bg-indigo-500/10"
    }
  ];

  const appSummaryCards = stats.map((s: any) => ({
    title: s.name,
    value: s.value,
    icon: s.name.includes("Active") ? Target : FileText,
    trend: s.trend,
    description: s.description,
    variant: s.variant as any
  }));

  return (
    <div className="space-y-10 pb-20 animate-fade-in text-foreground">
      <DashboardHero 
        title="Targeted Applications" 
        description="Connect your culture data to your business goals." 
      />

      {loadingStats ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[1, 2, 3, 4].map(i => <div key={i} className="h-44 bg-muted/30 animate-pulse rounded-xl border border-muted/50"></div>)}
          </div>
      ) : (
          <SummaryCards cards={appSummaryCards} />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {applications.map((app, index) => (
          <Card key={index} className="border shadow-sm rounded-xl bg-card overflow-hidden transition-all group flex flex-col hover:border-primary/50 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between px-8 py-5">
              <span className="text-[13px] font-medium text-muted-foreground/60 lowercase italic">Strategic Use Case</span>
              <div className={cn("p-2.5 rounded-lg transition-transform group-hover:scale-110 shadow-sm", app.bg, app.color)}>
                <app.icon size={20} />
              </div>
            </CardHeader>
            <CardContent className="p-8 flex-1 flex flex-col">
              <h3 className="text-xl text-foreground mb-4 tracking-tighter leading-tight font-medium uppercase">{app.title}</h3>
              <p className="text-xs text-muted-foreground font-medium leading-relaxed mb-10 flex-1 italic opacity-80">{app.description}</p>
              <Button 
                onClick={() => handleGenerateReport(app.title)}
                disabled={generatingFor === app.title}
                className="w-full h-12 bg-muted/50 border border-muted/50 hover:bg-primary hover:text-primary-foreground hover:border-primary rounded-lg text-[13px] font-medium text-primary transition-all flex items-center justify-center gap-3 disabled:opacity-50 shadow-sm"
              >
                {generatingFor === app.title ? (
                  <>
                    <Loader2 className="animate-spin" size={14} /> 
                    Generating Analysis...
                  </>
                ) : (
                  <>
                    <FileText size={16} />
                    Finalize Targeted Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
