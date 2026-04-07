"use client";
import { Button } from "@/components/ui/button";
import { Headphones, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="min-h-[85vh] bg-primary text-primary-foreground rounded-xl p-12 lg:p-20 shadow-2xl relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        <h1 className="text-6xl lg:text-8xl font-medium tracking-tight mb-10 opacity-20 select-none ]">WELCOME</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 leading-relaxed font-medium">
          <div className="space-y-8">
            <p className="text-xl font-medium tracking-tight border-b border-primary-foreground/10 pb-4">
              WELCOME TO YOUR CUSTOMIZABLE Culture Monitor™ (CM™) WEBSITE.
            </p>
            <p className="text-sm font-medium leading-relaxed">
              PLEASE ENSURE THEIR IS A CLEAR UNDERSTANDING OF WHAT YOUR PREFERRED OPERATING STYLE OR CULTURE IS BEFORE CUSTOMIZING YOUR CM™.
            </p>
            <p className="text-[13px] leading-relaxed opacity-90">
              In the event, further effort is required to capture an acceptable characterization of your organization's desired culture we have provided the names of some of OrgFitech's Trusted Partners to augment internal capability with this task. If you have any questions, please don't hesitate to contact <a href="mailto:Support@orgfitech.com" className="font-medium hover:underline">Support@orgfitech.com</a>.
            </p>
            <p className="text-[13px] text-primary-foreground leading-relaxed border-t border-primary-foreground/10 pt-6">
              ONCE YOU ARE READY TO BEGIN, YOU ALSO MIGHT FIND IT HELPFUL TO READ THE USER GUIDE BEFORE PROCEEDING.
            </p>
            <p className="text-[13px] font-medium opacity-80 leading-relaxed">
              THERE ARE ONLY TWO PHASES FOR CULTURE SHAPING: 1. DEVELOPING AN OCM™ ORGANIZATIONAL MODEL WHICH INCLUDES BASIC INFORMATION, SEGMENT ANALYSIS INFO AND WORKFORCE DATA ; 2. THAN ESTABLISHING CULTURE SHAPING PROFILES WITH CRITICAL CULTURE FACTORS, QUESTIONS AND
            </p>
          </div>

          <div className="space-y-8 text-[14px]">
            <p className="text-lg tracking-tight italic opacity-60">We like to start with the end in mind.</p>
            <p className="leading-relaxed">
              So, a look in the first tab, <span className="font-medium underline">Overall Culture Monitor™</span>, on the Dashboard before you begin will help give you a sense of what the tool will look like once completed. We have put in some samples to create your first look. We have included a complete organization profile and a sample completed poll that was completed using that profile.
            </p>
            <p className="leading-relaxed">
              The sample represents a realistic visual of what the results of various polls can look like.
            </p>
            <p className="leading-relaxed opacity-90">
              Once you have completed your profile and polled the the state of culture evolution with at least one department or designated group, the Dashboard will change from the Sample Version to the active version with the associated polling to be undertaken to ascertain the state of ongoing culture evolution checks.
            </p>
            <p className="leading-relaxed opacity-90 transition-all hover:opacity-100">
              Over time, consideration may be given or circumstance may require an alteration to the culture profile. If and when this happens your previous culture profile will continue to be saved as "V1" and your new profile will be "V2" and so on. You will be
            </p>
            <div className="pt-10">
               <Link href="/admin">
                  <Button variant="secondary" className="px-12 h-14 rounded-xl shadow-xl text-base transition-all hover:scale-105 active:scale-95 group">
                    Enter Dashboard <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
                  </Button>
               </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Assets */}
      <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-primary-foreground/5 blur-[120px] rounded-full"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-background/10 blur-[120px] rounded-full"></div>
    </div>
  );
}
