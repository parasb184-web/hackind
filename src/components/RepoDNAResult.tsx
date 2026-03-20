"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, GitPullRequest, LayoutTemplate, Star, Users, ArrowRight } from "lucide-react";
import { AgentCard } from "./AgentCard";

export function RepoDNAResult({ result }: { result: any }) {
  const { repoMeta, painPoints, matchedAgents } = result;

  const [loadingStep, setLoadingStep] = useState(0);

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

        {painPoints?.map((pp: any, idx: number) => {
          const matchingAgent = matchedAgents.find((a: any) => a.capabilityTags?.includes(pp.agentCategory));

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
                  No direct agent matches found in marketplace yet for "{pp.agentCategory}".
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-12 flex justify-center">
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-xl shadow-lg shadow-blue-500/20 transition-all flex items-center gap-2">
          Generate Shareable Stack Page <ArrowRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
