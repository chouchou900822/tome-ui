"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: ReactNode;
  className?: string;
  /** 光斑颜色，建议带透明度 */
  color?: string;
  /** 光斑半径（像素） */
  radius?: number;
}

/**
 * 聚光灯卡片：一束柔光跟随鼠标在卡片表面游走，同时点亮靠近指针的边框。
 * 用 MotionValue 直接驱动 CSS 渐变，不触发 React 重渲染。
 */
export function SpotlightCard({
  children,
  className,
  color = "rgba(215, 255, 60, 0.16)",
  radius = 320,
}: SpotlightCardProps) {
  const x = useMotionValue(-radius);
  const y = useMotionValue(-radius);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const glow = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, ${color}, transparent 70%)`;
  const edge = useMotionTemplate`radial-gradient(${radius * 0.8}px circle at ${x}px ${y}px, rgba(255,255,255,0.5), transparent 70%)`;

  return (
    <div
      onMouseMove={onMove}
      className={cn(
        "group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-8",
        className,
      )}
    >
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{ background: glow }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          padding: 1,
          background: edge,
          maskImage: "linear-gradient(#000, #000), linear-gradient(#000, #000)",
          maskClip: "content-box, border-box",
          maskComposite: "exclude",
          WebkitMaskComposite: "xor",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
