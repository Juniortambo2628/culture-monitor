"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Globe, Plus, Building2, Terminal, MoreVertical, Trash2, Loader2, Edit3, HeartPulse, UserPlus, CheckSquare, AlertCircle, X, Save } from "lucide-react";
import DashboardHero from "@/components/DashboardHero";
import axiosInstance from "@/lib/axios";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Dialog } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function MyOrganizationsPage() {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newOrgName, setNewOrgName] = useState("");
  const [newOrgIndustry, setNewOrgIndustry] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isProvisionOpen, setIsProvisionOpen] = useState(false);
  const [provisionData, setProvisionData] = useState({
    name: "",
    email: "",
    role: "user",
    organization_id: ""
  });
  const [emailStatus, setEmailStatus] = useState<'new' | 'existing' | 'claimed' | null>(null);
  const [submittingProvision, setSubmittingProvision] = useState(false);

  // Check email availability
  useEffect(() => {
    if (provisionData.email.length > 5 && provisionData.email.includes('@')) {
      const timer = setTimeout(async () => {
        try {
          const res = await axiosInstance.get(`/users/check?email=${provisionData.email}`);
          setEmailStatus(res.data.status);
        } catch (e) {
          console.error("Email check failed", e);
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
        setEmailStatus(null);
    }
  }, [provisionData.email]);

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/organizations");
      setOrganizations(res.data);
    } catch (e) {
      console.error("Failed to load organizations");
    } finally {
      setLoading(false);
    }
  };

  const handleAddOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await axiosInstance.post("/organizations", { name: newOrgName, industry: newOrgIndustry });
      fetchOrganizations();
      setIsModalOpen(false);
      setNewOrgName("");
      setNewOrgIndustry("");
    } catch (error) {
      console.error("Error creating org", error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this organization and all its data?")) return;
    try {
      await axiosInstance.delete(`/organizations/${id}`);
      fetchOrganizations();
    } catch (e) { console.error(e); }
  };

  const handleProvision = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailStatus === 'claimed') {
        toast.error("Process aborted: Email already registered.");
        return;
    }
    setSubmittingProvision(true);
    try {
      const res = await axiosInstance.post("/users", { 
        ...provisionData, 
        password: "Password1!", 
        password_confirmation: "Password1!" 
      });
      if (res.status === 201) {
          toast.success("New participant provisioned.");
      } else {
          toast.success("Access updated for existing user.");
      }
      setIsProvisionOpen(false);
      setProvisionData({ name: "", email: "", role: "user", organization_id: "" });
    } catch (e: any) {
      toast.error(e.response?.data?.message || "Provisioning failure.");
    } finally {
      setSubmittingProvision(false);
    }
  };

  return (
    <div className="animate-fade-in space-y-12 pb-20">
      <DashboardHero 
        title="My Organizations" 
        description="Manage your organizations and their settings."
      />

      <div className="flex justify-between items-end gap-6 mb-8">
        <div>
          <h3 className="text-xl text-foreground font-medium tracking-tight">Active Organizations</h3>
          <p className="text-[13px] text-muted-foreground mt-1">Organizations currently in the system.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="h-11 px-6 rounded-xl bg-primary text-primary-foreground text-[13px] font-medium shadow-lg shadow-primary/20">
          <Plus size={16} className="mr-2" /> Register Organization
        </Button>
      </div>

      {loading ? (
        <div className="h-[40vh] flex flex-col items-center justify-center gap-6 animate-pulse">
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
          <p className="text-[13px] font-medium text-muted-foreground">Loading organizations...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {organizations.map((org) => (
            <Card key={org.id} className="shadow-sm rounded-xl overflow-hidden bg-card border group transition-all hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
              <div className="h-32 bg-muted/30 border-b relative flex items-center justify-center overflow-hidden">
                <Globe className="absolute text-muted-foreground/5" size={140} strokeWidth={1} style={{ top: '-10px', right: '-20px' }} />
                <div className="w-14 h-14 bg-background border shadow-sm rounded-2xl flex items-center justify-center text-primary relative z-10 group-hover:scale-110 transition-transform">
                  <Building2 size={24} />
                </div>
              </div>
              <CardContent className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h4 className="text-base text-foreground font-bold tracking-tight leading-none">{org.name}</h4>
                    <span className="text-[12px] font-medium text-muted-foreground mt-1 inline-block uppercase tracking-wider">{org.industry || "General Enterprise"}</span>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger className="h-8 w-8 inline-flex items-center justify-center rounded-md text-muted-foreground hover:bg-muted border border-transparent hover:border-border mt-[-4px] cursor-pointer">

                      <MoreVertical size={14} />

                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 bg-card border rounded-xl shadow-xl p-2">
                        <DropdownMenuItem 
                            onClick={() => {
                                setProvisionData(prev => ({ ...prev, organization_id: org.id.toString() }));
                                setIsProvisionOpen(true);
                            }}
                            className="text-[13px] font-medium py-2 px-3 rounded-lg cursor-pointer flex items-center gap-2"
                        >
                            <UserPlus size={14} /> Provision Participants
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-[13px] font-medium py-2 px-3 rounded-lg cursor-pointer flex items-center gap-2">
                            <Edit3 size={14} /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="my-1 opacity-50" />
                        <DropdownMenuItem onClick={() => handleDelete(org.id)} className="text-[13px] font-medium text-rose-500 focus:bg-rose-500/10 focus:text-rose-600 py-2 px-3 rounded-lg cursor-pointer flex items-center gap-2">
                            <Trash2 size={14} /> Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-muted-foreground">ID</span>
                    <span className="font-medium text-foreground bg-muted/50 px-2 py-0.5 rounded-md font-mono">{org.id.toString().padStart(6, '0')}</span>
                  </div>
                  <div className="flex items-center justify-between text-[13px]">
                    <span className="text-muted-foreground">Status</span>
                    <span className="font-medium text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-md flex items-center gap-1.5 line-clamp-1">
                      <HeartPulse size={12} /> Active
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Organization" description="Add a new organization to the system." maxWidth="md">
        <form onSubmit={handleAddOrg} className="space-y-8 mt-4">
          <div className="space-y-3 group">
              <label className="text-[13px] font-medium text-muted-foreground/60 ml-1">Organization Name</label>
              <div className="relative">
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-primary transition-colors" size={18} />
                  <Input 
                      placeholder="e.g. Apex Biotech Division" 
                      className="h-14 pl-12 pr-6 rounded-lg bg-muted/20 border-muted text-[13px] font-medium focus:bg-background transition-all placeholder:text-muted-foreground/30"
                      value={newOrgName}
                      onChange={(e) => setNewOrgName(e.target.value)}
                      required
                  />
              </div>
          </div>
          <div className="space-y-3 group">
              <label className="text-[13px] font-medium text-muted-foreground/60 ml-1">Industry Sector</label>
              <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/30 group-focus-within:text-primary transition-colors" size={18} />
                  <Input 
                      placeholder="e.g. Healthcare, Technology, etc." 
                      className="h-14 pl-12 pr-6 rounded-lg bg-muted/20 border-muted text-[13px] font-medium focus:bg-background transition-all placeholder:text-muted-foreground/30"
                      value={newOrgIndustry}
                      onChange={(e) => setNewOrgIndustry(e.target.value)}
                  />
              </div>
          </div>
          <div className="flex gap-4 pt-4">
              <Button type="button" variant="ghost" className="flex-1 h-14 rounded-lg text-[13px] font-medium text-muted-foreground" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button type="submit" disabled={isSaving} className="flex-[2] h-14 rounded-lg text-[13px] font-medium bg-primary text-primary-foreground shadow-lg shadow-primary/15 transition-all outline-none">
                  {isSaving ? <Loader2 className="animate-spin" size={14} /> : "Add Organization"}
              </Button>
          </div>
        </form>
      </Dialog>
      {/* Provisioning Dialog */}
      <Dialog 
        isOpen={isProvisionOpen} 
        onClose={() => setIsProvisionOpen(false)}
        title="Quick Account Provisioning"
        description="Register a new member to this organization."
        maxWidth="2xl"
      >
        <form onSubmit={handleProvision} className="space-y-6 pt-2">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">Full Name</Label>
                    <Input 
                       value={provisionData.name}
                       onChange={e => setProvisionData({...provisionData, name: e.target.value})}
                       placeholder="Member Name" 
                       className="h-11 rounded-lg bg-muted/30 border-muted font-medium text-xs transition-all focus:bg-background" 
                       required 
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">Email Address</Label>
                    <Input 
                       type="email"
                       value={provisionData.email}
                       onChange={e => setProvisionData({...provisionData, email: e.target.value})}
                       placeholder="email@example.com" 
                       className="h-11 rounded-lg bg-muted/30 border-muted font-medium text-xs transition-all focus:bg-background" 
                       required 
                    />
                    {emailStatus === 'new' && <p className="text-[10px] font-bold text-primary animate-pulse flex items-center gap-1.5"><CheckSquare size={10} /> New Identity Detected</p>}
                    {emailStatus === 'existing' && <p className="text-[10px] font-bold text-amber-500 flex items-center gap-1.5"><AlertCircle size={10} /> Unclaimed Account Found</p>}
                    {emailStatus === 'claimed' && <p className="text-[10px] font-bold text-destructive flex items-center gap-1.5"><X size={10} /> Already Registered</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[13px] font-medium text-muted-foreground">System Role</Label>
                <Select value={provisionData.role} onValueChange={v => { if (v) setProvisionData({...provisionData, role: v}) }}>
                    <SelectTrigger className="h-11 rounded-lg bg-muted/30 border-muted font-medium text-xs shadow-none">
                        <SelectValue placeholder="Select Role" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="admin" className="font-medium">Administrator</SelectItem>
                        <SelectItem value="user" className="font-medium">Participant (User)</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="pt-6 border-t flex justify-end gap-3">
                <Button 
                   type="button" 
                   variant="ghost" 
                   onClick={() => setIsProvisionOpen(false)}
                   className="h-10 px-6 rounded-lg text-[13px] font-medium text-muted-foreground"
                >
                   Cancel
                </Button>
                <Button 
                   type="submit" 
                   disabled={submittingProvision}
                   className="h-10 px-8 rounded-lg text-[13px] font-medium shadow-lg"
                >
                   {submittingProvision ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} className="mr-2" />}
                   Finalize Provisioning
                </Button>
            </div>
        </form>
      </Dialog>
    </div>
  );
}
