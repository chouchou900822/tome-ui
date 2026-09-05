"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "motion/react";
import type { MouseEvent, ReactNode } from "react";
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
  maxTilt = 12,
  scale = 1.03,
  glare = true,
}: TiltCardProps) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const spring = { stiffness: 200, damping: 20, mass: 0.4 };
  const rotateX = useSpring(useTransform(py, [0, 1], [maxTilt, -maxTilt]), spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-maxTilt, maxTilt]), spring);
  const glareX = useTransform(px, [0, 1], [0, 100]);
  const glareY = useTransform(py, [0, 1], [0, 100]);
  const glareBg = useMotionTemplate`radial-gradient(farthest-corner circle at ${glareX}% ${glareY}%, rgba(255,255,255,0.35), rgba(255,255,255,0) 60%)`;

  const onMove = (e: MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
  };

  const reset = () => {
    px.set(0.5);
    py.set(0.5);
  };

  return (
    <div style={{ perspective: 1000 }} className="inline-block">
      <motion.div
        onMouseMove={onMove}
        onMouseLeave={reset}
        whileHover={{ scale }}
        transition={{ type: "spring", ...spring }}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={cn(
          "relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-950 p-8",
          "shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)]",
          className,
        )}
      >
        <div style={{ transform: "translateZ(30px)" }} className="relative">
          {children}
        </div>
        {glare ? (
          <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 mix-blend-overlay"
            style={{ background: glareBg }}
          />
        ) : null}
      </motion.div>
    </div>
  );
}
