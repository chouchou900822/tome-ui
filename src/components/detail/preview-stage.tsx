"use client";

import { Eye, Monitor, RotateCcw, Smartphone } from "lucide-react";
import { useState, type ReactNode } from "react";
import { PreviewFrame } from "@/components/gallery/preview-frame";
import { cn } from "@/lib/utils";

interface PreviewStageProps {
  children: ReactNode;
  contentClassName?: string;
}

export function PreviewStage({ children, contentClassName }: PreviewStageProps) {
  const [round, setRound] = useState(0);
  const [compact, setCompact] = useState(false);

  return (
    <div className="surface-panel overflow-hidden">
      <div className="flex min-h-14 items-center justify-between gap-3 border-b border-line bg-white/[0.015] px-4 sm:px-5">
        <span className="flex items-center gap-2 text-xs text-ink/80"><Eye aria-hidden className="size-3.5 text-mute" />实时预览</span>
        <div className="flex items-center gap-3">
          <div aria-label="预览宽度" className="hidden items-center rounded-lg border border-line bg-black/20 p-0.5 sm:flex">
            <button type="button" aria-label="宽屏预览" aria-pressed={!compact} onClick={() => setCompact(false)}
              className={cn("grid h-7 w-8 place-items-center rounded-md transition-colors", !compact ? "bg-white/10 text-ink" : "text-mute hover:text-ink")}>
              <Monitor aria-hidden className="size-3.5" />
            </button>
            <button type="button" aria-label="窄屏预览" aria-pressed={compact} onClick={() => setCompact(true)}
              className={cn("grid h-7 w-8 place-items-center rounded-md transition-colors", compact ? "bg-white/10 text-ink" : "text-mute hover:text-ink")}>
              <Smartphone aria-hidden className="size-3.5" />
            </button>
          </div>
          <span aria-hidden className="hidden h-4 w-px bg-line sm:block" />
          <button type="button" onClick={() => setRound((value) => value + 1)}
            className="inline-flex h-8 items-center gap-2 rounded-lg px-2 text-[11px] text-mute transition-colors hover:bg-white/5 hover:text-ink">
            <RotateCcw aria-hidden className="size-3.5" />重播
          </button>
        </div>
      </div>
      <div className="bg-[#070708]">
        <PreviewFrame key={round} className={cn("mx-auto min-h-[420px] w-full lg:min-h-[500px]", compact && "max-w-[375px] border-x border-line")} contentClassName={contentClassName}>
          {children}
        </PreviewFrame>
      </div>
      <div className="flex items-center justify-between gap-4 border-t border-line px-4 py-3 text-[10px] text-mute/75 sm:px-5">
        <span>悬停、点击或滚动，感受真实效果</span>
        <span className="hidden items-center gap-1.5 sm:flex"><span aria-hidden className="size-1 rounded-full bg-accent/70" />{compact ? "375 px · 窄屏" : "自适应舞台"}</span>
      </div>
      <span role="status" className="sr-only">{round > 0 ? "预览已重新播放" : ""}</span>
    </div>
  );
}
