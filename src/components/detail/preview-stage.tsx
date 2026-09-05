"use client";

import { RotateCcw } from "lucide-react";
import { useState, type ReactNode } from "react";
import { PreviewFrame } from "@/components/gallery/preview-frame";

interface PreviewStageProps {
  children: ReactNode;
  contentClassName?: string;
}

/** 详情页的大舞台：重播按钮通过更换 key 强制重新挂载演示节点 */
export function PreviewStage({ children, contentClassName }: PreviewStageProps) {
  const [round, setRound] = useState(0);

  return (
    <div className="relative">
      <PreviewFrame
        key={round}
        className="min-h-[420px] rounded-2xl border border-line lg:min-h-[560px]"
        contentClassName={contentClassName}
      >
        {children}
      </PreviewFrame>
      <button
        type="button"
        onClick={() => setRound((r) => r + 1)}
        className="absolute right-4 top-4 inline-flex h-8 items-center gap-2 rounded-full border border-line bg-canvas/70 px-3 text-xs text-mute backdrop-blur transition-colors hover:border-white/20 hover:text-ink"
      >
        <RotateCcw className="size-3.5" />
        重播
      </button>
    </div>
  );
}
