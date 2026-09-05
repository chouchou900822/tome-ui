"use client";

import { useEffect, useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ClickSparkProps {
  children: ReactNode;
  className?: string;
  /** 火花线颜色 */
  sparkColor?: string;
  /** 火花线长度（像素） */
  sparkSize?: number;
  /** 每次点击迸出的线数 */
  sparkCount?: number;
}

interface Spark {
  x: number;
  y: number;
  angle: number;
  born: number;
}

const LIFE = 420;

/**
 * 点击火花：在容器内任意位置点击，迸出一圈短线向外飞散淡出。
 * Canvas 叠在内容之上但不拦截指针，适合包住按钮区或整页。
 */
export function ClickSpark({
  children,
  className,
  sparkColor = "#ffffff",
  sparkSize = 14,
  sparkCount = 8,
}: ClickSparkProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sparksRef = useRef<Spark[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let raf = 0;

    const layout = () => {
      canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
      canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    };

    const frame = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const now = performance.now();
      sparksRef.current = sparksRef.current.filter((s) => now - s.born < LIFE);
      ctx.strokeStyle = sparkColor;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      for (const s of sparksRef.current) {
        const t = (now - s.born) / LIFE;
        const head = t * sparkSize * 1.6;
        const tail = head - sparkSize * (1 - t * 0.5);
        if (tail < 0) continue;
        ctx.globalAlpha = 1 - t;
        ctx.beginPath();
        ctx.moveTo(s.x + Math.cos(s.angle) * tail, s.y + Math.sin(s.angle) * tail);
        ctx.lineTo(s.x + Math.cos(s.angle) * head, s.y + Math.sin(s.angle) * head);
        ctx.stroke();
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };

    layout();
    raf = requestAnimationFrame(frame);
    const observer = new ResizeObserver(layout);
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [sparkColor, sparkSize]);

  const onClick = (e: MouseEvent<HTMLDivElement>) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const now = performance.now();
    for (let i = 0; i < sparkCount; i++) {
      sparksRef.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        angle: (Math.PI * 2 * i) / sparkCount + Math.random() * 0.5,
        born: now,
      });
    }
  };

  return (
    <div className={cn("relative isolate", className)} onClick={onClick}>
      {children}
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      />
    </div>
  );
}
