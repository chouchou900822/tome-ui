"use client";

import { Check, Copy, TriangleAlert } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  label?: string;
  doneLabel?: string;
  className?: string;
  variant?: "primary" | "ghost";
  iconOnly?: boolean;
}

type CopyState = "idle" | "done" | "error";

export function CopyButton({ text, label = "复制提示词", doneLabel = "已复制", className, variant = "ghost", iconOnly = false }: CopyButtonProps) {
  const [state, setState] = useState<CopyState>("idle");

  useEffect(() => {
    if (state === "idle") return;
    const timer = window.setTimeout(() => setState("idle"), state === "error" ? 3000 : 2000);
    return () => window.clearTimeout(timer);
  }, [state]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("done");
    } catch {
      setState("error");
    }
  };

  const Icon = state === "done" ? Check : state === "error" ? TriangleAlert : Copy;
  const feedback = state === "done" ? doneLabel : state === "error" ? "复制失败，请重试" : label;

  return (
    <button type="button" onClick={() => void copy()} aria-label={feedback} aria-live="polite" title={feedback}
      className={cn(
        iconOnly ? "icon-button" : variant === "primary" ? "button-primary" : "button-secondary h-9 px-3.5 text-xs",
        state === "done" && "border-accent/35 bg-accent/10 text-accent hover:bg-accent/15",
        state === "error" && "border-red-400/30 bg-red-400/10 text-red-300 hover:bg-red-400/15",
        className,
      )}>
      <Icon aria-hidden className="size-3.5 shrink-0" />
      {iconOnly ? null : <span>{feedback}</span>}
    </button>
  );
}
