"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface FlickeringGridProps {
  children?: ReactNode;
  className?: string;
  /** 网格单元边长（像素），方块只占其中 1px */
  cellSize?: number;
  /** 每帧每格重抽目标亮度的概率（0–1） */
  flickerChance?: number;
  /** 单格亮度上限 */
  maxOpacity?: number;
  /** 方块颜色，支持 #rgb / #rrggbb */
  color?: string;
}

interface Cell {
  /** 当前不透明度 */
  opacity: number;
  /** 缓动目标 */
  target: number;
}

/** 解析十六进制颜色为 "r,g,b" 片段，供 rgba() 拼接 */
function parseColor(hex: string): string {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return "255,255,255";
  const s = m[1].length === 3 ? [...m[1]].map((c) => c + c).join("") : m[1];
  const n = parseInt(s, 16);
  return `${(n >> 16) & 255},${(n >> 8) & 255},${n & 255}`;
}

/**
 * 闪烁网格：Canvas 满铺容器，排满 1px 微光方块；
 * 每格按小概率重抽目标亮度并向其缓动，像一块会呼吸的电路板底纹。
 */
export function FlickeringGrid({
  children,
  className,
  cellSize = 8,
  flickerChance = 0.04,
  maxOpacity = 0.35,
  color = "#ffffff",
}: FlickeringGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const rgb = parseColor(color);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let cells: Cell[] = [];
    let cols = 0;
    let raf = 0;

    const layout = () => {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      cols = Math.floor(w / cellSize);
      const rows = Math.floor(h / cellSize);
      cells = Array.from({ length: cols * rows }, () => ({
        opacity: Math.random() * maxOpacity,
        target: Math.random() * maxOpacity,
      }));
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < cells.length; i++) {
        const cell = cells[i];
        if (Math.random() < flickerChance) cell.target = Math.random() * maxOpacity;
        cell.opacity += (cell.target - cell.opacity) * 0.08;
        if (cell.opacity < 0.01) continue;
        ctx.fillStyle = `rgba(${rgb},${cell.opacity.toFixed(3)})`;
        ctx.fillRect((i % cols) * cellSize + cellSize / 2 - 0.5, Math.floor(i / cols) * cellSize + cellSize / 2 - 0.5, 1, 1);
      }
    };

    layout();
    draw();
    if (!reduced.matches) raf = requestAnimationFrame(function tick() {
      draw();
      raf = requestAnimationFrame(tick);
    });

    const observer = new ResizeObserver(() => {
      layout();
      draw();
    });
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [cellSize, flickerChance, maxOpacity, color]);

  return (
    <div className={cn("relative isolate overflow-hidden bg-[#0b0b0d]", className)}>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
      />
      <div className="relative">{children}</div>
    </div>
  );
}
