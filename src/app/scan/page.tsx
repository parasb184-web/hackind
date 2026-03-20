"use client";

import { useState } from "react";
import { ScanInput } from "@/components/ScanInput";
import { RepoDNAResult } from "@/components/RepoDNAResult";
import { GapDetectorCard } from "@/components/GapDetectorCard";

export default function ScanPage() {
  const [scanResult, setScanResult] = useState<any>(null);
  const [gapAgents, setGapAgents] = useState<any[]>([]);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState("");

  const handleAnalyze = async (input: string, type: string) => {
    if (type !== "github") {
      setError("Currently, only GitHub Repositories are supported in this demo phase.");
      return;
    }

    setError("");
    setIsScanning(true);
    setScanResult(null);
    setGapAgents([]);

    try {
      const resp = await fetch("/api/github-scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoUrl: input })
      });
      const data = await resp.json();

      if (!resp.ok) throw new Error(data.error || "Failed to scan repo");

      setScanResult(data);

      const langs = Object.keys(data.repoMeta?.primaryLanguage ? { [data.repoMeta.primaryLanguage]: 1 } : {});
      const userCats = data.painPoints?.map((p: any) => p.agentCategory) || [];

      // Feature 8: Request Gap Detection
      const gapResp = await fetch("/api/gap-detect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ repoLanguages: langs, repoTags: ["web", "frontend"], currentCategories: userCats })
      });

      if (gapResp.ok) {
        const gapData = await gapResp.json();
        setGapAgents(gapData);
      }

    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-24 min-h-screen">
      <div className="text-center max-w-3xl mx-auto mb-16">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">Multi-Context Scan</h1>
        <p className="text-lg text-muted-foreground">
          Drop in a GitHub repo, Jira ticket, or system error log.
          AgentHub uses Claude 3.5 Sonnet to map your exact pain points straight to ready-to-deploy autonomous agents.
        </p>
      </div>

      {!scanResult && !isScanning && (
        <ScanInput onAnalyze={handleAnalyze} />
      )}

      {error && (
        <div className="mt-8 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-center rounded-xl max-w-2xl mx-auto">
          {error}
        </div>
      )}

      {(isScanning || scanResult) && (
        <RepoDNAResult result={scanResult} />
      )}

      {scanResult && gapAgents.length > 0 && (
        <div className="mt-24 pt-12 border-t border-white/5 animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
          <h2 className="text-2xl font-bold tracking-tight mb-8 text-center">Missing Capabilities Detectors</h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Based on millions of similar repository structures within Upstash Vector, AgentHub identified that you are missing several key automation nodes standard in this stack.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {gapAgents.map((g, idx) => (
              <GapDetectorCard key={idx} gapInfo={g} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
