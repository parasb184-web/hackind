"use client";

import { useAgents } from "@/hooks/useAgents";
import { IntentSearchBar } from "@/components/IntentSearchBar";
import { AgentGrid } from "@/components/AgentGrid";
import { LatestAINewsSection } from "@/components/LatestAINewsSection";
import { TrendingAgentsSection } from "@/components/TrendingAgentsSection";
import { LiveFeed } from "@/components/LiveFeed";
import { ScrollGlassReveal } from "@/components/ScrollGlassReveal";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { useEffect, Suspense } from "react";

function HomeContent() {
  const { data: agents = [], isLoading } = useAgents();
  const [query] = useQueryState("q", { defaultValue: "" });
  const router = useRouter();

  // If user searched, we can redirect to /agents or just filter the live feed
  useEffect(() => {
    if (query) {
      router.push(`/agents?q=${encodeURIComponent(query)}`);
    }
  }, [query, router]);

  const topAgents = [...agents].sort((a, b) => b.trustScore - a.trustScore).slice(0, 6);

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative overflow-hidden pt-24 pb-20">
        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4 text-[#111827] leading-[1.15]">
            Search, Test and Integrate.<br />
            AI Agents Built for <span className="text-[#00b4d8]">Developers</span>
          </h1>

          <p className="text-lg md:text-xl text-[#6b7280] mb-8 max-w-3xl font-medium mt-4">
            Just tell what you need and what stack you use, and our AI Developer Agent will find repositories,
            write integrations, test in sandbox, and sync code to your branches automatically.
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-14 max-w-3xl">
            {[
              "Find Agents", 
              "Test in Sandbox", 
              "Protect Reliability", 
              "Automate Workflows"
            ].map(pill => (
              <div key={pill} className="bg-white px-4 py-1.5 rounded-full border border-blue-200 text-[#374151] text-sm font-medium flex items-center gap-2 shadow-sm">
                <div className="w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-white">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                </div>
                {pill}
              </div>
            ))}
          </div>

            <IntentSearchBar />

            <div className="mt-8 flex justify-center w-full max-w-lg">
              <div className="w-full text-center bg-white border border-neutral-200 rounded-3xl overflow-hidden shadow-2xl p-4 md:p-6 relative">
                 <img src="/assets/images/hero.png" alt="Platform Dashboard Interface" className="w-full h-auto rounded-xl shadow-sm border border-neutral-100" />
              </div>
            </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24 flex-1">
        <div className="space-y-10">
          <ScrollGlassReveal>
          <section className="grid gap-8 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold tracking-tight">Featured Agents</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    High-trust agents with clear capability coverage and strong marketplace signals.
                  </p>
                </div>
                <Link href="/agents">
                  <Button variant="outline" className="hidden border-white/10 text-muted-foreground hover:text-white md:inline-flex">
                    Browse all <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </div>
              <AgentGrid agents={topAgents} isLoading={isLoading} />
            </div>

            <div className="xl:col-span-1">
              <LiveFeed />
            </div>
          </section>
          </ScrollGlassReveal>

          <ScrollGlassReveal delayMs={80}>
          <section className="glass-surface floating-glass grid gap-4 rounded-[2rem] px-6 py-8 md:grid-cols-3 bg-white border border-neutral-200">
            <div className="text-center md:text-left border-r-0 md:border-r border-neutral-200/60 pr-4">
              <p className="text-4xl font-black text-blue-600">12,400+</p>
              <p className="text-xs uppercase tracking-[0.2em] font-medium text-neutral-500 mt-2">Agent calls made</p>
            </div>
            <div className="text-center md:text-left border-r-0 md:border-r border-neutral-200/60 px-4">
              <p className="text-4xl font-black text-blue-600">48</p>
              <p className="text-xs uppercase tracking-[0.2em] font-medium text-neutral-500 mt-2">Agents listed</p>
            </div>
            <div className="text-center md:text-left pl-4">
              <p className="text-4xl font-black text-blue-600">1,200</p>
              <p className="text-xs uppercase tracking-[0.2em] font-medium text-neutral-500 mt-2">Developers onboarded</p>
            </div>
          </section>
          </ScrollGlassReveal>

          <ScrollGlassReveal delayMs={120}>
          <section className="glass-surface rounded-[2rem] px-8 py-12 bg-white/60">
            <div className="mb-10 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-neutral-900">How it works</h2>
              <p className="mt-4 text-base text-neutral-600">
                A fast path from intent to integration for teams evaluating autonomous agents.
              </p>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {[
                ["01", "Describe or paste your project", "bg-blue-50 text-blue-600"],
                ["02", "Discover matched agents instantly", "bg-purple-50 text-purple-600"],
                ["03", "Integrate with one line of code", "bg-emerald-50 text-emerald-600"],
              ].map(([step, label, colorCls]) => (
                <div key={step} className="glass-surface-soft rounded-[1.5rem] p-8 border border-neutral-100 bg-white hover:shadow-lg transition-all duration-300">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-6 ${colorCls} font-bold text-lg`}>
                    {step}
                  </div>
                  <p className="text-lg font-bold text-neutral-900">{label}</p>
                </div>
              ))}
            </div>
          </section>
          </ScrollGlassReveal>

          <ScrollGlassReveal delayMs={160}>
            <TrendingAgentsSection />
          </ScrollGlassReveal>
          <ScrollGlassReveal delayMs={200}>
            <LatestAINewsSection />
          </ScrollGlassReveal>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomeContent />
    </Suspense>
  );
}
