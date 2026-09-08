"use client";

import { useEffect, useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ElectricBorderProps {
  children: ReactNode;
  className?: string;
  /** 内层内容区类名，默认提供内边距 */
  innerClassName?: string;
  /** 电弧颜色 */
  color?: string;
}

/**
 * 电流边框：边框与辉光一起被 SVG 湍流位移滤镜反复扭曲，
 * 连续改变噪声频率形成细电丝；底板保持完整，不随滤镜变形。
 */
export function ElectricBorder({
  children,
  className,
  innerClassName,
  color = "#8bbdcc",
}: ElectricBorderProps) {
  const rawId = useId();
  const id = `electric-${rawId.replace(/[:]/g, "")}`;
  const [live, setLive] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setLive(!media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return (
    <div className={cn("relative rounded-2xl border border-white/8 bg-[#0e1419] shadow-[0_20px_50px_-30px_rgba(0,0,0,0.9)]", className)}>
      <svg aria-hidden className="absolute size-0">
        <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.012 0.025" numOctaves="2" seed="7" result="noise">
            {live ? (
              <animate attributeName="baseFrequency" values="0.012 0.025;0.018 0.035;0.012 0.025" dur="6s" repeatCount="indefinite" />
            ) : null}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={live ? 4 : 0} xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </svg>
      <div
        aria-hidden
        className="pointer-events-none absolute -inset-px rounded-[inherit] border"
        style={{
          filter: `url(#${id})`,
          borderColor: `color-mix(in srgb, ${color} 65%, transparent)`,
          boxShadow: `0 0 10px color-mix(in srgb, ${color} 16%, transparent), inset 0 0 16px color-mix(in srgb, ${color} 6%, transparent)`,
        }}
      />
      <div className={cn("relative rounded-2xl p-6", innerClassName)}>{children}</div>
    </div>
  );
}
