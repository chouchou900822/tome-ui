import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LightRaysProps {
  children?: ReactNode;
  className?: string;
}

/**
 * 光束倾泻：以顶边中点为原点向下张开数道光束，两层不同模糊与速度
 * 缓慢反向摆动，像放映机的灯锥扫过尘埃。纯 CSS 实现。
 */
export function LightRays({ children, className }: LightRaysProps) {
  return (
    <div className={cn("relative isolate overflow-hidden bg-[#0b0b0d]", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="light-rays-sway absolute left-1/2 top-0 aspect-square w-[220%] -translate-x-1/2 opacity-80 blur-md"
          style={{
            transformOrigin: "50% 0",
            animationDuration: "10s",
            backgroundImage:
              "conic-gradient(from 30deg at 50% 0%, transparent 0deg, rgba(255,255,255,0.1) 8deg, transparent 16deg, transparent 30deg, rgba(190,240,255,0.09) 38deg, transparent 46deg, transparent 62deg, rgba(255,255,255,0.07) 70deg, transparent 78deg, transparent 120deg)",
            maskImage: "linear-gradient(to bottom, #000 0%, transparent 85%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 0%, transparent 85%)",
          }}
        />
        <div
          className="light-rays-sway light-rays-reverse absolute left-1/2 top-0 aspect-square w-[220%] -translate-x-1/2 opacity-50 blur-2xl"
          style={{
            transformOrigin: "50% 0",
            animationDuration: "16s",
            backgroundImage:
              "conic-gradient(from 40deg at 50% 0%, transparent 0deg, rgba(120,200,255,0.07) 12deg, transparent 24deg, transparent 48deg, rgba(255,255,255,0.05) 58deg, transparent 68deg, transparent 120deg)",
            maskImage: "linear-gradient(to bottom, #000 0%, transparent 90%)",
            WebkitMaskImage: "linear-gradient(to bottom, #000 0%, transparent 90%)",
          }}
        />
      </div>
      <div className="relative">{children}</div>
      <style href="light-rays-keyframes" precedence="medium">
        {`@media (prefers-reduced-motion: no-preference) {
  .light-rays-sway { animation: light-rays-sway ease-in-out infinite alternate; }
  .light-rays-reverse { animation-direction: alternate-reverse; }
}
@keyframes light-rays-sway {
  from { transform: rotate(-2.5deg); }
  to { transform: rotate(2.5deg); }
}`}
      </style>
    </div>
  );
}
