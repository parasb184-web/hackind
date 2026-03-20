"use client";

import { useEffect, useMemo, useState } from "react";
import { collection, limit, onSnapshot, orderBy, query } from "firebase/firestore";
import { CircleDot } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { db } from "@/lib/firebase";
import { ActivityFeedItem, ActivityItem } from "@/components/ActivityItem";

export const LiveFeed = () => {
  const [items, setItems] = useState<ActivityFeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/activity").catch(() => null);

    const feedQuery = query(
      collection(db, "activity_feed"),
      orderBy("timestamp", "desc"),
      limit(15)
    );

    const unsubscribe = onSnapshot(
      feedQuery,
      (snapshot) => {
        const nextItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<ActivityFeedItem, "id">),
        }));

        setItems(nextItems);
        setIsLoading(false);
      },
      () => {
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const renderedItems = useMemo(() => items.slice(0, 15), [items]);

  return (
    <section className="glass-surface floating-glass rounded-[2rem] p-6 bg-white/80 border border-neutral-200 shadow-xl">
      <div className="mb-5 flex items-center justify-between">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.24em] text-emerald-600">
            <CircleDot className="h-3.5 w-3.5 live-pulse-dot" />
            Live on AgentHub
          </div>
          <h3 className="mt-4 text-2xl font-bold tracking-tight text-neutral-900">Marketplace activity</h3>
        </div>
      </div>

      <div className="space-y-3 overflow-hidden" style={{ maxHeight: 400 }}>
        {isLoading
          ? Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-20 rounded-2xl bg-neutral-100" />
            ))
          : renderedItems.map((item) => <ActivityItem key={item.id} item={item} />)}
      </div>
    </section>
  );
};
