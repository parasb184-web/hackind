"use client";

import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Flame, GitFork, Sparkles, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingAgentsResponse } from "@/lib/homepageFeed";

const fetchTrendingAgents = async (): Promise<TrendingAgentsResponse> => {
  const response = await fetch("/api/trending-agents");
  if (!response.ok) {
    throw new Error("Failed to load trending agents");
  }
  return response.json();
};

const formatCompactNumber = (value: number) =>
  Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value);

const formatRelativeDate = (value: string) =>
  new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(new Date(value));

export const TrendingAgentsSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["homepage", "trending-agents"],
    queryFn: fetchTrendingAgents,
    staleTime: 1000 * 60 * 30,
  });

  const trending = data?.trending || [];
  const picked = data?.picked || [];
  const trendingRail = isLoading ? Array.from({ length: 6 }) : [...trending, ...trending];
  const pickedRail = isLoading ? Array.from({ length: 6 }) : [...picked, ...picked];

  return (
    <section className="glass-surface relative overflow-hidden rounded-[2rem] p-8 md:p-10 border border-neutral-200 bg-white/80 shadow-lg">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.1),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(96,165,250,0.05),transparent_35%)] pointer-events-none" />

      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-orange-300">
              <Flame className="h-3.5 w-3.5" />
              Trending AI
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-neutral-900 md:text-4xl">
              What builders are watching this week
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-neutral-600 md:text-base">
              Fresh AI agent projects pulled from a public feed, tuned to feel like a live trending shelf instead of a static directory.
            </p>
          </div>

          <div className="marquee-shell w-full max-w-xl overflow-hidden mask-edges-light">
            <div className="marquee-track marquee-track-slow flex gap-3">
              {pickedRail.map((agent: any, index) => (
                <div
                  key={`${agent?.id || "picked"}-${index}`}
                    className="glass-surface-soft min-w-[190px] rounded-2xl px-4 py-3 border border-neutral-200 bg-white/90"
                >
                  {isLoading ? (
                    <Skeleton className="h-16 rounded-xl bg-neutral-100" />
                  ) : (
                    <>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[11px] font-bold uppercase tracking-[0.24em] text-blue-500">
                          Picked
                        </span>
                        <Sparkles className="h-4 w-4 text-blue-400" />
                      </div>
                      <p className="line-clamp-1 text-sm font-bold text-neutral-900">{agent.name}</p>
                      <p className="mt-1 text-xs text-neutral-500 font-medium">
                        {formatCompactNumber(agent.stars)} stars
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="marquee-shell overflow-hidden mask-edges-light">
          <div className="marquee-track flex gap-5">
            {trendingRail.map((agent: any, index) => (
              <Card
                key={`${agent?.id || "trend"}-${index}`}
                className="glass-surface group min-h-[430px] w-[340px] shrink-0 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl border-neutral-200 bg-white/90"
              >
              {isLoading ? (
                <CardContent className="space-y-4 p-6">
                  <Skeleton className="h-5 w-2/3 bg-neutral-100" />
                  <Skeleton className="h-12 w-full bg-neutral-100" />
                  <Skeleton className="h-10 w-full bg-neutral-100" />
                </CardContent>
              ) : (
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mb-3 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-orange-200 bg-orange-50 text-[10px] uppercase font-bold tracking-[0.22em] text-orange-600"
                        >
                          #{index + 1} trending
                        </Badge>
                        <Badge variant="outline" className="border-blue-200 bg-blue-50 font-medium text-blue-600">
                          {agent.language}
                        </Badge>
                      </div>
                      <h3 className="line-clamp-1 text-lg font-bold text-neutral-900">{agent.name}</h3>
                      <p className="mt-1 text-sm text-neutral-500 font-medium">by {agent.owner}</p>
                    </div>
                    <Image
                      src={agent.ownerAvatarUrl}
                      alt={agent.owner}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full border border-neutral-200 object-cover"
                    />
                  </div>

                  <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-neutral-700">
                    {agent.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {agent.topics.slice(0, 3).map((topic: string) => (
                      <Badge
                        key={topic}
                        variant="outline"
                        className="border-neutral-200 bg-neutral-50 text-[11px] text-neutral-600"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-neutral-100 bg-neutral-50 p-3 text-sm">
                    <div>
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="h-3.5 w-3.5 fill-amber-500" />
                        <span>{formatCompactNumber(agent.stars)}</span>
                      </div>
                      <p className="mt-1 text-[11px] uppercase font-bold tracking-[0.2em] text-neutral-400">Stars</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-blue-600 font-bold">
                        <GitFork className="h-3.5 w-3.5" />
                        <span>{formatCompactNumber(agent.forks)}</span>
                      </div>
                      <p className="mt-1 text-[11px] uppercase font-bold tracking-[0.2em] text-neutral-400">Forks</p>
                    </div>
                    <div>
                      <div className="text-neutral-900 font-bold">{agent.velocityScore}/99</div>
                      <p className="mt-1 text-[11px] uppercase font-bold tracking-[0.2em] text-neutral-400">Heat</p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.22em] font-bold text-neutral-400">
                      Updated {formatRelativeDate(agent.updatedAt)}
                    </p>
                    <Link
                      href={agent.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition-colors hover:text-blue-800"
                    >
                      View repo
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
};
