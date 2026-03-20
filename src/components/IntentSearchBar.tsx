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
          className="peer block w-full pl-12 pr-4 py-6 text-lg bg-black/40 border-white/10 rounded-2xl ring-offset-background placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 overflow-hidden shadow-xl shadow-black/50 backdrop-blur-md"
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
        <div className="mt-4 rounded-2xl border border-white/10 bg-black/90 p-6 text-left shadow-2xl backdrop-blur-xl">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4 uppercase tracking-wider">Search Results</h3>
          <div className="space-y-4">
            {results.map(r => (
              <div key={r.agent.id} className="relative group p-4 border border-white/5 rounded-xl bg-white/5 hover:bg-white/10 transition-colors">
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
