"use client";

import { Check, Copy, Loader2, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PromptCopyButtonProps {
  slug: string;
  label?: string;
  doneLabel?: string;
  className?: string;
  /** 紧凑模式：只显示图标 */
  iconOnly?: boolean;
}

type CopyState = "idle" | "loading" | "done" | "error";

/** 点击时才拉取 /api/prompt/<slug> 再复制，提示词不进首屏 payload；外壳样式与 CopyButton 同款 */
export function PromptCopyButton({
  slug,
  label = "复制提示词",
  doneLabel = "已复制",
  className,
  iconOnly = false,
}: PromptCopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), state === "error" ? 3000 : 2000);
    return () => window.clearTimeout(timer);
  }, [state]);

  const copy = async () => {
    setState("loading");
    try {
      const res = await fetch(`/api/prompt/${slug}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const text = await res.text();
      await navigator.clipboard.writeText(text);
      setState("done");
    } catch (error) {
      console.error("复制失败", error);
      setState("error");
    }
  };

  const Icon = state === "done" ? Check : state === "loading" ? Loader2 : state === "error" ? TriangleAlert : Copy;
  const tone =
    state === "done"
      ? "border-accent bg-accent text-accent-ink"
      : state === "error"
        ? "border-red-500/40 bg-red-500/10 text-red-400"
        : "border-line bg-white/5 text-ink hover:border-white/20 hover:bg-white/10";
  const text = state === "done" ? doneLabel : state === "error" ? "复制失败" : label;

  return (
    <button
      type="button"
      onClick={() => void copy()}
      disabled={state === "loading"}
      aria-label={text}
      aria-live="polite"
      className={cn(
        "inline-flex items-center gap-2 rounded-full border text-xs font-medium transition-all duration-300",
        tone,
        iconOnly ? "size-8 justify-center" : "px-3.5 py-2",
        className,
      )}
    >
      <Icon className={cn("size-3.5", state === "loading" && "motion-safe:animate-spin")} />
      {iconOnly ? null : <span>{text}</span>}
    </button>
  );
}
