"use client";

import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { CornerDownLeft, Search } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent } from "react";
import { PALETTE_EVENT } from "@/components/site/search-trigger";
import { filterEntries } from "@/lib/search";
import { cn } from "@/lib/utils";
import { getCategory, type RegistrySummary } from "@/registry";

interface CommandPaletteProps {
  entries: RegistrySummary[];
}

/** ⌘K 命令面板：模糊搜索所有组件，方向键选择，回车跳转 */
export function CommandPalette({ entries }: CommandPaletteProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const results = useMemo(
    () => filterEntries(entries, { category: "all", query }).slice(0, 8),
    [entries, query],
  );

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActive(0);
  }, []);

  const go = useCallback(
    (slug: string) => {
      close();
      router.push(`/c/${slug}`);
    },
    [close, router],
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      }
      if (e.key === "Escape") close();
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
    if (open) inputRef.current?.focus();
  }, [open]);

  const onInputKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((i) => (i + 1) % Math.max(results.length, 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => (i - 1 + Math.max(results.length, 1)) % Math.max(results.length, 1));
    } else if (e.key === "Enter") {
      const target = results[active];
      if (target) go(target.slug);
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="palette"
          role="dialog"
          aria-modal
          aria-label="搜索组件"
          className="fixed inset-0 z-50 flex items-start justify-center bg-canvas/60 p-4 pt-[12vh] backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <motion.div
            className="w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_40px_120px_-20px_rgba(0,0,0,0.9)]"
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="size-4 text-mute" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                onKeyDown={onInputKey}
                placeholder="搜索组件名、描述或标签…"
                className="h-13 w-full bg-transparent text-sm outline-none placeholder:text-mute"
              />
              <kbd className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[10px] text-mute">ESC</kbd>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-2">
              {results.length === 0 ? (
                <li className="px-3 py-8 text-center text-sm text-mute">没有匹配的组件</li>
              ) : (
                results.map((entry, i) => (
                  <li key={entry.slug}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(entry.slug)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                        i === active ? "bg-white/8" : "hover:bg-white/5",
                      )}
                    >
                      <span className="font-mono text-[10px] uppercase tracking-widest text-mute">
                        {getCategory(entry.category).code}
                      </span>
                      <span className="flex-1">
                        <span className="text-sm text-ink">{entry.title}</span>
                        <span className="ml-2 text-xs text-mute">{entry.name}</span>
                      </span>
                      {i === active ? <CornerDownLeft className="size-3.5 text-mute" /> : null}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
