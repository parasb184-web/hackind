"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Plus, Workflow } from "lucide-react";

export default function ChainsPage() {
  const [chains, setChains] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/chains").then(res => res.json()).then(data => {
      if (Array.isArray(data)) setChains(data);
    });
  }, []);

  return (
    <div className="container mx-auto px-6 py-24 min-h-screen">
      <div className="flex items-center justify-between mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">Your Workflows</h1>
        <Link href={`/chains/new`}>
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Chain
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {chains.length === 0 ? (
          <div className="col-span-full py-12 text-center text-muted-foreground bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center">
            <Workflow className="w-12 h-12 text-blue-500/50 mb-4" />
            <h3 className="text-xl font-semibold mb-2">No chains yet</h3>
            <p>Connect multiple intelligent agents into autonomous pipelines.</p>
          </div>
        ) : (
          chains.map(c => (
            <Link key={c.id} href={`/chains/${c.id}`} className="block relative overflow-hidden bg-black/40 border border-white/10 rounded-2xl p-6 hover:bg-white/5 transition-all">
              <h3 className="text-xl font-bold mb-2">{c.name}</h3>
              <div className="flex gap-2 text-sm text-muted-foreground mb-6">
                <span>{c.nodes?.length || 0} Agents</span>
                <span>•</span>
                <span>{c.edges?.length || 0} Connections</span>
              </div>
              <div className="flex -space-x-3">
                {c.nodes?.slice(0, 4).map((n: any, i: number) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-blue-900 flex items-center justify-center text-xs font-bold text-white shadow-xl">
                    {n.data.agent.name.substring(0, 2).toUpperCase()}
                  </div>
                ))}
                {c.nodes?.length > 4 && (
                  <div className="w-10 h-10 rounded-full border-2 border-black bg-white/10 flex items-center justify-center text-xs font-bold text-white shadow-xl">
                    +{c.nodes.length - 4}
                  </div>
                )}
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
