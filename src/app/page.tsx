"use client";

import { useAgents } from "@/hooks/useAgents";
import { IntentSearchBar } from "@/components/IntentSearchBar";
import { AgentGrid } from "@/components/AgentGrid";
import { LatestAINewsSection } from "@/components/LatestAINewsSection";
import { TrendingAgentsSection } from "@/components/TrendingAgentsSection";
import { LiveFeed } from "@/components/LiveFeed";
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
      <div className="site-grid-bg relative overflow-hidden border-b border-white/8 pt-24 pb-20">
        <div className="hero-orb hero-orb-blue left-[-6rem] top-[-4rem] h-72 w-72" />
        <div className="hero-orb hero-orb-cyan right-[8%] top-[4%] h-80 w-80" />
        <div className="hero-orb hero-orb-slate bottom-[-6rem] left-[40%] h-72 w-72" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(4,7,12,0.12),rgba(4,7,12,0.6)_38%,rgba(4,7,12,0.92))]" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="glass-surface relative mx-auto flex max-w-6xl flex-col items-center overflow-hidden rounded-[2.5rem] px-6 py-12 text-center md:px-10 md:py-16">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-300/50 to-transparent" />
            <div className="absolute left-[-10%] top-[-14%] h-40 w-40 rounded-full border border-white/6 bg-blue-500/10 blur-3xl" />
            <div className="absolute right-[-4%] bottom-[-10%] h-52 w-52 rounded-full border border-white/6 bg-cyan-400/8 blur-3xl" />

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-8 border border-blue-500/20">
              <Sparkles className="w-4 h-4" />
              Trusted AI Agent Marketplace
            </div>

            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 max-w-5xl">
              Find the right <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-blue-400">AI agent</span>. In seconds.
            </h1>

            <p className="text-lg md:text-xl text-blue-50/66 mb-12 max-w-2xl">
              The marketplace where developers list AI agents and teams discover, try, and integrate them without the guesswork.
            </p>

            <div className="mb-10 flex flex-col gap-3 sm:flex-row">
              <Link href="/agents">
                <Button className="h-12 rounded-full bg-[linear-gradient(180deg,rgba(59,130,246,1),rgba(37,99,235,0.92))] px-6 text-white shadow-[0_12px_30px_rgba(37,99,235,0.35)] hover:bg-blue-700">
                  Browse Agents <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link href="/scan">
                <Button variant="outline" className="glass-surface-soft h-12 rounded-full px-6 text-white hover:bg-white/10">
                  Scan Your Repo <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <IntentSearchBar />

            <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-blue-100/55 font-mono">
              <span>Popular:</span>
              <Link href="/agents?tags=code-review" className="hover:text-blue-400 underline decoration-white/20 underline-offset-4">code-review</Link>
              <Link href="/agents?tags=data-extraction" className="hover:text-blue-400 underline decoration-white/20 underline-offset-4">data-extraction</Link>
              <Link href="/agents?tags=summarization" className="hover:text-blue-400 underline decoration-white/20 underline-offset-4">summarization</Link>
            </div>

            <div className="mt-12 grid w-full gap-4 md:grid-cols-3">
              {[
                ["Workflow-ready", "Search by repo need, not by guessing categories."],
                ["Premium surfaces", "Layered blur, depth, and refined glass cards across the homepage."],
                ["Integration-first", "Validate in sandbox and ship with SDK snippets immediately."],
              ].map(([title, copy]) => (
                <div key={title} className="glass-surface-soft rounded-[1.75rem] p-5 text-left">
                  <p className="text-sm font-semibold text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-blue-100/58">{copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-24 flex-1">
        <div className="space-y-10">
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

          <section className="glass-surface grid gap-4 rounded-[2rem] px-6 py-5 md:grid-cols-3">
            <div className="text-center md:text-left">
              <p className="text-3xl font-black text-white">12,400+</p>
              <p className="text-xs uppercase tracking-[0.25em] text-blue-100/45">Agent calls made</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-3xl font-black text-white">48</p>
              <p className="text-xs uppercase tracking-[0.25em] text-blue-100/45">Agents listed</p>
            </div>
            <div className="text-center md:text-left">
              <p className="text-3xl font-black text-white">1,200</p>
              <p className="text-xs uppercase tracking-[0.25em] text-blue-100/45">Developers onboarded</p>
            </div>
          </section>

          <section className="glass-surface rounded-[2rem] px-6 py-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                A fast path from intent to integration for teams evaluating autonomous agents.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-3">
              {[
                ["01", "Describe or paste your project"],
                ["02", "Discover matched agents instantly"],
                ["03", "Integrate with one line of code"],
              ].map(([step, label]) => (
                <div key={step} className="glass-surface-soft rounded-[1.5rem] p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-300/60">{step}</p>
                  <p className="mt-4 text-xl font-semibold text-white">{label}</p>
                </div>
              ))}
            </div>
          </section>

          <TrendingAgentsSection />
          <LatestAINewsSection />
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
