"use client";

import { motion, useMotionValue, useSpring, useTransform } from "motion/react";
import type { MouseEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MagneticButtonProps {
  children: ReactNode;
  className?: string;
  /** 吸附强度，0 为不移动，1 为完全跟随鼠标 */
  strength?: number;
  /** 触发区域向外扩展的像素值 */
  padding?: number;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

/**
 * 磁吸按钮：鼠标靠近时按钮被"吸"向指针，内部文字以更小幅度跟随，形成视差；
 * 离开后用弹簧回弹。触发区域比按钮本身大一圈，让吸附提前发生。
 */
export function MagneticButton({
  children,
  className,
  strength = 0.35,
  padding = 24,
  onClick,
  type = "button",
  disabled,
}: MagneticButtonProps) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const spring = { stiffness: 180, damping: 16, mass: 0.2 };
  const sx = useSpring(x, spring);
  const sy = useSpring(y, spring);
  const tx = useTransform(sx, (v) => v * 0.45);
  const ty = useTransform(sy, (v) => v * 0.45);

  const onMove = (e: MouseEvent<HTMLSpanElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  };

  const reset = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <span
      onMouseMove={onMove}
      onMouseLeave={reset}
      className="inline-block"
      style={{ padding, margin: -padding }}
    >
      <motion.button
        type={type}
        disabled={disabled}
        onClick={onClick}
        style={{ x: sx, y: sy }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "relative inline-flex items-center justify-center gap-2 rounded-full",
          "bg-white px-7 py-3.5 text-sm font-medium text-black",
          "shadow-[0_0_0_1px_rgba(255,255,255,0.1),0_12px_40px_-12px_rgba(255,255,255,0.35)]",
          "transition-colors hover:bg-zinc-100 disabled:pointer-events-none disabled:opacity-50",
          className,
        )}
      >
        <motion.span style={{ x: tx, y: ty }} className="inline-flex items-center gap-2">
          {children}
        </motion.span>
      </motion.button>
    </span>
  );
}
