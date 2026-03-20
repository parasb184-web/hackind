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
          <Skeleton key={i} className="h-64 w-full rounded-xl bg-neutral-100" />
        ))}
      </div>
    );
  }

  if (agents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 mt-12 text-center bg-neutral-50 rounded-xl border border-dashed border-neutral-300">
        <img src="/assets/images/empty_agents.png" alt="No agents found" className="w-48 h-auto mix-blend-multiply drop-shadow-sm mb-6 opacity-80 relative -left-4" />
        <h3 className="text-xl font-bold mb-2 text-neutral-900">No agents match your filters</h3>
        <p className="text-neutral-500 max-w-sm">Clear the current filters or try a broader search to explore more agents in the marketplace.</p>
        <Link href="/agents" className="mt-5 inline-flex rounded-full border border-neutral-200 bg-white px-5 py-2.5 text-sm font-semibold text-neutral-700 hover:bg-neutral-50 shadow-sm">
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
