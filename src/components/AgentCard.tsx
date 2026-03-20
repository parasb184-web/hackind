import Link from "next/link";
import { Agent } from "@/lib/types";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrustScoreBadge } from "./TrustScoreBadge";
import { Star, Clock, DollarSign, Activity, GitBranch } from "lucide-react";

const getTagColor = (tag: string) => {
  const colors = [
    "bg-blue-500/10 text-blue-500 border-blue-500/20",
    "bg-purple-500/10 text-purple-500 border-purple-500/20",
    "bg-pink-500/10 text-pink-500 border-pink-500/20",
    "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
    "bg-teal-500/10 text-teal-500 border-teal-500/20",
  ];
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  return colors[Math.abs(hash) % colors.length];
};

const formatCalls = (num: number) => {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
  if (num >= 1000) return (num / 1000).toFixed(1) + "k";
  return num.toString();
};

export const AgentCard = ({ agent }: { agent: Agent }) => {
  return (
    <Link href={`/agents/${agent.id}`}>
      <Card className="h-full flex flex-col hover:border-blue-300 transition-all cursor-pointer bg-white overflow-hidden group shadow-sm hover:shadow-md border-neutral-200/60">
        <CardHeader className="pb-3 px-5 pt-5 flex flex-row items-start justify-between">
          <div className="flex-1 space-y-1">
            <CardTitle className="text-base font-bold truncate leading-tight flex items-center gap-2">
              {agent.name}
              {agent.version && <span className="text-xs font-normal text-muted-foreground bg-muted px-1.5 py-0.5 rounded">v{agent.version}</span>}
            </CardTitle>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-mono flex items-center">
                <img src={`https://github.com/${agent.creatorUsername}.png?size=32`} className="w-4 h-4 rounded-full mr-1.5" alt="" />
                {agent.creatorUsername}
              </span>
            </div>
          </div>
          <div>
            <TrustScoreBadge trustScore={agent.trustScore || 50} />
          </div>
        </CardHeader>
        <CardContent className="px-5 pb-4 flex-1">
          <p className="text-sm text-foreground/80 line-clamp-2 h-10 mb-4">{agent.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {agent.capabilityTags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="outline" className={`font-mono text-[10px] px-1.5 py-0 border ${getTagColor(tag)}`}>
                {tag}
              </Badge>
            ))}
            {agent.capabilityTags.length > 3 && (
              <Badge variant="outline" className="font-mono text-[10px] px-1.5 py-0 border bg-muted/50 text-muted-foreground">
                +{agent.capabilityTags.length - 3}
              </Badge>
            )}
          </div>
        </CardContent>
        <CardFooter className="px-5 py-3 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500">
          <div className="flex gap-4">
            <span className="flex items-center gap-1 group-hover:text-amber-500 transition-colors">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              {agent.rating?.toFixed(1) || "New"}
            </span>
            <span className="flex items-center gap-1 group-hover:text-blue-400 transition-colors truncate">
              <Activity className="w-3.5 h-3.5" />
              {formatCalls(agent.totalCalls || 0)} calls
            </span>
          </div>
          <div className="flex items-baseline gap-1 text-right text-foreground">
            <span className="font-mono text-xs">${agent.costPerCall?.toFixed(3) || "0.000"}</span>
            <span className="text-[10px] items-baseline text-muted-foreground font-mono">/call</span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
};
