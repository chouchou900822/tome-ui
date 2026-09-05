"use client";

import { Check, Copy } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface CopyButtonProps {
  text: string;
  label?: string;
  doneLabel?: string;
  className?: string;
  /** primary 为强调色主按钮，ghost 为半透明次按钮 */
  variant?: "primary" | "ghost";
  /** 紧凑模式：只显示图标 */
  iconOnly?: boolean;
}

export function CopyButton({
  text,
  label = "复制提示词",
  doneLabel = "已复制",
  className,
  variant = "ghost",
  iconOnly = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const copy = () => {
    navigator.clipboard
      .writeText(text)
      .then(() => setCopied(true))
      .catch((error: unknown) => console.error("复制失败", error));
  };

  const Icon = copied ? Check : Copy;
  const tone = copied
    ? "border-accent bg-accent text-accent-ink"
    : variant === "primary"
      ? "border-accent bg-accent text-accent-ink hover:brightness-110"
      : "border-line bg-white/5 text-ink hover:border-white/20 hover:bg-white/10";

  return (
    <button
      type="button"
      onClick={copy}
      aria-label={copied ? doneLabel : label}
      className={cn(
        "inline-flex items-center gap-2 rounded-full border text-xs font-medium transition-all duration-300",
        tone,
        iconOnly ? "size-8 justify-center" : "px-3.5 py-2",
        className,
      )}
    >
      <Icon className="size-3.5" />
      {iconOnly ? null : <span>{copied ? doneLabel : label}</span>}
    </button>
  );
}
