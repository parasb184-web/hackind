"use client";

import { useParams } from "next/navigation";
import { useAgent, useAgentReviews } from "@/hooks/useAgent";
import { SandboxPanel } from "@/components/SandboxPanel";
import { SDKSnippet } from "@/components/SDKSnippet";
import { TrustScoreBadge } from "@/components/TrustScoreBadge";
import { Badge } from "@/components/ui/badge";
import { Activity, Clock, Server, Star, Terminal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/lib/AuthContext";
import { useState, useEffect } from "react";
import { addReview, checkHasRunSandbox } from "@/lib/firestore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function AgentDetailPage() {
  const { id } = useParams() as { id: string };
  const { data: agent, isLoading } = useAgent(id);
  const { data: reviews = [], refetch: refetchReviews } = useAgentReviews(id);
  const { user } = useAuth();

  const [hasRun, setHasRun] = useState(false);
  const [rating, setRating] = useState(5);
  const [reviewBody, setReviewBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user && agent) {
      checkHasRunSandbox(agent.id, user.uid).then(setHasRun);
    }
  }, [user, agent]);

  if (isLoading) {
    return <div className="container mx-auto px-6 py-12"><Skeleton className="h-[400px] w-full rounded-xl" /></div>;
  }

  if (!agent) {
    return <div className="text-center mt-24">Agent not found.</div>;
  }

  const submitReview = async () => {
    if (!user) return;
    setSubmitting(true);
    try {
      await addReview(agent.id, user.uid, rating, reviewBody);
      setReviewBody("");
      refetchReviews();
      toast("Review submitted!");
    } catch (e: any) {
      toast("Error submitting review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-12 pb-32">
      <div className="flex flex-col lg:flex-row justify-between items-start gap-8 mb-12">
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-neutral-900">{agent.name}</h1>
            <Badge variant="secondary" className="bg-neutral-100 text-xs text-neutral-600 font-mono">v{agent.version}</Badge>
            <TrustScoreBadge trustScore={agent.trustScore} />
          </div>
          <p className="text-xl text-neutral-600 leading-relaxed">{agent.description}</p>

          <div className="flex items-center gap-4 mt-6 p-4 bg-neutral-50 rounded-lg border border-neutral-200 shrink-0 self-start">
            <img src={`https://github.com/${agent.creatorUsername}.png?size=48`} className="w-12 h-12 rounded-full border border-neutral-200" alt="" />
            <div>
              <div className="text-sm font-semibold text-neutral-500">Creator</div>
              <div className="text-base flex items-center gap-1 font-mono font-bold text-blue-600">@{agent.creatorUsername}</div>
            </div>
          </div>
        </div>

        <div className="w-full lg:w-96 shrink-0 space-y-4">
          <div className="grid grid-cols-2 gap-4 bg-neutral-50 p-6 rounded-xl border border-neutral-200 shadow-sm">
            <div className="space-y-1">
              <div className="text-xs text-neutral-500 flex items-center gap-1 uppercase tracking-wider font-bold"><Activity className="w-3.5 h-3.5" /> Total Calls</div>
              <div className="text-2xl font-mono text-neutral-900 font-bold">{((agent.totalCalls || 0) / 1000).toFixed(1)}k</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-neutral-500 flex items-center gap-1 uppercase tracking-wider font-bold"><Clock className="w-3.5 h-3.5" /> Avg Latency</div>
              <div className="text-2xl font-mono text-neutral-900 font-bold">{agent.avgLatencyMs || 0}ms</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-neutral-500 flex items-center gap-1 uppercase tracking-wider font-bold"><Server className="w-3.5 h-3.5" /> Uptime</div>
              <div className="text-2xl font-mono text-emerald-600 font-bold">{agent.uptimePercent || 0}%</div>
            </div>
            <div className="space-y-1">
              <div className="text-xs text-neutral-500 flex items-center gap-1 uppercase tracking-wider font-bold"><Star className="w-3.5 h-3.5" /> Rating</div>
              <div className="text-2xl font-mono text-amber-500 font-bold">{agent.rating?.toFixed(1) || "N/A"}/5</div>
            </div>
          </div>
          
          <Button 
            className="w-full h-14 text-lg font-bold bg-blue-600 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 text-white"  
            onClick={() => {
              if (!user) {
                toast("Please login with GitHub first to purchase agents.");
                return;
              }
              toast.success("Redirecting to Dashboard to provision your API Key...");
              setTimeout(() => { window.location.href = "/dashboard"; }, 1000);
            }}
          >
            Buy for ${agent.costPerCall}/call
          </Button>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-10">
        {agent.capabilityTags.map((tag) => <Badge key={tag} className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1 text-sm font-mono border-blue-200">{tag}</Badge>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-neutral-200">
        <div>
          <h3 className="text-2xl font-bold flex items-center gap-2 mb-6 text-neutral-900">
            <Terminal className="w-6 h-6 text-blue-600" /> Test Sandbox
          </h3>
          <p className="text-neutral-600 mb-6">Run this agent directly in your browser. Live requests are routed through AgentHub&apos;s API.</p>
          <SandboxPanel agent={agent} />
        </div>

        <div>
          <h3 className="text-2xl font-bold mb-6 flex justify-between items-center text-neutral-900">
            Integration SDK
            <span className="text-sm font-mono bg-neutral-100 text-neutral-600 px-2 py-1 rounded inline-flex items-center border border-neutral-200">Cost: ${agent.costPerCall}/call</span>
          </h3>
          <p className="text-neutral-600 mb-6">Copy and paste the snippet below to integrate into your application. We automatically secure requests and enforce SLAs.</p>
          <SDKSnippet agent={agent} />
        </div>
      </div>

      <div className="mt-24 pt-12 border-t border-neutral-200 max-w-3xl">
        <h3 className="text-2xl font-bold mb-8 text-neutral-900">Ratings & Reviews ({agent.reviewCount || 0})</h3>

        {reviews.length === 0 ? (
          <p className="text-neutral-500">No reviews yet.</p>
        ) : (
          <div className="space-y-6 mb-12">
            {reviews.map(r => (
              <div key={r.id} className="p-4 bg-white rounded-lg border border-neutral-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-500 text-amber-500' : 'text-neutral-300'}`} />)}
                  </div>
                  <span className="text-xs text-neutral-500">{new Date(r.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-neutral-900 mb-2">{r.body}</p>
              </div>
            ))}
          </div>
        )}

        {user && hasRun && (
          <div className="bg-white p-6 rounded-xl border border-neutral-200 mt-8 shadow-sm">
            <h4 className="text-lg font-bold mb-4 text-neutral-900">Leave a Review</h4>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(v => (
                <Star key={v} className={`w-6 h-6 cursor-pointer hover:scale-110 transition-transform ${v <= rating ? 'fill-amber-500 text-amber-500' : 'text-neutral-300'}`} onClick={() => setRating(v)} />
              ))}
            </div>
            <textarea
              value={reviewBody}
              onChange={e => setReviewBody(e.target.value)}
              className="w-full bg-neutral-50 border border-neutral-200 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mb-4 h-24 resize-none text-neutral-900 placeholder:text-neutral-400"
              placeholder="How was your experience using this agent?"
            />
            <Button onClick={submitReview} disabled={submitting || !reviewBody} className="bg-blue-600 hover:bg-blue-700">
              {submitting ? "Submitting..." : "Post Review"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
