"use client";

import { useAgents } from "@/hooks/useAgents";
import { AgentGrid } from "@/components/AgentGrid";
import { FilterSidebar } from "@/components/FilterSidebar";
import { useQueryState, parseAsArrayOf, parseAsString, parseAsFloat } from "nuqs";
import { useMemo, Suspense } from "react";
import { SearchBar } from "@/components/SearchBar";
import { Agent } from "@/lib/types";

const SEARCH_SYNONYMS: Record<string, string[]> = {
  study: ["research", "analysis", "summarization", "translation", "data-extraction", "education", "learning"],
  research: ["study", "analysis", "summarization", "data-extraction"],
  learn: ["study", "education", "translation", "summarization"],
  write: ["content-creation", "marketing", "generative", "copy"],
  build: ["code-generation", "frontend", "automation", "productivity"],
  code: ["code-review", "code-generation", "frontend", "testing"],
  data: ["data-extraction", "analytics", "database", "summarization"],
  audio: ["speech-to-text", "transcription", "voice", "nlp"],
  image: ["computer-vision", "analysis", "healthcare"],
  support: ["customer-support", "automation", "nlp"],
};

const tokenize = (value: string) =>
  value
    .toLowerCase()
    .split(/[^a-z0-9+#.-]+/)
    .filter(Boolean);

const getSearchScore = (agent: Agent, query: string) => {
  if (!query.trim()) return 1;

  const normalizedQuery = query.toLowerCase().trim();
  const queryTokens = tokenize(normalizedQuery);
  const expandedTokens = new Set(
    queryTokens.flatMap((token) => [token, ...(SEARCH_SYNONYMS[token] || [])])
  );

  const searchableParts = [
    agent.name,
    agent.description,
    agent.creatorUsername,
    agent.capabilityTags.join(" "),
    agent.supportedLanguages.join(" "),
  ];

  const searchableText = searchableParts.join(" ").toLowerCase();
  let score = 0;

  if (searchableText.includes(normalizedQuery)) {
    score += 12;
  }

  for (const token of expandedTokens) {
    if (searchableText.includes(token)) {
      score += queryTokens.includes(token) ? 4 : 2;
    }
  }

  for (const tag of agent.capabilityTags) {
    const normalizedTag = tag.toLowerCase();
    if (expandedTokens.has(normalizedTag)) {
      score += 5;
    }
    if (queryTokens.some((token) => normalizedTag.includes(token))) {
      score += 3;
    }
  }

  for (const language of agent.supportedLanguages) {
    if (expandedTokens.has(language.toLowerCase())) {
      score += 2;
    }
  }

  return score;
};

const hasStrongQueryMatch = (score: number, query: string) => {
  const tokenCount = tokenize(query).length;
  if (tokenCount <= 1) return score >= 4;
  return score >= 6;
};

function AgentsContent() {
  const { data: agents = [], isLoading } = useAgents();

  const [q] = useQueryState("q", { defaultValue: "" });
  const [tags] = useQueryState("tags", parseAsArrayOf(parseAsString).withDefault([]));
  const [langs] = useQueryState("langs", parseAsArrayOf(parseAsString).withDefault([]));
  const [maxCost] = useQueryState("cost", parseAsFloat.withDefault(1.0));
  const [minTrust] = useQueryState("trust", parseAsFloat.withDefault(0));
  const [sort] = useQueryState("sort", parseAsString.withDefault("newest"));

  const filteredAgents = useMemo(() => {
    const scoredAgents = agents
      .map((agent) => ({
        agent,
        searchScore: getSearchScore(agent, q),
      }))
      .filter(({ agent, searchScore }) => {
        if (agent.costPerCall > maxCost) return false;
        if (agent.trustScore < minTrust) return false;
        if (tags.length > 0 && !tags.some((tag) => agent.capabilityTags.includes(tag))) return false;
        if (langs.length > 0 && !langs.some((lang) => agent.supportedLanguages.includes(lang))) return false;
        if (q && !hasStrongQueryMatch(searchScore, q)) return false;
        return true;
      });

    const result = scoredAgents
      .sort((a, b) => b.searchScore - a.searchScore)
      .map(({ agent }) => agent);

    if (sort === "newest") {
      return result.sort((a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0));
    }
    if (sort === "used") {
      return result.sort((a, b) => (b.totalCalls || 0) - (a.totalCalls || 0));
    }
    if (sort === "rated") {
      return result.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    }
    if (sort === "cost") {
      return result.sort((a, b) => (a.costPerCall || 0) - (b.costPerCall || 0));
    }

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
