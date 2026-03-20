"use client";

import { useQueryState, parseAsArrayOf, parseAsString, parseAsFloat } from "nuqs";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Agent } from "@/lib/types";
import { useMemo } from "react";

export const FilterSidebar = ({ agents }: { agents: Agent[] }) => {
  const [tags, setTags] = useQueryState("tags", parseAsArrayOf(parseAsString).withDefault([]));
  const [langs, setLangs] = useQueryState("langs", parseAsArrayOf(parseAsString).withDefault([]));
  const [maxCost, setMaxCost] = useQueryState("cost", parseAsFloat.withDefault(0.1));
  const [minTrust, setMinTrust] = useQueryState("trust", parseAsFloat.withDefault(0));
  const [sort, setSort] = useQueryState("sort", parseAsString.withDefault("newest"));

  const allTags = useMemo(() => Array.from(new Set(agents.flatMap((a) => a.capabilityTags))).sort(), [agents]);
  const allLangs = useMemo(() => Array.from(new Set(agents.flatMap((a) => a.supportedLanguages))).sort(), [agents]);

  const toggleTag = (tag: string) => {
    if (tags.includes(tag)) setTags(tags.filter((t) => t !== tag));
    else setTags([...tags, tag]);
  };

  const toggleLang = (lang: string) => {
    if (langs.includes(lang)) setLangs(langs.filter((l) => l !== lang));
    else setLangs([...langs, lang]);
  };

  return (
    <div className="space-y-8 pr-6 sticky top-24">
      <div>
        <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Sort By</h4>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="w-full bg-white border border-neutral-200 text-neutral-900 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 shadow-sm"
        >
          <option value="newest">Newest</option>
          <option value="used">Most Used</option>
          <option value="rated">Highest Rated</option>
          <option value="cost">Lowest Cost</option>
        </select>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Max Cost / Call</h4>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground">$0</span>
          <span className="text-xs font-mono text-blue-600 font-bold">${maxCost.toFixed(3)}</span>
        </div>
        <Slider
          value={[maxCost]}
          min={0}
          max={0.1}
          step={0.001}
          onValueChange={(vals) => setMaxCost((vals as number[])[0])}
          className="w-full"
        />
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Min Trust Score</h4>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xs text-muted-foreground">0</span>
          <span className="text-xs font-mono text-blue-600 font-bold">{minTrust}</span>
        </div>
        <Slider
          value={[minTrust]}
          min={0}
          max={100}
          step={1}
          onValueChange={(vals) => setMinTrust((vals as number[])[0])}
          className="w-full"
        />
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Capabilities</h4>
        <div className="space-y-3 max-h-48 overflow-y-auto custom-scrollbar">
          {allTags.map((tag) => (
            <label key={tag} className="flex items-center space-x-3 cursor-pointer group">
              <Checkbox checked={tags.includes(tag)} onCheckedChange={() => toggleTag(tag)} className="border-neutral-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 shadow-sm" />
              <span className="text-sm text-neutral-600 group-hover:text-neutral-900 font-medium transition-colors">{tag}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h4 className="font-semibold text-sm mb-4 uppercase tracking-wider text-muted-foreground">Languages</h4>
        <div className="space-y-3">
          {allLangs.map((lang) => (
            <label key={lang} className="flex items-center space-x-3 cursor-pointer group">
              <Checkbox checked={langs.includes(lang)} onCheckedChange={() => toggleLang(lang)} className="border-neutral-300 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600 shadow-sm" />
              <span className="text-sm text-neutral-600 group-hover:text-neutral-900 font-medium transition-colors">{lang}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
};
