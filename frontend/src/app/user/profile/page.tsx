"use client";
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Mail, Building, Shield, Save, Loader2, UserCircle, BadgeCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DashboardHero from "@/components/DashboardHero";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export default function ProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: ""
  });

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axiosInstance.get("/user");
        setUser(res.data);
        setFormData({
          name: res.data.name || "",
          email: res.data.email || ""
        });
      } catch (e) {
        console.error("Failed to fetch user profile", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Assuming there's a profile update endpoint
      await axiosInstance.put("/profile/update", formData);
      toast.success("Profile Synchronized", {
        description: "Your administrative mapping has been updated successfully."
      });
    } catch (e) {
      toast.error("Parity Error", {
        description: "Could not synchronize profile changes with the central cluster."
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[40vh] flex flex-col items-center justify-center gap-6 animate-pulse">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-[13px] font-medium text-muted-foreground leading-none">Syncing participant profile...</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-10 pb-20">
      <DashboardHero 
        title="My profile" 
        description="Manage your organizational identity and diagnostic preferences within the Culture Monitor environment."
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-4 space-y-6">
          <Card className="p-10 border border-border shadow-sm rounded-[40px] relative overflow-hidden bg-gradient-to-br from-card to-secondary/10 group transition-all">
             <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full transition-transform group-hover:scale-125"></div>
             <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <div className="relative p-1 bg-background border border-border rounded-3xl shadow-xl shadow-primary/5">
                    <div className="w-24 h-24 bg-primary text-primary-foreground rounded-[24px] flex items-center justify-center transition-transform group-hover:scale-[1.02]">
                        <User size={48} strokeWidth={1.5} />
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-2 rounded-xl border-4 border-card shadow-lg">
                        <BadgeCheck size={18} />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <h3 className="text-2xl tracking-tight leading-none">{user?.name}</h3>
                    <p className="text-[13px] font-medium text-muted-foreground">{user?.role || 'Organization Member'}</p>
                </div>

                <div className="w-full flex items-center gap-3 p-4 bg-background border border-border rounded-2xl">
                    <Building size={16} className="text-primary"/>
                    <div className="text-left leading-none">
                        <p className="text-[13px] font-medium text-muted-foreground tracking-tight opacity-50 mb-1">Assigned cluster</p>
                        <p className="text-xs font-medium text-foreground">{user?.organization?.name || 'Global Cluster'}</p>
                    </div>
                </div>
             </div>
          </Card>
          
          <Card className="p-8 border border-border shadow-sm rounded-[32px] space-y-4">
             <h4 className="text-[13px] font-medium text-muted-foreground ml-1 flex items-center gap-2">
                <Shield size={14} className="text-emerald-500"/> Trust metrics
             </h4>
             <div className="space-y-3">
                <div className="flex justify-between items-center p-4 bg-muted/30 rounded-2xl">
                    <span className="text-[13px] font-medium text-muted-foreground italic leading-none">Identity Masking</span>
                    <span className="text-[13px] font-medium text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-lg">Enabled</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-muted/30 rounded-2xl text-current">
                    <span className="text-[13px] font-medium text-muted-foreground italic leading-none">Encryption Level</span>
                    <span className="text-[13px] font-medium text-primary bg-primary/10 px-2 py-1 rounded-lg">High-Entropy</span>
                </div>
             </div>
          </Card>
        </div>

        <div className="lg:col-span-8 space-y-6">
           <h3 className="text-[13px] font-medium text-muted-foreground ml-3 flex items-center gap-2">
                <UserCircle size={14} className="text-primary"/> Personnel mapping
           </h3>
           <Card className="border border-border shadow-sm rounded-[40px] overflow-hidden">
               <form onSubmit={handleSave} className="p-10 space-y-8">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       <div className="space-y-2.5">
                           <Label className="text-[13px] font-medium text-muted-foreground opacity-50 ml-1">Legal designation</Label>
                           <Input 
                               value={formData.name} 
                               onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                               className="h-12 border-border focus:ring-primary/10 rounded-2xl bg-muted/30 font-medium placeholder:text-muted-foreground/30 px-5 text-sm transition-all"
                               placeholder="Enter your full name"
                           />
                       </div>
                       <div className="space-y-2.5">
                           <Label className="text-[13px] font-medium text-muted-foreground opacity-50 ml-1">Digital coordinate</Label>
                           <Input 
                               value={formData.email} 
                               onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                               className="h-12 border-border focus:ring-primary/10 rounded-2xl bg-muted/30 font-medium placeholder:text-muted-foreground/30 px-5 text-sm transition-all"
                               placeholder="your@email.com"
                               type="email"
                           />
                       </div>
                   </div>

                   <div className="p-6 bg-slate-50 dark:bg-slate-900 border border-border rounded-[24px]">
                       <div className="flex items-center gap-4">
                           <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                               <Shield size={20} />
                           </div>
                           <div className="flex-1">
                               <h5 className="text-[12px] font-medium leading-tight">Anonymity verification</h5>
                               <p className="text-[13px] font-medium text-muted-foreground leading-relaxed italic">Changing your name or coordinate will not affect the anonymity of your historical behavioral submissions.</p>
                           </div>
                       </div>
                   </div>

                   <div className="flex justify-end pt-4">
                       <Button 
                            disabled={saving}
                            className="bg-primary hover:bg-[#1f3f3f text-primary-foreground h-12 px-8 rounded-2xl font-medium text-[12px flex items-center gap-3 shadow-xl shadow-primary/10 transition-all hover:scale-[1.02 active:scale-95 leading-none"
                       >
                           {saving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
                           {saving ? "Synchronizing..." : "Finalize profile sync"}
                       </Button>
                   </div>
               </form>
           </Card>
        </div>
      </div>
    </div>
  );
}
