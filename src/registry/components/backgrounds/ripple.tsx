import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RippleProps {
  children?: ReactNode;
  className?: string;
  /** 同心圆环数量 */
  rings?: number;
  /** 一个圆环从中心扩散到边缘的时长（秒） */
  speed?: number;
}

/**
 * 同心波纹：多圈圆环从中心依次扩散淡出，周而复始，
 * 像水面被轻轻叩了一下。纯 CSS 实现，动画走独立 scale 属性。
 */
export function Ripple({ children, className, rings = 5, speed = 4.5 }: RippleProps) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-[#0b0b0d]", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="relative aspect-square w-full max-w-[640px]">
          {Array.from({ length: rings }, (_, i) => (
            <span
              key={i}
              className="ripple-ring absolute inset-0 rounded-full border border-white/25 opacity-0"
              style={{
                animationDelay: `${((-i * speed) / rings).toFixed(2)}s`,
                animationDuration: `${speed}s`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="relative">{children}</div>
      <style href="ripple-keyframes" precedence="medium">
        {`@media (prefers-reduced-motion: no-preference) {
  .ripple-ring { animation: ripple-expand linear infinite; }
}
@keyframes ripple-expand {
  0% { scale: 0.15; opacity: 0.55; }
  100% { scale: 1; opacity: 0; }
}`}
      </style>
    </div>
  );
}
