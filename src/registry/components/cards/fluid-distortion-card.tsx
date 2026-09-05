"use client";

import { useEffect, useId, useRef, useState, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FluidDistortionCardProps {
  children: ReactNode;
  className?: string;
  /** 左上流体色 */
  colorA?: string;
  /** 右下流体色 */
  colorB?: string;
  /** SVG 位移强度，建议 0–64 */
  distortion?: number;
}

interface FluidFieldProps {
  colorA: string;
  colorB: string;
}

function FluidField({ colorA, colorB }: FluidFieldProps) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#09090b]">
      <span
        className="fluid-distortion-card-a absolute -left-8 -top-14 size-[190px] rounded-[42%_58%_64%_36%] opacity-[0.42] blur-[42px]"
        style={{ backgroundColor: colorA }}
      />
      <span
        className="fluid-distortion-card-b absolute -bottom-[72px] -right-12 size-[220px] rounded-[62%_38%_46%_54%] opacity-40 blur-[52px]"
        style={{ backgroundColor: colorB }}
      />
      <span
        className="fluid-distortion-card-band absolute left-[12%] top-[42%] h-20 w-[76%] -rotate-12 rounded-[50%] opacity-20 blur-2xl"
        style={{ backgroundImage: `linear-gradient(90deg, transparent, ${colorA}, ${colorB}, transparent)` }}
      />
      <span
        className="absolute inset-0 opacity-[0.12]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(112deg, rgba(255,255,255,0.45) 0 1px, transparent 1px 14px)",
        }}
      />
    </div>
  );
}

/**
 * 流体扭曲卡片：指针附近的彩色色场被局部位移，
 * 像隔着一层液体玻璃观察背景，正文始终保持清晰。
 */
export function FluidDistortionCard({
  children,
  className,
  colorA = "#22d3ee",
  colorB = "#a855f7",
  distortion = 32,
}: FluidDistortionCardProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const rawId = useId();
  const filterId = `fluid-distortion-${rawId.replace(/:/g, "")}`;
  const [reduceMotion, setReduceMotion] = useState(false);
  const displacement = Math.max(0, Math.min(distortion, 64));

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncPreference = () => setReduceMotion(media.matches);
    syncPreference();
    media.addEventListener("change", syncPreference);
    return () => media.removeEventListener("change", syncPreference);
  }, []);

  const updatePointer = (event: PointerEvent<HTMLDivElement>) => {
    if (reduceMotion) return;
    const element = rootRef.current;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    element.style.setProperty("--fluid-x", `${Math.max(0, Math.min(x, 100)).toFixed(1)}%`);
    element.style.setProperty("--fluid-y", `${Math.max(0, Math.min(y, 100)).toFixed(1)}%`);
    element.style.setProperty("--fluid-duration", "180ms");
    element.style.setProperty("--fluid-opacity", "1");
  };

  const hideDistortion = () => {
    if (reduceMotion) return;
    const element = rootRef.current;
    if (!element) return;
    element.style.setProperty("--fluid-duration", "260ms");
    element.style.setProperty("--fluid-opacity", "0");
  };

  const mask =
    "radial-gradient(110px circle at var(--fluid-x, 50%) var(--fluid-y, 50%), black 0%, black 42%, transparent 100%)";
  const interactiveOpacity = reduceMotion ? 0.26 : "var(--fluid-opacity, 0)";

  return (
    <div
      ref={rootRef}
      onPointerEnter={updatePointer}
      onPointerMove={updatePointer}
      onPointerLeave={hideDistortion}
      className={cn(
        "relative isolate overflow-hidden rounded-3xl border border-white/12 bg-[#09090b] p-7 shadow-[0_28px_70px_-36px_rgba(0,0,0,0.95)]",
        className,
      )}
    >
      <svg aria-hidden focusable="false" className="pointer-events-none absolute size-0">
        <filter id={filterId} x="-25%" y="-25%" width="150%" height="150%">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.012 0.025"
            numOctaves="2"
            seed="7"
            result="noise"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={reduceMotion ? Math.min(displacement, 12) : displacement}
            xChannelSelector="R"
            yChannelSelector="B"
          />
        </filter>
      </svg>

      <div aria-hidden className="pointer-events-none absolute inset-0">
        <FluidField colorA={colorA} colorB={colorB} />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity ease-out"
        style={{
          filter: `url(#${filterId}) saturate(1.35)`,
          maskImage: reduceMotion ? "none" : mask,
          WebkitMaskImage: reduceMotion ? "none" : mask,
          opacity: interactiveOpacity,
          transitionDuration: reduceMotion ? "0ms" : "var(--fluid-duration, 260ms)",
        }}
      >
        <FluidField colorA={colorA} colorB={colorB} />
      </div>

      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity ease-out"
        style={{
          background:
            "radial-gradient(110px circle at var(--fluid-x, 50%) var(--fluid-y, 50%), rgba(255,255,255,0.13), rgba(255,255,255,0.025) 50%, transparent 72%), radial-gradient(112px circle at var(--fluid-x, 50%) var(--fluid-y, 50%), transparent 68%, rgba(255,255,255,0.18) 69%, transparent 71%)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1), inset 0 0 30px rgba(255,255,255,0.025)",
          opacity: reduceMotion ? 0.16 : interactiveOpacity,
          transitionDuration: reduceMotion ? "0ms" : "var(--fluid-duration, 260ms)",
        }}
      />

      <div className="relative z-10 h-full">{children}</div>

      <style href="fluid-distortion-card-keyframes" precedence="medium">
        {`@keyframes fluid-distortion-drift-a{0%,100%{translate:-4% -2%;scale:1}50%{translate:9% 7%;scale:1.12}}@keyframes fluid-distortion-drift-b{0%,100%{translate:3% 2%;scale:1.05}50%{translate:-8% -6%;scale:.92}}@keyframes fluid-distortion-drift-band{0%,100%{translate:-3% 0%;rotate:-12deg}50%{translate:6% -8%;rotate:-5deg}}@media (prefers-reduced-motion:no-preference){.fluid-distortion-card-a{animation:fluid-distortion-drift-a 8s cubic-bezier(.45,0,.55,1) infinite}.fluid-distortion-card-b{animation:fluid-distortion-drift-b 10s cubic-bezier(.45,0,.55,1) infinite}.fluid-distortion-card-band{animation:fluid-distortion-drift-band 9s cubic-bezier(.45,0,.55,1) infinite}}`}
      </style>
    </div>
  );
}
