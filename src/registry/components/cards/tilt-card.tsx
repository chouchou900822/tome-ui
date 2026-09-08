"use client";

import { motion, useMotionTemplate, useMotionValue, useReducedMotion, useSpring, useTransform } from "motion/react";
import type { PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** 最大倾斜角度（度） */
  maxTilt?: number;
  /** 悬停时的缩放倍数 */
  scale?: number;
  /** 是否显示随角度移动的镜面高光 */
  glare?: boolean;
}

/**
 * 3D 倾斜卡片：根据指针在卡片内的位置绕 X/Y 轴旋转，附带跟随角度移动的镜面高光。
 * 旋转值经过弹簧平滑，离开时缓慢回正。
 */
export function TiltCard({
  children,
  className,
  maxTilt = 8,
  scale = 1.02,
  glare = true,
}: TiltCardProps) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const reduce = useReducedMotion();
  const spring = { stiffness: 200, damping: 20, mass: 0.4 };
  const zoom = useSpring(1, spring);
  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), spring);
  const glareX = useTransform(px, [0, 1], [0, 100]);
  const glareY = useTransform(py, [0, 1], [0, 100]);
  const glareBg = useMotionTemplate`radial-gradient(farthest-corner circle at ${glareX}% ${glareY}%, rgba(219,228,245,0.16), transparent 65%)`;

  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    if (reduce || e.pointerType === "touch") return;
    // 固定外层负责测量，旋转后的卡面不反向影响指针坐标。
    const rect = e.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    px.set(Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width)));
    py.set(Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height)));
    zoom.set(scale);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
    zoom.set(1);
  };

  return (
    <div onPointerMove={onMove} onPointerLeave={reset} style={{ perspective: 1000 }} className="relative min-w-0 max-w-full">
      <motion.div
        style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY, scale: reduce ? 1 : zoom, transformStyle: "preserve-3d" }}
        className={cn(
          "relative w-80 max-w-full rounded-2xl border border-white/15 bg-[#12141b] p-7",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_24px_60px_-28px_rgba(0,0,0,0.85)]",
          className,
        )}
      >
        {glare ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-[inherit]"
            style={{ background: reduce ? "radial-gradient(ellipse at top left, rgba(219,228,245,0.12), transparent 65%)" : glareBg }}
          />
        ) : null}
        <div style={{ transform: reduce ? undefined : "translateZ(24px)" }} className="relative h-full">
          {children}
        </div>
      </motion.div>
    </div>
  );
}
