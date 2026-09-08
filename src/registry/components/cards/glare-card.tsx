"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlareCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * 炫光卡片：一道斜向光带跟随鼠标横扫卡面，顶部边缘同时亮起一条高光线。
 * 与聚光灯卡片的径向光斑不同，这里的光是线性、有方向感的。
 */
export function GlareCard({ children, className }: GlareCardProps) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--gx", `${(((e.clientX - rect.left) / rect.width) * 100).toFixed(1)}%`);
    el.style.setProperty("--gy", `${(((e.clientY - rect.top) / rect.height) * 100).toFixed(1)}%`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={cn(
        "group/glare relative overflow-hidden rounded-2xl border border-white/15 bg-[#141519] p-6 transition-colors duration-500 hover:border-white/25 motion-reduce:transition-none",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_20px_50px_-28px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(0deg,rgba(255,255,255,0.02)_0px,rgba(255,255,255,0.02)_1px,transparent_1px,transparent_3px)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-35 transition-opacity duration-500 group-hover/glare:opacity-100 group-focus-within/glare:opacity-100 motion-reduce:transition-none"
        style={{
          backgroundImage:
            "linear-gradient(115deg, transparent 28%, rgba(211,220,235,0.04) 40%, rgba(245,247,255,0.16) 48%, rgba(211,220,235,0.04) 56%, transparent 70%)",
          backgroundSize: "220% 220%",
          backgroundPosition: "var(--gx, 50%) var(--gy, 50%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-linear-to-r from-transparent via-white/40 to-transparent opacity-40 transition-opacity duration-500 group-hover/glare:opacity-100 motion-reduce:transition-none"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
