"use client";

import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export const TrustScoreBadge = ({ trustScore }: { trustScore: number }) => {
  let colorClass = "bg-red-500/10 text-red-500 hover:bg-red-500/20";
  let label = "Unverified";

  if (trustScore >= 80) {
    colorClass = "bg-green-500/10 text-green-500 hover:bg-green-500/20";
    label = "Trusted";
  } else if (trustScore >= 50) {
    colorClass = "bg-amber-500/10 text-amber-500 hover:bg-amber-500/20";
    label = "Moderate";
  }

  return (
    <Tooltip>
      <TooltipTrigger>
        <span className="cursor-help">
          <Badge variant="outline" className={`border-0 ${colorClass}`}>
            {label} {trustScore}
          </Badge>
        </span>
      </TooltipTrigger>
      <TooltipContent>
        <p>Uptime 30% · Accuracy 25% · Rating 20% · Open Source 15% · Age 10%</p>
      </TooltipContent>
    </Tooltip>
  );
};
