"use client";
import { usePathname } from "next/navigation";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronRight, Home, Building2 } from "lucide-react";
import Link from "next/link";
import { useOrganization } from "@/context/OrganizationContext";
import { cn } from "@/lib/utils";

interface DashboardHeroProps {
  title: string;
  description: string;
}

export default function DashboardHero({ title, description }: DashboardHeroProps) {
  const pathname = usePathname();
  const { organizations, activeOrganization, setActiveOrganization, isLoading } = useOrganization();
  
  // Generate breadcrumbs from pathname
  const pathSegments = pathname.split('/').filter(Boolean);
  const breadcrumbs = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    const label = segment.charAt(0).toUpperCase() + segment.slice(1).replace(/-/g, ' ');
    return { label, path };
  });

  return (
    <header className="mb-10 w-full animate-fade-in">
      <div className="bg-muted/40 shadow-sm border border-muted/20 p-8 rounded-2xl">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[13px] font-medium text-muted-foreground mb-8 bg-background/50 border w-fit px-3 py-1.5 rounded-lg shadow-sm">
          <Link href="/" className="hover:text-primary transition-colors">
            <Home size={12} />
          </Link>
          {breadcrumbs.map((crumb, index) => (
            <div key={crumb.path} className="flex items-center gap-2">
              <ChevronRight size={12} className="text-muted-foreground/30" />
              <Link 
                href={crumb.path} 
                className={cn(
                  "hover:text-primary transition-colors",
                  index === breadcrumbs.length - 1 ? "text-foreground" : "text-muted-foreground"
                )}
              >
                {crumb.label}
              </Link>
            </div>
          ))}
        </nav>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-10">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-6xl font-medium text-foreground tracking-tighter leading-[1.1] mb-6">
              {title}
            </h1>
            <p className="text-md font-medium text-muted-foreground leading-relaxed">
              {description}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
