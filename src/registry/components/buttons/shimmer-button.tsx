import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps {
  children: ReactNode;
  className?: string;
  /** 流光颜色 */
  shimmerColor?: string;
  /** 按钮底色 */
  background?: string;
  /** 一圈流光的时长（秒） */
  speed?: number;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

/**
 * 流光按钮：一道锥形光沿按钮边缘持续旋转，形成"发光边框"；
 * 内层用同色底板遮住中心，只留下 1px 的光边。悬停时整体轻微上浮。
 */
export function ShimmerButton({
  children,
  className,
  shimmerColor = "#d7ff3c",
  background = "#161619",
  speed = 3,
  onClick,
  type = "button",
  disabled,
}: ShimmerButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "group/shimmer relative inline-flex overflow-hidden rounded-full bg-white/10 p-px text-sm font-medium text-white",
        "transition-transform duration-300 ease-out motion-safe:hover:-translate-y-0.5 motion-safe:active:translate-y-0",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute -inset-x-1/4 top-1/2 aspect-square -translate-y-1/2 motion-safe:animate-[shimmer-spin_3s_linear_infinite] group-disabled/shimmer:[animation-play-state:paused]"
        style={{
          animationDuration: `${speed}s`,
          background: `conic-gradient(from 90deg, transparent 55%, color-mix(in srgb, ${shimmerColor} 20%, transparent) 75%, ${shimmerColor} 88%, transparent 90%)`,
        }}
      />
      <span
        className="relative inline-flex items-center gap-2 rounded-full px-7 py-3.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),inset_0_-1px_0_rgba(0,0,0,0.4)]"
        style={{ background }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover/shimmer:opacity-100 group-focus-visible/shimmer:opacity-100 motion-reduce:transition-none"
          style={{
            background: `radial-gradient(60% 120% at 50% 100%, color-mix(in srgb, ${shimmerColor} 12%, transparent), transparent)`,
          }}
        />
        <span className="relative inline-flex items-center gap-2">{children}</span>
      </span>
      <style href="shimmer-button-keyframes" precedence="medium">
        {`@keyframes shimmer-spin{to{rotate:1turn}}`}
      </style>
    </button>
  );
}
