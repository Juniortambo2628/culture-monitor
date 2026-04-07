"use client";
import React, { useState, useEffect } from "react";
import { 
  FileText, 
  User, 
  HelpCircle, 
  LogOut, 
  LayoutDashboard, 
  History,
  BookOpen,
  Filter,
  Globe,
  Share2,
  Mail
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/DashboardHeader";
import { CommandPalette } from "@/components/CommandPalette";
import axiosInstance from "@/lib/axios";
import { OrganizationProvider } from "@/context/OrganizationContext";
import { SiteFooter } from "@/components/SiteFooter";
import { useAuth } from "@/context/AuthContext";

export default function UserLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { user, isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (isAuthenticated) {
      const fetchData = async () => {
        try {
          const notifRes = await axiosInstance.get("/notifications");
          setNotifications(notifRes.data);
        } catch (e) {
          console.error("Data fetch failed", e);
        }
      };
      fetchData();
    }
  }, [isAuthenticated, isAuthLoading, router]);

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
    { name: "Overview", path: "/user", icon: LayoutDashboard, category: "General" },
    { name: "Active Surveys", path: "/user/surveys", icon: FileText, category: "Participation" },
    { name: "My History", path: "/user/history", icon: History, category: "Participation" },
    { name: "My Profile", path: "/user/profile", icon: User, category: "Account" },
    { name: "User Guide", path: "/guide", icon: BookOpen, category: "Support" },
    { name: "Help Center", path: "/user/help", icon: HelpCircle, category: "Support" },
  ];

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

  return (
    <OrganizationProvider>
      <div className="flex h-screen bg-background font-sans transition-colors" suppressHydrationWarning>
        {/* Sidebar */}
        <aside className="w-80 bg-card border-none flex flex-col z-20 transition-colors">
          <div className="p-8">
            <Link href="/" className="flex items-center gap-3 group">
               <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/10 transition-transform group-hover:scale-110">
                  <Filter size={22} strokeWidth={2.5} />
               </div>
               <div>
                  <h1 className="text-xl text-foreground leading-none tracking-tight">Culture</h1>
                  <p className="text-[13px] font-medium text-primary">Monitor™</p>
               </div>
            </Link>
          </div>
          
          <nav className="flex-1 overflow-y-auto p-6 space-y-1.5 custom-scrollbar">
            <div className="mb-4 px-4">
              <p className="text-xs font-medium text-muted-foreground">Menu</p>
            </div>
            {menuItems.map((item) => (
              <Link 
                key={item.path}
                href={item.path} 
                className={`p-3.5 rounded-xl text-left font-medium flex items-center gap-3 transition-all duration-300 ${pathname === item.path ? 'bg-primary text-primary-foreground shadow-xl shadow-primary/10 scale-[1.02' : 'hover:bg-secondary text-muted-foreground hover:text-foreground'}`}
              >
                 <item.icon size={20} className={pathname === item.path ? 'text-primary-foreground' : 'text-muted-foreground'} /> 
                 <span className="text-sm">{item.name}</span>
              </Link>
            ))}
          </nav>

          <div className="p-6">
            <button 
              onClick={handleLogout}
              className="w-full p-4 rounded-xl text-red-500 font-medium text-sm flex items-center justify-center gap-3 hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/20"
            >
              <LogOut size={16} /> Sign out
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background transition-colors">
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

        <CommandPalette 
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          items={menuItems}
        />
      </div>
    </OrganizationProvider>
  );
}
