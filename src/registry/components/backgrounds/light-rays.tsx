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
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_0%,rgba(200,224,242,0.16),transparent_65%)]" />
        <div
          className="light-rays-sway absolute -inset-x-1/2 -top-[5%] h-[140%] opacity-80 blur-[3px]"
          style={{
            transformOrigin: "50% 0",
            animationDuration: "14s",
            backgroundImage:
              "conic-gradient(from 135deg at 50% 0%, transparent 0deg, rgba(207,226,244,0.22) 8deg, transparent 15deg, transparent 24deg, rgba(240,246,255,0.18) 29deg, transparent 34deg, transparent 42deg, rgba(207,226,244,0.25) 47deg, transparent 53deg, transparent 64deg, rgba(240,246,255,0.16) 69deg, transparent 78deg, transparent 90deg)",
            maskImage: "linear-gradient(to bottom, #000 5%, transparent 88%)",
          }}
        />
        <div
          className="light-rays-sway light-rays-reverse absolute -inset-x-1/2 -top-[5%] h-[140%] opacity-60 blur-[18px]"
          style={{
            transformOrigin: "50% 0",
            animationDuration: "21s",
            backgroundImage:
              "conic-gradient(from 140deg at 50% 0%, transparent 0deg, rgba(145,184,217,0.2) 18deg, transparent 30deg, transparent 44deg, rgba(224,238,255,0.15) 58deg, transparent 74deg, transparent 90deg)",
            maskImage: "linear-gradient(to bottom, #000 0%, transparent 90%)",
          }}
        />
        <div className="absolute inset-x-[35%] top-0 h-px bg-linear-to-r from-transparent via-white/60 to-transparent shadow-[0_0_20px_3px_rgba(207,226,244,0.12)]" />
      </div>
      <div className="relative">{children}</div>
      <style href="light-rays-keyframes" precedence="medium">
        {`@media (prefers-reduced-motion: no-preference) {
  .light-rays-sway { animation: light-rays-sway ease-in-out infinite alternate; }
  .light-rays-reverse { animation-direction: alternate-reverse; }
}
@keyframes light-rays-sway {
  from { rotate: -2deg; }
  to { rotate: 2deg; }
}`}
      </style>
    </div>
  );
}
