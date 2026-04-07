"use client";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Fingerprint, Mail, Lock, ArrowRight, Loader2, Globe, ShieldCheck } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated, user, isLoading } = useAuth();

  // Auth Guard: Redirect if already logged in
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (user?.role === 'admin') {
        router.push("/admin");
      } else {
        router.push("/user");
      }
    }
  }, [isAuthenticated, user, isLoading, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ email, password })
      });
      if (res.ok) {
         const data = await res.json();
         toast.success("Welcome back!", {
            description: `Successfully signed in as ${data.user.name}`
         });
         login(data.access_token, data.user);
      } else {
         toast.error("Authentication Failed", {
            description: "Check your email and password and try again."
         });
      }
    } catch (err) {
       toast.error("Connection Error", {
          description: "Unable to reach the authentication server."
       });
    } finally {
      setLoading(false);
    }
  };

  if (isLoading || isAuthenticated) {
    return (
       <div className="h-screen w-full flex items-center justify-center bg-background">
          <div className="flex flex-col items-center gap-4">
             <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
              <p className="text-[13px] font-medium text-slate-500 whitespace-nowrap">Logged in ?...Let's get you set up!</p>
          </div>
       </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background font-sans transition-all duration-500">
      {/* Left Side: Brand Section */}
      <div className="relative w-full lg:w-1/2 h-[35vh] lg:h-screen bg-slate-900 overflow-hidden group">
         <video 
            autoPlay 
            muted 
            loop 
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-60 transition-transform duration-[10000ms] group-hover:scale-110"
         >
            <source src="/login-video.mp4" type="video/mp4" />
         </video>
         
         <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/40 p-10 flex flex-col justify-between">
            <div className="flex items-center gap-3">
               <span className="text-xl font-medium text-white tracking-tight">Culture monitor<span className="text-teal-400">™</span></span>
            </div>

            <div className="max-w-md hidden lg:block pb-12">
               <h2 className="text-3xl font-bold text-white leading-tight mb-4 tracking-tight">Measure what matters most to your <span className="text-teal-900 bg-white px-2 py-0.5 rounded-lg">culture</span></h2>
               <p className="text-slate-300 font-medium leading-relaxed text-sm">
                  Join 1,000+ organizations leveraging real-time data to drive performance and engagement.
               </p>
            </div>
         </div>
      </div>

      {/* Right Side: Form Container */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20 bg-background relative transition-colors duration-300">
         <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
         
         <div className="w-full max-w-sm relative z-10">
            <div className="mb-8 text-center lg:text-left">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-primary rounded-full text-[13px] font-medium mb-4 border border-border">
                  <ShieldCheck size={12} /> Secure access
               </div>
               <h3 className="text-3xl font-bold text-foreground tracking-tight mb-2">Sign in</h3>
               <p className="text-slate-500 font-medium tracking-tight text-sm">Welcome back! Enter your credentials to access the Culture Monitor.</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
                <div className="space-y-1.5 group">
                   <label className="text-[13px] font-medium text-slate-500 ml-1">Email Address</label>
                   <div className="relative">
                      <Mail size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
                      <Input 
                         type="email" 
                         placeholder="admin@culturemonitor.com" 
                         value={email}
                         onChange={(e) => setEmail(e.target.value)}
                         required 
                         className="h-12 pl-12 bg-card border-border rounded-xl shadow-sm focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-slate-400/30 text-foreground"
                      />
                   </div>
                </div>

                <div className="space-y-1.5 group">
                   <label className="text-[13px] font-medium text-slate-500 ml-1">Password</label>
                   <div className="relative">
                      <Lock size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-primary" />
                      <Input 
                         type="password" 
                         placeholder="••••••••" 
                         value={password}
                         onChange={(e) => setPassword(e.target.value)}
                         required 
                         className="h-12 pl-12 bg-card border-border rounded-xl shadow-sm focus:ring-4 focus:ring-primary/10 transition-all font-medium placeholder:text-slate-400/30 text-foreground"
                      />
                   </div>
                </div>

               <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full h-12 rounded-xl bg-primary hover:bg-[#1f3f3f text-white font-medium text-xs transition-all active:scale-[0.98 group shadow-lg shadow-primary/10"
               >
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      Verify & sign in
                      <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  )}
               </Button>
            </form>

            <div className="mt-8 pt-8 border-t border-border flex flex-col items-center gap-4">
               <div className="flex gap-4">
                  <Link 
                     href="/" 
                     className="px-5 py-2.5 rounded-xl border border-border hover:border-slate-400 dark:hover:border-slate-600 transition-all text-[13px] font-medium text-slate-500 bg-card"
                  >
                     Return home
                  </Link>
                  <Link 
                     href="/register" 
                     className="px-5 py-2.5 rounded-xl border border-primary/20 hover:border-primary text-primary transition-all text-[13px] font-medium bg-secondary"
                  >
                     Create account
                  </Link>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
