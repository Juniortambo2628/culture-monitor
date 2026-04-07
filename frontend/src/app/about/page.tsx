"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Target, Users, Award, TrendingUp, Zap } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { PageHero } from "@/components/PageHero";
import { SiteFooter } from "@/components/SiteFooter";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <SiteHeader />

      <PageHero 
        title="Quantifying the Soul of Organizations"
        subtitle="Culture Monitor™ was born from a simple yet profound realization: organizational culture, though intangible, is the single most powerful driver of performance, innovation, and employee well-being."
        category="Our Mission & Vision"
        breadcrumbs={[
          { label: "About", path: "/about" }
        ]}
      />

      <main className="max-w-7xl mx-auto px-6 py-20">
        {/* Core Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-32">
          {[
            {
              icon: Target,
              title: "Strategic Precision",
              description: "We move beyond 'gut feeling' by providing high-fidelity data points that reveal the true state of your organizational health.",
              color: "text-emerald-500" ,
              bg: "bg-emerald-50 dark:bg-emerald-950/20"
            },
            {
              icon: Users,
              title: "Human Centric",
              description: "Our platform ensures every voice is heard, creating a transparent feedback loop that fosters trust and psychological safety.",
              color: "text-emerald-500",
              bg: "bg-emerald-50 dark:bg-emerald-950/20"
            },
            {
              icon: Zap,
              title: "Actionable Insights",
              description: "We don't just report numbers; we identify specific intervention areas and best practices to drive meaningful change.",
              color: "text-emerald-500" ,
              bg: "bg-emerald-50 dark:bg-emerald-950/20"
            }
          ].map((item, i) => (
            <div key={i} className="p-8 rounded-[32px] border border-border bg-card hover:shadow-2xl hover:shadow-primary/5 transition-all group">
              <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                <item.icon size={28} />
              </div>
              <h3 className="text-2xl text-foreground mb-4 tracking-tight">{item.title}</h3>
              <p className="text-muted-foreground font-medium leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <div className="relative rounded-[40px] overflow-hidden aspect-square lg:aspect-video shadow-2xl">
             <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10" />
             <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent z-10" />
             <img 
               src="https://images.unsplash.com/photo-1522071820081-001951d4576b?auto=format&fit=crop&q=80&w=1000" 
               alt="Team working together" 
               className="w-full h-full object-cover grayscale opacity-80"
             />
             <div className="absolute bottom-8 left-8 z-20">
                <p className="text-white text-lg italic opacity-60">Established 2024</p>
                <p className="text-white text-3xl tracking-tight font-bold">The Future of Work</p>
             </div>
          </div>
          <div className="space-y-8">
            <h2 className="text-4xl font-medium text-foreground tracking-tighter">Why Culture Monitor™?</h2>
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-primary font-bold rounded-full flex items-center justify-center text-white text-lg">1</div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Real-Time Awareness</h4>
                  <p className="text-muted-foreground font-medium text-sm">Annual surveys are fossils. We provide the pulse of today, so you can lead for tomorrow.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-primary font-bold rounded-full flex items-center justify-center text-white text-lg">2</div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Deep Segmentation</h4>
                  <p className="text-muted-foreground font-medium text-sm">Understand your organization at a granular level—by department, generation, and geography.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0 w-8 h-8 bg-primary font-bold rounded-full flex items-center justify-center text-white text-lg">3</div>
                <div>
                  <h4 className="font-medium text-foreground mb-2">Predictive Health</h4>
                  <p className="text-muted-foreground font-medium text-sm">Our Factor Analysis identifies friction before it becomes a failure, allowing for proactive leadership.</p>
                </div>
              </div>
            </div>
            <Link href="/register" className="inline-block mt-8">
               <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 py-7 rounded-2xl font-medium text-sm shadow-xl shadow-primary/20 active:scale-95 transition-all">
                 Begin your journey <TrendingUp size={16} className="ml-2" />
               </Button>
            </Link>
          </div>
        </div>

        {/* Trust Stats */}
        <div className="bg-[#0d3330] dark:bg-card rounded-[60px] p-12 lg:p-20 text-center relative overflow-hidden border border-[#1a4a46] dark:border-border shadow-2xl transition-colors duration-300">
           <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
           <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-12">
              <div>
                 <p className="text-5xl font-bold text-white mb-2 tracking-tighter">500+</p>
                 <p className="text-teal-300/60 font-medium text-xs">Client partners</p>
              </div>
              <div>
                 <p className="text-5xl font-bold text-white mb-2 tracking-tighter">2M+</p>
                 <p className="text-teal-300/60 font-medium text-xs">Voices measured</p>
              </div>
              <div>
                 <p className="text-5xl font-bold text-white mb-2 tracking-tighter">98%</p>
                 <p className="text-teal-300/60 font-medium text-xs">Engagement rate</p>
              </div>
              <div>
                 <p className="text-5xl font-bold text-white mb-2 tracking-tighter">15+</p>
                 <p className="text-teal-300/60 font-medium text-xs">Core factors</p>
              </div>
           </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
