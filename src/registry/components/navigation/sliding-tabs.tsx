"use client";

import { motion, useReducedMotion } from "motion/react";
import { useId, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface SlidingTab {
  id: string;
  label: string;
  content: ReactNode;
  icon?: ReactNode;
  disabled?: boolean;
}

export interface SlidingTabsProps {
  label: string;
  tabs: readonly SlidingTab[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
}

export function SlidingTabs({ label, tabs, value, defaultValue, onValueChange, className }: SlidingTabsProps) {
  const id = useId();
  const reduced = useReducedMotion();
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  const [internal, setInternal] = useState(defaultValue ?? "");
  const available = tabs.filter((tab) => !tab.disabled);
  const active = available.find((tab) => tab.id === (value ?? internal)) ?? available[0];
  if (!active) return null;

  const select = (tab: SlidingTab) => {
    setInternal(tab.id);
    onValueChange?.(tab.id);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLButtonElement>, tab: SlidingTab) => {
    const index = available.findIndex((item) => item.id === tab.id);
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % available.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + available.length) % available.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = available.length - 1;
    else return;
    event.preventDefault();
    const target = available[next];
    select(target);
    buttons.current[tabs.indexOf(target)]?.focus({ preventScroll: true });
  };

  return (
    <div className={cn("w-full", className)}>
      <div role="tablist" aria-label={label} className="flex gap-1 overflow-x-auto rounded-xl border border-white/10 bg-[#101314] p-1.5 shadow-[inset_0_2px_5px_#0005]">
        {tabs.map((tab, index) => (
          <button
            key={tab.id} ref={(node) => { buttons.current[index] = node; }}
            id={`${id}-tab-${index}`} type="button" role="tab"
            aria-selected={active.id === tab.id} aria-controls={`${id}-panel-${index}`}
            tabIndex={active.id === tab.id ? 0 : -1} disabled={tab.disabled}
            onClick={() => select(tab)} onKeyDown={(event) => onKeyDown(event, tab)}
            className={cn("relative flex min-h-10 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-3 text-[11px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#abc39c] disabled:cursor-not-allowed disabled:opacity-35 @md:px-5 @md:text-xs", active.id === tab.id ? "text-[#233020]" : "text-zinc-400 hover:text-zinc-200")}
          >
            {active.id === tab.id && <motion.span
              aria-hidden layoutId={`${id}-indicator`} initial={false}
              transition={reduced ? { duration: 0 } : { type: "spring", stiffness: 420, damping: 34 }}
              className="absolute inset-0 rounded-lg border border-[#ecf3e2]/70 bg-[#dbe4d1] shadow-[inset_0_1px_0_#fff,0_2px_5px_#0004]"
            />}
            {tab.icon && <span aria-hidden className="relative">{tab.icon}</span>}
            <span className="relative">{tab.label}</span>
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div key={tab.id} id={`${id}-panel-${index}`} role="tabpanel"
          aria-labelledby={`${id}-tab-${index}`} hidden={active.id !== tab.id} tabIndex={0}
          className="mt-3 rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-[#c4d4bd]/60 @md:mt-4">
          {tab.content}
        </div>
      ))}
    </div>
  );
}
