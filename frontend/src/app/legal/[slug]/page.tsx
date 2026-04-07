import { notFound } from "next/navigation";
import { ArrowLeft, Scale, ShieldAlert, FileText, Cookie } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const legalConfig: Record<string, { title: string; description: string; icon: any; status: string; features: string[] }> = {
  "privacy": {
    title: "Privacy Policy",
    description: "Strict data sovereignty guidelines concerning how we encrypt, store, and process your organizational telemetry.",
    icon: ShieldAlert,
    status: "Last Updated V2.4",
    features: ["End-to-End Encryption", "GDPR Compliant", "Zero-Knowledge Architecture"]
  },
  "terms": {
    title: "Terms of Service",
    description: "The contractual agreements and licensing parameters guiding the usage of the Culture Monitor platform.",
    icon: FileText,
    status: "Revision 4.1",
    features: ["Enterprise SLA", "API Rate Limits", "Fair Usage Standards"]
  },
  "legal": {
    title: "Legal & Compliance",
    description: "Comprehensive regulatory adherence outlines and formal company operating disclosures.",
    icon: Scale,
    status: "Active Disclosures",
    features: ["SOC 2 Type II", "ISO 27001", "Corporate Governance"]
  },
  "cookies": {
    title: "Cookie Policy",
    description: "Details regarding telemetry trackers, session tokens, and local cache mechanics required for platform stability.",
    icon: Cookie,
    status: "Strictly Necessary Model",
    features: ["Consent Auditing", "Session Only Modes", "Third-Party Exclusion"]
  }
};

export default async function DynamicLegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const config = legalConfig[slug];

  if (!config) {
    notFound();
  }

  const { title, description, icon: Icon, status, features } = config;

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex flex-col pt-32 pb-20">
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-slate-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <div className="max-w-4xl mx-auto px-6 lg:px-12 relative z-10 w-full mt-10">
        <Link href="/">
             <Button variant="ghost" className="mb-12 h-10 px-0 hover:bg-transparent text-[#2d5a5a dark:text-teal-400 text-[13px font-medium flex items-center gap-2">
                <ArrowLeft size={16} /> Return to Home
             </Button>
        </Link>
        <div className="animate-fade-in flex flex-col items-start">
            <div className="h-16 w-16 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[20px] flex items-center justify-center mb-8 shadow-sm">
                <Icon size={28} className="text-slate-700 dark:text-slate-300" />
            </div>
            <div className="flex items-center gap-3 mb-6">
                <div className="w-2 h-2 rounded-full bg-slate-400"></div>
                <span className="text-[13px font-medium text-slate-500 dark:text-slate-400">{status}</span>
            </div>
            <h1 className="text-4xl lg:text-5xl text-slate-900 dark:text-white tracking-tighter mb-6 leading-tight">
                {title}
            </h1>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed mb-12">
                {description}
            </p>

            <div className="w-full h-px bg-slate-200 dark:bg-slate-800 mb-12"></div>

            <div className="flex flex-wrap gap-4 mb-16">
                {features.map((feature, i) => (
                    <span key={i} className="bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-2.5 rounded-full text-[13px font-medium text-slate-700 dark:text-slate-300">
                        {feature}
                    </span>
                ))}
            </div>

            <div className="prose dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 text-sm leading-loose">
               <p className="mb-6 font-medium">
                  We are currently organizing and formatting the detailed documentation for this section. The comprehensive {title.toLowerCase()} guidelines will be available for review shortly.
               </p>
               <p className="mb-6 font-medium">
                  If you require immediate access to these binding agreements or have regulatory concerns, please contact our administrative systems directly. All data remains encrypted under zero-knowledge architecture protocols during this transitional phase.
               </p>
            </div>
        </div>
      </div>
    </div>
  );
}
