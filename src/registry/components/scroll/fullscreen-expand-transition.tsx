"use client";

import { useEffect, useRef, useState, type ReactNode, type UIEvent } from "react";
import { cn } from "@/lib/utils";

interface FullscreenExpandTransitionProps {
  children: ReactNode;
  startScale?: number;
  accent?: string;
  className?: string;
}

export function FullscreenExpandTransition({
  children,
  startScale = 0.58,
  accent = "#7c3aed",
  className,
}: FullscreenExpandTransitionProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const safeStartScale = Math.min(0.9, Math.max(0.4, startScale));

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    if (!reduceMotion || !panelRef.current) return;
    panelRef.current.style.scale = "1";
    panelRef.current.style.borderRadius = "0px";
    if (glowRef.current) glowRef.current.style.opacity = "0";
  }, [reduceMotion]);

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const viewport = event.currentTarget;
    const maxScroll = viewport.scrollHeight - viewport.clientHeight;
    const progress = maxScroll > 0 ? viewport.scrollTop / maxScroll : 0;
    const eased = reduceMotion ? 1 : 1 - Math.pow(1 - progress, 3);

    if (panelRef.current) {
      panelRef.current.style.scale = String(safeStartScale + (1 - safeStartScale) * eased);
      panelRef.current.style.borderRadius = `${28 * (1 - eased)}px`;
    }
    if (glowRef.current) {
      glowRef.current.style.opacity = String((1 - eased) * 0.7);
    }
  }

  return (
    <div
      className={cn(
        "relative h-full min-h-0 w-full overflow-hidden bg-[#0b0b0d] text-white",
        className,
      )}
    >
      <div
        className="absolute inset-0 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={handleScroll}
        tabIndex={0}
        aria-label="滚动扩展内容至全屏"
      >
        <div className="sticky top-0 h-full overflow-hidden">
          <div
            ref={glowRef}
            aria-hidden
            className="absolute inset-[16%] blur-[70px]"
            style={{ backgroundColor: accent, opacity: 0.7 }}
          />
          <div
            ref={panelRef}
            className="absolute inset-0 overflow-hidden border border-white/10 shadow-[0_30px_100px_rgba(0,0,0,0.75)]"
            style={{
              background: `radial-gradient(circle at 72% 24%, ${accent}, transparent 40%), linear-gradient(145deg, #202024, #09090b 72%)`,
              borderRadius: 28,
              scale: String(safeStartScale),
            }}
          >
            {children}
          </div>
          <p className="pointer-events-none absolute bottom-5 left-1/2 z-10 -translate-x-1/2 text-[9px] uppercase tracking-[0.25em] text-white/40">
            Scroll to expand
          </p>
        </div>
        <div aria-hidden className="h-[190%]" />
      </div>
    </div>
  );
}
