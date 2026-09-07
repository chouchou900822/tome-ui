"use client";

import { ArrowUpRight, Command, Search, X } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { CategoryId } from "@/registry/types";

export interface NavItem {
  id: CategoryId | "all";
  label: string;
  code: string;
  count: number;
}

interface GalleryNavProps {
  items: NavItem[];
  activeId: CategoryId | "all";
  query: string;
  resultCount: number | null;
  onQuery: (query: string) => void;
  onNavigate: (id: CategoryId | "all") => void;
}

function SearchField({ query, onQuery }: Pick<GalleryNavProps, "query" | "onQuery">) {
  return (
    <div className="relative">
      <Search aria-hidden className="pointer-events-none absolute left-3.5 top-1/2 size-3.5 -translate-y-1/2 text-mute" />
      <input aria-label="搜索词典中的组件" value={query} onChange={(event) => onQuery(event.target.value)} placeholder="寻找你的灵感…"
        className="h-10 w-full rounded-xl border border-line bg-white/[0.025] pl-10 pr-10 text-xs outline-none transition-colors placeholder:text-mute/70 focus:border-accent/40 focus:bg-white/[0.04]" />
      {query ? (
        <button type="button" aria-label="清空搜索" onClick={() => onQuery("")}
          className="absolute right-1.5 top-1/2 grid size-7 -translate-y-1/2 place-items-center rounded-lg text-mute transition-colors hover:bg-white/5 hover:text-ink">
          <X aria-hidden className="size-3.5" />
        </button>
      ) : null}
    </div>
  );
}

export function GalleryNav({ items, activeId, query, resultCount, onQuery, onNavigate }: GalleryNavProps) {
  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-24">
          <div className="mb-5 flex items-center justify-between">
            <p className="eyebrow">组件索引</p>
            <span className="font-mono text-[10px] text-mute/60">{String(items[0]?.count ?? 0).padStart(2, "0")} ITEMS</span>
          </div>
          <SearchField query={query} onQuery={onQuery} />
          <nav aria-label="词典分类目录" className="mt-5">
            <ul className="space-y-1">
              {items.map((item) => {
                const active = item.id === activeId;
                return (
                  <li key={item.id}>
                    <button type="button" onClick={() => onNavigate(item.id)} aria-current={active ? "location" : undefined}
                      className={cn("group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors", active ? "bg-accent/[0.07] text-accent" : "text-mute hover:bg-white/[0.03] hover:text-ink")}>
                      <span aria-hidden className={cn("size-1 rounded-full transition-colors", active ? "bg-accent" : "bg-white/15 group-hover:bg-white/40")} />
                      <span className="flex-1 text-xs">{item.label}</span>
                      <span className={cn("font-mono text-[10px]", active ? "text-accent/70" : "text-mute/55")}>{String(item.count).padStart(2, "0")}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
          <Link href="/mcp" className="group mt-8 block rounded-xl border border-line bg-gradient-to-br from-white/[0.035] to-transparent p-4 transition-colors hover:border-accent/25">
            <Command aria-hidden className="size-4 text-accent/80" />
            <p className="mt-3 text-xs text-ink">让 AI 直接翻词典</p>
            <p className="mt-1.5 text-[11px] leading-5 text-mute">连接 MCP，把灵感接入工作流。</p>
            <span className="mt-3 flex items-center gap-2 text-[10px] text-mute group-hover:text-accent">了解接入方式<ArrowUpRight aria-hidden className="size-3" /></span>
          </Link>
        </div>
      </aside>
      <div className="sticky top-[72px] z-30 -mx-5 mb-6 border-y border-line bg-canvas/95 px-5 py-3 backdrop-blur-xl sm:-mx-8 sm:px-8 lg:hidden">
        <SearchField query={query} onQuery={onQuery} />
        {resultCount !== null ? (
          <p role="status" className="mt-3 font-mono text-[10px] text-mute">{resultCount} 个匹配的组件</p>
        ) : (
          <nav aria-label="移动端分类目录" className="mt-3 flex gap-2 overflow-x-auto pb-1 whitespace-nowrap">
            {items.map((item) => (
              <button key={item.id} type="button" onClick={() => onNavigate(item.id)} aria-current={item.id === activeId ? "location" : undefined}
                className={cn("inline-flex min-h-8 shrink-0 items-center gap-2 rounded-full border px-3 text-[11px] transition-colors", item.id === activeId ? "border-accent/25 bg-accent/10 text-accent" : "border-line text-mute hover:border-white/20 hover:text-ink")}>
                {item.label}<span className="font-mono text-[9px] opacity-60">{String(item.count).padStart(2, "0")}</span>
              </button>
            ))}
          </nav>
        )}
      </div>
    </>
  );
}
