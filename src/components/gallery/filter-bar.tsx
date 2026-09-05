"use client";

import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { categories, type CategoryId } from "@/registry";

interface FilterBarProps {
  category: CategoryId | "all";
  query: string;
  total: number;
  onCategory: (category: CategoryId | "all") => void;
  onQuery: (query: string) => void;
}

export function FilterBar({ category, query, total, onCategory, onQuery }: FilterBarProps) {
  const options: { id: CategoryId | "all"; label: string }[] = [
    { id: "all", label: "全部" },
    ...categories.map((c) => ({ id: c.id, label: c.label })),
  ];

  return (
    <div className="sticky top-14 z-30 -mx-5 border-y border-line bg-canvas/80 px-5 py-3 backdrop-blur-xl md:-mx-8 md:px-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-1.5" role="tablist" aria-label="按分类筛选">
          {options.map((o) => {
            const selected = o.id === category;
            return (
              <button
                key={o.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => onCategory(o.id)}
                className={cn(
                  "rounded-full border px-3.5 py-1.5 text-xs transition-colors",
                  selected
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-line text-mute hover:border-white/20 hover:text-ink",
                )}
              >
                {o.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
            {String(total).padStart(2, "0")} 项
          </span>
          <label className="relative block">
            <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-mute" />
            <input
              value={query}
              onChange={(e) => onQuery(e.target.value)}
              placeholder="筛选…"
              className="h-9 w-44 rounded-full border border-line bg-white/5 pl-9 pr-8 text-xs outline-none transition-colors placeholder:text-mute focus:border-white/25 md:w-56"
            />
            {query ? (
              <button
                type="button"
                aria-label="清空"
                onClick={() => onQuery("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-mute hover:text-ink"
              >
                <X className="size-3" />
              </button>
            ) : null}
          </label>
        </div>
      </div>
    </div>
  );
}
