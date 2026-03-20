"use client";

import { useAgents } from "@/hooks/useAgents";
import { AgentGrid } from "@/components/AgentGrid";
import { FilterSidebar } from "@/components/FilterSidebar";
import { useQueryState, parseAsArrayOf, parseAsString, parseAsFloat } from "nuqs";
import { useMemo, Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";

function AgentsContent() {
  const { data: agents = [], isLoading } = useAgents();

  const [q] = useQueryState("q", { defaultValue: "" });
  const [tags] = useQueryState("tags", parseAsArrayOf(parseAsString).withDefault([]));
  const [langs] = useQueryState("langs", parseAsArrayOf(parseAsString).withDefault([]));
  const [maxCost] = useQueryState("cost", parseAsFloat.withDefault(0.1));
  const [minTrust] = useQueryState("trust", parseAsFloat.withDefault(0));
  const [sort] = useQueryState("sort", parseAsString.withDefault("newest"));

  const filteredAgents = useMemo(() => {
    let result = agents.filter(a => {
      // Name/desc search
      if (q && !a.name.toLowerCase().includes(q.toLowerCase()) && !a.description.toLowerCase().includes(q.toLowerCase())) return false;

      // Cost filter
      if (a.costPerCall > maxCost) return false;

      // Trust score filter
      if (a.trustScore < minTrust) return false;

      // Tags filter (must encompass selected tags, or if none selected then pass)
      if (tags.length > 0 && !tags.some(t => a.capabilityTags.includes(t))) return false;

      // Languages filter
      if (langs.length > 0 && !langs.some(l => a.supportedLanguages.includes(l))) return false;

      return true;
    });

    // Sorting
    if (sort === "newest") result = result.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
    if (sort === "used") result = result.sort((a, b) => b.totalCalls - a.totalCalls);
    if (sort === "rated") result = result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    if (sort === "cost") result = result.sort((a, b) => a.costPerCall - b.costPerCall);

    return result;
  }, [agents, q, tags, langs, maxCost, minTrust, sort]);

  return (
    <div className="container mx-auto px-6 py-12 min-h-screen">
      <div className="mb-12 border-b border-white/10 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight mb-4">Marketplace</h1>
        <p className="text-muted-foreground text-lg mb-8 max-w-2xl">Browse, verify, and integrate thousands of intelligent agents serving highly specific needs.</p>
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        <aside className="lg:col-span-1 border-r border-white/5 h-full">
          <FilterSidebar agents={agents} />
        </aside>

        <section className="lg:col-span-3">
          <AgentGrid agents={filteredAgents} isLoading={isLoading} />
        </section>
      </div>
    </div>
  );
}

export default function AgentsPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <AgentsContent />
    </Suspense>
  );
}
