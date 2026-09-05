"use client";

import { useReducedMotion } from "motion/react";
import { useEffect, useRef, useState, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

interface HyperTextProps {
  text: string;
  className?: string;
  /** 乱码从第一个字符到最后一个字符全部定格的总时长（毫秒） */
  duration?: number;
}

/** 跳变用的备选字符：符号、字母与数字 */
const CHARS = "!<>-_\\/[]{}=+*^?#()$%&@ABCDEFXYZ0123456789";

const randomChar = (): string => CHARS[Math.floor(Math.random() * CHARS.length)];

/**
 * 字符跳变：悬停时文字先整段抖成乱码，再从左到右逐位定格回原文；
 * 每次悬停都会重新播放。初始渲染就是原文，保证水合一致。
 */
export function HyperText({ text, className, duration = 900 }: HyperTextProps) {
  const [display, setDisplay] = useState(text);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => () => {
    if (timer.current) clearInterval(timer.current);
  }, []);

  const scramble = () => {
    if (reduce) return;
    if (timer.current) clearInterval(timer.current);
    const start = performance.now();
    timer.current = setInterval(() => {
      const settled = Math.floor(((performance.now() - start) / duration) * text.length);
      setDisplay(
        Array.from(text, (c, i) => (i < settled || c === " " ? c : randomChar())).join(""),
      );
      if (settled >= text.length && timer.current) {
        clearInterval(timer.current);
        timer.current = null;
        setDisplay(text);
      }
    }, 30);
  };

  const onEnter = (e: PointerEvent<HTMLSpanElement>) => {
    if (e.pointerType === "mouse") scramble();
  };

  return (
    <span
      aria-label={text}
      onPointerEnter={onEnter}
      onFocus={scramble}
      tabIndex={0}
      className={cn("inline-block cursor-default outline-none", className)}
    >
      <span aria-hidden className="inline-block tabular-nums">
        {display}
      </span>
    </span>
  );
}
