"use client";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { LucideIcon, ArrowUpRight, ArrowDownRight, Zap } from "lucide-react";

interface SummaryCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string | number;
  description: string;
  variant?: 'default' | 'teal' | 'amber' | 'rose';
}

export function SummaryCard({ 
  title, 
  value, 
  icon: Icon, 
  trend, 
  description, 
}: SummaryCardProps) {
  const isPositive = trend ? parseFloat(trend.toString()) >= 0 : null;
  
  return (
    <Card className="overflow-hidden group hover:shadow-md transition-all border shadow-sm bg-muted/30 rounded-xl border-muted/20">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center transition-transform group-hover:scale-110">
            <Icon size={18} strokeWidth={2.5} />
          </div>
          {trend !== undefined && (
              <div className="flex flex-col items-end">
                <div className={cn(
                  "flex items-center gap-1 text-[13px] font-medium px-3 py-1 rounded-lg border",
                  isPositive 
                    ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" 
                    : "bg-destructive/10 text-destructive border-destructive/20"
                )}>
                  {isPositive ? <ArrowUpRight size={10}/> : <ArrowDownRight size={10}/>} {Math.abs(parseFloat(trend.toString()))}%
                </div>
              </div>
          )}
        </div>
        
        <div className="space-y-2">
          <p className="text-[13px] font-medium text-muted-foreground/60 leading-none">{title}</p>
          <h3 className="text-3xl font-bold tracking-tighter text-foreground leading-none">{value}</h3>
          <p className="text-xs font-medium text-muted-foreground italic opacity-70 line-clamp-1 pt-2">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function SummaryCards({ cards }: { cards: SummaryCardProps[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
      {cards.map((card, index) => (
        <SummaryCard key={index} {...card} />
      ))}
    </div>
  );
}
