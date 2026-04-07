"use client";

import Link from "next/link";
import { Globe, Cpu, ShieldCheck, Database, Zap, Share2, MessageSquare, Users, Smartphone } from "lucide-react";
import { useSetting } from "@/context/SettingContext";

export function SiteFooter() {
  const currentYear = new Date().getFullYear();
  const { getSetting } = useSetting();

  return (
    <footer className="relative bg-background border-t border-border transition-colors duration-300 pt-20 pb-10 overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-teal-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-20">
          
          {/* Brand Column */}
          <div className="space-y-6">
            <Link href="/" className="flex items-center gap-2 group">
               <span className="tracking-tighter text-2xl text-foreground transition-colors">
                 CULTURE <span className="text-primary">MONITOR™</span>
               </span>
            </Link>
            <p className="text-sm font-medium text-muted-foreground leading-relaxed max-w-xs">
              Empowering organizations through industrial-grade behavioral insights and strategic cultural calibration. 
              High-fidelity intelligence for the modern workforce.
            </p>
            <div className="flex gap-4">
              {[Share2, MessageSquare, Users, Smartphone].map((Icon, i) => (
                <button key={i} className="w-10 h-10 rounded-xl bg-secondary border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-all shadow-sm">
                  <Icon size={18} />
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-8">Platform</h4>
            <ul className="space-y-4">
              {["Home", "Methodology", "Case studies", "Global benchmarks", "Pricing"].map((link) => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Column */}
          <div>
            <h4 className="text-xs font-medium text-muted-foreground mb-8">Resources</h4>
            <ul className="space-y-4">
              {["User guide", "Developer API", "System logs", "Whitepapers", "Community"].map((link) => (
                <li key={link}>
                  <Link href={`/${link.toLowerCase().replace(/ /g, '-')}`} className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* System Status Column */}
          <div className="bg-secondary/50 dark:bg-card/40 backdrop-blur-sm p-8 rounded-[32px] border border-border shadow-sm">
            <h4 className="text-xs font-medium text-muted-foreground mb-6">System status</h4>
            
            <div className="space-y-6">
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500 shadow-inner">
                     <Zap size={20} fill="currentColor" className="opacity-20" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground leading-none mb-1">Engines online</p>
                    <p className="text-[13px] font-medium text-emerald-500">{getSetting('system_uptime', '99.9% uptime')}</p>
                  </div>
               </div>
               
               <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-2xl text-primary shadow-inner">
                     <ShieldCheck size={20} />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-foreground leading-none mb-1">Data secured</p>
                    <p className="text-[13px] font-medium text-muted-foreground">ISO 27001 ready</p>
                  </div>
               </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-10 border-t border-border flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-6">
              <p className="text-xs font-medium text-muted-foreground">
                &copy; {currentYear} {getSetting('company_name', 'Culture Monitor™ AI Systems')}. All rights reserved.
              </p>
           </div>
           
           <div className="flex items-center gap-8">
              {["Privacy", "Terms", "Legal", "Cookies"].map((legal) => (
                <Link key={legal} href={`/legal/${legal.toLowerCase()}`} className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                  {legal}
                </Link>
              ))}
           </div>

           <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full border border-border">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[13px] font-medium text-muted-foreground">{getSetting('system_version', 'v2.4.0 Calibrated')}</span>
           </div>
        </div>
      </div>
    </footer>
  );
}
