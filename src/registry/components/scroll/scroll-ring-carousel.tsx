"use client";

import { useEffect, useRef, useState, type UIEvent } from "react";
import { cn } from "@/lib/utils";

interface ScrollRingItem {
  label: string;
  title: string;
  color: string;
}

interface ScrollRingCarouselProps {
  items: ScrollRingItem[];
  radius?: number;
  className?: string;
}

export function ScrollRingCarousel({
  items,
  radius = 150,
  className,
}: ScrollRingCarouselProps) {
  const ringRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const safeRadius = Math.min(220, Math.max(90, radius));
  const step = items.length > 0 ? 360 / items.length : 0;

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduceMotion(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  if (items.length === 0) return null;

  function handleScroll(event: UIEvent<HTMLDivElement>) {
    const viewport = event.currentTarget;
    const maxScroll = viewport.scrollHeight - viewport.clientHeight;
    const progress = maxScroll > 0 ? viewport.scrollTop / maxScroll : 0;
    const nextIndex = Math.min(items.length - 1, Math.round(progress * (items.length - 1)));
    const angle = reduceMotion ? nextIndex * step : progress * step * (items.length - 1);

    if (ringRef.current) {
      ringRef.current.style.transform = `rotateY(${-angle}deg)`;
    }
    setActiveIndex((current) => (current === nextIndex ? current : nextIndex));
  }

  return (
    <div
      className={cn(
        "relative h-full min-h-0 w-full overflow-hidden bg-[#0b0b0d] text-white [container-type:size]",
        className,
      )}
    >
      <div
        className="absolute inset-0 overflow-y-auto overscroll-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        onScroll={handleScroll}
        tabIndex={0}
        aria-label="滚动旋转 3D 环形轮播"
      >
        <div className="sticky top-0 flex h-full flex-col items-center justify-center overflow-hidden pb-12 @md:pb-16">
          <div aria-hidden className="absolute inset-x-[15%] top-1/2 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
          <div style={{ perspective: "760px" }} className="relative h-[clamp(112px,48cqh,208px)] w-[clamp(96px,40cqh,176px)]">
            <div
              ref={ringRef}
              className="relative size-full"
              style={{ transform: "rotateY(0deg)", transformStyle: "preserve-3d" }}
            >
              {items.map((item, index) => (
                <article
                  key={item.title}
                  className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-2xl border border-white/15 p-4 shadow-2xl [backface-visibility:hidden] @md:p-5"
                  style={{
                    background: `linear-gradient(155deg, ${item.color}, #151518 68%)`,
                    transform: `rotateY(${index * step}deg) translateZ(${safeRadius}px)`,
                  }}
                >
                  <p className="text-[9px] uppercase tracking-[0.28em] text-white/55">{item.label}</p>
                  <div>
                    <p className="mb-2 text-3xl font-light text-white/25">0{index + 1}</p>
                    <h3 className="text-xs font-medium @md:text-base">{item.title}</h3>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-5 text-center">
            <p className="text-[9px] uppercase tracking-[0.28em] text-white/35">Scroll to orbit</p>
            <p className="mt-1 text-xs text-white/70">{items[activeIndex]?.title}</p>
          </div>
        </div>
        <div aria-hidden style={{ height: `${Math.max(220, items.length * 70)}%` }} />
      </div>
    </div>
  );
}
