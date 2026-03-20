"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Newspaper } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AINewsResponse } from "@/lib/homepageFeed";

const fetchNews = async (): Promise<AINewsResponse> => {
  const response = await fetch("/api/ai-news");
  if (!response.ok) {
    throw new Error("Failed to load AI news");
  }
  return response.json();
};

const formatPublishedDate = (value: string) =>
  new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));

export const LatestAINewsSection = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["homepage", "ai-news"],
    queryFn: fetchNews,
    staleTime: 1000 * 60 * 15,
  });

  const items = data?.items || [];
  const newsRail = isLoading ? Array.from({ length: 8 }) : [...items.slice(0, 8), ...items.slice(0, 8)];

  return (
    <section className="glass-surface relative overflow-hidden rounded-[2rem] px-6 py-8 md:px-8 md:py-10 border border-neutral-200 bg-white/80 shadow-lg">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/20 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,0.05),transparent_28%),radial-gradient(circle_at_bottom_right,rgba(148,163,184,0.04),transparent_35%)] pointer-events-none" />

      <div className="relative z-10">
        <div className="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-blue-600">
              <Newspaper className="h-3.5 w-3.5" />
              Latest AI News
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900 md:text-3xl">
              Latest AI news and market signals
            </h2>
          </div>
          <p className="max-w-lg text-sm leading-6 text-neutral-600">
            A continuously updated news rail covering recent AI developments, product launches, and ecosystem movement.
          </p>
        </div>

        <div className="marquee-shell overflow-hidden mask-edges-light">
          <div className="marquee-track marquee-track-news flex gap-4">
          {newsRail.map((item: any, index) => (
            <Card
              key={`${item?.id || "news"}-${index}`}
              className="glass-surface-soft news-float w-[320px] shrink-0 p-5 border border-neutral-200 bg-white/90 hover:shadow-lg transition-shadow"
              style={{ animationDelay: `${index * 0.8}s` }}
            >
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-4 w-1/3 bg-neutral-100" />
                  <Skeleton className="h-14 w-full bg-neutral-100" />
                  <Skeleton className="h-4 w-2/3 bg-neutral-100" />
                </div>
              ) : (
                <div className="flex h-full flex-col">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <Badge variant="outline" className="border-blue-200 bg-blue-50 font-medium text-blue-600">
                      {item.source}
                    </Badge>
                    <span className="text-[11px] uppercase font-bold tracking-[0.22em] text-neutral-400">
                      {formatPublishedDate(item.publishedAt)}
                    </span>
                  </div>

                  <p className="flex-1 text-base font-bold leading-7 text-neutral-900">
                    {item.title}
                  </p>

                  <Link
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-blue-600 transition-colors hover:text-blue-800"
                  >
                    Open story
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                </div>
              )}
            </Card>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
};
