"use client";
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { HelpCircle, BookOpen, MessageSquare, Shield, Info, ArrowRight, ExternalLink, Globe, Sparkles, Filter } from "lucide-react";
import DashboardHero from "@/components/DashboardHero";
import Link from "next/link";

export default function HelpCenterPage() {
  const faqs = [
    {
      question: "Is my cultural diagnostic truly anonymous?",
      answer: "Yes. All behavioral signatures are aggregated at the segment level. Individual identifiers are stripped during the high-entropy ingestion process."
    },
    {
      question: "Can I update my previous submissions?",
      answer: "This is determined by the organization's administrator. If allowed, you will see an 'Update Calibration' button on active polls."
    },
    {
      question: "How often should I participate in culture scans?",
      answer: "Active scans typically occur once per quarter. You will receive a notification whenever a new diagnostic instrument is deployed to your cluster."
    },
    {
      question: "What happens to the data after collection?",
      answer: "Data is processed through our analytics engine to identify cultural trends, factor resonance, and organizational alignment metrics."
    }
  ];

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      <DashboardHero 
        title="Help center" 
        description="Navigation coordinates and technical documentation to assist your journey through the Culture Monitor ecosystem."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8 space-y-12">
            <div className="space-y-6">
                <h3 className="text-[13px] font-medium text-muted-foreground ml-3 flex items-center gap-2">
                    <Info size={14} className="text-primary"/> Structural FAQ
                </h3>
                <div className="grid grid-cols-1 gap-4 text-current">
                    {faqs.map((faq, idx) => (
                        <Card key={idx} className="border border-border shadow-sm rounded-3xl overflow-hidden group hover:border-primary/50 transition-all">
                            <div className="p-8 space-y-3">
                                <h4 className="text-base tracking-tight leading-tight group-hover:text-primary transition-colors flex items-center gap-3">
                                   <div className="w-1.5 h-1.5 rounded-full bg-primary" /> {faq.question}
                                </h4>
                                <p className="text-[13px] font-medium text-muted-foreground leading-relaxed italic border-l-2 border-muted pl-5 ml-0.5">
                                    {faq.answer}
                                </p>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>

            <div className="p-10 bg-primary/5 border border-primary/10 rounded-[48px] relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-bl-full transition-transform group-hover:rotate-12 group-hover:scale-110"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                    <div className="w-24 h-24 bg-primary text-primary-foreground rounded-[32px] flex flex-shrink-0 items-center justify-center shadow-2xl shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform duration-500">
                        <BookOpen size={48} />
                    </div>
                    <div className="space-y-4 text-center md:text-left">
                        <h3 className="text-3xl tracking-tight leading-none text-current font-bold">Comprehensive user guide</h3>
                        <p className="text-[14px] font-medium text-muted-foreground italic leading-relaxed max-w-sm mx-auto md:mx-0">
                            Deep dive into factor analysis, cultural mapping, and diagnostic methodologies in our full documentation module.
                        </p>
                        <Link href="/guide" className="block pt-2">
                            <button className="h-11 px-8 rounded-2xl bg-primary text-primary-foreground font-medium text-[13px shadow-xl shadow-primary/10 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 mx-auto md:mx-0 leading-none">
                                Access guide <ExternalLink size={14} />
                            </button>
                        </Link>
                    </div>
                </div>
            </div>
        </div>

        <div className="lg:col-span-4 space-y-6">
           <h3 className="text-[13px] font-medium text-muted-foreground ml-3 flex items-center gap-2">
                <MessageSquare size={14} className="text-primary"/> Support cluster
           </h3>
           <Card className="p-10 border border-border bg-card shadow-sm rounded-[40px] space-y-10 group">
              <div className="space-y-6">
                <div className="flex items-center gap-4 p-5 bg-muted/30 rounded-3xl transition-transform group-hover:translate-x-2">
                    <div className="w-12 h-12 bg-secondary rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-primary/5">
                        <HelpCircle size={24} />
                    </div>
                    <div className="leading-tight">
                        <h5 className="text-xs tracking-tight mb-1">General inquiries</h5>
                        <p className="text-[13px] font-medium text-muted-foreground opacity-60">Response in &lt; 2 hours</p>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 p-5 bg-muted/30 rounded-3xl transition-transform group-hover:translate-x-2">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center text-emerald-600 shadow-lg shadow-emerald-500/5">
                        <Shield size={24} />
                    </div>
                    <div className="leading-tight">
                        <h5 className="text-xs tracking-tight mb-1">Privacy matters</h5>
                        <p className="text-[13px] font-medium text-muted-foreground opacity-60">High-priority cluster</p>
                    </div>
                </div>

                <div className="flex items-center gap-4 p-5 bg-muted/30 rounded-3xl transition-transform group-hover:translate-x-2">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary shadow-lg shadow-primary/5">
                        <Globe size={24} />
                    </div>
                    <div className="leading-tight">
                        <h5 className="text-xs tracking-tight mb-1">Satellite support</h5>
                        <p className="text-[13px] font-medium text-muted-foreground opacity-60">Global coordination</p>
                    </div>
                </div>
              </div>

              <div className="pt-2 text-current">
                 <button className="w-full h-12 border-2 border-border border-dashed rounded-2xl text-[13px] font-medium text-muted-foreground hover:border-primary hover:text-primary transition-all flex items-center justify-center gap-3 active:scale-95 leading-none">
                     Submit liaison request <ArrowRight size={16} />
                 </button>
              </div>
           </Card>

           <div className="p-8 bg-secondary/20 border border-secondary rounded-[32px] space-y-4">
               <div className="flex items-center gap-3 text-primary">
                    <Sparkles size={20} />
                    <h4 className="text-xs tracking-tight">System version</h4>
               </div>
               <div className="flex justify-between items-center bg-card p-4 rounded-xl shadow-sm border border-border">
                   <div className="flex items-center gap-3">
                       <Filter size={14} className="text-primary"/>
                       <span className="text-[13px] font-medium">CultureMonitor v4.1</span>
                   </div>
                   <div className="w-2 h-2 bg-emerald-500 rounded-full shadow-[0_0_8px_rgba(16,185,129,0.5)]"></div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
}
