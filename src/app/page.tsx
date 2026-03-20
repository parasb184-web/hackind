"use client";

import { useAgents } from "@/hooks/useAgents";
import { IntentSearchBar } from "@/components/IntentSearchBar";
import { AgentGrid } from "@/components/AgentGrid";
import { LatestAINewsSection } from "@/components/LatestAINewsSection";
import { TrendingAgentsSection } from "@/components/TrendingAgentsSection";
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
      <div className="relative border-b border-white/10 bg-black pt-24 pb-32">
        <div className="absolute inset-0 bg-blue-500/5 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black"></div>

        <div className="container mx-auto px-6 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-8 border border-blue-500/20">
            <Sparkles className="w-4 h-4" />
            Trusted AI Agent Marketplace
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-4xl">
            Discover and integrate <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">AI Agents</span> in seconds.
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground mb-12 max-w-2xl">
            Discover, evaluate, and integrate production-ready AI agents through a unified developer marketplace.
          </p>

          <IntentSearchBar />

          <div className="mt-8 flex gap-4 text-sm text-muted-foreground font-mono">
            <span>Popular:</span>
            <Link href="/agents?tags=code-review" className="hover:text-blue-400 underline decoration-white/20 underline-offset-4">code-review</Link>
            <Link href="/agents?tags=data-extraction" className="hover:text-blue-400 underline decoration-white/20 underline-offset-4">data-extraction</Link>
            <Link href="/agents?tags=summarization" className="hover:text-blue-400 underline decoration-white/20 underline-offset-4">summarization</Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24 flex-1">
        <div className="space-y-10">
          <TrendingAgentsSection />
          <LatestAINewsSection />

          <section>
            <div className="mb-12 flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Top Rated Agents</h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  Trusted picks from the AgentHub marketplace.
                </p>
              </div>
              <Link href="/agents">
                <Button variant="outline" className="flex items-center gap-2 border-white/10 text-muted-foreground hover:text-white">
                  Browse all <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>

            <AgentGrid agents={topAgents} isLoading={isLoading} />
          </section>
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
