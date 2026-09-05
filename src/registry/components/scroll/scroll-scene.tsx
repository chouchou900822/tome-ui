"use client";

import { useState, type UIEvent } from "react";
import { cn } from "@/lib/utils";

interface ScrollSceneItem {
  eyebrow: string;
  title: string;
  description: string;
  color: string;
}

interface ScrollSceneProps {
  items: ScrollSceneItem[];
  className?: string;
}

export function ScrollScene({ items, className }: ScrollSceneProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  if (items.length === 0) return null;

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const viewport = event.currentTarget;
    const nextIndex = Math.min(
      items.length - 1,
      Math.max(0, Math.round(viewport.scrollTop / viewport.clientHeight)),
    );

    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  }

  return (
    <div
      className={cn(
        "relative isolate h-full min-h-64 w-full overflow-hidden bg-[#0b0b0d] text-white",
        className,
      )}
    >
      {items.map((item, index) => (
        <section
          key={item.title}
          aria-hidden={index !== activeIndex}
          className={cn(
            "pointer-events-none absolute inset-0 flex flex-col justify-end p-6 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none @md:p-9",
            index === activeIndex ? "opacity-100" : "opacity-0",
          )}
          style={{
            background: `radial-gradient(circle at 72% 24%, ${item.color} 0%, transparent 42%), linear-gradient(145deg, #18181b 0%, #09090b 72%)`,
          }}
        >
          <div
            aria-hidden
            className="absolute right-[12%] top-[16%] size-28 rounded-full border border-white/20 bg-white/5 shadow-[0_0_70px_rgba(255,255,255,0.12)] backdrop-blur-xl @md:size-40"
          />
          <div className="relative max-w-lg">
            <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.3em] text-white/55">
              {item.eyebrow}
            </p>
            <h3 className="text-2xl font-semibold tracking-[-0.04em] @md:text-4xl @xl:text-5xl">
              {item.title}
            </h3>
            <p className="mt-3 max-w-md text-xs leading-relaxed text-white/55 @md:text-sm">
              {item.description}
            </p>
          </div>
        </section>
      ))}

      <div
        className="absolute inset-0 z-10 snap-y snap-mandatory overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={handleScroll}
        tabIndex={0}
        aria-label="滚动切换场景"
      >
        {items.map((item) => (
          <div key={item.title} className="min-h-full snap-start snap-always" aria-hidden />
        ))}
      </div>

      <div className="pointer-events-none absolute right-4 top-1/2 z-20 flex -translate-y-1/2 flex-col gap-2">
        {items.map((item, index) => (
          <span
            key={item.title}
            className={cn(
              "h-1 rounded-full bg-white/25 transition-[width,background-color] duration-300 motion-reduce:transition-none",
              index === activeIndex ? "w-6 bg-white" : "w-2",
            )}
          />
        ))}
      </div>

      <p className="pointer-events-none absolute bottom-5 right-5 z-20 text-[9px] uppercase tracking-[0.24em] text-white/35">
        Scroll ↓
      </p>
    </div>
  );
}
