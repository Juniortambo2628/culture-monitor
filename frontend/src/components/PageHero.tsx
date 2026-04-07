"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface Breadcrumb {
  label: string;
  path?: string;
}

interface PageHeroProps {
  title: string;
  subtitle: string;
  breadcrumbs: Breadcrumb[];
  category?: string;
}

export function PageHero({ title, subtitle, breadcrumbs, category }: PageHeroProps) {
  return (
    <section className="relative pt-40 pb-24 overflow-hidden border-b border-border bg-secondary/30 dark:bg-card/30">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-[0.05] dark:opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] animate-fade-in" />
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary-900/10 to-transparent dark:from-teal-900/10 to-transparent blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 mb-10 overflow-x-auto whitespace-nowrap pb-2 no-scrollbar">
          <Link href="/" className="text-muted-foreground hover:text-primary transition-colors">
            <Home size={16} />
          </Link>
          {breadcrumbs.map((crumb, i) => (
            <React.Fragment key={i}>
              <ChevronRight size={14} className="text-muted-foreground/40" />
              {crumb.path ? (
                <Link href={crumb.path} className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-xs font-medium text-primary">
                  {crumb.label}
                </span>
              )}
            </React.Fragment>
          ))}
        </nav>

        {/* Hero Content */}
        <div className="max-w-4xl space-y-8 animate-slide-up">
          {category && (
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-secondary border border-border rounded-full text-primary">
              <span className="text-xs font-medium">{category}</span>
            </div>
          )}
          
          <h1 className="text-5xl md:text-7xl font-bold text-foreground leading-[1.1]">
            {title.split(' ').map((word, i) => (
              <span key={i} className={i === Math.floor(title.split(' ').length / 2) ? "text-primary" : ""}>
                {word}{' '}
              </span>
            ))}
          </h1>
          
          <p className="text-xl text-muted-foreground leading-relaxed font-medium max-w-2xl border-l-4 border-border pl-6 py-2 italic">
            "{subtitle}"
          </p>
        </div>
      </div>
    </section>
  );
}

import React from "react";
