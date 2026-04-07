"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { CheckCircle2, AlertCircle, ArrowRight, Loader2 } from "lucide-react";
import axiosInstance from "@/lib/axios";

function SurveyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pollId = searchParams.get("poll_id");
  
  const [poll, setPoll] = useState<any>(null);
  const [userResponse, setUserResponse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<{ [key: number]: number }>({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!pollId) {
        toast.error("Invalid Survey", { description: "No poll was found." });
        router.push("/user");
        return;
    }

    const fetchPoll = async () => {
        try {
            const res = await axiosInstance.get(`/polls/${pollId}`);
            const pollData = res.data.poll;
            const existingResponse = res.data.user_response;
            
            setPoll(pollData);
            setUserResponse(existingResponse);
            
            // Initialize answers
            const initialAnswers: { [key: number]: number } = {};
            if (existingResponse) {
                setAnswers(existingResponse.answers);
                setProgress(100);
            } else {
                pollData.questions.forEach((q: any) => {
                    initialAnswers[q.id] = 5;
                });
                setAnswers(initialAnswers);
            }
        } catch (e) {
            console.error("Failed to fetch poll", e);
            toast.error("Error", { description: "Could not load the survey." });
        } finally {
            setLoading(false);
        }
    };

    fetchPoll();
  }, [pollId, router]);

  const handleUpdate = (val: number, questionId: number) => {
    if (userResponse && !poll?.can_update_responses) return;
    
    const newAnswers = { ...answers, [questionId]: val };
    setAnswers(newAnswers);
    
    // Calculate progress based on answered count
    const total = poll.questions.length;
    const answered = Object.keys(newAnswers).length;
    setProgress((answered / total) * 100);
  };

  const handleSubmit = async () => {
    if (userResponse && !poll?.can_update_responses) {
        router.push("/user");
        return;
    }

    setSubmitting(true);
    try {
      const res = await axiosInstance.post("/responses", {
        poll_id: pollId,
        answers: answers
      });
      
      toast.success(userResponse ? "Response Updated" : "Response Saved", {
        description: userResponse 
            ? "Your response has been updated successfully."
            : "Your response has been saved successfully.",
        icon: <CheckCircle2 className="text-emerald-500" size={18} />
      });
      
      router.push("/user");
    } catch (e: any) {
      toast.error("Error", {
        description: e.response?.data?.message || "Something went wrong. Please try again.",
        icon: <AlertCircle className="text-rose-500" size={18} />
      });
    } finally {
      setSubmitting(false);
    }
  };

  const isReadOnly = userResponse && !poll?.can_update_responses;

    if (loading) {
        return (
            <div className="h-[40vh] flex flex-col items-center justify-center gap-4 animate-pulse">
                <Loader2 className="w-12 h-12 text-teal-500 animate-spin" />
                <p className="text-[13px] font-medium text-slate-400">Loading survey questions...</p>
            </div>
        );
    }

  if (!poll) return null;

  return (
    <div className="container mx-auto py-20 px-4 max-w-5xl space-y-12 animate-fade-in">
       <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground rounded-full mb-1">
              <span className="text-xs font-medium">{poll.organization?.name} </span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
            {poll.title}
          </h1>
          <p className="text-sm font-medium text-muted-foreground max-w-2xl mx-auto">{poll.description}</p>
          {isReadOnly && (
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500/10 text-amber-600 rounded-full mt-4">
                <span className="text-[13px] font-medium tracking-tight">Read-only view • Response locked</span>
            </div>
          )}
       </div>

       <div className="sticky top-20 z-20 bg-background/80 backdrop-blur-xl border p-4 rounded-2xl shadow-sm flex items-center gap-4 mt-6">
          <div className="flex-1">
             <div className="flex justify-between text-xs font-medium text-muted-foreground mb-2">
                <span>{isReadOnly ? "Completed" : "Progress"}</span>
                <span className="text-primary">{Math.round(progress)}%</span>
             </div>
             <Progress value={progress} className="h-2" />
          </div>
       </div>
       
       <div className="space-y-6 pb-6">
          {poll.questions.map((q: any, i: number) => (
             <Card key={q.id} className="w-full transition-colors hover:border-primary/50">
              <div className="flex flex-col md:flex-row gap-6 p-6 md:p-8">
                <div className="flex-1 space-y-4 pr-0 md:pr-4">
                  <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
                     <span className="flex h-6 w-6 items-center justify-center rounded-md bg-secondary text-secondary-foreground">
                        {i + 1}
                     </span>
                     <span className="text-primary">{q.factor?.name} </span>
                  </div>
                  <CardTitle className="text-lg font-medium md: leading-snug">{q.text}</CardTitle>
                </div>
                
                <div className="w-full md:w-5/12 bg-muted/50 rounded-xl p-6 border flex flex-col justify-center">
                    <Slider 
                      value={[answers[q.id] || 5]} 
                      max={10} min={1} step={1} 
                      onValueChange={(v) => {
                        const val = Array.isArray(v) ? v[0] : v;
                        handleUpdate(val, q.id);
                      }}
                      className={isReadOnly ? "cursor-not-allowed opacity-70" : "cursor-pointer"}
                      disabled={isReadOnly}
                    />
                    <div className="flex items-center justify-between mt-6 text-xs font-medium text-muted-foreground">
                        <span>Low</span>
                        <span className="text-primary font-medium bg-background px-3 py-1 rounded-md border shadow-sm">Level {answers[q.id]}</span>
                        <span>High</span>
                    </div>
                </div>
              </div>
             </Card>
          ))}
       </div>

        <div className="flex flex-col items-center gap-4 pt-6 pb-20">
          <p className="text-xs font-medium text-muted-foreground">
            {isReadOnly ? "Thank you for your valuable contribution to the organizational model." : "Review your answers before submitting."}
          </p>
          <Button 
            onClick={handleSubmit} 
            disabled={submitting}
            size="lg"
            className="w-full max-w-md font-medium shadow-lg transition-transform hover:scale-[1.02 active:scale-95"
          >
            {submitting ? <Loader2 className="animate-spin mr-2" /> : null}
            {isReadOnly ? "Return to Dashboard" : (userResponse ? "Update Response" : "Submit Response")}
            {!submitting && <ArrowRight className="ml-2 w-4 h-4" />}
          </Button>
       </div>
    </div>
  );
}

export default function SurveyPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SurveyContent />
        </Suspense>
    );
}

