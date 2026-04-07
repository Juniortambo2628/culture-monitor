"use client";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Download, UserPlus, Filter, Trash2, Loader2, Save, X, LayoutGrid, List, CheckSquare, Square, MoreVertical, ShieldCheck, UserCircle, AlertCircle, Target } from "lucide-react";
import DashboardHero from "@/components/DashboardHero";
import SummaryCards from "@/components/SummaryCards";
import ViewToggle from "@/components/ViewToggle";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axiosInstance from "@/lib/axios";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useOrganization } from "@/context/OrganizationContext";

export default function ParticipantsPage() {
  const { activeOrganization } = useOrganization();
  const [participants, setParticipants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [showAllUsers, setShowAllUsers] = useState(false);
  const [view, setView] = useState<'grid' | 'list'>('list');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [orgs, setOrgs] = useState<any[]>([]);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    role: "user",
    password: "Password1!",
    password_confirmation: "Password1!",
    organization_id: ""
  });

  const [emailStatus, setEmailStatus] = useState<'new' | 'existing' | 'claimed' | null>(null);

  useEffect(() => {
    fetchInitialData();
  }, [activeOrganization, showAllUsers]);

  // Check email availability
  useEffect(() => {
    if (formData.email.length > 5 && formData.email.includes('@')) {
      const timer = setTimeout(async () => {
        try {
          const res = await axiosInstance.get(`/users/check?email=${formData.email}`);
          setEmailStatus(res.data.status); // backend should return 'new', 'existing', or 'claimed'
        } catch (e) {
          console.error("Email check failed", e);
        }
      }, 500);
      return () => clearTimeout(timer);
    } else {
        setEmailStatus(null);
    }
  }, [formData.email]);

  const fetchInitialData = async () => {
    setLoading(true);
    try {
      const query = showAllUsers ? "" : `?organization_id=${activeOrganization?.id}`;
      const [usersRes, orgsRes] = await Promise.all([
        axiosInstance.get(`/users${query}`),
        axiosInstance.get("/organizations")
      ]);
      setParticipants(usersRes.data.data || usersRes.data);
      setOrgs(orgsRes.data);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load directory data.");
    } finally {
      setLoading(false);
    }
  };

  const fetchParticipants = fetchInitialData;

  const handleCreateParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailStatus === 'claimed') {
        toast.error("Process aborted: Email already registered and claimed.");
        return;
    }
    setSubmitting(true);
    try {
      const res = await axiosInstance.post("/users", { ...formData, organization_id: activeOrganization?.id });
      if (res.status === 201) {
          toast.success("New participant provisioned.", { description: `${formData.name} was successfully added to the system.` });
      } else {
          toast.success("Access permissions updated.", { description: `Existing account linked to ${activeOrganization?.name || 'this cluster'}.` });
      }
      setIsAddOpen(false);
      setFormData({ 
        name: "", 
        email: "", 
        role: "user", 
        password: "Password1!", 
        password_confirmation: "Password1!",
        organization_id: activeOrganization?.id.toString() || ""
      });
      setEmailStatus(null);
      fetchParticipants();
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || "Provisioning failure. Check data integrity.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;
    setSubmitting(true);
    try {
      await axiosInstance.put(`/users/${selectedUser.id}`, {
        name: selectedUser.name,
        email: selectedUser.email,
        role: selectedUser.role,
        organization_id: selectedUser.organization_id
      });
      toast.success("Account updated successfully.");
      setIsEditOpen(false);
      fetchParticipants();
    } catch (e: any) {
      console.error(e);
      toast.error(e.response?.data?.message || "Failed to update account.");
    } finally {
      setSubmitting(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === participants.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(participants.map(p => p.id));
    }
  };

  const toggleSelect = (id: number) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Are you sure you want to remove ${selectedIds.length} participants?`)) return;
    try {
        await Promise.all(selectedIds.map(id => axiosInstance.delete(`/users/${id}`)));
        toast.success(`${selectedIds.length} members removed.`);
        setSelectedIds([]);
        fetchParticipants();
    } catch (e) {
        toast.error("Bulk deletion failed.");
    }
  };

  const handleRemoveUser = async (id: number) => {
    if (!confirm("Are you sure you want to permanently remove this participant profile?")) return;
    try {
        await axiosInstance.delete(`/users/${id}`);
        toast.success("Profile removed from the directory.");
        fetchParticipants();
    } catch (e) {
        toast.error("Failed to remove profile.");
    }
  };

  const participantStats = [
    { title: "Network Capacity", value: participants.length, icon: UserPlus, description: "Total registered in current scope", variant: 'teal' as const },
    { title: "System Admins", value: participants.filter(p => p.role === 'admin').length, icon: ShieldCheck, description: "Privileged access accounts", variant: 'amber' as const },
    { title: "Unassigned Assets", value: participants.filter(p => !p.organization_id).length, icon: AlertCircle, description: "Members without cluster mapping", variant: 'rose' as const },
    { title: "Deployment Rate", value: participants.length > 0 ? Math.round((participants.filter(p => p.organization_id).length / participants.length) * 100) + "%" : "0%", icon: Target, description: "Organization mapping efficiency", variant: 'default' as const }
  ];

  return (
    <div className="animate-fade-in space-y-10">
      <DashboardHero 
        title="People & Directory" 
        description="Strategic management of human assets and organizational clusters." 
      />

      <SummaryCards cards={participantStats} />

      <div className="flex flex-col md:flex-row items-center justify-between gap-6 -mt-6">
        <div className="flex items-center gap-3">
             <ViewToggle view={view} onViewChange={setView} />
             {selectedIds.length > 0 && (
                 <div className="flex items-center gap-2 animate-in slide-in-from-left-4 fade-in duration-300">
                     <span className="text-[11px] font-bold text-primary uppercase bg-primary/10 px-3 py-1.5 rounded-lg border border-primary/20">
                         {selectedIds.length} Selected
                     </span>
                     <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleBulkDelete}
                        className="h-9 px-4 text-destructive hover:bg-destructive/10 rounded-lg text-[11px] font-bold uppercase tracking-tight"
                     >
                        <Trash2 size={14} className="mr-2" /> Batch Remove
                     </Button>
                 </div>
             )}
        </div>
        <div className="flex items-center gap-3">
            <Button variant="outline" className="h-10 px-6 rounded-lg flex items-center gap-2 text-[13px] font-medium shadow-sm">
            <Download size={14} /> Export Data
            </Button>
            <Button onClick={() => setIsAddOpen(true)} className="h-10 px-6 rounded-lg flex items-center gap-2 text-[13px] font-medium shadow-lg shadow-primary/10 transition-all hover:scale-105 active:scale-95">
            <UserPlus size={14} /> Provision Access
            </Button>
        </div>
      </div>

      <Card className="shadow-sm rounded-xl bg-card overflow-hidden border">
          <CardHeader className="px-8 py-6 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6 flex-1">
                <div className="relative w-full md:w-80 group">
                    <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground/50 group-focus-within:text-primary transition-colors" />
                    <Input 
                        placeholder="Search name, email or cluster..." 
                        className="pl-11 h-11 bg-background border-muted rounded-lg font-medium text-xs shadow-none" 
                    />
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-muted/30 rounded-xl border border-muted/50">
                    <Label className="text-[11px] font-bold text-muted-foreground uppercase opacity-60">Directory Depth</Label>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setShowAllUsers(false)}
                            className={cn("text-[11px] font-bold px-3 py-1 rounded-md transition-all", !showAllUsers ? "bg-primary text-white shadow-sm" : "hover:text-primary")}
                        >
                            {activeOrganization?.name || "Cluster"}
                        </button>
                        <button 
                            onClick={() => setShowAllUsers(true)}
                            className={cn("text-[11px] font-bold px-3 py-1 rounded-md transition-all", showAllUsers ? "bg-primary text-white shadow-sm" : "hover:text-primary")}
                        >
                            Global
                        </button>
                    </div>
                </div>
            </div>
            <Button variant="ghost" className="text-muted-foreground text-[13px] font-medium flex items-center gap-2 h-11 px-6 rounded-lg">
               <Filter size={16} /> Advanced Filters
            </Button>
         </CardHeader>
         <CardContent className={cn("p-0 min-h-[300px]", view === 'grid' && "p-8")}>
             {loading ? (
                 <div className="flex flex-col items-center justify-center p-20 gap-4">
                    <Loader2 className="animate-spin text-primary" size={32} />
                    <span className="text-[13px] font-medium text-muted-foreground">Synthesizing Directory...</span>
                 </div>
             ) : participants.length === 0 ? (
                 <div className="flex flex-col items-center justify-center p-20 gap-4 text-center">
                    <UserCircle className="text-muted/50" size={48} />
                    <p className="text-sm font-medium text-muted-foreground italic">No mapping discovery in current scope.</p>
                 </div>
             ) : view === 'list' ? (
                <table className="w-full text-xs text-left whitespace-nowrap">
                <thead className="text-[13px] font-medium text-muted-foreground bg-muted/40 border-b uppercase tracking-tighter">
                    <tr>
                        <th className="px-8 py-4 w-10">
                            <button onClick={toggleSelectAll} className="p-1 rounded-md hover:bg-muted transition-colors">
                                {selectedIds.length === participants.length ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} />}
                            </button>
                        </th>
                        <th className="px-8 py-4 hover:text-primary cursor-pointer transition-colors">Identity Profile</th>
                        <th className="px-8 py-4">Organizational Cluster</th>
                        <th className="px-8 py-4">Corporate Role</th>
                        <th className="px-8 py-4 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-muted/30">
                    {participants.map((p) => (
                        <tr key={p.id} className={cn("hover:bg-muted/20 transition-all group", selectedIds.includes(p.id) && "bg-primary/[0.02]")}>
                            <td className="px-8 py-4">
                                <button onClick={() => toggleSelect(p.id)} className="p-1 rounded-md hover:bg-muted transition-colors">
                                    {selectedIds.includes(p.id) ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} />}
                                </button>
                            </td>
                            <td className="px-8 py-4">
                                <div className="flex flex-col">
                                    <span className="text-[13px] font-bold text-foreground group-hover:text-primary transition-colors">{p.name}</span>
                                    <span className="text-[11px] font-medium text-muted-foreground/60">{p.email}</span>
                                </div>
                            </td>
                            <td className="px-8 py-4">
                               {p.organization ? (
                                   <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/[0.08] text-primary border border-primary/10 rounded-lg font-bold text-[10px] uppercase tracking-wide">
                                       {p.organization.name}
                                   </div>
                               ) : (
                                   <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted/50 text-muted-foreground/60 border border-muted rounded-lg font-bold text-[10px] uppercase tracking-wide">
                                       Unassigned
                                   </div>
                               )}
                            </td>
                            <td className="px-8 py-4">
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-muted/30 rounded-lg border border-muted/50 text-[11px] font-bold text-muted-foreground uppercase opacity-80">
                                    {p.role === 'admin' ? <ShieldCheck size={12} className="text-amber-500" /> : <UserCircle size={12} />}
                                    {p.role}
                                </div>
                            </td>
                            <td className="px-8 py-4 text-right">
                               <div className="flex items-center justify-end gap-1">
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        onClick={() => {
                                            setSelectedUser({...p, organization_id: p.organization_id?.toString() || ""});
                                            setIsEditOpen(true);
                                        }}
                                        className="h-9 w-9 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                    >
                                        <Save size={14} />
                                    </Button>
                                     <Button variant="ghost" size="icon" onClick={() => handleRemoveUser(p.id)} className="h-9 w-9 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all">
                                         <Trash2 size={14} />
                                     </Button>
                               </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
                </table>
             ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {participants.map((p) => (
                        <Card key={p.id} className={cn(
                            "relative overflow-hidden group hover:shadow-xl transition-all border rounded-2xl p-6",
                            selectedIds.includes(p.id) ? "border-primary bg-primary/[0.02]" : "hover:border-primary/30"
                        )}>
                            <button 
                                onClick={() => toggleSelect(p.id)} 
                                className="absolute top-4 left-4 z-10 p-1.5 rounded-lg bg-card border shadow-sm transition-all hover:scale-110"
                            >
                                {selectedIds.includes(p.id) ? <CheckSquare size={16} className="text-primary" /> : <Square size={16} className="text-muted-foreground/40" />}
                            </button>

                            <div className="flex flex-col items-center text-center space-y-4 pt-4">
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary/20 to-primary/5 flex items-center justify-center text-primary relative">
                                    <UserCircle size={32} />
                                    {p.role === 'admin' && (
                                        <div className="absolute -top-1 -right-1 bg-amber-500 text-white p-1 rounded-lg shadow-lg">
                                            <ShieldCheck size={12} />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className="text-sm font-bold text-foreground leading-tight">{p.name}</h4>
                                    <p className="text-[11px] font-medium text-muted-foreground/60 line-clamp-1">{p.email}</p>
                                </div>
                                
                                <div className="w-full pt-2 flex flex-col gap-2">
                                    <div className="px-3 py-2 bg-muted/30 rounded-xl border border-muted/50 text-[10px] font-bold text-muted-foreground uppercase tracking-wider line-clamp-1">
                                        {p.organization?.name || "Unassigned"}
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 pt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Button 
                                        variant="outline" 
                                        size="sm" 
                                        onClick={() => {
                                            setSelectedUser({...p, organization_id: p.organization_id?.toString() || ""});
                                            setIsEditOpen(true);
                                        }}
                                        className="h-9 px-4 rounded-xl text-[11px] font-bold text-primary border-primary/20 hover:bg-primary/5"
                                    >
                                        Configure
                                    </Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                         onClick={() => handleRemoveUser(p.id)}
                                        className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                                    >
                                        <Trash2 size={14} />
                                    </Button>
                                </div>
                            </div>
                        </Card>
                    ))}
                </div>
             )}
         </CardContent>
         <div className="border-t px-8 py-6 flex flex-col md:flex-row justify-between items-center gap-6 text-[13px] font-medium text-muted-foreground bg-muted/20">
            <span className="opacity-80">Displaying <span className="text-primary">{participants.length}</span> Total Entries</span>
            <div className="flex gap-2">
               <Button variant="outline" size="sm" className="h-9 px-4 text-[13px] font-medium rounded-lg" disabled>Previous</Button>
               <Button variant="outline" size="sm" className="h-9 px-4 text-[13px] font-medium rounded-lg">Next Page</Button>
            </div>
         </div>
      </Card>

      {/* Add Participant Dialog */}
      <Dialog 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)}
        title="Account Provisioning"
        description="Register a new system participant"
        maxWidth="2xl"
      >
        <form onSubmit={handleCreateParticipant} className="space-y-6 pt-2">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">Full Name</Label>
                    <Input 
                       value={formData.name}
                       onChange={e => setFormData({...formData, name: e.target.value})}
                       placeholder="John Doe" 
                       className="h-11 rounded-lg bg-muted/30 border-muted font-medium text-xs transition-all focus:bg-background" 
                       required 
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">Email Address</Label>
                    <Input 
                       type="email"
                       value={formData.email}
                       onChange={e => setFormData({...formData, email: e.target.value})}
                       placeholder="employee@org.com" 
                       className="h-11 rounded-lg bg-muted/30 border-muted font-medium text-xs transition-all focus:bg-background" 
                       required 
                    />
                    {emailStatus === 'new' && <p className="text-[10px] font-bold text-primary animate-pulse flex items-center gap-1.5"><CheckSquare size={10} /> Brand new identity discovered</p>}
                    {emailStatus === 'existing' && <p className="text-[10px] font-bold text-amber-500 flex items-center gap-1.5"><AlertCircle size={10} /> Found unclaimed provisioned account</p>}
                    {emailStatus === 'claimed' && <p className="text-[10px] font-bold text-destructive flex items-center gap-1.5"><X size={10} /> Identity already claimed & registered</p>}
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-[13px] font-medium text-muted-foreground">System Role</Label>
                <Select value={formData.role} onValueChange={v => { if (v) setFormData({...formData, role: v}) }}>
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
                   onClick={() => setIsAddOpen(false)}
                   className="h-10 px-6 rounded-lg text-[13px] font-medium text-muted-foreground hover:bg-muted"
                >
                   Cancel
                </Button>
                <Button 
                   type="submit" 
                   disabled={submitting}
                   className="h-10 px-8 rounded-lg text-[13px] font-medium shadow-lg shadow-primary/10 flex items-center gap-2"
                >
                   {submitting ? <Loader2 className="animate-spin" size={14} /> : <Save size={14} />}
                   Provision Access
                </Button>
            </div>
        </form>
      </Dialog>

      {/* Edit Participant Dialog */}
      <Dialog 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)}
        title="Account Configuration"
        description="Update participant settings and cluster assignment"
        maxWidth="2xl"
      >
        <form onSubmit={handleUpdateParticipant} className="space-y-6 pt-2">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">Full Name</Label>
                    <Input 
                       value={selectedUser?.name || ""}
                       onChange={e => setSelectedUser({...selectedUser, name: e.target.value})}
                       className="h-11 rounded-lg bg-muted/30 border-muted font-medium text-xs transition-all focus:bg-background" 
                       required 
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">Email Address</Label>
                    <Input 
                       value={selectedUser?.email || ""}
                       onChange={e => setSelectedUser({...selectedUser, email: e.target.value})}
                       className="h-11 rounded-lg bg-muted/30 border-muted font-medium text-xs transition-all focus:bg-background" 
                       required 
                    />
                </div>
                <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">Corporate Role</Label>
                    <Select value={selectedUser?.role} onValueChange={v => setSelectedUser({...selectedUser, role: v})}>
                        <SelectTrigger className="h-11 rounded-lg bg-muted/30 border-muted font-medium text-xs">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="admin">Administrator</SelectItem>
                            <SelectItem value="user">Participant (User)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <div className="space-y-2">
                    <Label className="text-[13px] font-medium text-muted-foreground">Organizational Assignment</Label>
                    <Select value={selectedUser?.organization_id} onValueChange={v => setSelectedUser({...selectedUser, organization_id: v})}>
                        <SelectTrigger className="h-11 rounded-lg bg-muted/30 border-muted font-medium text-xs">
                            <SelectValue placeholder="Unassigned / Global" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="">Unassigned (Global Access)</SelectItem>
                            {orgs.map(org => (
                                <SelectItem key={org.id} value={org.id.toString()}>{org.name}</SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div className="pt-6 border-t flex justify-end gap-3">
                <Button 
                   type="button" 
                   variant="ghost" 
                   onClick={() => setIsEditOpen(false)}
                   className="h-10 px-6 rounded-lg text-[13px] font-medium text-muted-foreground"
                >
                   Cancel
                </Button>
                <Button 
                   type="submit" 
                   disabled={submitting}
                   className="h-10 px-8 rounded-lg text-[13px] font-medium shadow-lg"
                >
                   {submitting ? <Loader2 className="animate-spin" size={14} /> : "Save Changes"}
                </Button>
            </div>
        </form>
      </Dialog>
    </div>
  );
}
