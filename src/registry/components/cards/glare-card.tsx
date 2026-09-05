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
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-6 transition-colors duration-300 hover:border-white/25",
        className,
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          backgroundImage:
            "linear-gradient(107deg, transparent 32%, rgba(255,255,255,0.14) 48%, transparent 64%)",
          backgroundSize: "220% 220%",
          backgroundPosition: "var(--gx, 50%) var(--gy, 50%)",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
