"use client";

import { motion, useMotionTemplate, useMotionValue } from "motion/react";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface DotGridProps {
  children?: ReactNode;
  className?: string;
  /** 点与点之间的间距（像素） */
  gap?: number;
  /** 常态下的点颜色 */
  dotColor?: string;
  /** 指针附近被点亮的点颜色 */
  glowColor?: string;
  /** 点亮区域半径（像素） */
  radius?: number;
}

/**
 * 交互点阵：底层是均匀的暗点，上层是同样排布的亮点，
 * 用跟随鼠标的径向遮罩只显露亮点的一小片区域，形成"手电筒扫过点阵"的效果。
 */
export function DotGrid({
  children,
  className,
  gap = 24,
  dotColor = "rgba(255,255,255,0.14)",
  glowColor = "#d7ff3c",
  radius = 220,
}: DotGridProps) {
  const x = useMotionValue(-9999);
  const y = useMotionValue(-9999);
  const mask = useMotionTemplate`radial-gradient(${radius}px circle at ${x}px ${y}px, #000 0%, transparent 70%)`;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - rect.left);
    y.set(e.clientY - rect.top);
  };

  const reset = () => {
    x.set(-9999);
    y.set(-9999);
  };

  const dots = (color: string) => ({
    backgroundImage: `radial-gradient(circle, ${color} 1px, transparent 1.5px)`,
    backgroundSize: `${gap}px ${gap}px`,
    backgroundPosition: "center",
  });

  return (
    <div
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={cn("relative isolate overflow-hidden bg-zinc-950", className)}
    >
      <div aria-hidden className="pointer-events-none absolute inset-0" style={dots(dotColor)} />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ ...dots(glowColor), maskImage: mask, WebkitMaskImage: mask }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
