import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GridBeamsProps {
  children?: ReactNode;
  className?: string;
  /** 网格间距（像素） */
  size?: number;
  /** 光束颜色 */
  beamColor?: string;
  /** 光束所在的列序号（从左往右，0 起） */
  columns?: number[];
  /** 网格线颜色 */
  lineColor?: string;
}

const DURATIONS = [5, 7.5, 6, 8.5, 5.5, 7, 6.5];
const DELAYS = [0, 2.1, 4.7, 1.3, 3.9, 0.6, 2.9];

/**
 * 网格光束：底层是淡淡的网格线，若干束细光沿竖向网格线从上方坠落，
 * 边缘用径向遮罩淡出。纯 CSS，无需 JS。
 * 时长与延迟取自互不成比例的数表，避免多束光周期性同步。
 */
export function GridBeams({
  children,
  className,
  size = 48,
  beamColor = "#d7ff3c",
  columns = [2, 5, 9, 14, 18, 23, 27],
  lineColor = "rgba(255,255,255,0.06)",
}: GridBeamsProps) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-zinc-950", className)}>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `linear-gradient(to right, ${lineColor} 1px, transparent 1px), linear-gradient(to bottom, ${lineColor} 1px, transparent 1px)`,
          backgroundSize: `${size}px ${size}px`,
          maskImage: "radial-gradient(ellipse at center, #000 40%, transparent 85%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, #000 40%, transparent 85%)",
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {columns.map((col, i) => (
          <span
            key={col}
            className="absolute top-0 h-[40%] w-px motion-safe:animate-[grid-beam-fall_6s_linear_infinite]"
            style={{
              left: col * size,
              background: `linear-gradient(to bottom, transparent, ${beamColor}, transparent)`,
              animationDuration: `${DURATIONS[i % DURATIONS.length]}s`,
              animationDelay: `-${DELAYS[i % DELAYS.length]}s`,
              opacity: 0.8,
            }}
          />
        ))}
      </div>
      <div className="relative">{children}</div>
      <style href="grid-beams-keyframes" precedence="medium">
        {`@keyframes grid-beam-fall{from{transform:translateY(-100%)}to{transform:translateY(300%)}}`}
      </style>
    </div>
  );
}
