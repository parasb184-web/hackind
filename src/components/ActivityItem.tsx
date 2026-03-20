"use client";

import { formatDistanceToNow } from "date-fns";

export interface ActivityFeedItem {
  id: string;
  agentName: string;
  repoType: string;
  eventType: string;
  timestamp?: { toDate?: () => Date } | Date | string | null;
}

const getAccentClass = (value: string) => {
  const accents = [
    "bg-blue-500",
    "bg-emerald-500",
    "bg-cyan-500",
    "bg-orange-500",
    "bg-fuchsia-500",
  ];

  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = value.charCodeAt(i) + ((hash << 5) - hash);
  }

  return accents[Math.abs(hash) % accents.length];
};

const normalizeDate = (value: ActivityFeedItem["timestamp"]) => {
  if (!value) return new Date();
  if (value instanceof Date) return value;
  if (typeof value === "string") return new Date(value);
  if (typeof value === "object" && typeof value.toDate === "function") return value.toDate();
  return new Date();
};

export const ActivityItem = ({ item }: { item: ActivityFeedItem }) => {
  const accent = getAccentClass(item.agentName);
  const timestamp = normalizeDate(item.timestamp);

  return (
    <div className="animate-in fade-in slide-in-from-top-3 flex items-start gap-3 rounded-2xl border border-neutral-100 bg-white px-4 py-3 duration-500 shadow-sm hover:shadow-md transition-shadow">
      <span className={`mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full ${accent}`} />
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-6 text-neutral-600">
          <span className="font-bold text-neutral-900">{item.agentName}</span>
          {" was "}
          <span className="font-medium text-blue-600">{item.eventType}</span>
          {" by a "}
          <span className="font-medium text-neutral-500">{item.repoType}</span>
        </p>
        <p className="mt-1 text-[11px] font-bold uppercase tracking-[0.24em] text-neutral-400">
          {formatDistanceToNow(timestamp, { addSuffix: true })}
        </p>
      </div>
    </div>
  );
};
