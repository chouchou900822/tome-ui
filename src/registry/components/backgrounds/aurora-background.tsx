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
 * 极光背景：三道低饱和弧形光带缓慢交错，暗部与细噪点保留夜空的层次。
 * 纯 CSS 动画，GPU 合成，适合作为首屏 Hero 的底层。
 */
export function AuroraBackground({
  children,
  className,
  colors = ["#7564c9", "#4da6a8", "#b4d4c0"],
  speed = 18,
}: AuroraBackgroundProps) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-[#080c12]", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 110%, color-mix(in srgb, ${colors[1]} 22%, transparent), transparent 70%)` }} />
      <div aria-hidden className="pointer-events-none absolute -inset-x-[20%] -inset-y-[30%] -rotate-12 opacity-65 blur-[28px]">
        {colors.map((color, i) => (
          <span
            key={color + i}
            className="absolute h-[75%] w-[120%] rounded-[50%] motion-safe:animate-[aurora-drift_18s_ease-in-out_infinite_alternate]"
            style={{
              background: `radial-gradient(ellipse at 50% 50%, transparent 36%, color-mix(in srgb, ${color} 65%, transparent) 49%, ${color} 52%, transparent 66%)`,
              left: `${[-18, 4, -8][i]}%`,
              top: `${[-22, 2, 24][i]}%`,
              animationDuration: `${speed + i * 5}s`,
              animationDelay: `${-i * 6}s`,
            }}
          />
        ))}
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.055] mix-blend-soft-light"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_10%,rgba(8,12,18,0.6)_100%)]" />
      <div className="relative">{children}</div>
      <style href="aurora-keyframes" precedence="medium">
        {`@keyframes aurora-drift{0%{translate:-4% -3%;rotate:-8deg;scale:1}50%{translate:5% 4%;rotate:3deg;scale:1.06}100%{translate:-2% 6%;rotate:-3deg;scale:.98}}`}
      </style>
    </div>
  );
}
