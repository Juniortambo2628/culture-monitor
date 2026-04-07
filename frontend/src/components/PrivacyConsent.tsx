"use client";

import { useState, useEffect } from "react";
import { Info, Shield, Cookie, X, Lock, Eye, BarChart3, Target, CheckCircle2 } from "lucide-react";
import { 
  Dialog
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function PrivacyConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [isCookieModalOpen, setIsCookieModalOpen] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true,
    analytic: true,
    marketing: false
  });

  useEffect(() => {
    const consent = localStorage.getItem("cm_privacy_consent");
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cm_privacy_consent", JSON.stringify(preferences));
    setIsVisible(false);
    setIsCookieModalOpen(false);
  };

  const handleAcceptAll = () => {
    const allAccepted = { essential: true, analytic: true, marketing: true };
    localStorage.setItem("cm_privacy_consent", JSON.stringify(allAccepted));
    setIsVisible(false);
    setIsCookieModalOpen(false);
  };

  const handleReject = () => {
    localStorage.setItem("cm_privacy_consent", "rejected");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      <div className="fixed bottom-0 left-0 w-full p-4 md:p-8 z-[90] flex justify-center pointer-events-none animate-in slide-in-from-bottom-10 duration-700">
        <div className="bg-card/95 backdrop-blur-2xl border border-border rounded-[40px] p-6 md:p-8 w-full max-w-5xl flex flex-col md:flex-row items-center gap-8 shadow-2xl pointer-events-auto ring-1 ring-slate-900/5 transition-colors duration-300">
          
          <div className="flex items-start gap-5">
            <div className="mt-1 p-4 bg-primary/10 rounded-2xl text-primary shrink-0 shadow-inner">
              <Shield size={28} strokeWidth={2.5} />
            </div>
            <div className="flex-1">
               <h3 className="text-xl text-foreground tracking-tight mb-1 italic">Privacy Calibration</h3>
               <p className="text-muted-foreground text-xs md:text-sm leading-relaxed font-medium max-w-xl">
                  We utilize telemetric nodes to optimize cultural mapping and platform performance. 
                  By accepting, you authorize the processing of anonymized behavioral metadata.
               </p>
            </div>
          </div>

          <div className="flex items-center gap-4 w-full md:w-auto mt-6 md:mt-0">
            <Button 
              variant="ghost" 
              onClick={() => setIsCookieModalOpen(true)}
              className="text-[13px] font-medium text-muted-foreground hover:text-primary transition-all px-4 h-14"
            >
              Preferences
            </Button>

            <div className="flex gap-2 w-full md:w-auto">
              <Button 
                  variant="outline" 
                  onClick={handleReject}
                  className="flex-1 md:flex-none h-14 px-8 border-2 border-border text-muted-foreground rounded-2xl text-[13px] font-medium hover:bg-secondary transition-all"
              >
                  Opt Out
              </Button>
              
              <Button 
                  onClick={handleAcceptAll}
                  className="flex-1 md:flex-none h-14 px-10 bg-primary hover:bg-teal-900 text-primary-foreground rounded-2xl text-[13px] font-medium shadow-xl shadow-primary/20 transition-all active:scale-95 border-none"
              >
                  Authorize All
              </Button>
            </div>
          </div>
        </div>
      </div>

      <Dialog 
        isOpen={isCookieModalOpen} 
        onClose={() => setIsCookieModalOpen(false)}
        title="Privacy Configuration"
        description="Detailed control over telemetric data acquisition."
        maxWidth="2xl"
      >
        <div className="space-y-6 pt-4">
          <div className="space-y-4">
              {/* Essential */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[32px] border border-slate-100 dark:border-slate-900 flex items-start gap-4 transition-all">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-primary shadow-sm">
                  <Lock size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs text-slate-900 dark:text-white">Essential Nodes</h4>
                    <span className="text-[13px] font-medium text-primary px-2 py-1 bg-primary/10 rounded-md tracking-tighter">Required</span>
                  </div>
                  <p className="text-[13px] font-medium text-slate-400 dark:text-slate-500 leading-relaxed">
                    Critical for secure authentication, session persistence, and anti-fraud protocols. Cannot be deactivated.
                  </p>
                </div>
              </div>

              {/* Analytical */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[32px] border border-slate-100 dark:border-slate-900 flex items-start gap-4 group transition-all">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-emerald-500 shadow-sm">
                  <BarChart3 size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs text-slate-900 dark:text-white">Behavioral Analytics</h4>
                    <button 
                      onClick={() => setPreferences(prev => ({...prev, analytic: !prev.analytic}))}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${preferences.analytic ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-800'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${preferences.analytic ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <p className="text-[13px] font-medium text-slate-400 dark:text-slate-500 leading-relaxed">
                    Anonymized pattern detection to optimize survey flow and organizational health mapping.
                  </p>
                </div>
              </div>

              {/* Marketing */}
              <div className="p-6 bg-slate-50 dark:bg-slate-950 rounded-[32px] border border-slate-100 dark:border-slate-900 flex items-start gap-4 group transition-all">
                <div className="p-3 bg-white dark:bg-slate-900 rounded-xl text-amber-500 shadow-sm">
                  <Target size={20} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="text-xs text-slate-900 dark:text-white">Marketing & Reach</h4>
                    <button 
                      onClick={() => setPreferences(prev => ({...prev, marketing: !prev.marketing}))}
                      className={`relative w-12 h-6 rounded-full transition-all duration-300 ${preferences.marketing ? 'bg-primary' : 'bg-slate-300 dark:bg-slate-800'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${preferences.marketing ? 'translate-x-7' : 'translate-x-1'}`} />
                    </button>
                  </div>
                  <p className="text-[13px] font-medium text-slate-400 dark:text-slate-500 leading-relaxed">
                    External attribution nodes to understand site traffic origin and campaign performance.
                  </p>
                </div>
              </div>
          </div>

          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2 text-primary text-[13px] font-medium">
              <CheckCircle2 size={16} />
              Verified Secure Node
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
                <Link 
                  href="/legal/cookies" 
                  onClick={() => setIsCookieModalOpen(false)}
                  className="hidden md:block text-[13px] font-medium text-slate-400 hover:text-primary underline transition-colors"
                >
                  Full Cookie Protocol
                </Link>
                <Button 
                  onClick={handleAccept}
                  className="w-full sm:w-auto h-14 px-10 bg-primary hover:bg-teal-900 text-white rounded-2xl text-xs shadow-xl shadow-teal-500/20 active:scale-95 transition-all"
                >
                  Save Configuration
                </Button>
            </div>
          </div>
        </div>
      </Dialog>
    </>
  );
}
