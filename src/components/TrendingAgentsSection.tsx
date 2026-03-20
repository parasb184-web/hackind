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
    <section className="relative overflow-hidden rounded-[2rem] border border-blue-500/15 bg-[linear-gradient(135deg,rgba(10,10,10,0.96),rgba(11,28,48,0.92)_48%,rgba(7,15,30,0.98))] p-8 md:p-10">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(59,130,246,0.20),transparent_30%),radial-gradient(circle_at_bottom_left,rgba(96,165,250,0.12),transparent_35%)]" />

      <div className="relative z-10 flex flex-col gap-8">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-orange-300">
              <Flame className="h-3.5 w-3.5" />
              Trending AI
            </div>
            <h2 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
              What builders are watching this week
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-blue-100/70 md:text-base">
              Fresh AI agent projects pulled from a public feed, tuned to feel like a live trending shelf instead of a static directory.
            </p>
          </div>

          <div className="marquee-shell w-full max-w-xl overflow-hidden">
            <div className="marquee-track marquee-track-slow flex gap-3">
              {pickedRail.map((agent, index) => (
                <div
                  key={`${agent?.id || "picked"}-${index}`}
                  className="min-w-[190px] rounded-2xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
                >
                  {isLoading ? (
                    <Skeleton className="h-16 rounded-xl bg-white/10" />
                  ) : (
                    <>
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-[11px] font-semibold uppercase tracking-[0.24em] text-blue-200/60">
                          Picked
                        </span>
                        <Sparkles className="h-4 w-4 text-blue-300" />
                      </div>
                      <p className="line-clamp-1 text-sm font-semibold text-white">{agent.name}</p>
                      <p className="mt-1 text-xs text-blue-100/60">
                        {formatCompactNumber(agent.stars)} stars
                      </p>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="marquee-shell overflow-hidden">
          <div className="marquee-track flex gap-5">
            {trendingRail.map((agent, index) => (
              <Card
                key={`${agent?.id || "trend"}-${index}`}
                className="group min-h-[430px] w-[340px] shrink-0 border-white/10 bg-black/35 shadow-[0_20px_80px_rgba(0,0,0,0.28)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1 hover:border-blue-400/40"
              >
              {isLoading ? (
                <CardContent className="space-y-4 p-6">
                  <Skeleton className="h-5 w-2/3 bg-white/10" />
                  <Skeleton className="h-12 w-full bg-white/10" />
                  <Skeleton className="h-10 w-full bg-white/10" />
                </CardContent>
              ) : (
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mb-3 flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className="border-orange-400/30 bg-orange-500/10 text-[10px] uppercase tracking-[0.22em] text-orange-200"
                        >
                          #{index + 1} trending
                        </Badge>
                        <Badge variant="outline" className="border-blue-400/25 bg-blue-500/10 text-blue-200">
                          {agent.language}
                        </Badge>
                      </div>
                      <h3 className="line-clamp-1 text-lg font-semibold text-white">{agent.name}</h3>
                      <p className="mt-1 text-sm text-blue-100/60">by {agent.owner}</p>
                    </div>
                    <Image
                      src={agent.ownerAvatarUrl}
                      alt={agent.owner}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full border border-white/10 object-cover"
                    />
                  </div>

                  <p className="line-clamp-3 min-h-[4.5rem] text-sm leading-6 text-blue-50/72">
                    {agent.description}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {agent.topics.slice(0, 3).map((topic) => (
                      <Badge
                        key={topic}
                        variant="outline"
                        className="border-white/10 bg-white/5 text-[11px] text-blue-100/70"
                      >
                        {topic}
                      </Badge>
                    ))}
                  </div>

                  <div className="mt-6 grid grid-cols-3 gap-3 rounded-2xl border border-white/8 bg-white/5 p-3 text-sm">
                    <div>
                      <div className="flex items-center gap-1 text-amber-300">
                        <Star className="h-3.5 w-3.5 fill-amber-300" />
                        <span>{formatCompactNumber(agent.stars)}</span>
                      </div>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-blue-100/40">Stars</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-blue-300">
                        <GitFork className="h-3.5 w-3.5" />
                        <span>{formatCompactNumber(agent.forks)}</span>
                      </div>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-blue-100/40">Forks</p>
                    </div>
                    <div>
                      <div className="text-white">{agent.velocityScore}/99</div>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-blue-100/40">Heat</p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <p className="text-xs uppercase tracking-[0.22em] text-blue-100/40">
                      Updated {formatRelativeDate(agent.updatedAt)}
                    </p>
                    <Link
                      href={agent.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-sm font-medium text-blue-200 transition-colors hover:text-white"
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
