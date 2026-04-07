"use client";
import React, { useState, useEffect } from "react";
import { Search, Bell, User, ChevronDown, Fingerprint, Settings, LogOut, Sun, Moon, Zap, AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface DashboardHeaderProps {
  user: any;
  notifications: any[];
  onSearchOpen: () => void;
  markAsRead: (id: number) => Promise<void>;
  handleLogout: () => void;
}

export function DashboardHeader({ user, notifications, onSearchOpen, markAsRead, handleLogout }: DashboardHeaderProps) {
  const { theme, setTheme } = useTheme();
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();

  useEffect(() => { setMounted(true); }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'response_alert': return <Zap className="text-amber-500" size={16} />;
      case 'score_pulse': return <AlertTriangle className="text-rose-500" size={16} />;
      case 'milestone': return <CheckCircle2 className="text-emerald-500" size={16} />;
      case 'system_health': return <Info className="text-blue-500" size={16} />;
      default: return <Bell className="text-slate-400" size={16} />;
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <header className="h-20 bg-card flex items-center justify-between px-10 z-30 transition-colors duration-300">
      <div className="flex-1 max-w-xl">
        <div 
          className="relative group bg-secondary border border-border rounded-2xl h-11 px-4 flex items-center gap-3 cursor-text transition-all hover:border-slate-400/50 dark:hover:border-slate-600 hover:bg-slate-100/50 dark:hover:bg-slate-800/80"
          onClick={onSearchOpen}
        >
          <Search className="text-muted-foreground" size={18} />
          <span className="text-sm font-medium text-muted-foreground">Search system...</span>
          <kbd className="ml-auto bg-card border border-border px-1.5 py-0.5 rounded text-[13px] font-medium text-muted-foreground shadow-sm">⌘K</kbd>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Theme Toggler */}
        <button 
          onClick={() => {
            const nextTheme = theme === 'dark' ? 'light' : 'dark';
            setTheme(nextTheme);
            toast.success(nextTheme === 'dark' ? "Deep Teal Mode Active" : "Light Mode Active", {
              description: "Dashboard aesthetics updated."
            });
          }}
          className="p-2 text-muted-foreground hover:text-primary transition-all rounded-full hover:bg-secondary"
          aria-label="Toggle Theme"
        >
          {mounted ? (theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />) : <Sun size={20} />}
        </button>

        {/* Notifications */}
        <div className="relative">
          <button 
            onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
            className={`relative p-2 text-muted-foreground hover:text-primary transition-all rounded-full hover:bg-secondary ${isNotificationsOpen ? 'text-primary bg-secondary' : ''}`}
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 rounded-full border-2 border-card flex items-center justify-center text-[8px] text-white">
                {unreadCount}
              </div>
            )}
          </button>

          {isNotificationsOpen && (
            <div className="absolute top-[120%] right-0 w-80 bg-card border border-border rounded-2xl shadow-2xl z-50 animation-slide-up p-2">
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h3 className="text-xs font-medium text-foreground">Recent activity</h3>
                <span className="text-[13px] font-medium text-muted-foreground bg-secondary px-2 py-0.5 rounded">{notifications.length} Alerts</span>
              </div>
              <div className="max-h-96 overflow-y-auto custom-scrollbar">
                {notifications.length > 0 ? (
                  notifications.map(n => (
                    <button 
                      key={n.id} 
                      onClick={() => markAsRead(n.id)}
                      className={`w-full p-4 text-left hover:bg-secondary transition-all border-b border-border last:border-0 relative ${!n.is_read ? 'bg-primary/5' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className="mt-1">{getNotificationIcon(n.type)}</div>
                        <div className="flex-1">
                          <p className={`text-[13px] font-medium tracking-tight ${!n.is_read ? 'text-foreground' : 'text-muted-foreground'}`}>{n.title}</p>
                          <p className="text-[13px] font-medium text-muted-foreground mt-0.5 leading-relaxed">{n.message}</p>
                          <p className="text-[8px] font-medium text-muted-foreground/60 mt-2">{new Date(n.created_at).toLocaleString()}</p>
                        </div>
                        {!n.is_read && <div className="w-2 h-2 bg-primary rounded-full mt-2"></div>}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="py-10 text-center space-y-3">
                    <Bell size={24} className="mx-auto text-muted-foreground/30" />
                    <p className="text-[13px] font-medium text-muted-foreground italic">No new activity</p>
                  </div>
                )}
              </div>
              <button className="w-full p-3 text-center text-[13px] font-medium text-primary hover:bg-secondary transition-all rounded-xl mt-1 border-t border-border">
                Clear all notifications
              </button>
            </div>
          )}
        </div>

        {/* Profile */}
        <div className="relative">
          <button 
            onClick={() => setIsProfileOpen(!isProfileOpen)}
            className={`flex items-center gap-3 p-1.5 transition-all rounded-2xl ${isProfileOpen ? 'bg-secondary' : 'hover:bg-secondary'}`}
          >
            <div className="w-9 h-9 bg-secondary text-primary border border-border rounded-xl flex items-center justify-center font-medium text-xs shadow-sm transition-transform active:scale-90">
              {user?.name?.[0] || <User size={18} />}
            </div>
            <div className="text-left hidden md:block">
              <p className="text-sm font-medium text-foreground leading-none">{user?.name || "Global Admin"}</p>
              <p className="text-[13px] font-medium text-muted-foreground mt-1">{user?.role || "Administrator"}</p>
            </div>
            <ChevronDown size={14} className={`text-muted-foreground transition-transform ${isProfileOpen ? 'rotate-180' : ''}`} />
          </button>

          {isProfileOpen && (
            <div className="absolute top-[120%] right-0 w-64 bg-card border border-border rounded-2xl shadow-2xl z-50 animation-slide-up p-2">
              <div className="p-4 border-b border-border mb-2">
                <p className="text-[13px] font-medium text-primary mb-1">Signed in as</p>
                <p className="font-medium text-foreground truncate text-sm">{user?.email || "kevin@culturemonitor.io"}</p>
              </div>
              <button className="w-full p-3 rounded-xl text-left text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all flex items-center gap-3">
                <Fingerprint size={16} /> My account
              </button>
              <button 
                onClick={() => router.push('/admin/settings')}
                className="w-full p-3 rounded-xl text-left text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-all flex items-center gap-3"
              >
                <Settings size={16} /> Preferences
              </button>
              <div className="h-px bg-border my-2"></div>
              <button 
                onClick={handleLogout}
                className="w-full p-3 rounded-xl text-left text-xs font-medium text-rose-500 hover:bg-rose-500/10 transition-all flex items-center gap-3"
              >
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
