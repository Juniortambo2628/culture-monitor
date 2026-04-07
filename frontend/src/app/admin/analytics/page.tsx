"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar } from "recharts";
import { TrendingUp, Activity, PieChart, Zap, RefreshCw, Loader2 } from "lucide-react";
import DashboardHero from "@/components/DashboardHero";
import SummaryCards from "@/components/SummaryCards";
import HelpInfoBox from "@/components/HelpInfoBox";
import axiosInstance from "@/lib/axios";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useOrganization } from "@/context/OrganizationContext";
import { OrgComparisonWidget } from "@/components/OrgComparisonWidget";

interface TrendData {
    period: string;
    score: number;
    target: number;
}

interface RadarData {
    subject: string;
    A: number;
    fullMark: number;
}

interface HeatmapData {
    name: string;
    score: number;
}

interface StatData {
    name: string;
    value: string | number;
    trend: string | number;
    description: string;
    variant: string;
}

function AnalyticsContent() {
    const { activeOrganization, activePoll, setActivePoll } = useOrganization();
    const searchParams = useSearchParams();
    
    const [trends, setTrends] = useState<TrendData[]>([]);
    const [radarData, setRadarData] = useState<RadarData[]>([]);
    const [heatmap, setHeatmap] = useState<HeatmapData[]>([]);
    const [stats, setStats] = useState<StatData[]>([]);
    const [polls, setPolls] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [fetchingVersion, setFetchingVersion] = useState(false);

    useEffect(() => {
        const fetchInitialData = async () => {
            if (!activeOrganization) return;
            setLoading(true);
            try {
                const orgId = activeOrganization.id;
                const [trendsRes, statsRes, pollsRes] = await Promise.all([
                    axiosInstance.get(`/analytics/trends?organization_id=${orgId}`),
                    axiosInstance.get(`/analytics/stats?module=dashboard&organization_id=${orgId}`),
                    axiosInstance.get(`/polls?organization_id=${orgId}`)
                ]);

                setTrends(trendsRes.data);
                setStats(statsRes.data);
                
                // Fix duplicates by using a Map to filter by ID
                const uniquePolls = Array.from(new Map(pollsRes.data.map((p: any) => [p.id, p])).values())
                                         .filter((p: any) => p.status !== 'draft');
                setPolls(uniquePolls);
                
                // If we don't have a global activePoll, but have polls, pick the first one and set globally
                if (!activePoll && uniquePolls.length > 0) {
                    setActivePoll(uniquePolls[0]);
                }
            } catch (error) {
                console.error("Error fetching initial analytics data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchInitialData();
    }, [activeOrganization]);

    useEffect(() => {
        if (!activePoll || !activeOrganization) return;

        const fetchVersionData = async () => {
            setFetchingVersion(true);
            try {
                const orgId = activeOrganization.id;
                const [radarRes, heatmapRes] = await Promise.all([
                    axiosInstance.get(`/analytics/radar?poll_id=${activePoll.id}&organization_id=${orgId}`),
                    axiosInstance.get(`/analytics/heatmap?poll_id=${activePoll.id}&organization_id=${orgId}`)
                ]);

                setRadarData(radarRes.data);
                setHeatmap(heatmapRes.data);
            } catch (error) {
                console.error("Error fetching versioned data:", error);
            } finally {
                setFetchingVersion(false);
            }
        };

        fetchVersionData();
    }, [activePoll, activeOrganization]);

    if (loading) {
        return (
            <div className="h-[40vh] flex flex-col items-center justify-center gap-6 animate-pulse">
                <Loader2 className="w-12 h-12 text-primary animate-spin" />
                <p className="text-[13px] font-medium text-muted-foreground">Analyzing your data...</p>
            </div>
        );
    }

    const summaryCards = stats.map((s: any) => ({
        title: s.name,
        value: s.value,
        icon: s.name.includes('Rate') ? Zap : s.name.includes('Score') ? Activity : PieChart,
        trend: s.trend,
        description: s.description,
        variant: s.variant as any
    }));

    return (
        <div className="animate-fade-in space-y-12 pb-20">
            <DashboardHero 
                title="Advanced Analytics" 
                description="View analytics, trends, and results for your organization." 
            />

            <SummaryCards cards={summaryCards} />

            <OrgComparisonWidget />

            <Card className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 rounded-xl border shadow-sm bg-card">
                <div>
                    <h3 className="text-[13px] font-medium text-primary uppercase">Profile Version Status</h3>
                    <p className="text-[12px] font-medium text-muted-foreground mt-1 italic">Viewing multi-dimensional analysis for the currently active context</p>
                </div>
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="bg-muted/30 border rounded-lg h-11 px-6 flex items-center gap-3">
                        <Activity size={14} className={fetchingVersion ? "animate-spin text-primary" : "text-primary/50"} />
                        <span className="text-xs font-bold text-foreground">
                            {activePoll ? `${activePoll.year} Q${activePoll.quarter} - ${activePoll.title}` : "Discovering active versions..."}
                        </span>
                    </div>
                </div>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                <Card className="shadow-sm rounded-xl bg-card overflow-hidden border">
                    <CardHeader className="px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary"><TrendingUp size={20} /></div>
                                <div>
                                    <h3 className="text-base text-foreground tracking-tight leading-none font-medium uppercase">Quarterly Pulse</h3>
                                    <p className="text-[13px] font-medium text-muted-foreground mt-1 lowercase italic opacity-60">Longitudinal growth vector</p>
                                </div>
                            </div>
                            <HelpInfoBox 
                                title="QUARTERLY PULSE" 
                                content="Visualizes the 'Culture Pulse' longitudinal index compared to quarterly benchmarks." 
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 h-[400px]">
                        <ResponsiveContainer width="100%" height={320}>
                            <LineChart data={trends}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted/30" />
                                <XAxis dataKey="period" axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 13, fontWeight: 500 }} dy={10} />
                                <YAxis axisLine={false} tickLine={false} tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 13, fontWeight: 500 }} domain={[0, 10]} dx={-10} />
                                <Tooltip 
                                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow)', fontWeight: 'bold', background: 'hsl(var(--card))', fontSize: '12px' }}
                                />
                                <Line type="monotone" dataKey="score" stroke="hsl(var(--primary))" strokeWidth={4} dot={{ fill: "hsl(var(--primary))", r: 4, strokeWidth: 2, stroke: "#fff" }} activeDot={{ r: 8, strokeWidth: 0 }} />
                                <Line type="monotone" dataKey="target" stroke="hsl(var(--muted-foreground))" strokeDasharray="6 6" strokeWidth={2} dot={false} opacity={0.3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card className="shadow-sm rounded-xl bg-card overflow-hidden border">
                    <CardHeader className="px-8 py-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-primary/10 rounded-xl text-primary"><Activity size={20} /></div>
                                <div>
                                    <h3 className="text-base text-foreground tracking-tight leading-none">Factor Equilibrium</h3>
                                    <p className="text-[13px] font-medium text-muted-foreground mt-1">Dimensional balance index</p>
                                </div>
                            </div>
                            <HelpInfoBox 
                                title="FACTOR EQUILIBRIUM" 
                                content="Identifies the balance of cultural factors across six key dimensions." 
                            />
                        </div>
                    </CardHeader>
                    <CardContent className="p-8 h-[400px] flex items-center justify-center">
                        <ResponsiveContainer width="100%" height={320}>
                            <RadarChart cx="50%" cy="50%" outerRadius={120} data={radarData}>
                                <PolarGrid stroke="currentColor" className="text-muted/30" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 13, fontWeight: 500 }} />
                                <Radar name="Org Index" dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.2} strokeWidth={3} />
                                <Tooltip contentStyle={{ borderRadius: '12px', background: 'hsl(var(--card))', border: 'none', boxShadow: 'var(--shadow)', fontSize: '12px' }} />
                            </RadarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <Card className="shadow-sm rounded-xl bg-card overflow-hidden border">
                <CardHeader className="px-10 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                        <h3 className="text-xl text-foreground tracking-tight">Organizational Heatmap</h3>
                        <p className="text-[13px] font-medium text-muted-foreground mt-1 italic">Segment-level health distribution</p>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                        <div className="flex items-center gap-3 text-[13px] font-medium text-muted-foreground bg-muted/50 px-4 py-2 rounded-lg border">
                            <span>Critical</span>
                            <div className="flex gap-1 h-2.5">
                                <div className="w-6 bg-rose-500 rounded-sm opacity-40"></div>
                                <div className="w-6 bg-amber-500 rounded-sm opacity-40"></div>
                                <div className="w-6 bg-emerald-500 rounded-sm opacity-40"></div>
                                <div className="w-6 bg-primary rounded-sm"></div>
                            </div>
                            <span>Optimal</span>
                        </div>
                        <HelpInfoBox 
                            title="SEGMENT HEATMAP" 
                            content="Displays the comparative density of cultural health across organizational segments." 
                        />
                    </div>
                </CardHeader>
                <CardContent className="p-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {heatmap.map((item, index) => (
                            <div 
                                key={index} 
                                className={cn(
                                    "p-6 rounded-xl border transition-all hover:scale-[1.03] hover:shadow-lg cursor-default flex flex-col justify-between h-40 group",
                                    item.score >= 8 ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/10' : 
                                    item.score >= 6 ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600' : 
                                    item.score >= 4 ? 'bg-amber-500/10 border-amber-500/20 text-amber-600' :
                                    'bg-rose-500/10 border-rose-500/20 text-rose-600'
                                )}
                            >
                                <div className="text-[13px] font-medium opacity-70 group-hover:opacity-100 transition-opacity lowercase italic">{item.name}</div>
                                <div className="flex items-end justify-between">
                                    <div className="text-4xl tracking-tighter leading-none font-bold">{item.score.toFixed(1)}</div>
                                    <div className={cn(
                                        "text-[12px] font-medium py-1.5 px-3 rounded-lg border uppercase",
                                        item.score >= 8 ? 'bg-white/10 border-white/20 text-white' : 'bg-background/20 border-current/20'
                                    )}>
                                        {item.score >= 8 ? 'Optimal' : item.score >= 6 ? 'Healthy' : item.score >= 4 ? 'Alert' : 'Critical'}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default function AnalyticsPage() {
    return (
        <Suspense fallback={<Loader2 className="animate-spin" />}>
            <AnalyticsContent />
        </Suspense>
    );
}
