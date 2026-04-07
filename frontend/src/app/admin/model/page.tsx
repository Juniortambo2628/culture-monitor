"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Settings2, Database, Layers, Zap, Cpu, Terminal, Share2, Loader2 } from "lucide-react";
import DashboardHero from "@/components/DashboardHero";
import SummaryCards from "@/components/SummaryCards";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import axiosInstance from "@/lib/axios";
import { useOrganization } from "@/context/OrganizationContext";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function OrganizationModelPage() {
  const router = useRouter();
  const { activeOrganization } = useOrganization();
  const [stats, setStats] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newSegment, setNewSegment] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [segments, setSegments] = useState([
    { id: "factors", endpoint: "/factors", title: "Cultural Factors / Dimensions", items: [] as string[] },
    { id: "departments", endpoint: null, title: "Departmental Clusters", items: ["Engineering", "Legal", "Marketing", "Sales", "Support", "Finance"] as string[] },
    { id: "organizations", endpoint: "/organizations", title: "Target Organizations", items: [] as string[] },
    { id: "job_levels", endpoint: null, title: "Corporate Job Levels", items: ["Executive", "Director", "Manager", "Senior IC", "Individual Contributor"] as string[] },
    { id: "locations", endpoint: null, title: "Geographic Locations", items: ["Remote Cluster", "HQ Node", "Regional North"] as string[] }
  ]);

  const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null);

  useEffect(() => {
    if (activeOrganization) {
      fetchModelData();
    }
  }, [activeOrganization]);

  const fetchModelData = async () => {
    try {
      setLoadingStats(true);
      const [statsRes, orgsRes, factorsRes] = await Promise.all([
        axiosInstance.get(`/analytics/stats?module=model&organization_id=${activeOrganization?.id}`),
        axiosInstance.get("/organizations"),
        axiosInstance.get("/factors")
      ]);
      
      setStats(statsRes.data);
      
      setSegments(prev => prev.map(s => {
          if (s.id === "organizations") return { ...s, items: orgsRes.data.map((o: any) => o.name) };
          if (s.id === "factors") return { ...s, items: factorsRes.data.map((f: any) => f.name) };
          return s;
      }));
    } catch (error) {
      console.error("Error fetching model data:", error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleAddSegment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    if (selectedEndpoint) {
        try {
            await axiosInstance.post(selectedEndpoint, { name: newSegment });
            fetchModelData();
        } catch (error) {
            console.error("Error adding entity", error);
        }
    } else {
        setSegments(prev => prev.map(s => s.title === selectedCategory ? { ...s, items: [...s.items, newSegment] } : s));
    }

    setTimeout(() => {
        setIsSaving(false);
        setIsModalOpen(false);
        setNewSegment("");
    }, 500);
  };

  const modelSummaryCards = stats.map((s: any) => ({
    title: s.name,
    value: s.value,
    icon: s.name.includes("Factor") ? Layers : s.name.includes("Question") ? Database : Zap,
    trend: s.trend,
    description: s.description,
    variant: s.variant as any
  }));

  if (loadingStats) {
    return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-6 animate-pulse">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-[13px] font-medium text-muted-foreground">Loading Demographic Model...</p>
        </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-12 pb-20">
      <DashboardHero 
        title="Develop Organization Model" 
        description="Set up the demographics and segments for your organization." 
      />

      <SummaryCards cards={modelSummaryCards} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {segments.map((segment, index) => (
          <Card key={index} className="shadow-sm rounded-xl bg-card overflow-hidden transition-all group border border-muted/50 hover:border-primary/50">
            <CardHeader className="flex flex-row items-center justify-between px-8 py-5">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-background border rounded-lg text-muted-foreground group-hover:text-primary transition-colors shadow-sm"><Terminal size={14}/></div>
                <CardTitle className="text-lg font-medium /80 leading-none">{segment.title}</CardTitle>
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => {
                    if (segment.id === 'factors') {
                        router.push('/admin/profile');
                    } else {
                        toast.info(`${segment.title} configuration is handled via Organization Meta-settings.`);
                    }
                }}
                className="text-muted-foreground h-9 w-9 hover:bg-muted transition-colors rounded-lg"
              >
                <Settings2 size={16}/>
              </Button>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex flex-wrap gap-2.5">
                {segment.items.map((item, i) => (
                  <span key={i} className="px-3.5 py-1.5 bg-background border rounded-lg text-[13px] font-medium tracking-tight text-foreground/70 shadow-sm transition-all hover:border-primary hover:text-primary cursor-default">
                    {item}
                  </span>
                ))}
                <Button 
                    variant="outline" 
                    className="h-9 px-4 text-[13px] font-medium border border-dashed border-muted-foreground/30 text-primary hover:bg-primary/5 hover:border-primary transition-all rounded-lg"
                    onClick={() => {
                        setSelectedCategory(segment.title);
                        setSelectedEndpoint(segment.endpoint);
                        setIsModalOpen(true);
                    }}
                >
                  <Plus size={14} className="mr-2" /> Add Entity
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Segment Architect"
        description="Expanding Demographic Dimension"
        maxWidth="md"
      >
        <div className="flex items-center gap-4 mb-10">
            <div className="p-3 bg-primary/10 rounded-xl text-primary shadow-sm"><Share2 size={24}/></div>
            <p className="text-[13px] font-medium text-primary italic leading-none">Expanding Demographic Dimension</p>
        </div>

        <form onSubmit={handleAddSegment} className="space-y-10">
            <div className="space-y-3 group">
                <label className="text-[13px] font-medium text-muted-foreground/60 ml-1">New {selectedCategory} Entity</label>
                <div className="relative">
                    <Cpu className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-primary transition-colors" size={18} />
                    <Input 
                        placeholder="e.g. STRATEGIC OPERATIONS" 
                        className="h-14 pl-12 pr-6 rounded-lg bg-muted/20 border-muted text-xs focus:bg-background transition-all placeholder:text-muted-foreground/30"
                        value={newSegment}
                        onChange={(e) => setNewSegment(e.target.value)}
                        required
                    />
                </div>
            </div>
            <div className="flex gap-4 pt-4">
                <Button 
                    type="button" 
                    variant="ghost" 
                    className="flex-1 h-14 rounded-lg text-[13px] font-medium text-muted-foreground hover:bg-muted transition-all"
                    onClick={() => setIsModalOpen(false)}
                >
                    Abort
                </Button>
                <Button 
                    type="submit" 
                    disabled={isSaving}
                    className="flex-[2 h-14 rounded-lg text-[13px] font-medium bg-primary text-primary-foreground shadow-lg shadow-primary/15 transition-all hover:scale-[1.02 active:scale-95"
                >
                    {isSaving ? <Loader2 className="animate-spin" size={14} /> : "Register Entity"}
                </Button>
            </div>
        </form>
      </Dialog>
    </div>
  );
}
