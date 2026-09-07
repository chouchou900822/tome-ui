"use client";

import { Braces, Info } from "lucide-react";
import { useId, useState, type KeyboardEvent } from "react";
import { CopyButton } from "@/components/site/copy-button";
import { cn } from "@/lib/utils";

export interface CodeTab {
  id: string;
  label: string;
  raw: string;
  html: string;
  hint?: string;
}

interface CodeTabsProps {
  tabs: CodeTab[];
  className?: string;
}

/** 原文复制与高亮展示共用数据，支持方向键切换选项卡。 */
export function CodeTabs({ tabs, className }: CodeTabsProps) {
  const groupId = useId();
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const active = tabs.find((tab) => tab.id === activeId) ?? tabs[0];
  if (!active) return null;

  const onTabKey = (event: KeyboardEvent<HTMLButtonElement>, index: number) => {
    let next = index;
    if (event.key === "ArrowRight") next = (index + 1) % tabs.length;
    else if (event.key === "ArrowLeft") next = (index - 1 + tabs.length) % tabs.length;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = tabs.length - 1;
    else return;
    event.preventDefault();
    setActiveId(tabs[next].id);
    document.getElementById(groupId + "-" + tabs[next].id)?.focus();
  };

  return (
    <div className={cn("surface-panel flex min-w-0 flex-col overflow-hidden", className)}>
      <div className="flex items-center justify-between gap-2 border-b border-line bg-white/[0.015] px-2 sm:px-3">
        <div role="tablist" aria-label="代码与使用方式" className="flex min-w-0 gap-1 overflow-x-auto">
          {tabs.map((tab, index) => {
            const selected = tab.id === active.id;
            return (
              <button key={tab.id} id={groupId + "-" + tab.id} type="button" role="tab" aria-selected={selected}
                aria-controls={groupId + "-panel"} tabIndex={selected ? 0 : -1} onKeyDown={(event) => onTabKey(event, index)} onClick={() => setActiveId(tab.id)}
                className={cn("relative shrink-0 px-3 py-4 text-[11px] transition-colors sm:px-4 sm:text-xs", selected ? "text-accent" : "text-mute hover:text-ink")}>
                {tab.label}
                {selected ? <span aria-hidden className="absolute inset-x-3 bottom-0 h-0.5 bg-accent sm:inset-x-4" /> : null}
              </button>
            );
          })}
        </div>
        <CopyButton key={active.id} text={active.raw} label={"复制" + active.label}
          className="my-2 h-8 shrink-0 gap-1.5 px-2.5 text-[10px] [&>span]:hidden sm:[&>span]:inline" />
      </div>
      <div className="flex items-center justify-between border-b border-line bg-black/15 px-5 py-2.5 font-mono text-[9px] text-mute/65 sm:px-6">
        <span className="inline-flex items-center gap-2"><Braces aria-hidden className="size-3" />{active.label}</span>
        <span>{active.raw.split("\n").length} 行</span>
      </div>
      <div id={groupId + "-panel"} role="tabpanel" aria-labelledby={groupId + "-" + active.id} tabIndex={0}
        className="code-surface max-h-[560px] min-w-0 overflow-auto bg-[#0d0e10] text-[13px]"
        dangerouslySetInnerHTML={{ __html: active.html }} />
      {active.hint ? (
        <div className="flex items-start gap-2.5 border-t border-line px-5 py-4 sm:px-6">
          <Info aria-hidden className="mt-0.5 size-3.5 shrink-0 text-mute/60" />
          <p className="text-[11px] leading-6 text-mute">{active.hint}</p>
        </div>
      ) : null}
    </div>
  );
}
