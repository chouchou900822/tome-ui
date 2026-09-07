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
      aria-label="搜索组件"
      aria-haspopup="dialog"
      className={cn(
        "group inline-flex size-9 items-center justify-center gap-3 rounded-full border border-line bg-white/[0.025] text-xs text-mute transition-colors hover:border-white/20 hover:bg-white/5 hover:text-ink sm:w-auto sm:pl-3.5 sm:pr-1.5",
        className,
      )}
    >
      <Search aria-hidden className="size-3.5" />
      <span className="hidden sm:inline">搜索组件</span>
      <kbd className="ml-1 hidden rounded-full border border-line bg-canvas px-2 py-1 font-mono text-[10px] text-mute sm:inline">
        ⌘K
      </kbd>
    </button>
  );
}
