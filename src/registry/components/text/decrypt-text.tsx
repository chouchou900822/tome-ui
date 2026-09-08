"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";
import { cn } from "@/lib/utils";

interface DecryptTextProps {
  text: string;
  className?: string;
  /** 每帧揭示的字符数，越大越快 */
  revealPerFrame?: number;
  /** 帧间隔（毫秒） */
  frameDelay?: number;
  /** 鼠标悬停时重新播放 */
  replayOnHover?: boolean;
  /** 关闭后只在悬停或键盘聚焦时播放 */
  animateOnMount?: boolean;
  /** 播完后自动重播（用于演示场景） */
  loop?: boolean;
  /** 乱码字符集 */
  glyphs?: string;
}

const DEFAULT_GLYPHS = "!<>-_\\/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

function splitGlyphs(value: string): string[] {
  return Array.from(new Intl.Segmenter("zh-CN", { granularity: "grapheme" }).segment(value), (part) => part.segment);
}

/**
 * 解码文字：字符先以乱码闪动，再从左到右逐个落定为真实内容。
 * 服务端与首帧渲染的都是最终文本，避免水合不一致；乱码只在挂载后运行。
 */
export function DecryptText({
  text,
  className,
  revealPerFrame = 0.5,
  frameDelay = 30,
  replayOnHover = true,
  animateOnMount = true,
  loop = false,
  glyphs = DEFAULT_GLYPHS,
}: DecryptTextProps) {
  const [display, setDisplay] = useState(text);
  const frame = useRef<number | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reduce = useReducedMotion();
  const chars = splitGlyphs(text);
  const displayed = splitGlyphs(display);

  const play = useCallback(() => {
    if (frame.current !== null) cancelAnimationFrame(frame.current);
    if (timer.current !== null) clearTimeout(timer.current);
    if (reduce) { setDisplay(text); return; }

    const chars = splitGlyphs(text);
    let revealed = 0;
    let last = 0;

    const step = (now: number) => {
      if (now - last >= frameDelay) {
        last = now;
        revealed += Math.max(0.1, revealPerFrame);
        setDisplay(
          chars
            .map((c, i) => {
              if (/\s/.test(c) || i < revealed) return c;
              return glyphs[Math.floor(Math.random() * glyphs.length)] ?? c;
            })
            .join(""),
        );
      }
      if (revealed < chars.length) {
        frame.current = requestAnimationFrame(step);
      } else {
        setDisplay(text);
        frame.current = null;
        if (loop) timer.current = setTimeout(play, 2200);
      }
    };

    frame.current = requestAnimationFrame(step);
  }, [text, frameDelay, revealPerFrame, glyphs, reduce, loop]);

  useEffect(() => {
    setDisplay(text);
    if (animateOnMount || loop) play();
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
      if (timer.current !== null) clearTimeout(timer.current);
    };
  }, [play, text, animateOnMount, loop]);

  return (
    <span
      aria-label={text}
      onMouseEnter={replayOnHover ? play : undefined}
      onFocus={replayOnHover ? play : undefined}
      tabIndex={replayOnHover ? 0 : undefined}
      className={cn("inline-block rounded-sm font-mono tabular-nums outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-current", className)}
    >
      <span aria-hidden>
        {chars.map((char, i) => (
          <span key={i} className="relative inline-grid">
            <span className="invisible col-start-1 row-start-1 whitespace-pre">{char}</span>
            <span className="col-start-1 row-start-1 text-center whitespace-pre">{displayed[i] ?? char}</span>
          </span>
        ))}
      </span>
    </span>
  );
}
