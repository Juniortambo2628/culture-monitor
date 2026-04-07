"use client";
import { LayoutDashboard, Users, FileText, Settings, LogOut, Building2, Filter, Target, Share2, Globe, Mail, Home, UserPlus, Fingerprint, BarChart3, BookOpen, Layers } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { DashboardHeader } from "@/components/DashboardHeader";
import { CommandPalette } from "@/components/CommandPalette";
import axiosInstance from "@/lib/axios";
import { OrganizationProvider } from "@/context/OrganizationContext";
import { useAuth } from "@/context/AuthContext";
import { SiteFooter } from "@/components/SiteFooter";
import { ContextIndicator } from "@/components/ContextIndicator";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!isAuthLoading && user?.role !== 'admin') {
       router.push("/user");
       return;
    }

    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const notifRes = await axiosInstance.get("/notifications");
          setNotifications(notifRes.data);
          setIsDataLoading(false);
        } catch (e) {
          console.error("Data fetch failed", e);
          setIsDataLoading(false);
        }
      };
      fetchData();
    }
  }, [isAuthenticated, isAuthLoading, user, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  if (isAuthLoading || (isAuthenticated && isDataLoading)) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
           <p className="text-[13px] font-medium text-muted-foreground">Verifying session...</p>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
  };

  const markAsRead = async (id: number) => {
    try {
        await axiosInstance.post(`/notifications/${id}/read`);
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    } catch (e) { console.error(e); }
  };

  const menuItems = [
    { name: "Welcome", path: "/admin/welcome", icon: Home, category: "Overview" },
    { name: "Dashboard", path: "/admin", icon: LayoutDashboard, category: "Overview" },
    { name: "Advanced Analytics", path: "/admin/analytics", icon: BarChart3, category: "Analysis" },
    { name: "Participants", path: "/admin/participants", icon: Users, category: "Management" },
    { name: "CM Poll Inventory", path: "/admin/polls", icon: FileText, category: "Management" },
    { name: "Organizations", path: "/admin/organizations", icon: Building2, category: "Setup" },
    { name: "Organization Model", path: "/admin/model", icon: Layers, category: "Setup" },
    { name: "Culture Profile", path: "/admin/profile", icon: Filter, category: "Data" },
    { name: "Strategic Apps", path: "/admin/applications", icon: Target, category: "Strategic" },
    { name: "System Settings", path: "/admin/settings", icon: Settings, category: "Admin" },
    { name: "User Guide", path: "/admin/guide", icon: BookOpen, category: "Support" },
    { name: "My Profile", path: "/admin/my-profile", icon: Fingerprint, category: "Personal" },
  ];


  return (
    <OrganizationProvider>
      <div className="flex h-screen bg-background font-sans transition-colors" suppressHydrationWarning>
      {/* Sidebar */}
      <aside className="w-80 bg-card flex flex-col border-r z-20">
        <div className="p-8">
          <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/10 transition-transform group-hover:scale-110">
                 <Filter size={22} strokeWidth={2.5} />
              </div>
              <div>
                 <h1 className="text-xl text-foreground leading-none tracking-tight">Culture</h1>
                 <p className="text-[13px] font-medium text-primary">Monitor™ CMS</p>
              </div>
          </Link>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-6 space-y-1.5 custom-scrollbar">
          {menuItems.map((item) => (
            <Link 
              key={item.path}
              href={item.path} 
              className={`p-3.5 rounded-xl text-left font-medium flex items-center gap-3 transition-all duration-300 ${pathname === item.path ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/10 scale-[1.02]' : 'hover:bg-muted text-muted-foreground hover:text-foreground'}`}
            >
               <item.icon size={20} className={pathname === item.path ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
               <span className="text-[13px] tracking-tight">{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="p-6 pt-0">
          <Button 
            onClick={handleLogout}
            variant="ghost"
            className="w-full h-11 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10 font-medium text-[13px] flex items-center justify-center gap-3 transition-all"
          >
            <LogOut size={16} /> LOGOUT
          </Button>
        </div>
      </aside>

      {/* Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background transition-colors">
        {/* Unified Top Header */}
        <DashboardHeader
          user={user}
          notifications={notifications}
          onSearchOpen={() => setIsSearchOpen(true)}
          markAsRead={markAsRead}
          handleLogout={handleLogout}
        />

        <div className="flex-1 overflow-y-auto w-full custom-scrollbar relative">
           <div className="p-10 min-h-[calc(100vh-80px)">
              {children}
           </div>
           
           {/* Footer */}
           <SiteFooter />
        </div>
      </main>

      {/* Fuzzy Search Command Palette */}
      <CommandPalette
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        items={menuItems}
      />
      <ContextIndicator />
      </div>
    </OrganizationProvider>
  );
}
