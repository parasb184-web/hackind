"use client";

import { useState, useEffect } from "react";
import { Copy, Check } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Agent } from "@/lib/types";
import { codeToHtml } from "shiki";
import { toast } from "sonner";
import { useAuth } from "@/lib/AuthContext";

export const SDKSnippet = ({ agent }: { agent: Agent }) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [snippets, setSnippets] = useState<{ py: string; js: string; cur: string }>({ py: "", js: "", cur: "" });

  const inputJson = agent.exampleInput ? JSON.stringify(agent.exampleInput) : "{}";
  const apiKey = user ? "API_KEY_HERE" : "YOUR_API_KEY"; // Real integration would use db keys

  const pyCode = `import requests

response = requests.post(
    "https://agenthub.io/api/sandbox/${agent.id}",
    headers={"Authorization": "Bearer ${apiKey}"},
    json=${inputJson},
    timeout=10
)
result = response.json()
print(result)`;

  const jsCode = `const response = await fetch(
    "https://agenthub.io/api/sandbox/${agent.id}",
    {
        method: "POST",
        headers: {
            "Authorization": "Bearer ${apiKey}",
            "Content-Type": "application/json"
        },
        body: JSON.stringify(${inputJson})
    }
);
const result = await response.json();
console.log(result);`;

  const curlCode = `curl -X POST https://agenthub.io/api/sandbox/${agent.id} \\
  -H "Authorization: Bearer ${apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '${inputJson}'`;

  useEffect(() => {
    const highlight = async () => {
      const p = await codeToHtml(pyCode, { lang: "python", theme: "github-dark" });
      const j = await codeToHtml(jsCode, { lang: "javascript", theme: "github-dark" });
      const c = await codeToHtml(curlCode, { lang: "bash", theme: "github-dark" });
      setSnippets({ py: p, js: j, cur: c });
    };
    highlight();
  }, [pyCode, jsCode, curlCode]);

  const onCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast("Copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-xl overflow-hidden border border-white/10 bg-[#0d1117] mt-8">
      <Tabs defaultValue="python" className="w-full">
        <div className="flex items-center justify-between border-b border-white/10 bg-white/5 pr-4">
          <TabsList className="bg-transparent rounded-none p-0 h-10 border-0">
            <TabsTrigger value="python" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-10 border-b-2 border-transparent hover:text-white px-4">Python</TabsTrigger>
            <TabsTrigger value="javascript" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-10 border-b-2 border-transparent hover:text-white px-4">JavaScript</TabsTrigger>
            <TabsTrigger value="curl" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-500 rounded-none h-10 border-b-2 border-transparent hover:text-white px-4">cURL</TabsTrigger>
          </TabsList>
          <button
            onClick={() => {
              const el = document.querySelector('[data-state="active"][role="tab"]');
              if (!el) return;
              const v = el.getAttribute("data-value");
              if (v === "python") onCopy(pyCode);
              else if (v === "javascript") onCopy(jsCode);
              else onCopy(curlCode);
            }}
            className="text-muted-foreground hover:text-white transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        <TabsContent value="python" className="p-4 overflow-x-auto text-sm my-0 ui-highlight-container" dangerouslySetInnerHTML={{ __html: snippets.py }} />
        <TabsContent value="javascript" className="p-4 overflow-x-auto text-sm my-0 ui-highlight-container" dangerouslySetInnerHTML={{ __html: snippets.js }} />
        <TabsContent value="curl" className="p-4 overflow-x-auto text-sm my-0 ui-highlight-container" dangerouslySetInnerHTML={{ __html: snippets.cur }} />
      </Tabs>
      <style>{`
        .ui-highlight-container pre { background-color: transparent !important; margin: 0; }
        .ui-highlight-container code { font-family: 'JetBrains Mono', monospace; line-height: 1.5; }
      `}</style>
    </div>
  );
};
