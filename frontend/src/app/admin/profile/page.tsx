"use client";
import { useEffect, useState } from "react";
import axiosInstance from "@/lib/axios";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Zap, Cog, Lightbulb, Users2, Heart, Loader2, Target } from "lucide-react";
import DashboardHero from "@/components/DashboardHero";
import { cn } from "@/lib/utils";
import { useOrganization } from "@/context/OrganizationContext";

export default function CultureProfilePage() {
  const { activeOrganization } = useOrganization();
  const [factors, setFactors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingFactor, setEditingFactor] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (activeOrganization) {
      fetchFactors();
    }
  }, [activeOrganization]);

  const fetchFactors = async () => {
    setLoading(true);
    try {
      const url = activeOrganization ? `/factors?organization_id=${activeOrganization.id}` : '/factors';
      const res = await axiosInstance.get(url);
      console.log("Factors Loaded:", res.data);
      setFactors(res.data);
    } catch (e) {
      console.error("Failed to fetch factors", e);
    } finally {
      setLoading(false);
    }
  };

  const getIcon = (name: string) => {
    switch (name.toLowerCase()) {
      case 'alignment': return ShieldCheck;
      case 'agility': return Zap;
      case 'execution': return Cog;
      case 'innovation': return Lightbulb;
      case 'collaboration': return Heart;
      case 'trust': return ShieldCheck;
      default: return Target;
    }
  };

  const handleSave = async () => {
    if (!editingFactor) return;
    setIsSaving(true);
    try {
      await axiosInstance.put(`/factors/${editingFactor.id}`, editingFactor);
      toast.success("Factor updated successfully");
      setEditingFactor(null);
      fetchFactors();
    } catch (e) {
      toast.error("Failed to update factor");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-6 animate-pulse">
            <Loader2 className="w-12 h-12 text-primary animate-spin" />
            <p className="text-muted-foreground">Loading profile...</p>
        </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-12 pb-20">
      <DashboardHero 
        title="Culture Shaping Profile" 
        description="View factors for your organization." 
      />

      <div className="flex justify-end -mt-6">
        <Button onClick={fetchFactors} variant="ghost" size="sm" className="text-muted-foreground hover:text-primary gap-2">
            <Loader2 size={14} className={cn(loading && "animate-spin")} /> Force Resynchronization
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {factors.length === 0 ? (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center space-y-6 bg-muted/10 rounded-3xl border border-dashed border-muted">
                <Target className="text-muted-foreground/20" size={60} />
                <div className="space-y-1">
                    <p className="text-sm font-bold text-foreground">Strategic Dimensions Missing</p>
                    <p className="text-xs text-muted-foreground italic">No global or organization-specific factors discovered in current context.</p>
                </div>
                <Button onClick={fetchFactors} variant="outline" className="h-10 px-6 rounded-lg text-xs font-bold border-primary/20 text-primary hover:bg-primary/5">
                    Trigger Manual Discovery
                </Button>
            </div>
        ) : factors.map((factor) => {
          const Icon = getIcon(factor.name);
          return (
            <Card key={factor.id} className="shadow-sm rounded-xl bg-card overflow-hidden transition-all group border border-muted/50 hover:border-primary/50 hover:shadow-md">
              <CardHeader className="flex flex-row items-center justify-between px-8 py-5">
                <span className="text-[13px] font-medium text-muted-foreground/60 leading-none lowercase italic">Factor Analysis</span>
                <div className={cn("p-2.5 rounded-lg transition-transform group-hover:scale-110 shadow-sm bg-primary/10 text-primary")}>
                  <Icon size={20} />
                </div>
              </CardHeader>
              <CardContent className="p-8">
                <h3 className="text-xl text-foreground mb-4 tracking-tighter leading-tight font-medium uppercase">{factor.name}</h3>
                <p className="text-xs text-muted-foreground font-medium mb-8 leading-relaxed italic opacity-80 min-h-[40px]">
                  {factor.description || `Measures the organizational capability to maintain long-term ${factor.name.toLowerCase()} and strategic focus.`}
                </p>
                <div className="flex items-center justify-between pt-6 border-t border-muted/50">
                  <span className="text-[13px] font-medium text-muted-foreground/60">Weight: {factor.weight || '1.0'}</span>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 px-4 text-[13px] font-medium text-primary hover:bg-primary/5 hover:text-primary transition-all rounded-lg"
                    onClick={() => setEditingFactor(factor)}
                  >
                    Edit Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Dialog 
        isOpen={!!editingFactor} 
        onClose={() => setEditingFactor(null)}
        title={`Configure: ${editingFactor?.name}`}
        description={`Targeting ${activeOrganization?.name || "Global Cluster"}`}
      >
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="name">Diagnostic Label</Label>
            <Input 
              id="name" 
              value={editingFactor?.name || ''} 
              onChange={(e) => setEditingFactor({...editingFactor, name: e.target.value})}
              className="h-11 bg-muted/20 border-muted"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="desc">Intelligence Description</Label>
            <textarea 
              id="desc" 
              className="w-full min-h-[120px] bg-muted/20 border border-muted rounded-lg p-4 text-[13px] font-medium outline-none focus:ring-2 focus:ring-primary/20 transition-all italic leading-relaxed"
              value={editingFactor?.description || ''} 
              onChange={(e) => setEditingFactor({...editingFactor, description: e.target.value})}
              placeholder="Provide a benchmark description..."
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="weight">Algorithm Weight</Label>
              <Input 
                id="weight" 
                type="number" 
                step="0.1" 
                min="0.5"
                max="2.0"
                value={editingFactor?.weight || 1.0} 
                onChange={(e) => setEditingFactor({...editingFactor, weight: e.target.value})}
                className="h-11 bg-muted/20 border-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="type">Dimension Class</Label>
              <select 
                id="type"
                className="w-full h-11 bg-muted/20 border border-muted rounded-lg px-4 text-[13px] font-medium outline-none cursor-pointer appearance-none"
                value={editingFactor?.type || 'strategic'}
                onChange={(e) => setEditingFactor({...editingFactor, type: e.target.value})}
              >
                <option value="foundational">Foundational</option>
                <option value="strategic">Strategic</option>
                <option value="operational">Operational</option>
              </select>
            </div>
          </div>

          <div className="pt-6 flex items-center justify-end gap-4 border-t border-muted/50 mt-10">
            <Button variant="ghost" onClick={() => setEditingFactor(null)} className="h-11 px-8 text-[13px] font-medium">
              Cancel
            </Button>
            <Button 
                onClick={handleSave} 
                disabled={isSaving}
                className="h-11 px-10 text-[13px] font-medium shadow-lg shadow-primary/20"
            >
              {isSaving ? "Synchronizing..." : "Synchronize Profile"}
            </Button>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
