"use client";

import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export const PALETTE_EVENT = "tome:open-palette";

export function openPalette(): void {
  window.dispatchEvent(new CustomEvent(PALETTE_EVENT));
}

interface SearchTriggerProps {
  className?: string;
}

/** 页头里的搜索入口，点击后打开命令面板 */
export function SearchTrigger({ className }: SearchTriggerProps) {
  return (
    <button
      type="button"
      onClick={openPalette}
      className={cn(
        "group inline-flex h-9 items-center gap-2 rounded-full border border-line bg-white/5 pl-3 pr-1.5 text-xs text-mute transition-colors hover:border-white/20 hover:text-ink",
        className,
      )}
    >
      <Search className="size-3.5" />
      <span className="hidden sm:inline">搜索组件</span>
      <kbd className="ml-1 hidden rounded-full border border-line bg-canvas px-2 py-0.5 font-mono text-[10px] text-mute sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
