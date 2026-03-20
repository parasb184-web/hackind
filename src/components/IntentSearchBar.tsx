"use client";

import { useState, useEffect, useCallback } from "react";
import { Sparkles } from "lucide-react";
import { AgentCard } from "./AgentCard";
import { Agent } from "@/lib/types";
import { Input } from "./ui/input";

export function IntentSearchBar() {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<{ agent: Agent, matchReason: string }[]>([]);
  const [recent, setRecent] = useState<string[]>([]);

  useEffect(() => {
    const r = localStorage.getItem("recent_searches");
    if (r) setRecent(JSON.parse(r));
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(query);
    }, 500);
    return () => clearTimeout(handler);
  }, [query]);

  const updateRecent = useCallback((q: string) => {
    const newRecent = [q, ...recent.filter(x => x !== q)].slice(0, 5);
    setRecent(newRecent);
    localStorage.setItem("recent_searches", JSON.stringify(newRecent));
  }, [recent]);

  useEffect(() => {
    if (!debouncedQuery) {
      setResults([]);
      setIsSearching(false);
      return;
    }

    const controller = new AbortController();

    const search = async () => {
      setIsSearching(true);
      try {
        const res = await fetch("/api/search", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ query: debouncedQuery }),
          signal: controller.signal,
        });

        if (!res.ok) {
          setResults([]);
          return;
        }

        const data = await res.json();
        if (Array.isArray(data)) {
          setResults(data);
          updateRecent(debouncedQuery);
        } else {
          setResults([]);
        }
      } catch (e) {
        if ((e as Error).name !== "AbortError") {
          setResults([]);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsSearching(false);
        }
      }
    };

    search();

    return () => {
      controller.abort();
    };
  }, [debouncedQuery, updateRecent]);

  return (
    <div className="w-full max-w-3xl mx-auto relative z-20">
      <div className={`relative group ${isSearching ? 'animate-pulse' : ''}`}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Sparkles className={`h-5 w-5 ${isSearching ? 'text-blue-400' : 'text-muted-foreground'}`} />
        </div>
        <Input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by use case, workflow, or capability"
          className="peer block w-full rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(12,18,30,0.78),rgba(8,12,20,0.7))] pl-12 pr-4 py-7 text-lg text-white ring-offset-background placeholder:text-blue-100/42 shadow-[0_20px_70px_rgba(0,0,0,0.32)] backdrop-blur-2xl focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
        />
        {isSearching && (
          <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
            <span className="text-sm text-blue-400 animate-pulse">Searching marketplace...</span>
          </div>
        )}
      </div>

      {recent.length > 0 && !query && (
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {recent.map(r => (
            <button
              key={r}
              onClick={() => setQuery(r)}
              className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs text-muted-foreground hover:bg-white/10 transition-colors"
            >
              {r}
            </button>
          ))}
        </div>
      )}

      {results.length > 0 && (
        <div className="glass-surface mt-5 rounded-[1.75rem] p-6 text-left">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Search Results</h3>
          <div className="space-y-4">
            {results.map(r => (
              <div key={r.agent.id} className="relative group rounded-2xl border border-white/8 bg-white/[0.035] p-4 transition-colors hover:bg-white/[0.06]">
                <p className="text-sm italic text-blue-200 mb-3 border-l-2 border-blue-500 pl-3">&quot;{r.matchReason}&quot;</p>
                <AgentCard agent={r.agent} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
