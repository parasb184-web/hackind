"use client";

import { AgentCard } from "./AgentCard";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "./ui/button";

export function GapDetectorCard({ gapInfo, onAdd }: { gapInfo: any, onAdd?: () => void }) {
  const { category, agent, impact } = gapInfo;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-200 bg-white p-1 shadow-sm hover:shadow-md transition-shadow">
      <div className="absolute top-0 right-0 px-3 py-1 bg-red-50 text-red-600 text-xs font-bold uppercase tracking-wider rounded-bl-xl z-10 border-b border-l border-red-100">
        Missing Context
      </div>

      <div className="p-5 bg-neutral-50 rounded-xl border border-neutral-100 relative z-0 h-full flex flex-col">
        <div className="mb-4">
          <h3 className="font-bold text-lg flex items-center gap-2 text-neutral-900">
            <Zap className="w-4 h-4 text-amber-500" />
            {category.replace("-", " ")}
          </h3>
          <p className="text-sm font-medium text-emerald-600 mt-2 p-2 bg-emerald-50 rounded-lg border border-emerald-200 font-bold">
            {impact}
          </p>
        </div>

        <div className="flex-1">
          <AgentCard agent={agent} />
        </div>

        <Button onClick={onAdd} className="mt-4 w-full bg-white hover:bg-neutral-50 text-blue-600 font-bold border border-neutral-200 group shadow-sm">
          Add to your stack <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
