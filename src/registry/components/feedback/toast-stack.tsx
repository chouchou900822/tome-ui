"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  meta?: string;
  icon?: ReactNode;
  tone?: "success" | "info" | "warning";
}

export interface ToastStackProps {
  items: readonly ToastItem[];
  label?: string;
  emptyMessage?: string;
  onDismiss?: (id: string) => void;
  className?: string;
}

const TONES: Record<NonNullable<ToastItem["tone"]>, string> = {
  success: "text-[#c0d9ad] border-[#c0d9ad]/20 bg-[#c0d9ad]/8",
  info: "text-[#acc8dc] border-[#acc8dc]/20 bg-[#acc8dc]/8",
  warning: "text-[#dfc59e] border-[#dfc59e]/20 bg-[#dfc59e]/8",
};

/** 通知保持可读，用户自行关闭；展开后可以滚动浏览全部消息。 */
export function ToastStack({ items, label = "通知", emptyMessage = "所有消息已读", onDismiss, className }: ToastStackProps) {
  const reduced = useReducedMotion();
  const [dismissed, setDismissed] = useState<Set<string>>(() => new Set());
  const [expanded, setExpanded] = useState(false);
  const buttons = useRef(new Map<string, HTMLButtonElement>());
  const empty = useRef<HTMLLIElement>(null);
  const nextFocus = useRef<string | null>(null);
  const pending = items.filter((item) => !dismissed.has(item.id));
  const visible = expanded ? pending : pending.slice(0, 3);

  useEffect(() => {
    if (nextFocus.current === null) return;
    (buttons.current.get(nextFocus.current) ?? empty.current)?.focus({ preventScroll: true });
    nextFocus.current = null;
  }, [dismissed]);

  return (
    <section aria-label={label} className={cn("w-full max-w-sm", className)}>
      <div className="mb-3 flex items-center justify-between px-1 text-[10px] text-zinc-400">
        <span>{label}</span><span className="font-mono text-zinc-500">{String(pending.length).padStart(2, "0")}</span>
      </div>
      <ol aria-live="polite" aria-relevant="additions removals" className={cn("relative h-34 @md:h-44", expanded ? "overflow-y-auto overscroll-contain pr-1" : "overflow-hidden")}>
        <AnimatePresence initial={false}>
          {visible.map((item, index) => (
            <motion.li key={item.id} initial={false}
              aria-hidden={!expanded && index > 0} inert={!expanded && index > 0}
              animate={{ top: expanded ? index * 120 : index * 14, scale: expanded ? 1 : 1 - index * 0.055, opacity: expanded ? 1 : 1 - index * 0.22 }}
              exit={{ opacity: 0, scale: reduced ? 1 : 0.97 }}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 360, damping: 32 }}
              style={{ zIndex: pending.length - index, transformOrigin: "50% 100%" }}
              className="absolute inset-x-1 top-0 flex h-26 items-start gap-3 rounded-2xl border border-white/15 bg-[#1a1e1f] p-3 shadow-[inset_0_1px_0_#ffffff08,0_8px_18px_-10px_#0008] @md:h-28 @md:p-4"
            >
              <span aria-hidden className={cn("mt-0.5 grid size-8 shrink-0 place-items-center rounded-xl border", TONES[item.tone ?? "info"])}>
                {item.icon ?? <span className="size-1.5 rounded-full bg-current" />}
              </span>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="truncate text-[11px] font-medium text-zinc-100 @md:text-xs">{item.title}</p>
                  {item.meta && <span className="shrink-0 text-[8px] text-zinc-500">{item.meta}</span>}
                </div>
                {item.description && <p className="mt-1.5 line-clamp-2 text-[10px] leading-relaxed text-zinc-400">{item.description}</p>}
                <button type="button" aria-label={`关闭${item.title}`}
                  ref={(node) => { if (node) buttons.current.set(item.id, node); else buttons.current.delete(item.id); }}
                  onClick={() => {
                    nextFocus.current = (pending[index + 1] ?? pending[index - 1])?.id ?? "";
                    setDismissed((previous) => new Set(previous).add(item.id));
                    onDismiss?.(item.id);
                  }}
                  className="mt-1 min-h-6 rounded px-0.5 text-[9px] text-zinc-500 hover:text-zinc-200 focus-visible:outline-2 focus-visible:outline-[#c0d9ad]">关闭</button>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
        {pending.length === 0 && <li ref={empty} tabIndex={-1} className="grid h-28 place-items-center rounded-2xl border border-dashed border-white/10 text-xs text-zinc-500 outline-none">{emptyMessage}</li>}
      </ol>
      <div className="mt-1 flex justify-center">
        <button type="button" disabled={pending.length < 2} aria-expanded={expanded}
          onClick={() => setExpanded((previous) => !previous)}
          className="min-h-7 rounded-full border border-white/10 bg-white/3 px-4 text-[9px] text-zinc-400 hover:bg-white/6 hover:text-zinc-200 disabled:cursor-default disabled:opacity-30 @md:min-h-8">
          {expanded ? "收起通知" : `展开 ${pending.length} 条通知`}
        </button>
      </div>
    </section>
  );
}
