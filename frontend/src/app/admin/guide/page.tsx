"use client";
import React from "react";
import { BookOpen, Info, Target, BarChart2, Activity, ShieldCheck, Mail, Users, FileText, ChevronRight } from "lucide-react";
import DashboardHero from "@/components/DashboardHero";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function UserGuidePage() {
  const guideSections = [
    {
      title: "REAL-TIME METER",
      content: "The real-time Meter for the Culture Monitor™ (CM™) will display at any point in time the current cumulative reading. The reading is based on those employees that have completed their respective assessments.",
      icon: Activity
    },
    {
      title: "REAL-TIME FACTOR ANALYSIS",
      content: "The Factor Analysis of the CM™ utilizes a polar unfiltered chart. This will capture the real time view of the differences between each factor. The dotted line surrounding the chart represents the current Culture Monitor™ reading.",
      icon: Target
    },
    {
      title: "SEGMENT COMPARISONS",
      content: "The Segment Comparisons utilizes a combo bar chart and tracks comparative differences between selected segments. The selected choices might be various departments, various job levels or something as specific between full time employees and part time employees. The third dimension in this chart is the visible dotted straight line representing the current Culture Monitor™ reading.",
      icon: Users
    },
    {
      title: "FACTOR ANALYSIS BY SEGMENT(S)",
      content: "The Factor Analysis by Segment(s) is a line chart that provides more inclusion of robust choices that are visually comparative. Each point in the line curve is an actual factor, the bottom (horizontal) axis. The vertical axis represents the numeric rating while each line plotted represents the segment being compared. Again the dotted line represents the current Culture Monitor™ reading.",
      icon: BarChart2
    },
    {
      title: "CM™ POLL METER COMPARISON",
      content: "The Poll Comparison for the Overall Culture Monitor™ reading are side by side and reflective of the choices that have been entered.",
      icon: Activity
    },
    {
      title: "CM™ POLL FACTOR ANALYSIS",
      content: "The Factor Analysis for the chosen polls to be compared utilizes a polar unfiltered chart. These capture the resultant view of the differences between each factor per poll. The dotted line surrounding the chart represents the overall Culture Monitor™ reading of that poll.",
      icon: Target
    },
    {
      title: "CM™ POLL SEGMENT COMPARISONS",
      content: "The Poll Segment Comparisons utilizes a side by side bar chart. It tracks comparative differences between selected segments and utilizes the designated colours for the dotted straight lines of the respective Culture Monitor™ reading.",
      icon: Users
    },
    {
      title: "CM™ POLL FACTOR ANALYSIS COMPARISON BY SEGMENT(S)",
      content: "The CM™ Poll Factor Analysis Comparison by Segment(s) is a horizontal Mirror Bar Chart. Each bar represents a chosen segment and the mirror is an altered reflection of the actual result of the polls that were selected.",
      icon: BarChart2
    }
  ];

  return (
    <div className="space-y-12 pb-20 max-w-6xl mx-auto">
      <DashboardHero 
        title="User Guide" 
        description="Learn how to use the Culture Monitor system." 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card className="p-8 border-l-4 border-l-primary bg-primary/5 rounded-xl shadow-none">
          <div className="space-y-4">
            <h3 className="text-[13px] font-medium text-primary">System Philosophy</h3>
            <p className="text-xs leading-relaxed text-muted-foreground font-medium italic">
              "We like to start with the end in mind. The Culture Monitor reveals the state of culture evolution through the eyes of its employees."
            </p>
          </div>
        </Card>
        
        <Card className="p-8 border bg-muted/30 rounded-xl shadow-none">
          <div className="space-y-4">
            <h3 className="text-[13px] font-medium text-foreground">Phases for Culture Shaping</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-[13px] font-medium text-primary">1</div>
                <p className="text-[13px] font-medium text-muted-foreground tracking-tight">Developing an OCM™ Organizational Model</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="mt-1 w-5 h-5 bg-primary/10 rounded-full flex items-center justify-center text-[13px] font-medium text-primary">2</div>
                <p className="text-[13px] font-medium text-muted-foreground tracking-tight">Establishing Culture Shaping Profiles</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <div className="space-y-8">
        <div className="flex items-center gap-4 px-4">
          <div className="p-3 bg-primary/10 text-primary rounded-xl shadow-sm"><BookOpen size={24} /></div>
          <div>
            <h2 className="text-2xl tracking-tight text-foreground">Diagnostic Instrumentation</h2>
            <p className="text-[13px] font-medium text-muted-foreground mt-1">Understanding the CM™ Visualization Engine</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {guideSections.map((section, idx) => (
            <Card key={idx} className="hover:border-primary/50 transition-all shadow-sm rounded-xl group overflow-hidden border">
              <CardHeader className="p-6 pb-3 flex flex-row items-center gap-4">
                <div className="p-2 bg-card rounded-lg text-primary shadow-sm transition-transform group-hover:scale-110"><section.icon size={16} /></div>
                <CardTitle className="text-lg font-medium leading-tight">{section.title}</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-xs font-medium leading-relaxed text-muted-foreground italic">
                  {section.content}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <Card className="p-10 border-none bg-primary text-primary-foreground rounded-xl shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-bl-full"></div>
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-10">
          <div className="space-y-4">
            <h3 className="text-3xl tracking-tighter leading-none font-bold">Still have questions?</h3>
            <p className="text-primary-foreground/70 font-medium text-sm max-w-xl leading-relaxed">
              In the event, further effort is required to capture an acceptable characterization of your organization's desired culture we have provided the names of some of OrgFitech's Trusted Partners.
            </p>
            <div className="flex items-center gap-4 pt-4">
               <div className="p-3 bg-white/10 rounded-xl border border-white/10 flex items-center justify-center"><Mail size={24} /></div>
               <div>
                  <p className="text-[13px] font-medium opacity-60">Support Cluster</p>
                  <p className="text-lg font-medium">Support@orgfitech.com</p>
               </div>
            </div>
          </div>
          <Button variant="secondary" className="h-12 px-8 text-[13px] font-medium rounded-lg shadow-xl transition-all hover:scale-105 active:scale-95">
            Contact Trusted Partner
          </Button>
        </div>
      </Card>
    </div>
  );
}
