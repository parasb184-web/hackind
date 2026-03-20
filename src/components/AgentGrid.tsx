"use client";

import { Agent } from "@/lib/types";
import { AgentCard } from "./AgentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { PackageOpen } from "lucide-react";
import Link from "next/link";

export const AgentGrid = ({ agents, isLoading }: { agents: Agent[]; isLoading: boolean }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-64 w-full rounded-xl bg-white/5" />
        ))}
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 mt-12 text-center bg-white/5 rounded-xl border border-dashed border-white/20">
        <PackageOpen className="w-16 h-16 text-muted-foreground mb-4" />
        <h3 className="text-xl font-bold mb-2">No agents match your filters</h3>
        <p className="text-muted-foreground max-w-sm">Clear the current filters or try a broader search to explore more agents in the marketplace.</p>
        <Link href="/agents" className="mt-5 inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-semibold text-white hover:bg-white/10">
          Clear filters
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {agents.map((agent) => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
};
