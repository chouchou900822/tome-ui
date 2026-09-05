"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WobbleCardProps {
  children: ReactNode;
  className?: string;
}

/**
 * 果冻卡片：鼠标在卡面游走时，整卡小幅度倾斜晃动，
 * 内部两团色晕向反方向漂移，松手后弹簧拉回，像按在软胶上。
 */
export function WobbleCard({ children, className }: WobbleCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const spring = { stiffness: 160, damping: 13, mass: 0.6 };

  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [3.5, -3.5]), spring);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-3.5, 3.5]), spring);
  const blobX = useSpring(useTransform(mx, [-0.5, 0.5], [16, -16]), spring);
  const blobY = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), spring);

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const tilt = reduce ? undefined : { rotateX, rotateY };
  const drift = reduce ? undefined : { x: blobX, y: blobY };

  return (
    <div className="[perspective:800px]">
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        style={tilt}
        className={cn(
          "relative overflow-hidden rounded-3xl border border-white/10 bg-zinc-950 p-8",
          className,
        )}
      >
        <motion.div
          aria-hidden
          style={drift}
          className="pointer-events-none absolute -right-10 -top-16 size-48 rounded-full bg-sky-500/25 blur-3xl"
        />
        <motion.div
          aria-hidden
          style={drift ? { x: blobY, y: blobX } : undefined}
          className="pointer-events-none absolute -bottom-16 -left-12 size-56 rounded-full bg-violet-500/20 blur-3xl"
        />
        <div className="relative">{children}</div>
      </motion.div>
    </div>
  );
}
