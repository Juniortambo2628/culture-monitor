"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Send, RefreshCw, AlertCircle, CheckCircle2, ArrowRight, ArrowLeft, Trash2, Building2, BarChart3, Activity, Loader2, LayoutGrid, List, CheckSquare, Square, MoreVertical, Globe, Layers, Filter } from "lucide-react";
import DashboardHero from "@/components/DashboardHero";
import SummaryCards from "@/components/SummaryCards";
import ViewToggle from "@/components/ViewToggle";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import axiosInstance from "@/lib/axios";
import { useOrganization } from "@/context/OrganizationContext";
import { cn } from "@/lib/utils";

interface Poll {
  id: number;
  title: string;
  description: string;
  status: 'draft' | 'active' | 'closed';
  organization?: { id: number; name: string };
  year: number;
  quarter: number;
  created_at: string;
}

interface Organization {
  id: number;
  name: string;
}

interface Factor {
  id: number;
  name: string;
}

export default function PollsPage() {
  const { activeOrganization } = useOrganization();
  const [polls, setPolls] = useState<Poll[]>([]);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [allFactors, setAllFactors] = useState<Factor[]>([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [isCreating, setIsCreating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    organization_id: '',
    year: new Date().getFullYear(),
    quarter: 1,
    status: 'draft',
    can_update_responses: false,
    selectedFactors: [] as number[],
    questions: [] as { factor_id: number; text: string }[]
  });

  useEffect(() => {
    if (activeOrganization) {
      fetchInitialData();
      setFormData(prev => ({ ...prev, organization_id: activeOrganization.id.toString() }));
    }
  }, [activeOrganization]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const [pollsRes, orgsRes, factorsRes, statsRes] = await Promise.all([
        axiosInstance.get(`/polls?organization_id=${activeOrganization?.id}`),
        axiosInstance.get("/organizations"),
        axiosInstance.get("/factors"),
        axiosInstance.get(`/analytics/stats?module=polls&organization_id=${activeOrganization?.id}`)
      ]);

      setPolls(pollsRes.data);
      setOrgs(orgsRes.data);
      // Deduplicate factors by name to prevent visual redundancy in Wizard
      const uniqueFactors = Array.from(new Map(factorsRes.data.map((f: any) => [f.name, f])).values());
      setAllFactors(uniqueFactors as Factor[]);
      setStats(statsRes.data);
    } catch (e) {
      console.error("Failed to fetch initial data", e);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePoll = async () => {
    setIsCreating(true);
    try {
      const res = await axiosInstance.post("/polls/elaborate", formData);
      
      if (res.status === 200 || res.status === 201) {
        setIsModalOpen(false);
        setStep(1);
        setFormData({
          title: '',
          description: '',
          organization_id: activeOrganization?.id.toString() || '',
          year: new Date().getFullYear(),
          quarter: 1,
          status: 'draft',
          can_update_responses: false,
          selectedFactors: [],
          questions: []
        });
        fetchInitialData();
      }
    } catch (e) {
      console.error("Failed to create poll", e);
    } finally {
      setIsCreating(false);
    }
  };

  const addQuestion = (factorId: number) => {
    setFormData({
      ...formData,
      questions: [...formData.questions, { factor_id: factorId, text: '' }]
    });
  };

  const removeQuestion = (index: number) => {
    const questions = [...formData.questions];
    questions.splice(index, 1);
    setFormData({ ...formData, questions });
  };

  const updateQuestion = (index: number, text: string) => {
    const questions = [...formData.questions];
    questions[index].text = text;
    setFormData({ ...formData, questions });
  };

  const handleDeletePoll = async (id: number) => {
    if (!confirm("Are you sure you want to permanently delete this poll?")) return;
    try {
        await axiosInstance.delete(`/polls/${id}`);
        fetchInitialData();
    } catch (e) {
        console.error("Failed to delete poll", e);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === processedPolls.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(processedPolls.map(p => p.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to permanently remove ${selectedIds.length} polls?`)) return;
    try {
        await Promise.all(selectedIds.map(id => axiosInstance.delete(`/polls/${id}`)));
        setSelectedIds([]);
        fetchInitialData();
    } catch (e) {
        console.error("Bulk delete failed", e);
    }
  };

  const handleBulkStatus = async (status: string) => {
    try {
        await Promise.all(selectedIds.map(id => axiosInstance.put(`/polls/${id}`, { status })));
        setSelectedIds([]);
        fetchInitialData();
    } catch (e) {
        console.error("Bulk status update failed", e);
    }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
        await axiosInstance.put(`/polls/${id}`, { status });
        fetchInitialData();
    } catch (e) {
        console.error("Failed to update status", e);
    }
  };

  const [filterOrg, setFilterOrg] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterQuarter, setFilterQuarter] = useState("all");

  const processedPolls = polls.filter((p) => {
      if (filterOrg !== "all" && (p.organization?.id.toString() !== filterOrg && !(filterOrg === "global" && !p.organization))) return false;
      if (filterStatus !== "all" && p.status !== filterStatus) return false;
      if (filterQuarter !== "all" && p.quarter.toString() !== filterQuarter) return false;
      return true;
  });

  const groupedPolls = processedPolls.reduce((acc, poll) => {
      const orgName = poll.organization?.name || "Global System Cluster";
      if (!acc[orgName]) acc[orgName] = [];
      acc[orgName].push(poll);
      return acc;
  }, {} as Record<string, Poll[]>);

  const pollSummaryCards = stats.map((s: any) => ({
    title: s.name,
    value: s.value,
    icon: s.name.includes("Active") ? Activity : BarChart3,
    trend: s.trend,
    description: s.description,
    variant: s.variant as any
  }));

  if (loading && polls.length === 0) {
    return (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-6 animate-pulse">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
            <p className="text-[13px] font-medium text-muted-foreground">Loading polls...</p>
        </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      <DashboardHero 
        title="CM Poll Inventory" 
        description="Create and manage your polls." 
      />

      <SummaryCards cards={pollSummaryCards} />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 -mt-6">
        <div className="flex items-center gap-3">
             <ViewToggle view={view} onViewChange={setView} />
             {selectedIds.length > 0 && (
                 <div className="flex items-center gap-2 animate-in slide-in-from-left-4 fade-in duration-300">
                     <span className="text-[11px] font-bold text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                         {selectedIds.length} Selected
                     </span>
                     <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleBulkStatus('active')}
                        className="h-9 px-4 text-primary hover:bg-primary/5 rounded-lg text-[11px] font-bold uppercase tracking-tight"
                     >
                        <Send size={14} className="mr-2" /> Activate
                     </Button>
                     <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleBulkDelete}
                        className="h-9 px-4 text-destructive hover:bg-destructive/10 rounded-lg text-[11px] font-bold uppercase tracking-tight"
                     >
                        <Trash2 size={14} className="mr-2" /> Batch Remove
                     </Button>
                 </div>
             )}
        </div>
        <div className="flex items-center gap-3">
             <select className="h-10 text-[11px] font-bold uppercase bg-card border border-muted/50 rounded-xl px-4 min-w-[160px] outline-none shadow-sm focus:border-primary transition-all text-muted-foreground" value={filterOrg} onChange={e => setFilterOrg(e.target.value)}>
                <option value="all">Depth: All Clusters</option>
                <option value="global">System Global</option>
                {orgs.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </select>
            <select className="h-10 text-[11px] font-bold uppercase bg-card border border-muted/50 rounded-xl px-4 min-w-[140px] outline-none shadow-sm focus:border-primary transition-all text-muted-foreground" value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">Status: All</option>
                <option value="active">Active</option>
                <option value="closed">Closed</option>
                <option value="draft">Draft</option>
            </select>
            <Button 
                onClick={() => setIsModalOpen(true)}
                className="h-10 px-6 bg-primary text-white text-[13px] font-medium rounded-lg shadow-lg shadow-primary/10 flex items-center gap-3 transition-all hover:scale-105 active:scale-95"
            >
                <Plus size={16} /> Launch Wizard
            </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 pt-4">
          <div className="lg:col-span-3 space-y-12">
              {Object.keys(groupedPolls).length === 0 ? (
                  <Card className="border border-dashed bg-muted/20 rounded-2xl p-20 text-center shadow-none flex flex-col items-center gap-4">
                      <AlertCircle className="text-muted/40" size={48} />
                      <div className="space-y-1">
                        <p className="text-muted-foreground font-bold text-sm uppercase opacity-60">Inventory Empty</p>
                        <p className="text-[13px] text-muted-foreground/40 italic">No polling discovery in current scope.</p>
                      </div>
                  </Card>
              ) : view === 'grid' ? (
                Object.entries(groupedPolls).map(([orgName, orgPolls]) => (
                    <div key={orgName} className="space-y-6">
                        <div className="flex items-center gap-3 ml-2 group">
                             <div className="w-1.5 h-6 bg-primary rounded-full transition-transform group-hover:scale-y-125"></div>
                             <h3 className="text-[14px] font-black tracking-tighter text-foreground uppercase opacity-80 flex items-center gap-2">
                                <Building2 size={16} className="text-primary/60" /> {orgName} 
                                <span className="bg-muted text-[10px] px-2 py-0.5 rounded-full opacity-60">{orgPolls.length}</span>
                             </h3>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {orgPolls.map(poll => (
                                <Card key={poll.id} className={cn(
                                    "shadow-sm rounded-2xl overflow-hidden group transition-all border relative",
                                    selectedIds.includes(poll.id) ? "border-primary bg-primary/[0.02]" : "border-muted/50 hover:border-primary/30"
                                )}>
                                    <button 
                                        onClick={() => toggleSelect(poll.id)} 
                                        className="absolute top-4 left-4 z-10 p-1.5 rounded-lg bg-card border shadow-sm transition-all hover:scale-110"
                                    >
                                        {selectedIds.includes(poll.id) ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} className="text-muted-foreground/30" />}
                                    </button>

                                    <div className="p-8 space-y-6 bg-card h-full flex flex-col justify-between">
                                        <div className="pt-4">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em] opacity-80 mb-1">Temporal Index</span>
                                                    <span className="text-[15px] font-bold text-foreground tracking-tight underline decoration-primary/20 decoration-2 underline-offset-4">
                                                        {poll.year} Q{poll.quarter}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col items-end gap-1.5">
                                                    <div className={cn(
                                                        "px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider border",
                                                        poll.status === 'active' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" : 
                                                        poll.status === 'draft' ? "bg-amber-500/10 text-amber-600 border-amber-500/20" :
                                                        "bg-muted text-muted-foreground border-muted"
                                                    )}>
                                                        {poll.status}
                                                    </div>
                                                    {poll.status === 'active' && <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></div>}
                                                </div>
                                            </div>
                                            <h4 className="text-lg font-black text-foreground tracking-tight leading-none group-hover:text-primary transition-colors pb-1">{poll.title}</h4>
                                            <p className="text-[13px] font-medium text-muted-foreground/70 mt-3 line-clamp-2 leading-relaxed italic border-l-2 border-muted/30 pl-4 py-1">{poll.description || "System diagnostic calibration."}</p>
                                        </div>
                                        
                                        <div className="flex items-center justify-between pt-6 border-t border-muted/50 mt-6 overflow-hidden">
                                            <div className="flex items-center -space-x-2">
                                                {[1,2,3].map(i => <div key={i} className="w-7 h-7 rounded-lg bg-muted border-2 border-card flex items-center justify-center text-[10px] text-muted-foreground/40 font-bold">U{i}</div>)}
                                            </div>
                                            <div className="flex items-center gap-1.5 translate-x-4 group-hover:translate-x-0 transition-transform duration-500 opacity-0 group-hover:opacity-100">
                                                <Button variant="ghost" size="icon" onClick={() => handleDeletePoll(poll.id)} className="h-9 w-9 rounded-xl text-destructive/40 hover:text-destructive hover:bg-destructive/10 transition-all">
                                                    <Trash2 size={15} />
                                                </Button>
                                                <Link href={`/admin/analytics?poll_id=${poll.id}`}>
                                                  <Button className="h-9 rounded-xl text-[11px] font-black tracking-tight text-white bg-primary hover:scale-105 active:scale-95 shadow-lg shadow-primary/20 px-5 flex items-center gap-2">
                                                      CALIBRATE <BarChart3 size={14} className="opacity-70" />
                                                  </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    </div>
                ))
              ) : (
                <Card className="rounded-2xl border shadow-sm overflow-hidden">
                    <table className="w-full text-xs text-left whitespace-nowrap">
                        <thead className="text-[11px] font-black text-muted-foreground/60 bg-muted/40 border-b uppercase tracking-widest">
                            <tr>
                                <th className="px-8 py-5 w-10">
                                    <button onClick={toggleSelectAll} className="p-1 rounded-md hover:bg-muted transition-colors">
                                        {selectedIds.length === processedPolls.length ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} />}
                                    </button>
                                </th>
                                <th className="px-8 py-5">Launch Period</th>
                                <th className="px-8 py-5">Registry Title</th>
                                <th className="px-8 py-5">Cluster Mapping</th>
                                <th className="px-8 py-5">Status Pulse</th>
                                <th className="px-8 py-5 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-muted/30">
                            {processedPolls.map(p => (
                                <tr key={p.id} className={cn("hover:bg-muted/10 transition-all group", selectedIds.includes(p.id) && "bg-primary/[0.02]")}>
                                    <td className="px-8 py-5">
                                        <button onClick={() => toggleSelect(p.id)} className="p-1 rounded-md hover:bg-muted transition-colors">
                                            {selectedIds.includes(p.id) ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} />}
                                        </button>
                                    </td>
                                    <td className="px-8 py-5 font-black text-foreground">
                                        <div className="flex flex-col">
                                            <span>{p.year} Q{p.quarter}</span>
                                            <span className="text-[10px] opacity-40 font-medium">INDEX_{p.id}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="font-bold text-foreground group-hover:text-primary transition-colors">{p.title}</div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted/50 rounded-lg border border-muted opacity-80 font-bold uppercase text-[10px]">
                                            <Building2 size={12} className="text-muted-foreground/40" /> {p.organization?.name || "Global"}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5">
                                        <div className={cn(
                                            "inline-flex items-center gap-2 px-3 py-1 rounded-full font-black text-[10px] uppercase border",
                                            p.status === 'active' ? "border-emerald-500/20 text-emerald-600 bg-emerald-500/5" : "border-muted text-muted-foreground bg-muted/20"
                                        )}>
                                            {p.status}
                                        </div>
                                    </td>
                                    <td className="px-8 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => handleDeletePoll(p.id)} className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10">
                                                <Trash2 size={15} />
                                            </Button>
                                            <Link href={`/admin/analytics?poll_id=${p.id}`}>
                                                <Button variant="ghost" size="icon" className="h-9 w-9 rounded-xl text-primary hover:bg-primary/5">
                                                    <BarChart3 size={15} />
                                                </Button>
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Card>
              )}
          </div>

          <div className="space-y-6">
              <h3 className="text-[13px] font-medium text-muted-foreground ml-2">Quick Distribution</h3>
              <Card className="shadow-sm rounded-xl overflow-hidden border">
                  <div className="p-8 space-y-6 bg-card">
                      <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-r-xl">
                          <p className="text-[13px] font-medium text-primary mb-1">Notice</p>
                          <p className="text-[13px] font-medium text-muted-foreground leading-relaxed italic">Draft polls require factor validation before distribution.</p>
                      </div>
                      <div className="space-y-2.5">
                          <p className="text-[13px] font-medium text-muted-foreground/60 ml-1">Distribution Ready</p>
                          {polls.filter(p => p.status === 'draft').slice(0, 3).map(p => (
                             <div key={p.id} className="flex items-center justify-between p-3.5 bg-muted/20 rounded-xl border border-transparent hover:border-primary/50 transition-all group">
                                <span className="text-xs tracking-tight text-foreground/80 group-hover:text-primary transition-colors">{p.title}</span>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  onClick={() => handleUpdateStatus(p.id, 'active')}
                                  className="text-primary hover:bg-background rounded-lg h-8 w-8 shadow-sm"
                                ><Send size={14}/></Button>
                             </div>
                          ))}
                      </div>
                  </div>
              </Card>
          </div>
      </div>

      <Dialog 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Poll Wizard"
        description="Standardized poll creation tools."
        maxWidth="4xl"
      >
        <div className="flex justify-end gap-3 mb-8">
            {[1, 2, 3].map((s) => (
                <div key={s} className={`w-8 h-8 rounded-lg flex items-center justify-center text-[13px] font-medium transition-all ${step >= s ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20' : 'bg-muted text-muted-foreground/50 border border-transparent'}`}>
                {step > s ? <CheckCircle2 size={16}/> : s}
                </div>
            ))}
        </div>

        <div className="max-h-[70vh] overflow-y-auto custom-scrollbar pr-1 pt-2">
            {step === 1 && (
                <div className="space-y-6 animate-slide-up">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2 space-y-4">
                            <div className="flex items-center justify-between p-4 bg-muted/20 rounded-xl border border-muted/50">
                                <div className="space-y-1">
                                    <Label className="text-[13px] font-bold text-foreground">Global Distribution</Label>
                                    <p className="text-[11px] text-muted-foreground">Make this poll available to all registered users.</p>
                                </div>
                                <input 
                                    type="checkbox" 
                                    className="w-10 h-5 rounded-full bg-muted checked:bg-primary appearance-none cursor-pointer transition-all relative after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all checked:after:translate-x-5" 
                                    checked={!formData.organization_id}
                                    onChange={(e) => setFormData({ ...formData, organization_id: e.target.checked ? '' : (activeOrganization?.id.toString() || '') })}
                                />
                            </div>

                            {formData.organization_id !== '' && (
                                <div className="space-y-2 animate-fade-in">
                                    <Label className="text-[13px] font-medium text-muted-foreground">Target Organization Cluster</Label>
                                    <select 
                                        className="flex h-11 w-full items-center justify-between rounded-lg border border-muted bg-muted/30 px-4 text-xs font-medium focus:bg-background outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none disabled:opacity-70"
                                        value={formData.organization_id}
                                        onChange={(e) => setFormData({ ...formData, organization_id: e.target.value })}
                                        disabled={!!activeOrganization}
                                    >
                                        <option value="">Select Organization...</option>
                                        {orgs.map(org => <option key={org.id} value={org.id}>{org.name}</option>)}
                                    </select>
                                </div>
                            )}
                        </div>
                        <div className="md:col-span-2 space-y-2">
                            <Label className="text-[13px] font-medium text-muted-foreground">Registry Title</Label>
                            <Input 
                                className="h-11 rounded-lg bg-muted/30 border-muted font-medium text-xs focus:bg-background transition-all"
                                type="text" 
                                placeholder="e.g. 2026 Annual Cultural Resonance Study"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[13px] font-medium text-muted-foreground">Calibration Year</Label>
                            <Input 
                                className="h-11 rounded-lg bg-muted/30 border-muted font-medium text-xs focus:bg-background transition-all"
                                type="number" 
                                value={formData.year}
                                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[13px] font-medium text-muted-foreground">Target Quarter</Label>
                            <select 
                                className="flex h-11 w-full items-center justify-between rounded-lg border border-muted bg-muted/30 px-4 text-xs font-medium focus:bg-background outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none"
                                value={formData.quarter}
                                onChange={(e) => setFormData({ ...formData, quarter: parseInt(e.target.value) })}
                            >
                                <option value={1}>Q1 / Jan - Mar</option>
                                <option value={2}>Q2 / Apr - Jun</option>
                                <option value={3}>Q3 / Jul - Sep</option>
                                <option value={4}>Q4 / Oct - Dec</option>
                            </select>
                        </div>
                        <div className="md:col-span-2 flex items-center gap-3 p-4 bg-primary/5 rounded-xl border border-primary/10">
                            <input 
                                type="checkbox" 
                                id="can_update"
                                checked={formData.can_update_responses}
                                onChange={(e) => setFormData({ ...formData, can_update_responses: e.target.checked })}
                                className="w-4 h-4 rounded border-primary/20 text-primary focus:ring-primary/30"
                            />
                            <Label htmlFor="can_update" className="text-[13px] font-medium text-primary cursor-pointer leading-tight">
                                Allow participants to update responses while active
                            </Label>
                        </div>
                    </div>
                    <Button className="w-full h-12 bg-primary text-white text-[13px] font-medium rounded-lg flex items-center justify-center gap-3 mt-10 shadow-xl shadow-primary/15 transition-all hover:scale-[1.01] active:scale-95" onClick={() => setStep(2)}>
                        Next: Select Factors <ArrowRight size={18} />
                    </Button>
                </div>
            )}

            {step === 2 && (
                <div className="space-y-8 animate-slide-up">
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {allFactors.length > 0 ? allFactors.map((factor) => (
                            <button 
                                key={factor.id}
                                onClick={() => {
                                const selected = [...formData.selectedFactors];
                                if (selected.includes(factor.id)) {
                                    selected.splice(selected.indexOf(factor.id), 1);
                                } else {
                                    selected.push(factor.id);
                                }
                                setFormData({ ...formData, selectedFactors: selected });
                                }}
                                className={`p-6 rounded-xl border-2 cursor-pointer transition-all flex flex-col items-start gap-4 group hover:scale-[1.02] ${formData.selectedFactors.includes(factor.id) ? 'border-primary bg-primary/5 shadow-md shadow-primary/5' : 'border-muted bg-muted/5'}`}
                            >
                                <div className={`p-1.5 rounded-lg transition-all ${formData.selectedFactors.includes(factor.id) ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground/30 group-hover:bg-muted/50'}`}>
                                <CheckCircle2 size={12} />
                                </div>
                                <span className={`text-[13px] font-medium transition-colors ${formData.selectedFactors.includes(factor.id) ? 'text-primary' : 'text-muted-foreground'}`}>{factor.name}</span>
                            </button>
                        )) : (
                            [1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="p-6 rounded-xl border border-muted animate-pulse bg-muted/20 h-32"></div>
                            ))
                        )}
                    </div>
                    <div className="flex gap-4 mt-12">
                        <Button variant="ghost" className="flex-1 h-11 rounded-lg text-[13px] font-medium text-muted-foreground hover:bg-muted" onClick={() => setStep(1)}><ArrowLeft size={16} className="mr-2"/> Back</Button>
                        <Button 
                            className="flex-[2] h-11 bg-primary text-white text-[13px] font-medium rounded-lg flex items-center justify-center gap-3 shadow-lg shadow-primary/10 transition-all hover:scale-[1.01]" 
                            onClick={async () => {
                                // Fetch standard questions for selected factors
                                try {
                                    const names = formData.selectedFactors.map(id => allFactors.find(f => f.id === id)?.name).filter(Boolean);
                                    if (names.length > 0) {
                                        const res = await axiosInstance.get(`/standard-questions?factors=${names.join(',')}`);
                                        const standardQs = res.data.map((sq: any) => ({
                                            factor_id: allFactors.find(f => f.name === sq.factor_name)?.id || 0,
                                            text: sq.text
                                        })).filter((q: any) => q.factor_id !== 0);
                                        
                                        setFormData(prev => ({ ...prev, questions: standardQs }));
                                    }
                                } catch (e) {
                                    console.error("Failed to load standard questions", e);
                                }
                                setStep(3);
                            }}
                        >
                            Next: Define Questions <ArrowRight size={16} className="ml-2" />
                        </Button>
                    </div>
                </div>
            )}

            {step === 3 && (
                <div className="space-y-8 animate-slide-up pb-6">
                    {formData.selectedFactors.map(fId => {
                        const factor = allFactors.find(f => f.id === fId);
                        const factorName = factor ? factor.name : "Factor";
                        return (
                            <div key={fId} className="space-y-4">
                                <div className="flex justify-between items-center bg-muted/30 p-4 rounded-xl border border-muted/50">
                                <h3 className="text-[13px] font-medium text-primary leading-none">{factorName}</h3>
                                <Button variant="ghost" className="text-primary text-[13px] font-medium hover:bg-background px-3 h-8 rounded-lg shadow-sm" onClick={() => addQuestion(fId)}><Plus size={12} className="mr-1.5" /> Add Question</Button>
                                </div>
                                <div className="space-y-3 px-1">
                                {formData.questions.filter(q => q.factor_id === fId).length === 0 && (
                                    <p className="text-[13px] font-medium text-muted-foreground/40 italic text-center py-4 bg-muted/5 rounded-xl border border-dashed">No questions defined for this factor.</p>
                                )}
                                {formData.questions.map((q, idx) => q.factor_id === fId ? (
                                    <div key={idx} className="flex gap-3 group">
                                        <div className="flex-1 relative">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-0.5 h-4 bg-primary/30 rounded-full transition-all group-focus-within:h-6 group-focus-within:bg-primary"></div>
                                        <Input 
                                            className="pl-10 h-11 rounded-lg bg-muted/30 border-muted font-medium text-xs focus:bg-background transition-all" 
                                            placeholder={`Question text for ${factorName}...`}
                                            value={q.text}
                                            onChange={(e) => updateQuestion(idx, e.target.value)}
                                        />
                                        </div>
                                        <Button variant="ghost" size="icon" className="h-11 w-11 text-destructive/50 hover:text-destructive hover:bg-destructive/5 rounded-lg transition-all" onClick={() => removeQuestion(idx)}><Trash2 size={16} /></Button>
                                    </div>
                                ) : null)}
                                </div>
                            </div>
                        );
                    })}
                    <div className="flex gap-4 mt-12 pb-4">
                        <Button variant="ghost" className="flex-1 h-11 rounded-lg text-[13px] font-medium text-muted-foreground hover:bg-muted" onClick={() => setStep(2)}><ArrowLeft size={16} className="mr-2"/> Back</Button>
                            <Button 
                                className="flex-[2] h-11 bg-primary text-white text-[13px] font-medium rounded-lg flex items-center justify-center gap-3 shadow-xl shadow-primary/15 transition-all hover:scale-[1.01]" 
                                onClick={handleCreatePoll}
                                disabled={isCreating}
                            >
                                {isCreating ? <Loader2 className="animate-spin" size={14} /> : "Finalize and Create Poll"} <CheckCircle2 size={18} />
                            </Button>
                    </div>
                </div>
            )}
        </div>
      </Dialog>
    </div>
  );
}
