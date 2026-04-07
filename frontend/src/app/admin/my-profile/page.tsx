import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Fingerprint, Mail, Shield, Key, Camera, User } from "lucide-react";
import DashboardHero from "@/components/DashboardHero";
import { cn } from "@/lib/utils";

export default function MyProfilePage() {
  return (
    <div className="animate-fade-in space-y-12 pb-20">
      <DashboardHero 
        title="my profile" 
        description="Manage your personal account settings." 
      />

      <div className="max-w-6xl mx-auto space-y-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-8">
             <Card className="shadow-sm rounded-xl bg-card overflow-hidden text-center p-10 transition-all hover:shadow-md">
                <div className="relative w-32 h-32 mx-auto mb-8 cursor-pointer group">
                   <div className="w-full h-full bg-muted/50 rounded-full flex items-center justify-center overflow-hidden border-4 border-background shadow-md">
                      <User size={64} className="text-muted-foreground/30" />
                   </div>
                   <div className="absolute inset-0 bg-primary/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-primary-foreground backdrop-blur-sm">
                      <Camera size={20} />
                   </div>
                </div>
                <h3 className="text-2xl text-foreground tracking-tight leading-none mb-2">Admin User</h3>
                <p className="text-[13px] font-medium text-primary mb-6">Master Administrator</p>
                <div className="flex justify-center gap-2">
                   <div className="bg-muted px-4 py-1.5 rounded-lg text-[13px] font-medium text-muted-foreground border">
                      SWF5 Assigned
                   </div>
                </div>
             </Card>

             <div className="space-y-4">
                <div className="p-8 bg-primary rounded-xl text-primary-foreground shadow-lg shadow-primary/15 relative overflow-hidden group">
                   <div className="absolute -right-4 -top-4 text-white/10 group-hover:scale-110 transition-transform">
                      <Shield size={80} />
                   </div>
                   <div className="flex items-center gap-3 mb-4 relative z-10">
                      <Shield size={18} className="text-primary-foreground/70" />
                      <h4 className="text-md font-bold leading-none">RBAC Permissions</h4>
                   </div>
                   <p className="text-[13px] font-medium text-primary-foreground/80 leading-relaxed relative z-10">
                      Your account has full administrative privileges. You can manage organization models, create polls, and provision new user accounts.
                   </p>
                </div>
                <p className="text-[13px] font-medium text-muted-foreground text-center opacity-50">
                   Account ID: CM-MASTER-2026-001
                </p>
             </div>
          </div>

          <Card className="lg:col-span-2 shadow-sm rounded-xl bg-card overflow-hidden border">
            <CardHeader className="p-10">
               <CardTitle className="text-lg font-medium tracking-tight leading-none mb-2">Security & Identity</CardTitle>
               <CardDescription className="text-xs font-medium text-muted-foreground italic">Update your professional details and secure your access.</CardDescription>
            </CardHeader>
            <CardContent className="p-10">
              <form className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <Label className="text-[13px] font-medium text-muted-foreground ml-1">Professional Name</Label>
                    <Input defaultValue="Admin" className="h-12 rounded-lg bg-muted/20 border-muted text-xs focus:bg-background transition-all" />
                  </div>
                  <div className="space-y-3">
                    <Label className="text-[13px] font-medium text-muted-foreground ml-1">Surname</Label>
                    <Input defaultValue="User" className="h-12 rounded-lg bg-muted/20 border-muted text-xs focus:bg-background transition-all" />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-[13px] font-medium text-muted-foreground ml-1">Verified Email Address</Label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30" size={18} />
                    <Input defaultValue="admin@orgfitech.com" className="h-12 pl-12 rounded-lg bg-muted/50 border-muted text-xs opacity-60" disabled />
                  </div>
                  <p className="text-[13px] font-medium text-emerald-600 ml-1 flex items-center gap-2 italic animate-pulse">
                     <Shield size={10} /> Verified Administrative Identity
                  </p>
                </div>

                <div className="pt-8 border-t">
                   <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                      <div>
                        <h4 className="text-base text-foreground tracking-tight leading-none mb-1">Security Credentials</h4>
                        <p className="text-[13px] font-medium text-muted-foreground italic">Last credential synchronization: 3 months ago.</p>
                      </div>
                      <Button variant="outline" className="h-10 px-6 rounded-lg border-muted text-[13px] font-medium hover:bg-muted hover:text-primary transition-all shadow-sm">
                         Change Password
                      </Button>
                   </div>
                </div>

                <div className="pt-6">
                  <Button className="w-full h-14 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm shadow-lg shadow-primary/20 transition-all hover:scale-[1.01] active:scale-[0.99]">
                    Synchronize Profile Changes
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
