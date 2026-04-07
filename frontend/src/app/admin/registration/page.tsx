"use client";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Dialog } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Mail, Shield, CheckCircle2, Loader2 } from "lucide-react";
import DashboardHero from "@/components/DashboardHero";
import { cn } from "@/lib/utils";
import { useOrganization } from "@/context/OrganizationContext";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";

export default function RegistrationPage() {
  const { activeOrganization } = useOrganization();
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "" ,
    email: "",
    role: "user",
    department: "it"
  });
 
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrganization) {
        toast.error("Please select an active organization context first.");
        return;
    }
 
    setIsLoading(true);
    try {
        await axiosInstance.post("/users", {
            name: `${formData.firstName} ${formData.lastName}`.trim(),
            email: formData.email,
            role: formData.role,
            password: "Password1!", 
            organization_id: activeOrganization.id,
            department: formData.department
        });
        
        setSubmitted(true);
        toast.success("Account Provisioned", {
            description: `${formData.firstName} ${formData.lastName} has been added to ${activeOrganization?.name}.`
        });
        
        setTimeout(() => {
            setSubmitted(false);
            setFormData({ firstName: "", lastName: "", email: "", role: "user", department: "it" });
        }, 3000);
    } catch (error: any) {
        console.error(error);
        toast.error(error.response?.data?.message || "Registration failed.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="space-y-12 pb-20">
      <DashboardHero 
        title="CM Registration" 
        description="Create new user accounts and assign roles." 
      />

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
             <Card className="border-none shadow-sm bg-primary text-primary-foreground overflow-hidden rounded-xl">
                <CardContent className="p-8 relative">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-white opacity-5 rounded-bl-full"></div>
                   <div className="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center mb-6 border border-white/10">
                      <Shield size={24} />
                   </div>
                   <h3 className="tracking-tight text-xl mb-3">Role-Based Access</h3>
                   <p className="text-xs opacity-80 leading-relaxed font-medium mb-6">
                      Administrators retain full access to dashboard analytics, settings, and poll deployment. Participants access survey experiences based on organizational mappings.
                   </p>
                   <div className="flex items-center gap-2 text-[13px] font-medium bg-white/5 p-3 rounded-lg border border-white/10">
                      <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]"></div>
                      <span>SYSTEM SECURE ONLINE</span>
                   </div>
                </CardContent>
             </Card>

             <Card className="shadow-sm bg-card rounded-xl overflow-hidden group border">
                <CardHeader className="px-6 py-4">
                    <span className="text-[13px] font-medium text-muted-foreground">Provisioning</span>
                </CardHeader>
                <CardContent className="p-6">
                    <div className="flex items-center gap-3 text-primary mb-4">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                          <UserPlus size={18} />
                        </div>
                        <h4 className="text-xs tracking-tight text-foreground">Instant Matrix</h4>
                    </div>
                    <p className="text-[13px] font-medium text-muted-foreground leading-relaxed mb-4">
                        New participants registered through this console receive encrypted access credentials to their corporate email.
                    </p>
                    <div className="h-1 w-full bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary w-1/3 rounded-full"></div>
                    </div>
                </CardContent>
             </Card>
          </div>

           <div className="lg:col-span-8">
              <Card className="shadow-sm rounded-xl bg-card border">
                  <CardHeader className="px-8 py-6 flex flex-row items-center gap-4">
                      <div className="p-2.5 bg-primary/10 text-primary rounded-lg">
                        <UserPlus size={20} />
                      </div>
                      <div>
                          <CardTitle className="text-lg font-medium tracking-tight">Registration Console</CardTitle>
                          <CardDescription className="text-[13px] font-medium text-primary mt-1 flex items-center gap-2">
                             <CheckCircle2 size={12} /> Targeting {activeOrganization?.name || "Global Cluster"}
                          </CardDescription>
                      </div>
                  </CardHeader>
                  <CardContent className="p-8">
                      <form onSubmit={handleSubmit} className="space-y-8">
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                              <Label className="text-[13px] font-medium text-muted-foreground ml-1">First Name</Label>
                              <Input 
                                placeholder="John" 
                                className="h-11 px-4 rounded-lg bg-muted/30 border-muted focus:bg-background transition-all font-medium text-xs" 
                                required 
                                value={formData.firstName}
                                onChange={e => setFormData({...formData, firstName: e.target.value})}
                              />
                          </div>
                          <div className="space-y-2">
                              <Label className="text-[13px] font-medium text-muted-foreground ml-1">Last Name</Label>
                              <Input 
                                placeholder="Doe" 
                                className="h-11 px-4 rounded-lg bg-muted/30 border-muted focus:bg-background transition-all font-medium text-xs" 
                                required 
                                value={formData.lastName}
                                onChange={e => setFormData({...formData, lastName: e.target.value})}
                              />
                          </div>
                        </div>

                         <div className="space-y-2 group">
                          <Label className="text-[13px] font-medium text-muted-foreground ml-1">Corporate Email Address</Label>
                          <div className="relative">
                              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" size={16} />
                              <Input 
                                type="email" 
                                placeholder="john.doe@orgfitech.com" 
                                className="h-11 pl-10 pr-4 rounded-lg bg-muted/30 border-muted focus:bg-background transition-all font-medium text-xs" 
                                required 
                                value={formData.email}
                                onChange={e => setFormData({...formData, email: e.target.value})}
                              />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <div className="space-y-2">
                              <Label className="text-[13px] font-medium text-muted-foreground ml-1">System Role</Label>
                              <Select value={formData.role} onValueChange={v => v && setFormData({...formData, role: v})}>
                                <SelectTrigger className="h-11 px-4 rounded-lg bg-muted/30 border-muted focus:bg-background transition-all text-xs font-medium shadow-none">
                                    <SelectValue placeholder="Select Role" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg shadow-xl bg-card">
                                    <SelectItem value="admin" className="font-medium py-2">Administrator</SelectItem>
                                    <SelectItem value="analyst" className="font-medium py-2">Analyst</SelectItem>
                                    <SelectItem value="user" className="font-medium py-2">Participant (User)</SelectItem>
                                </SelectContent>
                              </Select>
                          </div>
                           <div className="space-y-2">
                              <Label className="text-[13px] font-medium text-muted-foreground ml-1">Department Assignment</Label>
                              <Select value={formData.department} onValueChange={v => v && setFormData({...formData, department: v})}>
                                <SelectTrigger className="h-11 px-4 rounded-lg bg-muted/30 border-muted focus:bg-background transition-all text-xs font-medium shadow-none">
                                    <SelectValue placeholder="Select Dept" />
                                </SelectTrigger>
                                <SelectContent className="rounded-lg shadow-xl bg-card">
                                    <SelectItem value="it" className="font-medium py-2">Information Technology</SelectItem>
                                    <SelectItem value="hr" className="font-medium py-2">Human Resources</SelectItem>
                                    <SelectItem value="ops" className="font-medium py-2">Operations</SelectItem>
                                    <SelectItem value="marketing" className="font-medium py-2">Marketing</SelectItem>
                                    <SelectItem value="finance" className="font-medium py-2">Finance</SelectItem>
                                </SelectContent>
                              </Select>
                          </div>
                        </div>

                         <div className="pt-6 border-t flex justify-end">
                          <Button 
                              type="submit" 
                              disabled={submitted || isLoading}
                              className={cn(
                                "h-11 px-8 rounded-lg    text-[13px] font-medium shadow-sm transition-all flex items-center gap-2",
                                submitted ? "bg-emerald-500 text-white" : "bg-primary text-primary-foreground"
                              )}
                          >
                               {submitted ? (
                                  <>
                                      <CheckCircle2 size={16} /> Credentials Sent
                                  </>
                              ) : isLoading ? (
                                  <>
                                      <Loader2 className="animate-spin" size={16} /> Provisioning...
                                  </>
                              ) : (
                                  <>
                                      Provision Account <UserPlus size={16} />
                                  </>
                              )}
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
