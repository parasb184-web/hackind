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
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">{agent.name}</h1>
            <Badge variant="secondary" className="bg-white/10 text-xs text-muted-foreground font-mono">v{agent.version}</Badge>
            <TrustScoreBadge trustScore={agent.trustScore} />
          </div>
          <p className="text-xl text-muted-foreground leading-relaxed">{agent.description}</p>

          <div className="flex items-center gap-4 mt-6 p-4 bg-white/5 rounded-lg border border-white/10 shrink-0 self-start">
            <img src={`https://github.com/${agent.creatorUsername}.png?size=48`} className="w-12 h-12 rounded-full border border-white/10" alt="" />
            <div>
              <div className="text-sm font-semibold text-muted-foreground">Creator</div>
              <div className="text-base flex items-center gap-1 font-mono text-blue-400">@{agent.creatorUsername}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 w-full lg:w-96 shrink-0 bg-[#0d1117] p-6 rounded-xl border border-white/10">
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1 uppercase tracking-wider font-semibold"><Activity className="w-3.5 h-3.5" /> Total Calls</div>
            <div className="text-2xl font-mono text-white">{(agent.totalCalls / 1000).toFixed(1)}k</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1 uppercase tracking-wider font-semibold"><Clock className="w-3.5 h-3.5" /> Avg Latency</div>
            <div className="text-2xl font-mono text-white">{agent.avgLatencyMs}ms</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1 uppercase tracking-wider font-semibold"><Server className="w-3.5 h-3.5" /> Uptime</div>
            <div className="text-2xl font-mono text-green-400">{agent.uptimePercent}%</div>
          </div>
          <div className="space-y-1">
            <div className="text-xs text-muted-foreground flex items-center gap-1 uppercase tracking-wider font-semibold"><Star className="w-3.5 h-3.5" /> Rating</div>
            <div className="text-2xl font-mono text-amber-500">{agent.rating?.toFixed(1) || "N/A"}/5</div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap mb-10">
        {agent.capabilityTags.map((tag) => <Badge key={tag} className="bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 px-3 py-1 text-sm font-mono border-blue-500/30">{tag}</Badge>)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-white/10">
        <div>
          <h3 className="text-2xl font-semibold flex items-center gap-2 mb-6">
            <Terminal className="w-6 h-6 text-blue-500" /> Test Sandbox
          </h3>
          <p className="text-muted-foreground mb-6">Run this agent directly in your browser. Live requests are routed through AgentHub&apos;s API.</p>
          <SandboxPanel agent={agent} />
        </div>

        <div>
          <h3 className="text-2xl font-semibold mb-6 flex justify-between items-center">
            Integration SDK
            <span className="text-sm font-mono bg-white/5 text-muted-foreground px-2 py-1 rounded inline-flex items-center">Cost: ${agent.costPerCall}/call</span>
          </h3>
          <p className="text-muted-foreground mb-6">Copy and paste the snippet below to integrate into your application. We automatically secure requests and enforce SLAs.</p>
          <SDKSnippet agent={agent} />
        </div>
      </div>

      <div className="mt-24 pt-12 border-t border-white/10 max-w-3xl">
        <h3 className="text-2xl font-semibold mb-8">Ratings & Reviews ({agent.reviewCount || 0})</h3>

        {reviews.length === 0 ? (
          <p className="text-muted-foreground">No reviews yet.</p>
        ) : (
          <div className="space-y-6 mb-12">
            {reviews.map(r => (
              <div key={r.id} className="p-4 bg-white/5 rounded-lg border border-white/10 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex gap-1">
                    {Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-amber-500 text-amber-500' : 'text-white/20'}`} />)}
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(r.createdAt?.seconds * 1000).toLocaleDateString()}</span>
                </div>
                <p className="text-sm text-foreground mb-2">{r.body}</p>
              </div>
            ))}
          </div>
        )}

        {user && hasRun && (
          <div className="bg-[#111] p-6 rounded-xl border border-white/10 mt-8 shadow-xl">
            <h4 className="text-lg font-bold mb-4">Leave a Review</h4>
            <div className="flex gap-2 mb-4">
              {[1, 2, 3, 4, 5].map(v => (
                <Star key={v} className={`w-6 h-6 cursor-pointer ${v <= rating ? 'fill-amber-500 text-amber-500' : 'text-white/20'}`} onClick={() => setRating(v)} />
              ))}
            </div>
            <textarea
              value={reviewBody}
              onChange={e => setReviewBody(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 mb-4 h-24 resize-none"
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
