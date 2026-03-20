"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, GitPullRequest, LayoutTemplate, Star, Users, ArrowRight, Copy, Link2, BadgeCheck } from "lucide-react";
import { AgentCard } from "./AgentCard";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Agent } from "@/lib/types";

interface RepoPainPoint {
  painPoint: string;
  agentCategory: string;
  specificReason: string;
  estimatedTimeSaved: string;
}

interface RepoDNAResultData {
  ownerRepo?: string;
  repoMeta?: {
    stars?: number;
    contributors?: number;
    openIssues?: number;
    primaryLanguage?: string;
  };
  painPoints?: RepoPainPoint[];
  matchedAgents: Agent[];
}

export function RepoDNAResult({ result }: { result: RepoDNAResultData | null }) {
  const [loadingStep, setLoadingStep] = useState(0);
  const [copiedField, setCopiedField] = useState<"url" | "badge" | null>(null);

  useEffect(() => {
    const timer1 = setTimeout(() => setLoadingStep(1), 500);
    const timer2 = setTimeout(() => setLoadingStep(2), 1500);
    const timer3 = setTimeout(() => setLoadingStep(3), 3000);
    const timer4 = setTimeout(() => setLoadingStep(4), 5500);

    return () => { clearTimeout(timer1); clearTimeout(timer2); clearTimeout(timer3); clearTimeout(timer4); };
  }, []);

  const steps = [
    "Fetching repository...",
    "Analyzing open issues...",
    "Reading commit history...",
    "Mapping automation gaps..."
  ];

  if (!result) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-6 bg-black/40 border border-white/10 rounded-3xl mt-8 flex flex-col items-center shadow-xl">
        <div className="w-16 h-16 rounded-full border-b-2 border-r-2 border-blue-500 animate-spin mb-8"></div>
        <p className="text-sm font-mono text-muted-foreground">Preparing repository analysis...</p>
      </div>
    );
  }

  const { repoMeta, painPoints, matchedAgents } = result;
  const ownerRepo = result.ownerRepo || "";
  const origin = typeof window !== "undefined" ? window.location.origin : "https://agenthub.io";
  const shareUrl = ownerRepo ? `${origin}/stack/${ownerRepo}` : "";
  const badgeMarkdown = ownerRepo
    ? `[![AgentHub](${origin}/api/badge/${ownerRepo})](${origin}/stack/${ownerRepo})`
    : "";

  if (loadingStep < 4) {
    return (
      <div className="w-full max-w-4xl mx-auto py-12 px-6 bg-black/40 border border-white/10 rounded-3xl mt-8 flex flex-col items-center shadow-xl">
        <div className="w-16 h-16 rounded-full border-b-2 border-r-2 border-blue-500 animate-spin mb-8"></div>
        <div className="space-y-4 w-full max-w-sm">
          {steps.map((step, idx) => (
            <div key={idx} className={`flex items-center gap-3 transition-opacity duration-500 ${loadingStep >= idx ? 'opacity-100' : 'opacity-30'}`}>
              <CheckCircle2 className={`w-5 h-5 ${loadingStep > idx ? 'text-green-500' : 'text-blue-500'}`} />
              <span className={`font-mono text-sm ${loadingStep > idx ? 'text-muted-foreground' : 'text-white'}`}>{step}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const handleCopy = async (value: string, field: "url" | "badge") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      toast("Copied!");
      window.setTimeout(() => setCopiedField(null), 2000);
    } catch {
      toast("Copy failed");
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 mt-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">

      <div className="flex flex-wrap gap-6 mb-12 p-6 bg-white/5 border border-white/10 rounded-2xl">
        <div className="flex items-center gap-2"><Star className="w-5 h-5 text-yellow-500" /> <span className="font-mono">{repoMeta?.stars} Stars</span></div>
        <div className="flex items-center gap-2"><Users className="w-5 h-5 text-blue-400" /> <span className="font-mono">{repoMeta?.contributors} Contributors</span></div>
        <div className="flex items-center gap-2"><GitPullRequest className="w-5 h-5 text-green-400" /> <span className="font-mono">{repoMeta?.openIssues} Open Issues</span></div>
        <div className="flex items-center gap-2"><LayoutTemplate className="w-5 h-5 text-purple-400" /> <span className="font-mono">{repoMeta?.primaryLanguage}</span></div>
      </div>

      <div className="space-y-8">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Identified Pain Points & Agent Solutions</h2>

        {painPoints?.map((pp, idx: number) => {
          const matchingAgent = matchedAgents.find((a) => a.capabilityTags?.includes(pp.agentCategory));

          return (
            <div key={idx} className="bg-black/40 border border-white/10 p-6 rounded-3xl">
              <div className="flex items-start justify-between mb-6">
                <div className="max-w-3xl">
                  <h3 className="text-lg font-semibold mb-2">{pp.painPoint}</h3>
                  <p className="text-muted-foreground text-sm italic border-l-2 border-white/20 pl-4">{pp.specificReason}</p>
                </div>
                <div className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full whitespace-nowrap border border-green-500/20">
                  {pp.estimatedTimeSaved}
                </div>
              </div>

              {matchingAgent ? (
                <div className="pt-4 border-t border-white/5">
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-semibold mb-4 block">Recommended Agent</span>
                  <div className="max-w-sm">
                    <AgentCard agent={matchingAgent} />
                  </div>
                </div>
              ) : (
                <div className="pt-4 border-t border-white/5 text-sm font-mono text-muted-foreground">
                  No direct agent matches found in marketplace yet for &quot;{pp.agentCategory}&quot;.
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center">
        {shareUrl ? (
          <div className="w-full rounded-[2rem] border border-blue-500/20 bg-[#0b1120] p-6">
            <div className="mb-6 flex items-center gap-2 text-blue-300">
              <BadgeCheck className="h-5 w-5" />
              <h3 className="text-xl font-bold text-white">Share your agent stack</h3>
            </div>

            <div className="space-y-4">
              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.22em] text-blue-100/40">Shareable URL</p>
                <div className="flex flex-col gap-3 md:flex-row">
                  <input readOnly value={shareUrl} className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-blue-100" />
                  <Button onClick={() => handleCopy(shareUrl, "url")} className="bg-blue-600 hover:bg-blue-700">
                    {copiedField === "url" ? "Copied!" : "Copy URL"}
                    <Link2 className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div>
                <p className="mb-2 text-xs uppercase tracking-[0.22em] text-blue-100/40">README badge markdown</p>
                <div className="flex flex-col gap-3 md:flex-row">
                  <textarea readOnly value={badgeMarkdown} className="min-h-24 w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-sm text-blue-100" />
                  <Button onClick={() => handleCopy(badgeMarkdown, "badge")} variant="outline" className="border-white/10 bg-white/5 text-white hover:bg-white/10">
                    {copiedField === "badge" ? "Copied!" : "Copy badge"}
                    <Copy className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex justify-center">
                <a href={shareUrl} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
                  Open public stack page <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
            Generate Shareable Stack Page <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
