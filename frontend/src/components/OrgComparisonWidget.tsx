"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import axiosInstance from "@/lib/axios";
import { Loader2, Globe, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

const COLORS = ["#0d9488", "#f59e0b", "#3b82f6", "#ec4899", "#8b5cf6"];

export function OrgComparisonWidget({ className }: { className?: string }) {
  const [data, setData] = useState<{ organizations: string[]; trends: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchComparisonData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/analytics/compare-organizations");
        setData(response.data);
      } catch (error) {
        console.error("Failed to load organization comparisons", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchComparisonData();
  }, []);

  if (isLoading) {
    return (
      <Card className={cn("col-span-full h-[450px] flex items-center justify-center bg-card shadow-sm border border-border/50", className)}>
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-[13px] font-medium tracking-tight">Loading Global Comparisons...</p>
        </div>
      </Card>
    );
  }

  if (!data || !data.trends.length) {
    return (
      <Card className={cn("col-span-full h-[450px] flex items-center justify-center bg-card shadow-sm border border-border/50", className)}>
        <p className="text-sm text-muted-foreground">Insufficient benchmark data available.</p>
      </Card>
    );
  }

  return (
    <Card className={cn("col-span-full bg-card shadow-sm border border-border/50 rounded-2xl overflow-hidden hover:border-border transition-colors group", className)}>
      <CardHeader className="border-b border-border/50 bg-muted/10 px-8 py-6 flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg font-medium text-foreground tracking-tight flex items-center gap-3">
            <div className="p-2 bg-background border border-border/50 rounded-xl shadow-sm group-hover:text-amber-500 transition-colors">
              <Globe size={18} />
            </div>
            Global Organization Comparisons
          </CardTitle>
          <CardDescription className="text-[13px] text-muted-foreground ml-12">
            Longitudinal variance mapping across active network entities.
          </CardDescription>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-semibold tracking-wide">
          <TrendingUp size={14} /> LIVE BENCHMARK
        </div>
      </CardHeader>
      <CardContent className="p-8 pb-10">
        <div className="h-[380px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.trends} margin={{ top: 20, right: 30, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="currentColor" className="text-muted-foreground/15" />
              <XAxis 
                dataKey="period" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 12, fill: "currentColor" }} 
                className="text-muted-foreground font-medium" 
                dy={10} 
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                domain={[0, 10]} 
                tick={{ fontSize: 12, fill: "currentColor" }} 
                className="text-muted-foreground font-medium" 
                dx={-10} 
              />
              <Tooltip
                contentStyle={{ borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)", background: "rgba(0,0,0,0.8)", color: "#fff", boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4)" }}
                itemStyle={{ fontSize: "13px", fontWeight: "600" }}
                labelStyle={{ fontSize: "12px", color: "#a1a1aa", marginBottom: "4px" }}
              />
              <Legend 
                verticalAlign="top" 
                height={36} 
                iconType="circle"
                wrapperStyle={{ fontSize: "13px", fontWeight: "500", paddingTop: "0px", paddingBottom: "20px" }}
              />
              {data.organizations.map((org, idx) => (
                <Line 
                  key={org}
                  type="monotone" 
                  dataKey={org} 
                  name={org} 
                  stroke={COLORS[idx % COLORS.length]} 
                  strokeWidth={3} 
                  dot={{ r: 4, strokeWidth: 2, fill: "var(--background)" }} 
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
