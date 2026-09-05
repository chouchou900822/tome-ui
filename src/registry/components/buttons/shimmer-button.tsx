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
        "group relative inline-flex overflow-hidden rounded-full p-px",
        "transition-transform duration-300 ease-out hover:-translate-y-0.5 active:translate-y-0",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60",
        "disabled:pointer-events-none disabled:opacity-50",
        className,
      )}
    >
      <span
        aria-hidden
        className="absolute inset-[-100%] motion-safe:animate-[shimmer-spin_3s_linear_infinite]"
        style={{
          animationDuration: `${speed}s`,
          background: `conic-gradient(from 90deg at 50% 50%, transparent 0%, ${shimmerColor} 10%, transparent 20%, transparent 52%, ${shimmerColor} 58%, transparent 64%)`,
        }}
      />
      <span
        className="relative inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-white"
        style={{ background }}
      >
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(60% 120% at 50% 100%, ${shimmerColor}22, transparent)`,
          }}
        />
        <span className="relative inline-flex items-center gap-2">{children}</span>
      </span>
      <style href="shimmer-button-keyframes" precedence="medium">
        {`@keyframes shimmer-spin{to{transform:rotate(1turn)}}`}
      </style>
    </button>
  );
}
