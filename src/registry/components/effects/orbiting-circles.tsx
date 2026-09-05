import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface OrbitingCirclesProps {
  /** 轨道中心的内容，例如一个 Logo 图标 */
  center?: ReactNode;
  /** 轨道项，均分到圆周上 */
  items: ReactNode[];
  className?: string;
  /** 轨道半径（像素） */
  radius?: number;
  /** 一圈的时长（秒） */
  duration?: number;
  /** 反向公转 */
  reverse?: boolean;
  /** 整圈起始角度（度） */
  startAngle?: number;
}

/**
 * 环绕轨道：轨道项沿圆周匀速公转并始终保持自身正立，
 * 叠放多个不同半径与速度的实例可以组成星轨。纯 CSS 关键帧。
 */
export function OrbitingCircles({
  center,
  items,
  className,
  radius = 90,
  duration = 24,
  reverse = false,
  startAngle = 0,
}: OrbitingCirclesProps) {
  const count = items.length;
  const box = radius * 2 + 96;

  return (
    <div
      className={cn("relative isolate grid size-fit place-items-center", className)}
      style={{ width: box, height: box }}
    >
      {center}
      {items.map((item, i) => (
        <div
          key={i}
          aria-hidden
          className="orbit-item absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={
            {
              "--radius": radius,
              "--angle": (360 / Math.max(count, 1)) * i + startAngle,
              "--orbit-duration": duration,
              animationDirection: reverse ? "reverse" : "normal",
            } as CSSProperties
          }
        >
          {item}
        </div>
      ))}
      <style href="orbiting-circles-keyframes" precedence="medium">
        {`@media (prefers-reduced-motion: no-preference) {
  .orbit-item { animation: orbit linear infinite; animation-duration: calc(var(--orbit-duration) * 1s); }
}
@keyframes orbit {
  from { transform: rotate(calc(var(--angle) * 1deg)) translateY(calc(var(--radius) * 1px)) rotate(calc(var(--angle) * -1deg)); }
  to { transform: rotate(calc(var(--angle) * 1deg + 360deg)) translateY(calc(var(--radius) * 1px)) rotate(calc(var(--angle) * -1deg - 360deg)); }
}`}
      </style>
    </div>
  );
}
