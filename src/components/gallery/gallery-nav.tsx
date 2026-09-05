"use client";

import { Search, X } from "lucide-react";
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
  /** 当前选中项（「全部」视图下跟随 scrollspy，无高亮节时回落到「全部」） */
  activeId: CategoryId | "all";
  query: string;
  /** 搜索态的结果数；null 表示非搜索态 */
  resultCount: number | null;
  onQuery: (query: string) => void;
  onNavigate: (id: CategoryId | "all") => void;
}

/** 搜索输入框，桌面目录与移动工具条共用 */
function SearchField({ query, onQuery }: Pick<GalleryNavProps, "query" | "onQuery">) {
  return (
    <label className="relative block">
      <Search className="pointer-events-none absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-mute" />
      <input
        value={query}
        onChange={(e) => onQuery(e.target.value)}
        placeholder="搜索组件…"
        className="h-9 w-full rounded-full border border-line bg-white/5 pl-9 pr-8 text-xs outline-none transition-colors placeholder:text-mute focus:border-white/25"
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
  );
}

/**
 * 画廊导航，同一份状态两种布局：
 * 桌面 = 左侧 sticky 目录面板；移动 = header 下 sticky 搜索条 + 横向分类 chips（跳转语义）。
 * 必须作为画廊 grid 的直接子级渲染（aside 占第一列，移动条横贯整行）。
 */
export function GalleryNav({ items, activeId, query, resultCount, onQuery, onNavigate }: GalleryNavProps) {
  return (
    <>
      <aside className="hidden lg:block">
        <div className="sticky top-20 flex flex-col gap-5">
          <p className="font-mono text-[11px] uppercase tracking-[0.3em] text-mute">
            <span className="font-pixel text-accent">IDX</span>
            <span> — 目录</span>
          </p>
          <SearchField query={query} onQuery={onQuery} />
          <nav aria-label="词典分类目录">
            <ul className="flex flex-col">
              {items.map((item) => {
                const active = item.id === activeId;
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => onNavigate(item.id)}
                      aria-current={active ? "location" : undefined}
                      className={cn(
                        "flex w-full items-baseline gap-3 border-l py-2 pl-4 pr-2 text-left transition-colors hover:bg-white/[0.03]",
                        active ? "border-accent" : "border-line",
                      )}
                    >
                      <span
                        className={cn(
                          "font-mono text-[10px] uppercase tracking-[0.2em]",
                          active ? "text-accent" : "text-mute",
                        )}
                      >
                        {item.code}
                      </span>
                      <span className={cn("text-xs", active ? "text-ink" : "text-ink/70")}>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </div>
      </aside>

      <div className="sticky top-14 z-30 -mx-5 border-y border-line bg-canvas/80 px-5 py-3 backdrop-blur-xl md:-mx-8 md:px-8 lg:hidden">
        <div className="flex flex-col gap-3">
          <SearchField query={query} onQuery={onQuery} />
          {resultCount !== null ? (
            <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-mute">
              {String(resultCount).padStart(2, "0")} 项结果
            </p>
          ) : (
            <div className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1 whitespace-nowrap">
              {items.map((item) => {
                const active = item.id === activeId;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => onNavigate(item.id)}
                    aria-current={active ? "location" : undefined}
                    className={cn(
                      "inline-flex items-baseline gap-1.5 rounded-full border px-3.5 py-1.5 text-xs transition-colors",
                      active
                        ? "border-accent bg-accent text-accent-ink"
                        : "border-line text-mute hover:border-white/20 hover:text-ink",
                    )}
                  >
                    {item.label}
                    <span className="font-pixel text-[10px] opacity-70">
                      {String(item.count).padStart(2, "0")}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
