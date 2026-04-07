import { notFound } from "next/navigation";
import { ArrowLeft, Cpu, ShieldCheck, Database, Globe, Layers, Zap, Hexagon, TerminalSquare } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const pageConfig: Record<string, { title: string; description: string; icon: any; status: string; features: string[] }> = {
  "methodology": {
    title: "Diagnostic Methodology",
    description: "Deep dive into the neural and behavioral algorithms powering the Culture Monitor assessment engines.",
    icon: Hexagon,
    status: "V2 Framework Rolling Out",
    features: ["Psychometric Analysis", "Behavioral Mapping", "Data Normalization"]
  },
  "case-studies": {
    title: "Global Case Studies",
    description: "Real-world impact metrics from Fortune 500 organizations utilizing our predictive cultural models.",
    icon: Globe,
    status: "Compiling Recent Data",
    features: ["Enterprise Scaling", "M&A Diagnostics", "Retention Optimization"]
  },
  "global-benchmarks": {
    title: "Global Industry Benchmarks",
    description: "Calibrate your organizational health against aggregated global intelligence and competitor metrics.",
    icon: Database,
    status: "Q3 Index Compiling",
    features: ["Real-time Aggregation", "Sector Filtering", "Percentile Ranking"]
  },
  "pricing": {
    title: "Enterprise Deployments",
    description: "Scalable licensing and infrastructure pricing for organizations of all operational sizes.",
    icon: Layers,
    status: "New Tiers Incoming",
    features: ["Per-user Licensing", "Volume Discounts", "Custom SLA Support"]
  },
  "user-guide": {
    title: "Systems Interface Guide",
    description: "Comprehensive documentation for administering, deploying, and analyzing platform data.",
    icon: TerminalSquare,
    status: "Documentation Sync in Progress",
    features: ["Administrator Handbook", "Participant FAQ", "Troubleshooting"]
  },
  "developer-api": {
    title: "Developer API & Integrations",
    description: "Connect your enterprise applications directly to our REST and WebSocket event streams.",
    icon: Cpu,
    status: "API v2 Beta",
    features: ["OAuth 2.0 Auth", "Webhooks", "Custom Endpoints"]
  },
  "system-logs": {
    title: "Infrastructure Logs",
    description: "Real-time security auditing and operational system updates from the engineering core.",
    icon: Zap,
    status: "All Systems Operational",
    features: ["Incident Reports", "Latency Checks", "Update Changelog"]
  },
  "whitepapers": {
    title: "Research & Whitepapers",
    description: "Peer-reviewed analysis and forward-looking studies on organizational behavior and data science.",
    icon: ShieldCheck,
    status: "Peer Review Active",
    features: ["Predictive Attrition", "Trust Architectures", "Remote Cohort Efficacy"]
  },
  "community": {
    title: "Architect Community",
    description: "Connect with thousands of culture strategists, HR leaders, and organizational psychologists.",
    icon: Globe,
    status: "Forum Expanding",
    features: ["Strategy Boards", "Template Sharing", "Live Q&A"]
  }
};

export default async function DynamicFooterPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const config = pageConfig[slug];

  // If the slug isn't one of our known generic marketing pages, throw a 404
  // so we don't accidentally swallow actual missing application routes.
  if (!config) {
    notFound();
  }

  const { title, description, icon: Icon, status, features } = config;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center pt-24 pb-20">
      {/* Decorative Orbs */}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-teal-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-5%] w-[600px] h-[600px] bg-blue-500/5 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-5xl mx-auto px-6 lg:px-12 relative z-10 w-full mt-10">
        <div className="mb-10 animate-fade-in text-center sm:text-left flex flex-col items-center sm:items-start">
            <div className="h-20 w-20 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[24px] flex items-center justify-center mb-8 shadow-sm">
                <Icon size={36} className="text-[#2d5a5a] dark:text-teal-400" />
            </div>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse shadow-[0_0_10px_rgba(251,191,36,0.5)]"></div>
                <span className="text-[13px font-medium text-slate-500 dark:text-slate-400">{status}</span>
            </div>
            <h1 className="text-5xl lg:text-7xl text-slate-900 dark:text-white tracking-tighter mb-8 leading-tight">
                {title.split(' ').map((word, i, arr) => 
                   i === arr.length - 1 ? <span key={i} className="text-[#2d5a5a] dark:text-teal-400 block sm:inline">{word}</span> : <span key={i}>{word} </span>
                )}
            </h1>
            <p className="text-lg lg:text-xl font-medium text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-12">
                {description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mb-16 w-full">
                {features.map((feature, i) => (
                    <div key={i} className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 p-6 rounded-3xl shrink-0 group hover:border-[#2d5a5a]/30 transition-all text-center">
                        <span className="text-xs text-[#2d5a5a] dark:text-teal-500 group-hover:text-teal-600 transition-colors">{feature}</span>
                    </div>
                ))}
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 w-full sm:w-auto">
                <Link href="/">
                    <Button className="h-14 px-10 rounded-full bg-[#2d5a5a hover:bg-teal-900 text-white text-[13px font-medium shadow-xl shadow-teal-900/20 transition-all hover:scale-105 active:scale-95 flex items-center gap-3 w-full sm:w-auto">
                        <ArrowLeft size={18} /> Return to Global Network
                    </Button>
                </Link>
                <p className="text-xs font-medium text-slate-400">Environment deploying soon.</p>
            </div>
        </div>
      </div>
    </div>
  );
}
