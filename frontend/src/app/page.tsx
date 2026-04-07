"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ArrowRight, Download, MessageCircle, Info } from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { PrivacyConsent } from "@/components/PrivacyConsent";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";
import { SiteFooter } from "@/components/SiteFooter";

export default function Home() {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <main className="relative min-h-screen flex flex-col font-sans overflow-hidden tracking-tight antialiased bg-background text-foreground transition-colors duration-300">
      {/* Universal Background Video with theme-aware overlay */}
      <div className="absolute inset-0 z-0 animate-fade-in overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-90 dark:opacity-60 transition-opacity duration-300"
        >
          <source src="/hero-bg.mp4" type="video/mp4" />
        </video>
        
        {/* Theme-adaptive overlays */}
        <div className="absolute inset-0 bg-white/30 dark:bg-neutral-950/40 mix-blend-multiply dark:mix-blend-multiply transition-colors duration-300" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-white/20 to-[#0d3330] dark:from-transparent dark:via-background/40 dark:to-background transition-colors duration-300" />
        
        {/* Animated accent glows for light mode specifically */}
        <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-teal-500/5 blur-[120px] rounded-full transition-opacity duration-300" />
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-blue-500/5 blur-[100px] rounded-full transition-opacity duration-300" />
      </div>

      {/* Header */}
      <SiteHeader />

      {/* Main Hero Content */}
      <section className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-4 w-full min-h-[70vh] pt-32 pb-20">
         
         <div className="mb-6 inline-flex items-center border border-border bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-full px-5 py-2 shadow-sm transition-all">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mr-3 animate-pulse" />
            <span className="text-[13px] font-medium text-slate-600 dark:text-slate-400">
              Real-time organizational culture insights
            </span>
         </div>

         <h1 className="text-4xl md:text-6xl font-bold lg:text-7xl tracking-tighter mb-8 text-foreground transition-all transform hover:scale-[1.01] duration-500 flex flex-wrap justify-center gap-x-2">
            <span>Culture</span> 
            <span className="text-primary font-semibold">Monitor™</span>
         </h1>

         <h2 className="text-md md:text-xl font-medium text-slate-800 tracking-tight dark:text-foreground/80 mb-8 tracking-tight max-w-2xl px-6 py-4 transition-colors bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-full">
            Welcome to your customizable Culture Monitor™ website.
         </h2>

         <p className="text-md md:text-lg dark:text-muted-foreground font-medium tracking-tight  max-w-3xl leading-relaxed mb-12 transition-colors">
            Please ensure there is a clear understanding of what your preferred operating style or culture is before customizing your CM™. 
            We provide strategic advisory and market intelligence to empower change.
         </p>

         <div className="flex flex-col sm:flex-row gap-4 items-center">
            <Link href="/user">
               <Button className="bg-primary hover:bg-primary/90 text-primary-foreground px-10 h-14 text-sm font-medium rounded-full border-none shadow-xl transition-all hover:scale-105 active:scale-95 group">
                  Get started <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
               </Button>
            </Link>
            
            <Link href="/guide">
               <Button variant="outline" className="bg-white/40 dark:bg-card/40 backdrop-blur-md hover:bg-white dark:hover:bg-card text-foreground border border-border px-10 h-14 text-sm font-medium rounded-full hover:-translate-y-0.5 transition-all shadow-lg active:scale-95">
                  <Download className="w-4 h-4 mr-2" /> Read user guide
               </Button>
            </Link>
         </div>

      </section>

      <SiteFooter />

      {/* Fixed Chat Icons Overlay (outside of relative sections to stay on top) */}
      <div className="fixed bottom-0 right-0 p-6 flex flex-col gap-3 z-[60]">
          <button aria-label="WhatsApp Chat" className="w-14 h-14 bg-emerald-500 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl">
             <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>
          </button>
          <button aria-label="Messenger Chat" className="w-14 h-14 bg-blue-600 rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-xl relative">
             <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-400 rounded-full border-2 border-slate-900 dark:border-slate-800 z-10" />
             <MessageCircle className="w-7 h-7 text-white" />
          </button>
      </div>

      <PrivacyConsent />
    </main>
  );
}
