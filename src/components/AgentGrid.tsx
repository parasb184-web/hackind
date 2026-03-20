"use client";

import { Agent } from "@/lib/types";
import { AgentCard } from "./AgentCard";
import { Skeleton } from "@/components/ui/skeleton";
import { PackageOpen } from "lucide-react";

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
        <h3 className="text-xl font-bold mb-2">No agents found</h3>
        <p className="text-muted-foreground max-w-sm">Try adjusting your filters or search query to find what you&apos;re looking for.</p>
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
