"use client";

import { useQueryState } from "nuqs";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const SearchBar = () => {
  const [query, setQuery] = useQueryState("q", { defaultValue: "" });

  return (
    <div className="relative max-w-2xl w-full mx-auto">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <Input
        type="text"
        placeholder="Try 'summarize prs' or 'extract data'..."
        className="w-full pl-12 pr-4 py-6 rounded-full bg-white/5 border-white/20 focus-visible:ring-blue-500 shadow-xl text-lg backdrop-blur-sm transition-all focus:bg-white/10"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
    </div>
  );
};
