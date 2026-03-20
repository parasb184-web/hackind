"use client";

import { useState, useRef, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Agent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Play, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

export const SandboxPanel = ({ agent }: { agent: Agent }) => {
  const defaultInput = agent.exampleInput ? JSON.stringify(agent.exampleInput, null, 2) : "{\n  \n}";
  const [inputCode, setInputCode] = useState(defaultInput);
  const [outputCode, setOutputCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [latency, setLatency] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [apiKey, setApiKey] = useState("");

  const handleRun = async () => {
    setIsLoading(true);
    setError(null);
    setLatency(null);
    setOutputCode("Running agent...");

    try {
      // Validate JSON input
      const parsedInput = JSON.parse(inputCode);

      const res = await fetch(`/api/sandbox/${agent.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${apiKey}` },
        body: JSON.stringify(parsedInput),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Execution failed");
      }

      setOutputCode(JSON.stringify(data.output, null, 2));
      setLatency(data.latencyMs);

    } catch (err: any) {
      setError(err.message);
      setOutputCode(`Error: ${err.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[600px] border border-white/10 rounded-xl overflow-hidden bg-black">
      <div className="flex items-center justify-between px-4 py-3 bg-white/5 border-b border-white/10">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-sm">Live Sandbox</span>
          {latency !== null && (
            <span className="text-xs text-muted-foreground flex items-center gap-1 bg-white/5 px-2 py-1 rounded-md">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              {latency}ms
            </span>
          )}
          {error && (
            <span className="text-xs text-red-500 flex items-center gap-1 bg-red-500/10 px-2 py-1 rounded-md">
              <AlertCircle className="w-3 h-3" />
              Failed
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <input
            type="password"
            placeholder="Enter API Key (ah_...)"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            className="w-48 bg-black/50 border border-white/10 rounded-md px-3 h-8 text-xs font-mono focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-blue-500"
          />
          <Button size="sm" onClick={handleRun} disabled={isLoading || !apiKey} className="bg-blue-600 hover:bg-blue-700 h-8 text-xs font-medium px-4">
            {isLoading ? <Loader2 className="w-3.5 h-3.5 mr-2 animate-spin" /> : <Play className="w-3.5 h-3.5 mr-2" />}
            Run Agent
          </Button>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 divide-x divide-white/10">
        <div className="flex flex-col relative h-full">
          <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-4 py-2 bg-white/5 uppercase">
            Input / JSON payload
          </div>
          <div className="flex-1 overflow-hidden relative group">
            <Editor
              height="100%"
              defaultLanguage="json"
              theme="vs-dark"
              value={inputCode}
              onChange={(v) => setInputCode(v || "")}
              options={{ minimap: { enabled: false }, fontSize: 13, formatOnPaste: true, scrollBeyondLastLine: false, padding: { top: 16 } }}
            />
          </div>
        </div>

        <div className="flex flex-col relative h-full">
          <div className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground px-4 py-2 bg-white/5">
            Output / Responding JSON
          </div>
          <div className="flex-1 overflow-hidden relative">
            <Editor
              height="100%"
              defaultLanguage="json"
              theme="vs-dark"
              value={outputCode}
              options={{ readOnly: true, minimap: { enabled: false }, fontSize: 13, scrollBeyondLastLine: false, padding: { top: 16 } }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
