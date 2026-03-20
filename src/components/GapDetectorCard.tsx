"use client";

import { AgentCard } from "./AgentCard";
import { ArrowRight, Zap } from "lucide-react";
import { Button } from "./ui/button";

export function GapDetectorCard({ gapInfo, onAdd }: { gapInfo: any, onAdd?: () => void }) {
  const { category, agent, impact } = gapInfo;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-red-500/30 bg-black/40 p-1">
      <div className="absolute top-0 right-0 px-3 py-1 bg-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider rounded-bl-xl z-10">
        Missing Context
      </div>

      <div className="p-5 bg-white/5 rounded-xl border border-white/5 relative z-0 h-full flex flex-col">
        <div className="mb-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <Zap className="w-4 h-4 text-yellow-500" />
            {category.replace("-", " ")}
          </h3>
          <p className="text-sm font-medium text-green-400 mt-2 p-2 bg-green-500/10 rounded-lg border border-green-500/20">
            {impact}
          </p>
        </div>

        <div className="flex-1">
          <AgentCard agent={agent} />
        </div>

        <Button onClick={onAdd} className="mt-4 w-full bg-white/10 hover:bg-white/20 text-white border border-white/10 group">
          Add to your stack <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
}
