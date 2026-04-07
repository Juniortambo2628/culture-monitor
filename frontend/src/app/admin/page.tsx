"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip, RadarChart, PolarGrid, PolarAngleAxis, Radar, PieChart, Pie, Cell, CartesianGrid, LineChart, Line } from "recharts";
import { Eye, Activity, Zap, Target, Search, Clock, ShieldCheck, ChevronRight, User, Loader2, RefreshCw } from "lucide-react";
import DashboardHero from "@/components/DashboardHero";
import SummaryCards from "@/components/SummaryCards";
import SegmentTree from "@/components/SegmentTree";
import HelpInfoBox from "@/components/HelpInfoBox";
import axiosInstance from "@/lib/axios";
import { cn } from "@/lib/utils";
import { useOrganization } from "@/context/OrganizationContext";

export default function AdminDashboard() {
  const { activeOrganization, activePoll } = useOrganization();
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [polls, setPolls] = useState<any[]>([]);
  const [selectedPollId, setSelectedPollId] = useState<string>("");
  const [fetchingVersion, setFetchingVersion] = useState(false);

  // Chart States
  const [meterData, setMeterData] = useState({ score: 0, raw: 0 });
  const [radarData, setRadarData] = useState([]);
  const [comparisonData, setComparisonData] = useState([]);
  const [factorSegmentData, setFactorSegmentData] = useState([]);
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [participants, setParticipants] = useState<any[]>([]);
  const [selectedParticipant, setSelectedParticipant] = useState<any>(null);
  const [pcrData, setPcrData] = useState<any>(null);
  const [loadingPcr, setLoadingPcr] = useState(false);

  useEffect(() => {
    const fetchInitialData = async () => {
      if (!activeOrganization) return;
      setLoading(true);
      try {
        const orgId = activeOrganization.id;
        const [pollsRes, statsRes] = await Promise.all([
          axiosInstance.get(`/polls?organization_id=${orgId}`),
          axiosInstance.get(`/analytics/stats?module=dashboard&organization_id=${orgId}`)
        ]);

        const availablePolls = pollsRes.data.filter((p: any) => p.status !== 'draft');
        setPolls(availablePolls);
        setStats(statsRes.data);

        if (activePoll) {
          setSelectedPollId(activePoll.id.toString());
        } else if (availablePolls.length > 0) {
          setSelectedPollId(availablePolls[0].id.toString());
        } else {
          setSelectedPollId("");
          setMeterData({ score: 0, raw: 0 });
          setRadarData([]);
          setComparisonData([]);
          setFactorSegmentData([]);
        }
      } catch (e) {
        console.error("Dashboard initial fetch failed", e);
      } finally {
        setLoading(false);
      }
    };
    fetchInitialData();
  }, [activeOrganization, activePoll]);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!activeOrganization || !selectedPollId) return;
      
      setFetchingVersion(true);
      try {
        const orgId = activeOrganization.id;
        const pollId = selectedPollId;

        const [meterRes, radarRes, compRes, factorRes] = await Promise.all([
          axiosInstance.get(`/analytics/meter?organization_id=${orgId}&poll_id=${pollId}`),
          axiosInstance.get(`/analytics/radar?organization_id=${orgId}&poll_id=${pollId}`),
          axiosInstance.get(`/analytics/segment-comparisons?organization_id=${orgId}&poll_id=${pollId}`),
          axiosInstance.get(`/analytics/factor-by-segment?organization_id=${orgId}&poll_id=${pollId}`)
        ]);

        setMeterData(meterRes.data);
        setRadarData(radarRes.data);
        setComparisonData(compRes.data);
        setFactorSegmentData(factorRes.data);
      } catch (e) {
        console.error("Dashboard chart data fetch failed", e);
      } finally {
        setFetchingVersion(false);
      }
    };
    fetchChartData();
  }, [activeOrganization, selectedPollId]);

  // Fetch participants for PCR tab
  useEffect(() => {
    const fetchParticipants = async () => {
      if (!activeOrganization) return;
      try {
        const res = await axiosInstance.get(`/analytics/participants?organization_id=${activeOrganization.id}${selectedPollId ? `&poll_id=${selectedPollId}` : ''}`);
        setParticipants(res.data);
      } catch (e) { console.error('Failed to fetch participants', e); }
    };
    fetchParticipants();
  }, [activeOrganization, selectedPollId]);

  const handleParticipantClick = async (participant: any) => {
    setSelectedParticipant(participant);
    setLoadingPcr(true);
    try {
      const res = await axiosInstance.get(`/analytics/personal-reading?user_id=${participant.id}&organization_id=${activeOrganization?.id}${selectedPollId ? `&poll_id=${selectedPollId}` : ''}`);
      setPcrData(res.data);
    } catch (e) { console.error('Failed to fetch PCR', e); }
    finally { setLoadingPcr(false); }
  };

  const treeNodes = [
    { id: 'dept', label: 'Department', children: [
      { id: 'pc', label: 'People / Culture' },
      { id: 'fin', label: 'Finance / Treasury' },
      { id: 'mark', label: 'Marketing / Promotion' },
      { id: 'cs', label: 'Customer Service' },
      { id: 'sales', label: 'Sales' },
      { id: 'it', label: 'Information Technology' }
    ]},
    { id: 'gender', label: 'Gender', children: [
        { id: 'f', label: 'Female' },
        { id: 'm', label: 'Male' }
    ]},
    { id: 'gen', label: 'Generation', children: [
      { id: 'bb', label: 'Baby Boomer' },
      { id: 'gx', label: 'Gen X' },
      { id: 'gy', label: 'Millennial' },
      { id: 'gz', label: 'Gen Z' }
    ]}
  ];

  const dashboardSummaryCards = stats.map((s: any) => ({
    title: s.name,
    value: s.value,
    icon: s.name.includes('Responses') ? Eye : s.name.includes('Completion') ? Activity : Zap,
    trend: s.trend,
    description: s.description,
    variant: s.variant as any
  }));

  const DataTable = ({ data, columns }: { data: any[], columns: { label: string, key: string, suffix?: string }[] }) => (
    <div className="w-full overflow-hidden rounded-lg border border-border shadow-sm mt-2">
        <table className="w-full text-left text-[11px]">
            <thead className="bg-muted/50 text-muted-foreground uppercase font-bold">
                <tr>
                    {columns.map((col, i) => (
                        <th key={i} className="px-3 py-2.5 border-b border-border">{col.label}</th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card/30">
                {data?.map((row, i) => (
                    <tr key={i} className="hover:bg-primary/5 transition-colors">
                        {columns.map((col, j) => (
                            <td key={j} className="px-3 py-2.5 font-medium border-r border-border/10 last:border-r-0">
                                {row[col.key] ?? '--'}{col.suffix || ''}
                            </td>
                        ))}
                    </tr>
                ))}
                {(!data || data.length === 0) && (
                    <tr>
                        <td colSpan={columns.length} className="px-3 py-8 text-center text-muted-foreground/40 italic">No analysis data captured for this period.</td>
                    </tr>
                )}
            </tbody>
        </table>
    </div>
  );

  if (loading) {
    return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-6 animate-pulse">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading Dashboard...</p>
        </div>
    );
  }

  return (
    <div className="animation-fade-in space-y-10 pb-20 text-foreground">
      <DashboardHero 
        title="Dashboard" 
        description="Welcome to Dashboard Central, a place to analyze data to improve your Organization's CULTURE." 
      />
      
      <Card className="bg-muted/40 border-none">
        <CardContent className="p-6">
          <p className="text-md font-medium leading-relaxed">
            The Dashboard has been populated with a couple sample polls to give a sense of what it will look like once populated with your organization's data. Once an actual poll or valuation is conducted the Dashboard will evolve and be your customized main point of reference.
          </p>
          <p className="text-md font-medium leading-relaxed mt-2">
            There are three tabs to choose from: Overall Culture Monitor™; Personal Culture Reading™; and CM™ Poll Comparison. The first one is the default tab.
          </p>
        </CardContent>
      </Card>

      <SummaryCards cards={dashboardSummaryCards} />

      <Tabs defaultValue="overall" className="w-full pt-4">
        <TabsList className="w-full justify-start border-b rounded-none h-12 bg-transparent p-0 mb-10 gap-10">
          <TabsTrigger className="data-active:text-primary data-active:border-primary border-b-2 border-transparent rounded-none px-0 text-[13px] font-medium h-full transition-all" value="overall">Overall Culture Monitor™</TabsTrigger>
          <TabsTrigger className="data-active:text-primary data-active:border-primary border-b-2 border-transparent rounded-none px-0 text-[13px] font-medium h-full transition-all" value="personal">Personal Culture Reading™</TabsTrigger>
          <TabsTrigger className="data-active:text-primary data-active:border-primary border-b-2 border-transparent rounded-none px-0 text-[13px] font-medium h-full transition-all" value="comparison">CM™ Poll Comparison</TabsTrigger>
        </TabsList>
        
        {/* Tab 1: Overall Culture Monitor™ */}
        <TabsContent value="overall" className="animation-fade-in space-y-12 focus-visible:outline-none">


          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <aside className="lg:col-span-1 space-y-8">
               <div className="flex items-center gap-3 ml-2">
                  <div className="w-1.5 h-6 bg-primary rounded-full"></div>
                  <h3 className="text-xs text-muted-foreground">Filters</h3>
               </div>
               <Card className="bg-card shadow-sm">
                  <CardContent className="p-6">
                    <p className="text-[13px] font-medium text-muted-foreground mb-6">Organization Segments</p>
                    <SegmentTree nodes={treeNodes} onSelectionChange={(ids: string[]) => setSelectedSegments(ids)} />
                    <div className="mt-8 pt-6 border-t border-border">
                      <Button className="w-full h-11 font-medium text-[13px]" onClick={async () => {
                          if (!activeOrganization || !selectedPollId) return;
                          const orgId = activeOrganization.id;
                          const segs = selectedSegments.join(',');
                          try {
                            const [compRes, factorRes] = await Promise.all([
                              axiosInstance.get(`/analytics/segment-comparisons?organization_id=${orgId}&poll_id=${selectedPollId}&segment_type=department&segments=${segs}`),
                              axiosInstance.get(`/analytics/factor-by-segment?organization_id=${orgId}&poll_id=${selectedPollId}&segment_type=department&segments=${segs}`)
                            ]);
                            setComparisonData(compRes.data);
                            setFactorSegmentData(factorRes.data);
                          } catch (e) { console.error('Segment filter failed', e); }
                        }}>
                        Apply Selection
                      </Button>
                    </div>
                  </CardContent>
               </Card>
            </aside>

            <div className="lg:col-span-3 space-y-8">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Real-Time Meter */}
                  <Card className="shadow-sm overflow-hidden bg-card border rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pt-6 pb-2">
                       <CardTitle className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">Real-Time Meter</CardTitle>
                       <HelpInfoBox 
                          title="Real-Time Analysis Breakdown" 
                          content={
                            <DataTable 
                                data={[{ name: 'CM Score (Avg)', value: meterData.raw }, { name: 'Organizational Health (%)', value: meterData.score + '%' }]} 
                                columns={[{ label: 'Metric Indicator', key: 'name' }, { label: 'Recorded Value', key: 'value' }]} 
                            />
                          } 
                       />
                    </CardHeader>
                    <CardContent className="flex justify-center items-center py-10 min-h-[320px] relative">
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="99%" height={260}>
                           <PieChart>
                               <Pie 
                                  data={[{ name: "Score", value: meterData.score }, { name: "Remaining", value: Math.max(0, 100 - meterData.score) }]} 
                                  cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={85} outerRadius={120} dataKey="value" stroke="none"
                               >
                                  <Cell fill="hsl(var(--primary))" />
                                  <Cell fill="hsl(var(--muted)/0.3)" />
                               </Pie>
                           </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="absolute top-[65%] left-1/2 -translate-x-1/2 text-6xl text-foreground tracking-tighter">
                        {meterData.raw || 0}<span className="text-xl text-primary ml-1 italic font-medium">CM</span>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Real-Time Factor Analysis */}
                  <Card className="shadow-sm overflow-hidden bg-card border rounded-xl">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pt-6 pb-2">
                       <CardTitle className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">Factor Analysis</CardTitle>
                       <HelpInfoBox 
                          title="Factor Score Breakdown" 
                          content={
                            <DataTable 
                                data={radarData} 
                                columns={[{ label: 'Cultural Dimension', key: 'subject' }, { label: 'Live Average', key: 'A' }]} 
                            />
                          } 
                       />
                    </CardHeader>
                    <CardContent className="flex justify-center items-center min-h-[320px] py-10">
                       <div className="h-64 w-full">
                          <ResponsiveContainer width="99%" height={260}>
                             <RadarChart cx="50%" cy="50%" outerRadius={90} data={radarData}>
                                <PolarGrid stroke="hsl(var(--border))" />
                                <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 13, fontWeight: 500 }} />
                                <Radar name="Culture" dataKey="A" stroke="hsl(var(--primary))" strokeWidth={3} fill="hsl(var(--primary))" fillOpacity={0.2} />
                                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', background: 'hsl(var(--card))', boxShadow: 'var(--shadow)', fontWeight: 'bold', fontSize: '11px' }} />
                             </RadarChart>
                          </ResponsiveContainer>
                       </div>
                    </CardContent>
                  </Card>
               </div>

               {/* Segment Comparisons */}
               <Card className="shadow-sm overflow-hidden bg-card border rounded-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pt-6 pb-2">
                      <CardTitle className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">Segment Comparisons</CardTitle>
                      <HelpInfoBox 
                          title="Segment Performance Breakdown" 
                          content={
                            <DataTable 
                                data={comparisonData} 
                                columns={[{ label: 'Organizational Segment', key: 'name' }, { label: 'Health Score', key: 'score' }]} 
                            />
                          } 
                      />
                  </CardHeader>
                  <CardContent className="p-8 min-h-[360px]">
                     <div className="w-full h-[360px]">
                        <ResponsiveContainer width="99%" height={360}>
                        <BarChart data={comparisonData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                           <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 13, fontWeight: 500 }} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 13, fontWeight: 500 }} domain={[0, 10]} />
                           <Tooltip cursor={{ fill: 'hsl(var(--muted)/0.5)' }} contentStyle={{ borderRadius: '12px', border: 'none', background: 'hsl(var(--card))', boxShadow: 'var(--shadow)', fontWeight: 'bold', fontSize: '11px' }} />
                           <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                        </ResponsiveContainer>
                     </div>
                  </CardContent>
               </Card>

               {/* Factor Analysis by Segment(s) */}
               <Card className="shadow-sm overflow-hidden bg-card border rounded-xl">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pt-6 pb-2">
                      <CardTitle className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">Historical Factor Index</CardTitle>
                      <HelpInfoBox 
                          title="Longitudinal Factor Table" 
                          content={
                            <DataTable 
                                data={factorSegmentData} 
                                columns={[{ label: 'Factor Area', key: 'label' }, { label: 'Current Score', key: 's1' }, { label: 'Historical Bench', key: 's2' }]} 
                            />
                          } 
                      />
                  </CardHeader>
                  <CardContent className="p-8 min-h-[360px]">
                     <div className="w-full h-[360px]">
                        <ResponsiveContainer width="99%" height={360}>
                        <LineChart data={factorSegmentData}>
                           <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" />
                           <XAxis dataKey="label" axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 13, fontWeight: 500 }} />
                           <YAxis axisLine={false} tickLine={false} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 13, fontWeight: 500 }} domain={[0, 10]} />
                           <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', background: 'hsl(var(--card))', boxShadow: 'var(--shadow)', fontWeight: 'bold', fontSize: '11px' }} />
                           <Line type="monotone" dataKey="s1" stroke="hsl(var(--primary))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--primary))', strokeWidth: 0 }} />
                           <Line type="monotone" dataKey="s2" stroke="hsl(var(--muted-foreground))" strokeWidth={3} dot={{ r: 4, fill: 'hsl(var(--muted-foreground))', strokeWidth: 0 }} strokeDasharray="5 5" opacity={0.6} />
                        </LineChart>
                        </ResponsiveContainer>
                     </div>
                  </CardContent>
               </Card>
            </div>
          </div>
        </TabsContent>

        {/* Tab 2: Personal Culture Reading™ */}
        <TabsContent value="personal" className="animate-fade-in space-y-12 focus-visible:outline-none">
            <Card className="bg-primary/10 border-none shadow-none rounded-xl">
               <CardContent className="p-10 space-y-6">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="text-primary" size={24} />
                    <h3 className="text-sm text-foreground leading-none">Reminder</h3>
                  </div>
                  <p className="text-xs leading-relaxed text-muted-foreground font-medium italic">
                    REMEMBER: The Culture Monitor reveals the state of culture evolution through the eyes of its employees, there is nothing potentially punitive in these revelations. There are three charts within the Personal Culture Reading™ (PCR™) for individual diagnosis when not anonymous: the actual PCR Comparative Meter; PCR by Factor Radar Chart; and PCR Comparison by Factor Segment Bar Charts.
                  </p>
                  <div className="pt-2">
                    <p className="text-[13px] font-medium text-primary bg-background/50 inline-block px-4 py-2 rounded-lg border border-primary/20">
                      The chart immediately below embodies the list of participants with their recorded demographics. To initiate a comparative just click on the name.
                    </p>
                  </div>
               </CardContent>
            </Card>

            <Card className="shadow-sm overflow-hidden border rounded-xl">
               <CardHeader className="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <CardTitle className="text-lg font-medium tracking-tight leading-none">Participants</CardTitle>
                    <p className="text-[13px] font-medium text-muted-foreground mt-2 italic">Select a record to view their Personal Culture Reading™ .</p>
                  </div>
                  <div className="relative w-full md:w-80">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/40" size={14} />
                    <input className="h-11 pl-11 pr-6 bg-muted/50 border rounded-lg text-xs w-full focus:ring-4 focus:ring-primary/5 outline-none transition-all placeholder:text-muted-foreground/20" placeholder="Search participants..." />
                  </div>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead className="bg-muted text-[13px] font-medium text-muted-foreground">
                        <tr>
                          <th className="px-6 py-4">Last Name</th>
                          <th className="px-6 py-4">First Name</th>
                          <th className="px-6 py-4">Department</th>
                          <th className="px-6 py-4">Location</th>
                          <th className="px-6 py-4">Job Level</th>
                          <th className="px-6 py-4">Gender</th>
                          <th className="px-6 py-4">Generation</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {participants.map((p: any) => (
                          <tr key={p.id} className={cn("hover:bg-primary/5 cursor-pointer transition-all", selectedParticipant?.id === p.id && "bg-primary/10")} onClick={() => handleParticipantClick(p)}>
                            <td className="px-6 py-4 text-xs text-primary">{p.last_name || '--'}</td>
                            <td className="px-6 py-4 text-xs font-medium">{p.first_name}</td>
                            <td className="px-6 py-4 text-[13px] font-medium text-muted-foreground">{p.department}</td>
                            <td className="px-6 py-4 text-[13px] font-medium text-muted-foreground">{p.location}</td>
                            <td className="px-6 py-4 text-[13px] font-medium text-muted-foreground">{p.job_level}</td>
                            <td className="px-6 py-4 text-[13px] font-medium text-muted-foreground">{p.gender}</td>
                            <td className="px-6 py-4 text-[13px] font-medium text-muted-foreground">{p.generation}</td>
                          </tr>
                        ))}
                        {participants.length === 0 && (
                          <tr><td colSpan={7} className="px-6 py-8 text-center text-xs text-muted-foreground">No participants found for this poll.</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
               </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <Card className="shadow-sm bg-card overflow-hidden">
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pt-6 pb-2 border-b bg-muted/20">
                     <CardTitle className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">PCR™ Comparative Meter</CardTitle>
                     <HelpInfoBox 
                        title="Personal Performance Audit" 
                        content={
                          <DataTable 
                              data={pcrData ? [{ name: 'Your Personal Reading', value: pcrData.meter }, { name: 'Organization Baseline', value: pcrData.cm_meter }] : []} 
                              columns={[{ label: 'Performance Metric', key: 'name' }, { label: 'Score Value', key: 'value' }]} 
                          />
                        } 
                     />
                   </CardHeader>
                   <CardContent className="p-8 text-center min-h-[320px] flex items-center justify-center">
                     <div className="h-60 w-full flex items-center justify-center relative">
                        <Target size={100} className="text-secondary/20" />
                        <div className="absolute inset-0 flex items-center justify-center flex-col">
                          <span className="text-5xl font-bold text-foreground tracking-tighter">{pcrData?.meter ?? 0}</span>
                          <span className="text-[13px] font-medium text-primary uppercase mt-1 opacity-60">Your Reading</span>
                          {pcrData && <div className="text-xs text-muted-foreground mt-2 font-medium bg-muted/50 px-4 py-1.5 rounded-full border border-border shadow-sm">Baseline: {pcrData.cm_meter}</div>}
                        </div>
                     </div>
                   </CardContent>
                </Card>

                <Card className="shadow-sm bg-card overflow-hidden">
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pt-6 pb-2 border-b bg-muted/20">
                     <CardTitle className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">PCR™ Factor Analysis</CardTitle>
                     <HelpInfoBox 
                        title="Personal Factor Score List" 
                        content={
                          <DataTable 
                              data={pcrData?.radar || []} 
                              columns={[{ label: 'Core Factor', key: 'subject' }, { label: 'Your Score', key: 'A' }]} 
                          />
                        } 
                     />
                   </CardHeader>
                   <CardContent className="p-8 text-center min-h-[320px] flex items-center justify-center">
                      {pcrData?.radar?.length > 0 ? (
                        <ResponsiveContainer width="99%" height={240}>
                          <RadarChart cx="50%" cy="50%" outerRadius={80} data={pcrData.radar}>
                            <PolarGrid stroke="hsl(var(--border))" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 11, fontWeight: 500 }} />
                            <Radar name="PCR" dataKey="A" stroke="hsl(var(--primary))" strokeWidth={3} fill="hsl(var(--primary))" fillOpacity={0.2} />
                            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', background: 'hsl(var(--card))', boxShadow: 'var(--shadow)', fontWeight: 'bold', fontSize: '11px' }} />
                          </RadarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="flex flex-col items-center gap-4 animate-pulse">
                          <div className="w-32 h-32 rounded-full border-4 border-dashed border-muted animate-spin-slow"></div>
                          <p className="text-xs text-muted-foreground">Select a participant to map analysis...</p>
                        </div>
                      )}
                   </CardContent>
                </Card>

                <Card className="shadow-sm bg-card overflow-hidden">
                   <CardHeader className="flex flex-row items-center justify-between space-y-0 px-6 pt-6 pb-2 border-b bg-muted/20">
                     <CardTitle className="text-[13px] font-bold text-muted-foreground uppercase tracking-wider">Demographic Alignment</CardTitle>
                     <HelpInfoBox 
                        title="Segment-Specific PCR Values" 
                        content={
                          <DataTable 
                              data={pcrData?.segments || []} 
                              columns={[{ label: 'Peer Group Segment', key: 'name' }, { label: 'Comparison Score', key: 'score' }]} 
                          />
                        } 
                     />
                   </CardHeader>
                   <CardContent className="p-8 min-h-[320px] flex items-center justify-center">
                      {pcrData?.segments?.length > 0 ? (
                        <ResponsiveContainer width="99%" height={240}>
                          <BarChart data={pcrData.segments} layout="vertical" margin={{ left: 20 }}>
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" />
                            <XAxis type="number" domain={[0,10]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 500 }} />
                            <YAxis dataKey="name" type="category" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11, fontWeight: 500 }} width={120} />
                            <Tooltip cursor={{ fill: 'hsl(var(--primary)/0.05)' }} contentStyle={{ borderRadius: '12px', border: 'none', background: 'hsl(var(--card))', boxShadow: 'var(--shadow)', fontWeight: 'bold', fontSize: '11px' }} />
                            <Bar dataKey="score" radius={[0,6,6,0]} barSize={24}>
                               {pcrData.segments.map((entry: any, index: number) => (
                                 <Cell key={`cell-${index}`} fill={entry.isUser ? "hsl(var(--primary))" : "hsl(var(--muted-foreground)/0.3)"} />
                               ))}
                            </Bar>
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="space-y-4 w-full max-w-[200px] animate-pulse">
                          <div className="h-3 bg-muted rounded-full overflow-hidden"><div className="w-1/3 h-full bg-primary"></div></div>
                          <div className="h-3 bg-muted rounded-full"></div>
                          <div className="h-3 bg-muted rounded-full"></div>
                        </div>
                      )}
                   </CardContent>
                </Card>
            </div>
        </TabsContent>

        {/* Tab 3: CM™ Poll Comparison */}
        <TabsContent value="comparison" className="animation-fade-in space-y-12 focus-visible:outline-none">
            <Card className="bg-muted/30 border-none shadow-none">
              <CardContent className="p-8 space-y-4">
                <p className="text-[13px] leading-relaxed text-muted-foreground font-medium italic">
                  The <span className="font-medium underline">CM™ Poll Comparison</span>, has four charts: CM™ Poll Meter Comparison; CM™ Poll Factor Analysis Comparison with Polar Charts; CM™ Poll Segment Comparison with Bar Charts; and CM™ Poll Factor Analysis Comparison by Segment(s) with horizontal Mirror Bar Chart.
                </p>
                <p className="text-[12px] text-primary">
                  To initiate a comparison, utilize the two horizontal boxes immediately below. This allows you to capture a "static" comparison of any two polls that has been conducted.
                </p>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
               <Card className="shadow-sm border bg-card p-8 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center">1</div>
                    <h5 className="text-xs text-muted-foreground">POLL 1:</h5>
                  </div>
                  <div className="grid grid-cols-1 gap-6">
                    <div className="space-y-2">
                       <p className="text-[13px] font-medium text-muted-foreground ml-1">Select a Poll:</p>
                       <select className="w-full h-11 px-4 rounded-xl bg-muted border-none text-xs font-medium outline-none cursor-pointer">
                          <option>Current CM</option>
                       </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <p className="text-[13px] font-medium text-muted-foreground ml-1">Year:</p>
                          <select className="w-full h-11 px-4 rounded-xl bg-muted border-none text-xs font-medium outline-none cursor-pointer">
                             <option>2026</option>
                          </select>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[13px] font-medium text-muted-foreground ml-1">Quarter:</p>
                          <select className="w-full h-11 px-4 rounded-xl bg-muted border-none text-xs font-medium outline-none cursor-pointer">
                             <option>Q1</option>
                          </select>
                       </div>
                    </div>
                  </div>
                  <div className="pt-6 p-6 bg-muted/20 rounded-xl border border-dashed border-muted-foreground/20">
                      <div className="flex justify-between items-center text-[13px] font-medium text-muted-foreground/50">
                        <span>Poll</span>
                        <span>Version</span>
                      </div>
                      <div className="flex justify-between items-end mt-6">
                         <div className="text-3xl text-muted-foreground/20 italic tracking-tighter leading-none font-bold">--</div>
                         <div className="text-[13px] font-medium bg-background border px-4 py-1.5 rounded-lg shadow-sm text-muted-foreground/30">--</div>
                      </div>
                  </div>
               </Card>

               <Card className="shadow-sm border bg-card p-8 space-y-8">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-secondary text-primary rounded-xl flex items-center justify-center">2</div>
                    <h5 className="text-xs text-muted-foreground">POLL 2:</h5>
                  </div>
                  <div className="grid grid-cols-1 gap-6 opacity-60 pointer-events-none">
                    <div className="space-y-2">
                       <p className="text-[13px] font-medium text-muted-foreground ml-1">Select a Poll:</p>
                       <select className="w-full h-11 px-4 rounded-xl bg-muted border-none text-xs font-medium outline-none cursor-pointer">
                          <option>Select Poll...</option>
                       </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div className="space-y-2">
                          <p className="text-[13px] font-medium text-muted-foreground ml-1">Year:</p>
                          <select className="w-full h-11 px-4 rounded-xl bg-muted border-none text-xs font-medium outline-none cursor-pointer"></select>
                       </div>
                       <div className="space-y-2">
                          <p className="text-[13px] font-medium text-muted-foreground ml-1">Quarter:</p>
                          <select className="w-full h-11 px-4 rounded-xl bg-muted border-none text-xs font-medium outline-none cursor-pointer"></select>
                       </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full h-12 rounded-xl text-[13px] font-medium border-dashed">
                    RUN COMPARISON
                  </Button>
               </Card>
            </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
