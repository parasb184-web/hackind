"use client";

import { useState } from "react";
import { ScanSearch, Github, FileJson, Briefcase, FileText } from "lucide-react";
import { Button } from "./ui/button";

export function ScanInput({ onAnalyze }: { onAnalyze: (input: string, type: string) => void }) {
  const [input, setInput] = useState("");
  const [type, setType] = useState<"github" | "notion" | "errorlog" | "jobdescription" | "plaintext">("plaintext");

  const detectType = (text: string) => {
    if (text.match(/github\.com\/[\w-]+\/[\w-]+/)) return "github";
    if (text.match(/notion\.so\//)) return "notion";
    if (text.match(/Error:|Exception|Traceback|at line/i)) return "errorlog";
    if (text.match(/hiring|position|requirements|responsibilities|qualifications/i)) return "jobdescription";
    return "plaintext";
  };

  const handleInput = (val: string) => {
    setInput(val);
    setType(detectType(val));
  };

  const typeConfig = {
    github: { icon: <Github className="w-4 h-4" />, label: "GitHub Repo detected", color: "text-white", bg: "bg-white/10", placeholder: "Paste a GitHub repo URL e.g. github.com/vercel/next.js" },
    notion: { icon: <FileText className="w-4 h-4" />, label: "Notion Doc detected", color: "text-white", bg: "bg-white/10", placeholder: "Paste a Notion link..." },
    errorlog: { icon: <FileJson className="w-4 h-4" />, label: "Error Log detected", color: "text-red-400", bg: "bg-red-500/10", placeholder: "Paste your error log or stack trace..." },
    jobdescription: { icon: <Briefcase className="w-4 h-4" />, label: "Job Description detected", color: "text-blue-400", bg: "bg-blue-500/10", placeholder: "Paste a job description..." },
    plaintext: { icon: <ScanSearch className="w-4 h-4" />, label: "Plain Text", color: "text-muted-foreground", bg: "bg-white/5", placeholder: "Describe your project in plain English or paste URLs..." }
  };

  const config = typeConfig[type];

  return (
    <div className="w-full max-w-4xl mx-auto space-y-4">
      <div className="relative group">
        <textarea
          className="w-full min-h-[200px] bg-black/40 border border-white/10 rounded-2xl p-6 text-lg placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-blue-500 resize-none font-mono"
          placeholder={config.placeholder}
          value={input}
          onChange={(e) => handleInput(e.target.value)}
        />

        {input && (
          <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${config.color} ${config.bg} border border-current/20 transition-all`}>
            {config.icon}
            {config.label}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <Button
          size="lg"
          disabled={!input}
          onClick={() => onAnalyze(input, type)}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 px-8 h-12 rounded-xl text-base"
        >
          <ScanSearch className="w-5 h-5" />
          Analyse & Match Agents
        </Button>
      </div>
    </div>
  );
}
