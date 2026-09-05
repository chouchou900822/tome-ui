"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface TextPressureProps {
  text: string;
  className?: string;
  /** 最细字重 */
  minWeight?: number;
  /** 最粗字重 */
  maxWeight?: number;
  /** 指针生效半径（像素） */
  radius?: number;
}

/**
 * 压力字体：指针靠近的字符被"压"粗压宽，离开后回落，
 * 需要可变字体才有平滑过渡（系统 UI 字体多为可变）。
 * 字重直接写入每个字符的 style，指针移动不触发 React 重渲染。
 */
export function TextPressure({
  text,
  className,
  minWeight = 400,
  maxWeight = 850,
  radius = 130,
}: TextPressureProps) {
  const containerRef = useRef<HTMLSpanElement>(null);
  const charsRef = useRef<(HTMLSpanElement | null)[]>([]);
  const mouse = useRef({ x: -1e4, y: -1e4 });
  const raf = useRef(0);
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = containerRef.current;
    if (!el || reduce) return;

    const paint = () => {
      raf.current = 0;
      for (const span of charsRef.current) {
        if (!span) continue;
        const rect = span.getBoundingClientRect();
        const distance = Math.hypot(
          mouse.current.x - (rect.left + rect.width / 2),
          mouse.current.y - (rect.top + rect.height / 2),
        );
        const strength = Math.max(0, 1 - distance / radius);
        const weight = Math.round(minWeight + (maxWeight - minWeight) * strength);
        span.style.fontWeight = String(weight);
        span.style.fontVariationSettings = `"wght" ${weight}`;
      }
    };

    const schedule = () => {
      if (!raf.current) raf.current = requestAnimationFrame(paint);
    };

    const onMove = (e: PointerEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
      schedule();
    };
    const onLeave = () => {
      mouse.current = { x: -1e4, y: -1e4 };
      schedule();
    };

    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [reduce, minWeight, maxWeight, radius]);

  return (
    <span
      ref={containerRef}
      aria-label={text}
      className={cn("inline-block cursor-default select-none", className)}
    >
      {Array.from(text).map((c, i) => (
        <span
          key={i}
          aria-hidden
          ref={(el) => {
            charsRef.current[i] = el;
          }}
          className="inline-block transition-[font-weight] duration-100"
          style={{ fontWeight: minWeight }}
        >
          {c === " " ? " " : c}
        </span>
      ))}
    </span>
  );
}
