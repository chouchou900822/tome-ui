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
  /** 乱码字符集 */
  glyphs?: string;
}

const DEFAULT_GLYPHS = "!<>-_\\/[]{}=+*^?#ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

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
  glyphs = DEFAULT_GLYPHS,
}: DecryptTextProps) {
  const [display, setDisplay] = useState(text);
  const frame = useRef<number | null>(null);
  const reduce = useReducedMotion();

  const play = useCallback(() => {
    if (reduce) return;
    if (frame.current !== null) cancelAnimationFrame(frame.current);

    const chars = Array.from(text);
    let revealed = 0;
    let last = 0;

    const step = (now: number) => {
      if (now - last >= frameDelay) {
        last = now;
        revealed += revealPerFrame;
        setDisplay(
          chars
            .map((c, i) => {
              if (c === " " || i < revealed) return c;
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
      }
    };

    frame.current = requestAnimationFrame(step);
  }, [text, frameDelay, revealPerFrame, glyphs, reduce]);

  useEffect(() => {
    play();
    return () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    };
  }, [play]);

  return (
    <span
      aria-label={text}
      onMouseEnter={replayOnHover ? play : undefined}
      className={cn("inline-block font-mono tabular-nums", className)}
    >
      <span aria-hidden>{display}</span>
    </span>
  );
}
