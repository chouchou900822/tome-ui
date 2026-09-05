"use client";

import { useState } from "react";
import { CopyButton } from "@/components/site/copy-button";
import { cn } from "@/lib/utils";

export interface CodeTab {
  id: string;
  label: string;
  /** 复制到剪贴板的原文 */
  raw: string;
  /** shiki 渲染好的 HTML */
  html: string;
  /** 面板下方的说明 */
  hint?: string;
}

interface CodeTabsProps {
  tabs: CodeTab[];
  className?: string;
}

/** 提示词 / 源码 / 用法三个选项卡，每个都可一键复制 */
export function CodeTabs({ tabs, className }: CodeTabsProps) {
  const [activeId, setActiveId] = useState(tabs[0]?.id ?? "");
  const active = tabs.find((t) => t.id === activeId) ?? tabs[0];
  if (!active) return null;

  return (
    <div className={cn("flex flex-col overflow-hidden rounded-2xl border border-line bg-panel", className)}>
      <div className="flex items-center justify-between gap-3 border-b border-line px-2">
        <div role="tablist" className="flex">
          {tabs.map((tab) => {
            const selected = tab.id === active.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => setActiveId(tab.id)}
                className={cn(
                  "relative px-4 py-3.5 text-xs transition-colors",
                  selected ? "text-ink" : "text-mute hover:text-ink",
                )}
              >
                {tab.label}
                {selected ? <span className="absolute inset-x-4 -bottom-px h-px bg-accent" /> : null}
              </button>
            );
          })}
        </div>
        <CopyButton
          key={active.id}
          text={active.raw}
          label={`复制${active.label}`}
          className="my-2 mr-2"
        />
      </div>

      <div
        className="code-surface max-h-[560px] overflow-auto text-[13px]"
        dangerouslySetInnerHTML={{ __html: active.html }}
      />

      {active.hint ? (
        <p className="border-t border-line px-5 py-3 font-mono text-[11px] leading-relaxed text-mute">{active.hint}</p>
      ) : null}
    </div>
  );
}
