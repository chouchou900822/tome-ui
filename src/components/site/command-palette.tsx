"use client";

import { ArrowDown, ArrowUp, CornerDownLeft, Search, SearchX, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { PALETTE_EVENT } from "@/components/site/search-trigger";
import { filterEntries } from "@/lib/search";
import { cn } from "@/lib/utils";
import { getCategory } from "@/registry/categories";
import type { RegistrySummary } from "@/registry/types";

interface CommandPaletteProps {
  entries: RegistrySummary[];
}

/** 原生模态框负责焦点约束与恢复，输入框负责结果列表的键盘导航。 */
export function CommandPalette({ entries }: CommandPaletteProps) {
  const router = useRouter();
  const id = useId();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const results = useMemo(() => filterEntries(entries, { category: "all", query }).slice(0, 8), [entries, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        if (dialogRef.current?.open) close();
        else setOpen(true);
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener(PALETTE_EVENT, onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener(PALETTE_EVENT, onOpen);
    };
  }, [close]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!open) {
      if (dialog.open) dialog.close();
      return;
    }
    if (!dialog.open) dialog.showModal();
    inputRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = previousOverflow; };
  }, [open]);

  useEffect(() => {
    if (open) document.getElementById(id + "-option-" + active)?.scrollIntoView({ block: "nearest", behavior: "instant" });
  }, [active, id, open]);

  const go = (slug: string) => {
    close();
    router.push("/c/" + slug);
  };

  const onInputKey = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((value) => (value + 1) % Math.max(results.length, 1));
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((value) => (value - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1));
    } else if (event.key === "Enter") {
      event.preventDefault();
      if (results[active]) go(results[active].slug);
    }
  };

  return (
    <dialog ref={dialogRef} aria-label="搜索组件" onClose={close}
      onCancel={(event) => { event.preventDefault(); close(); }}
      onKeyDown={(event) => {
        if (event.key !== "Tab") return;
        const targets = event.currentTarget.querySelectorAll<HTMLElement>('input, button:not([tabindex="-1"])');
        const first = targets[0];
        const last = targets[targets.length - 1];
        if ((event.shiftKey && document.activeElement === first) || (!event.shiftKey && document.activeElement === last)) {
          event.preventDefault();
          (event.shiftKey ? last : first)?.focus();
        }
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) close();
      }}
      className="fixed inset-x-0 top-[10dvh] mx-auto my-0 max-h-[80dvh] w-[calc(100%-2rem)] max-w-xl overflow-hidden rounded-2xl border border-white/15 bg-panel text-ink shadow-[0_40px_120px_-20px_#000] backdrop:bg-black/70 backdrop:backdrop-blur-md open:flex open:flex-col motion-safe:open:animate-fade-up motion-safe:[animation-duration:200ms]">
      <div className="flex shrink-0 items-center gap-3 border-b border-line px-5">
        <Search aria-hidden className="size-4 shrink-0 text-accent/75" />
        <input ref={inputRef} role="combobox" aria-label="搜索组件名、描述或标签" aria-autocomplete="list" aria-expanded={open}
          aria-controls={id + "-results"} aria-activedescendant={results[active] ? id + "-option-" + active : undefined}
          value={query} onChange={(event) => { setQuery(event.target.value); setActive(0); }} onKeyDown={onInputKey}
          placeholder="寻找组件、动效或一点灵感…" className="h-16 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-mute/60" />
        <button type="button" onClick={close} aria-label="关闭搜索" className="grid size-7 shrink-0 place-items-center rounded-lg border border-line text-mute transition-colors hover:text-ink"><X aria-hidden className="size-3.5" /></button>
      </div>
      <div className="flex shrink-0 items-center justify-between px-5 pb-1 pt-4">
        <p className="eyebrow text-[9px]">{query.trim() ? "匹配的组件" : "从这些细节开始"}</p>
        <span className="font-mono text-[9px] text-mute/50">{entries.length} 个组件</span>
      </div>
      <ul id={id + "-results"} role="listbox" aria-label="搜索结果" className="min-h-0 overflow-y-auto p-2">
        {results.map((entry, index) => (
          <li key={entry.slug} role="presentation">
            <button id={id + "-option-" + index} type="button" role="option" aria-selected={index === active} tabIndex={-1}
              onMouseEnter={() => setActive(index)} onClick={() => go(entry.slug)}
              className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-colors", index === active ? "bg-accent/[0.07]" : "hover:bg-white/[0.025]")}>
              <span className={cn("w-14 shrink-0 truncate font-mono text-[9px] tracking-wider sm:w-20", index === active ? "text-accent/75" : "text-mute/60")}>{getCategory(entry.category).code}</span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm text-ink">{entry.title}</span>
                <span className="mt-1 block truncate font-mono text-[10px] text-mute">{entry.name}</span>
              </span>
              {index === active ? <CornerDownLeft aria-hidden className="size-3.5 shrink-0 text-accent/65" /> : null}
            </button>
          </li>
        ))}
      </ul>
      {results.length === 0 ? <div role="status" className="px-6 py-12 text-center"><SearchX aria-hidden className="mx-auto size-6 text-mute/50" /><p className="mt-4 text-sm">没有找到匹配的组件</p><p className="mt-2 text-xs text-mute">试试「文字」「发光」或组件的英文名称。</p></div> : null}
      <div className="flex shrink-0 items-center justify-between gap-3 border-t border-line bg-black/15 px-5 py-3 text-[9px] text-mute/70">
        <span className="inline-flex items-center gap-1"><ArrowUp aria-hidden className="size-3" /><ArrowDown aria-hidden className="mr-1 size-3" />切换<CornerDownLeft aria-hidden className="ml-3 size-3" />打开</span>
        <span>Esc 关闭</span>
      </div>
    </dialog>
  );
}
