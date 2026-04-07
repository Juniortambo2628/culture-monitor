"use client";

import React from "react";
import { 
  BookOpen, 
  HelpCircle, 
  ShieldCheck, 
  BarChart3, 
  Zap, 
  CheckCircle2, 
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";

export default function UserGuidePage() {
  const sections = [
    {
      id: "introduction",
      title: "Introduction to CM™",
      icon: BookOpen,
      content: "Culture Monitor™ (CM™) is a strategic intelligence platform designed to measure, analyze, and optimize organizational culture. By providing real-time insights into behavioral patterns and cultural alignment, CM™ empowers organizations to make data-driven decisions that foster growth and agility."
    },
    {
      id: "getting-started",
      title: "Getting Started",
      icon: Zap,
      content: "To begin, log in with your corporate credentials. Once logged in, you will be directed to your personalized dashboard where you can see active surveys, recently completed readings, and upcoming cultural milestones."
    },
    {
      id: "surveys",
      title: "Participating in Surveys",
      icon: CheckCircle2,
      content: "Surveys are the heartbeat of CM™. When a new survey is active, it will appear on your dashboard. These surveys are designed to be concise and impactful. Your honest feedback is critical for an accurate cultural reading."
    },
    {
      id: "anonymity",
      title: "Privacy & Anonymity",
      icon: ShieldCheck,
      content: "We take your privacy seriously. All participant responses are anonymized before being aggregated into organizational reports. No individual responses are ever shared with leadership in a way that can be traced back to you."
    },
    {
      id: "analytics",
      title: "Understanding Analytics",
      icon: BarChart3,
      content: "Admins have access to advanced analytics, including Faktor Radars and Heatmaps. These visualizations help identify areas of cultural strength and opportunities for improvement across different segments of the organization."
    },
    {
      id: "support",
      title: "Support & Help",
      icon: HelpCircle,
      content: "If you encounter any technical issues or have questions about a specific survey, please reach out to your organizational admin or use the Help Center link in your sidebar."
    }
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-foreground transition-colors antialiased">
      <SiteHeader />

      <PageHero 
        title="Mastering the Culture Monitor"
        subtitle="Welcome to the official documentation. Whether you are a participant providing feedback or an admin architecting cultural change, this guide provides everything you need to succeed."
        category="Version 2.4.0 Update"
        breadcrumbs={[
          { label: "Resources", path: "/guide" },
          { label: "User Guide" }
        ]}
      />

      <main className="pb-20 px-6">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 hidden lg:block sticky top-32 h-fit">
            <div className="space-y-1">
              <p className="px-4 text-[13px] font-medium text-muted-foreground mb-4 opacity-50">Documentation Topics</p>
              {sections.map(section => (
                <a 
                  key={section.id}
                  href={`#${section.id}`}
                  className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-card hover:shadow-sm text-muted-foreground hover:text-primary font-medium text-sm transition-all"
                >
                  <section.icon size={18} className="opacity-70" />
                  {section.title}
                </a>
              ))}
            </div>

            <div className="mt-12 p-6 bg-primary rounded-[32px] text-primary-foreground shadow-2xl relative overflow-hidden group">
               <div className="relative z-10">
                   <h4 className="text-lg mb-2">Need Live Help?</h4>
                   <p className="text-xs text-primary-foreground/70 mb-6 font-medium leading-relaxed">Our support team is available 24/7 for technical assistance.</p>
                   <button className="w-full h-11 bg-primary-foreground text-primary rounded-xl text-xs shadow-lg transition-transform hover:scale-105 active:scale-95">
                       Chat Support
                   </button>
               </div>
               <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary-foreground/10 rounded-full blur-2xl group-hover:scale-150 transition-transform"></div>
            </div>
          </aside>

          {/* Content area */}
          <div className="lg:col-span-9 space-y-20 pt-10">
            <div className="space-y-32">
              {sections.map(section => (
                <section key={section.id} id={section.id} className="scroll-mt-32">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-14 h-14 bg-card shadow-xl border border-border rounded-3xl flex items-center justify-center text-primary transition-colors">
                      <section.icon size={28} />
                    </div>
                    <h2 className="text-3xl text-foreground tracking-tight font-bold">{section.title}</h2>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    <div className="space-y-6 text-muted-foreground transition-colors">
                      <p className="text-lg leading-relaxed font-medium">
                        {section.content}
                      </p>
                      <ul className="space-y-3">
                        {["Enterprise compliance", "ISO 27001 Certified", "GDPR Compliant"].map((item, i) => (
                           <li key={i} className="flex items-center gap-3 text-[13px] font-medium underline opacity-60">
                               <CheckCircle2 size={16} className="text-emerald-500" />
                               {item}
                           </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-secondary/30 rounded-[40px] aspect-video flex items-center justify-center border-4 border-card shadow-inner overflow-hidden group transition-colors">
                        <section.icon size={64} className="text-muted-foreground/20 transition-transform group-hover:scale-110 duration-700" />
                    </div>
                  </div>
                </section>
              ))}
            </div>

            <div className="bg-[#0d3330] dark:bg-card rounded-[48px] p-12 md:p-20 text-white dark:text-foreground relative overflow-hidden shadow-2xl transition-colors duration-300">
                <div className="relative z-10 max-w-2xl text-center mx-auto">
                    <h2 className="text-4xl md:text-5xl mb-6 tracking-tight leading-tight">Ready to transform your <span className="text-[#3edec7] dark:text-primary">workplace?</span></h2>
                    <p className="text-lg text-teal-300/60 dark:text-muted-foreground mb-10 leading-relaxed font-medium">
                        Join over 5,000 organizations using Culture Monitor™ to build world-class teams.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link href="/login">
                            <Button className="w-full sm:w-auto h-14 px-10 bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium text-sm shadow-xl transition-transform hover:-translate-y-1">
                                Get started now
                            </Button>
                        </Link>
                        <Button variant="outline" className="w-full sm:w-auto h-14 px-10 border-white/20 text-white hover:bg-white hover:text-[#0d3330 rounded-full font-medium text-sm transition-all">
                            Request demo
                        </Button>
                    </div>
                </div>
                <div className="absolute top-[-100px] left-[-100px] w-96 h-96 bg-primary/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-100px] right-[-100px] w-96 h-96 bg-[#3edec7]/10 rounded-full blur-[120px]"></div>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
