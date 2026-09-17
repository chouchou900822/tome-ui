import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface BreathingLineProps {
  className?: string;
  /** 轨道宽度（像素） */
  width?: number;
  /** 一次扫掠的时长（秒） */
  duration?: number;
  /** 光束颜色 */
  color?: string;
  /** 读屏文案 */
  label?: string;
}

/**
 * 呼吸线：一段带辉光的光束沿 1px 发丝轨道扫掠，
 * 先生长、再匀速、最后收缩消隐，作为页面级的极简加载指示。
 * 关键帧按轨道宽度的百分比定义，任意宽度下节奏一致。
 */
export function BreathingLine({
  className,
  width = 240,
  duration = 1.8,
  color = "#d7ff3c",
  label = "加载中",
}: BreathingLineProps) {
  return (
    <div
      role="status"
      aria-label={label}
      className={cn("breathing-line relative h-px max-w-full overflow-hidden", className)}
      style={{
        width,
        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.16), transparent)",
        "--bl-color": color,
        "--bl-duration": `${duration}s`,
      } as CSSProperties}
    >
      <span aria-hidden className="breathing-line-beam absolute h-0.5 -top-px">
        <span className="breathing-line-core absolute left-1/2 top-1/2 size-[3px] rounded-full" />
      </span>
      <style href="breathing-line-keyframes" precedence="medium">
        {`.breathing-line-beam {
  left: 35%; width: 30%;
  background: linear-gradient(90deg, transparent, var(--bl-color), transparent);
  filter: drop-shadow(0 0 3.5px var(--bl-color)) drop-shadow(0 0 3.5px var(--bl-color));
}
.breathing-line-core {
  translate: -50% -50%;
  background: var(--bl-color);
  box-shadow: 0 0 6px 2px color-mix(in srgb, var(--bl-color) 45%, transparent);
}
@media (prefers-reduced-motion: no-preference) {
  .breathing-line-beam { animation: breathing-line-sweep var(--bl-duration) linear infinite; }
}
@keyframes breathing-line-sweep {
  0%   { left: 0;      width: 11.67%; }
  20%  { left: 21.67%; width: 21.67%; }
  40%  { left: 41.67%; width: 30%; }
  60%  { left: 61.67%; width: 30%; }
  80%  { left: 76.67%; width: 23.33%; }
  100% { left: 93.33%; width: 6.67%; }
}`}
      </style>
    </div>
  );
}
