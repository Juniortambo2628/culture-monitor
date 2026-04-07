"use client";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { 
  Globe, 
  ShieldCheck, 
  Bell, 
  BarChart3, 
  Save, 
  RefreshCcw, 
  Mail, 
  MessageSquare, 
  Clock, 
  UserCheck,
  Database,
  Terminal,
  Cpu,
  Layers
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardHero from "@/components/DashboardHero";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("auth_token");
      const res = await fetch("http://localhost:8000/api/settings", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        setSettings(await res.json());
      }
    } catch (e) {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = (group: string, key: string, value: string) => {
    setSettings((prev: any) => ({
      ...prev,
      [group]: prev[group].map((s: any) => s.key === key ? { ...s, value } : s)
    }));
  };

  const saveSettings = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("auth_token");
      const payload: any = {};
      Object.keys(settings).forEach(group => {
        payload[group] = {};
        settings[group].forEach((s: any) => {
           payload[group][s.key] = s.value;
        });
      });

      const res = await fetch("http://localhost:8000/api/settings", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}` 
        },
        body: JSON.stringify({ settings: payload })
      });

      if (res.ok) {
        toast.success("Settings Saved", {
          description: "Your settings have been saved."
        });
      }
    } catch (e) {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
     return (
        <div className="h-[60vh] flex flex-col items-center justify-center gap-6 animate-pulse">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-[13px] font-medium text-muted-foreground">Loading Settings...</p>
        </div>
     );
  }

  const sections = [
    { id: "general", label: "General", icon: Globe, description: "Basic site settings" },
    { id: "communications", label: "Communications", icon: Bell, description: "Email and notification settings" },
    { id: "security", label: "Security", icon: ShieldCheck, description: "Login and password settings" },
    { id: "analytics", label: "Analytics", icon: BarChart3, description: "Chart and data settings" },
  ];

  const getIconForKey = (key: string) => {
    switch(key) {
        case 'support_email': return <Mail size={16} />;
        case 'welcome_message': return <MessageSquare size={16} />;
        case 'session_timeout': 
        case 'heatmap_refresh_rate': return <Clock size={16} />;
        case 'allow_public_registration': return <UserCheck size={16} />;
        default: return <Database size={16} />;
    }
  };

  return (
    <div className="animate-fade-in space-y-12">
      <DashboardHero 
        title="Settings" 
        description="Manage your system and organizational settings." 
      />

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="bg-card border p-2 rounded-xl flex flex-col h-auto space-y-1 shadow-sm w-full">
              {sections.map(section => (
                <TabsTrigger 
                  key={section.id} 
                  value={section.id}
                  className="w-full justify-start gap-4 p-3 rounded-lg text-left font-medium text-muted-foreground data-[state=active:bg-primary data-[state=active:text-primary-foreground transition-all group"
                >
                   <div className="p-2 bg-muted rounded-md group-data-[state=active]:bg-primary-foreground/20 transition-colors">
                      <section.icon size={16} className="group-data-[state=active]:text-primary-foreground" />
                   </div>
                   <div className="flex-1 overflow-hidden">
                      <p className="text-[13px] font-medium leading-none mb-1 group-data-[state=active:text-primary-foreground">{section.label}</p>
                      <p className="text-[13px] font-medium opacity-70 truncate group-data-[state=active:text-primary-foreground/70">{section.description}</p>
                   </div>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>

          <Card className="bg-primary/5 border-primary/10 rounded-xl overflow-hidden shadow-none">
             <CardContent className="p-6">
                <div className="flex items-center gap-3 mb-4">
                   <div className="p-2.5 bg-primary rounded-lg text-primary-foreground"><Terminal size={18}/></div>
                   <div>
                      <p className="text-[13px] font-medium text-primary">Status</p>
                      <p className="text-xs text-foreground">Online</p>
                   </div>
                </div>
                <p className="text-[13px] font-medium text-muted-foreground mb-6 leading-relaxed italic">Changes apply immediately.</p>
                <Button 
                   onClick={saveSettings}
                   disabled={saving}
                   className="w-full h-10 text-[13px] font-medium rounded-lg shadow-sm"
                >
                   {saving ? <RefreshCcw className="animate-spin mr-2" size={14} /> : <Save className="mr-2" size={14} />}
                   Save settings
                </Button>
             </CardContent>
          </Card>
        </div>

        <div className="flex-1">
          <Card className="rounded-xl bg-card overflow-hidden shadow-sm border">
             <div className="p-8 border-b flex items-center justify-between">
                <div>
                  <h3 className="text-xl text-foreground tracking-tight">System Blueprint</h3>
                  <p className="text-muted-foreground text-[13px] font-medium mt-1 flex items-center gap-2">
                    <Cpu size={12}/> System Check: <span className="text-emerald-500">Passed</span>
                  </p>
                </div>
                <div className="p-3 bg-card rounded-lg border shadow-sm"><Layers size={18} className="text-primary" /></div>
             </div>
            
            <div className="p-8 space-y-12">
               {sections.map(section => (
                 <div key={section.id} className="space-y-6 animate-slide-up">
                    <div className="flex items-center gap-4">
                        <span className="text-[13px] font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">{section.label}</span>
                        <div className="h-px bg-border flex-1"></div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                       {settings[section.id]?.map((item: any) => (
                           <div key={item.key} className="space-y-2 group">
                              <div className="flex items-center justify-between px-1">
                                 <label className="text-[13px] font-medium text-muted-foreground group-focus-within:text-primary transition-colors">{item.key.replace(/_/g, ' ')}</label>
                                 <div className="text-muted-foreground/30 group-focus-within:text-primary transition-all">{getIconForKey(item.key)}</div>
                              </div>
                              <Input 
                                 value={item.value} 
                                 onChange={(e) => handleUpdate(section.id, item.key, e.target.value)}
                                 className="h-11 bg-muted/30 border-muted focus:bg-background transition-all font-medium text-xs" 
                              />
                           </div>
                       ))}
                    </div>
                 </div>
               ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
