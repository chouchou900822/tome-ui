"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface CopyCommandProps {
  command: string;
  label?: string;
  prefix?: ReactNode;
  copyLabel?: string;
  copiedLabel?: string;
  className?: string;
}

export function CopyCommand({
  command, label = "终端命令", prefix = "$", copyLabel = "复制",
  copiedLabel = "已复制", className,
}: CopyCommandProps) {
  const [status, setStatus] = useState<"idle" | "copying" | "copied" | "error">("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);
  const busy = useRef(false);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = async () => {
    if (busy.current) return;
    busy.current = true;
    if (timer.current) clearTimeout(timer.current);
    setStatus("copying");
    try {
      await navigator.clipboard.writeText(command);
      if (mounted.current) setStatus("copied");
    } catch {
      if (mounted.current) setStatus("error");
    } finally {
      busy.current = false;
      if (mounted.current) timer.current = setTimeout(() => setStatus("idle"), 2400);
    }
  };

  return (
    <div className={cn("w-full overflow-hidden rounded-2xl border border-white/12 bg-[#141618] shadow-[inset_0_1px_0_#ffffff08,0_16px_40px_-24px_#000]", className)}>
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-3">
        <span className="text-[10px] tracking-wider text-zinc-400">{label}</span>
        <span aria-hidden className="flex gap-1"><span className="size-1 rounded-full bg-zinc-600" /><span className="size-1 rounded-full bg-zinc-600" /><span className="size-1 rounded-full bg-zinc-600" /></span>
      </div>
      <div className="flex items-center gap-3 p-3 @md:gap-4 @md:p-4">
        <span aria-hidden className="pl-1 font-mono text-xs text-[#bdd4bc]">{prefix}</span>
        <code tabIndex={0} aria-label={command} className="min-w-0 flex-1 overflow-x-auto whitespace-nowrap py-2 font-mono text-[11px] text-zinc-200 @md:text-sm">{command}</code>
        <button type="button" disabled={status === "copying"} onClick={copy}
          aria-label={`${copyLabel}：${command}`}
          className={cn("min-h-9 shrink-0 rounded-lg border border-white/10 bg-white/4 px-3 text-[10px] text-zinc-300 hover:bg-white/8 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#bdd4bc] disabled:opacity-50 motion-safe:transition-colors", status === "copied" && "border-[#bdd4bc]/25 bg-[#bdd4bc]/10 text-[#bdd4bc]")}>
          {status === "copied" ? copiedLabel : status === "copying" ? "复制中" : copyLabel}
        </button>
      </div>
      <p role="status" className={cn("text-[10px] text-amber-200", status === "error" ? "px-4 pb-3" : "sr-only")}>
        {status === "error" ? "复制未完成，请选中命令手动复制。" : status === "copied" ? copiedLabel : ""}
      </p>
    </div>
  );
}
