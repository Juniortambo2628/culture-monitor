"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, LayoutDashboard, Info, BookOpen, UserCircle, Settings as SettingsIcon, Menu, X, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { CommandPalette } from "@/components/CommandPalette";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export function SiteHeader() {
  const pathname = usePathname();
  const { user, isAuthenticated } = useAuth();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "Home", path: "/", icon: LayoutDashboard, category: "Navigation" },
    { name: "About", path: "/about", icon: Info, category: "Navigation" },
    { name: "User guide", path: "/guide", icon: BookOpen, category: "Resources" },
    { name: "Client login", path: "/login", icon: UserCircle, category: "Auth" },
    { name: "Admin dashboard", path: "/admin", icon: LayoutDashboard, category: "Admin" },
    { name: "System settings", path: "/admin/settings", icon: SettingsIcon, category: "Admin" },
  ];

  const mainLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "User guide", path: "/guide" },
  ];

  const headerBgClass = isScrolled 
    ? "bg-white/70 dark:bg-card/70 border-border/50 shadow-xl backdrop-blur-xl" 
    : "border-transparent backdrop-blur-sm";

  const linkActiveColor = "text-primary dark:text-[#3edec7]";
  const linkBaseColor = isScrolled || pathname !== '/' ? "text-muted-foreground" : "text-slate-600 dark:text-slate-100/80";

  // Robust getDashboardPath helper
  const getDashboardPath = () => {
    if (!isAuthenticated || !user) return "/login";
    const role = user.role?.toLowerCase();
    if (role === 'admin' || role === 'analyst' || role === 'superadmin') {
      return "/admin";
    }
    return "/user";
  };

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ${isScrolled ? 'py-4' : 'py-6'}`}>
        <div className="max-w-7xl mx-auto px-6">
          <div className={`${headerBgClass} rounded-2xl transition-all duration-500 flex items-center justify-between px-8 py-3.5`}>
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 transition-transform group-hover:scale-110">
                <Filter size={20} strokeWidth={2.5} />
              </div>
              <div className="flex flex-col">
                <span className={`text-lg font-medium leading-none tracking-tight ${isScrolled || pathname !== '/' ? 'text-foreground' : 'text-slate-900 dark:text-white'}`}>Culture monitor</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-10">
              {mainLinks.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path} 
                  className={`text-sm font-medium transition-all hover:text-primary ${ pathname === link.path ? linkActiveColor : linkBaseColor }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className={`p-2 transition-colors hover:text-primary ${linkBaseColor}`}
                aria-label="Search"
              >
                <Search size={18} />
              </button>

              <ThemeToggle />

              <Link href={getDashboardPath()} className="hidden sm:block">
                <Button className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full font-medium text-xs px-6 h-10 shadow-lg shadow-primary/10 transition-all active:scale-95 border-none">
                  {isAuthenticated ? "Dashboard" : "Client login"}
                </Button>
              </Link>

              {/* Mobile Menu Toggle */}
              <button 
                className={`lg:hidden p-2 transition-colors ${linkBaseColor}`}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Menu Content */}
          {isMobileMenuOpen && (
            <div className="lg:hidden mt-4 bg-card/95 backdrop-blur-2xl border border-border rounded-[32px] p-8 flex flex-col gap-6 shadow-2xl animate-in slide-in-from-top-4 duration-500">
              {navItems.map((link) => (
                <Link 
                  key={link.path} 
                  href={link.path} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`flex items-center gap-4 text-sm font-medium ${ pathname === link.path ? 'text-primary' : 'text-muted-foreground' }`}
                >
                  <link.icon size={18} className="opacity-60" />
                  {link.name}
                </Link>
              ))}
              <div className="h-px bg-border my-2"></div>
              <Link href={getDashboardPath()} onClick={() => setIsMobileMenuOpen(false)}>
                <Button className="w-full bg-primary text-primary-foreground rounded-2xl py-6 font-medium text-sm shadow-xl shadow-primary/20">
                  {isAuthenticated ? "Go to dashboard" : "Client login"}
                </Button>
              </Link>
            </div>
          )}
        </div>
      </header>

      <CommandPalette 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
        items={navItems} 
      />
    </>
  );
}
