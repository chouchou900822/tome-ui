import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AuroraBackgroundProps {
  children?: ReactNode;
  className?: string;
  /** 三组光带颜色 */
  colors?: [string, string, string];
  /** 光带流动一个周期的时长（秒） */
  speed?: number;
}

/**
 * 极光背景：三层大尺寸模糊色块以不同节奏漂移，叠加噪点遮罩消除色带。
 * 纯 CSS 动画，GPU 合成，适合作为首屏 Hero 的底层。
 */
export function AuroraBackground({
  children,
  className,
  colors = ["#7c3aed", "#06b6d4", "#d7ff3c"],
  speed = 14,
}: AuroraBackgroundProps) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-black", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70 blur-3xl saturate-150">
        {colors.map((color, i) => (
          <span
            key={color + i}
            className="absolute rounded-full motion-safe:animate-[aurora-drift_14s_ease-in-out_infinite_alternate]"
            style={{
              background: color,
              width: "55%",
              height: "55%",
              left: `${[-10, 45, 20][i]}%`,
              top: `${[-20, -10, 45][i]}%`,
              animationDuration: `${speed + i * 3}s`,
              animationDelay: `${-i * 4}s`,
            }}
          />
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.12] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div className="relative">{children}</div>
      <style href="aurora-keyframes" precedence="medium">
        {`@keyframes aurora-drift{0%{transform:translate(0,0) scale(1)}50%{transform:translate(12%,18%) scale(1.15)}100%{transform:translate(-8%,6%) scale(0.95)}}`}
      </style>
    </div>
  );
}
