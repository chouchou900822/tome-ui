"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LetterGlitchProps {
  children?: ReactNode;
  className?: string;
  /** 一个字符单元的边长（像素） */
  cellSize?: number;
  /** 每帧每格跳变新字符的概率（0–1） */
  glitchChance?: number;
}

/** 备选字符集：符号、字母与数字混合，避开易与空白混淆的字符 */
const CHARS = "!<>-_\\/[]{}=+*^?#$%&@ABCDEFXYZ0123456789";

/** 青绿为主的跳变色板，掺少量白色作高光 */
const COLORS = [
  "rgba(18,255,255,0.55)",
  "rgba(18,255,255,0.32)",
  "rgba(0,255,102,0.38)",
  "rgba(0,255,102,0.25)",
  "rgba(255,255,255,0.4)",
  "rgba(18,255,255,0.45)",
] as const;

interface Glyph {
  char: string;
  color: string;
}

const randomGlyph = (): Glyph => ({
  char: CHARS[Math.floor(Math.random() * CHARS.length)],
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
});

/**
 * 字符雨屏：满屏等宽字符以青绿色调随机跳变，中心亮、边缘渐隐，
 * 是一层数字噪声质感的底纹。
 */
export function LetterGlitch({
  children,
  className,
  cellSize = 14,
  glitchChance = 0.06,
}: LetterGlitchProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let glyphs: Glyph[] = [];
    let cols = 0;
    let raf = 0;

    const layout = () => {
      const w = canvas.clientWidth || 1;
      const h = canvas.clientHeight || 1;
      canvas.width = Math.max(1, Math.round(w * dpr));
      canvas.height = Math.max(1, Math.round(h * dpr));
      cols = Math.floor(w / cellSize);
      const rows = Math.floor(h / cellSize);
      glyphs = Array.from({ length: cols * rows }, randomGlyph);
    };

    const draw = () => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${cellSize - 2}px ui-monospace, SFMono-Regular, Menlo, monospace`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      for (let i = 0; i < glyphs.length; i++) {
        const glyph = glyphs[i];
        if (Math.random() < glitchChance) Object.assign(glyph, randomGlyph());
        ctx.fillStyle = glyph.color;
        ctx.fillText(
          glyph.char,
          (i % cols) * cellSize + cellSize / 2,
          Math.floor(i / cols) * cellSize + cellSize / 2,
        );
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
  }, [cellSize, glitchChance]);

  return (
    <div className={cn("relative isolate overflow-hidden bg-[#0b0b0d]", className)}>
      <canvas
        ref={canvasRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 size-full"
        style={{
          maskImage: "radial-gradient(120% 120% at 50% 50%, #000 30%, transparent 76%)",
          WebkitMaskImage: "radial-gradient(120% 120% at 50% 50%, #000 30%, transparent 76%)",
        }}
      />
      <div className="relative">{children}</div>
    </div>
  );
}
