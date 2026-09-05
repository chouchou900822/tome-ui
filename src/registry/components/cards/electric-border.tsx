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
 * 像一圈不稳定的电弧箍住卡片。抖动由 SMIL 驱动，无 JS 动画循环。
 */
export function ElectricBorder({
  children,
  className,
  innerClassName,
  color = "#7df9ff",
}: ElectricBorderProps) {
  const rawId = useId();
  const id = `electric-${rawId.replace(/[:]/g, "")}`;
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) setLive(true);
  }, []);

  return (
    <div className={cn("relative rounded-2xl", className)}>
      <svg aria-hidden className="absolute size-0">
        <filter id={id}>
          <feTurbulence type="fractalNoise" baseFrequency="0.018" numOctaves="3" seed="2" result="noise">
            {live ? (
              <animate attributeName="seed" values="2;9;4;15;7;2" dur="1.6s" repeatCount="indefinite" />
            ) : null}
          </feTurbulence>
          <feDisplacementMap in="SourceGraphic" in2="noise" scale="14" />
        </filter>
      </svg>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-2xl border border-cyan-300/60 bg-zinc-950"
        style={{
          filter: `url(#${id})`,
          boxShadow: `0 0 14px ${color}55, inset 0 0 10px ${color}22`,
        }}
      />
      <div className={cn("relative rounded-2xl p-6", innerClassName)}>{children}</div>
    </div>
  );
}
