"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface TypewriterProps {
  /** 轮播的短语列表 */
  phrases: string[];
  className?: string;
  /** 每个字符的输入间隔（毫秒） */
  typingSpeed?: number;
  /** 每个字符的删除间隔（毫秒） */
  deletingSpeed?: number;
  /** 打完一句后的停留时长（毫秒） */
  pause?: number;
  /** 光标字符 */
  cursor?: string;
}

/**
 * 打字机：循环输入、停留、删除一组短语，附带闪烁光标。
 * 使用 Array.from 按码点切分，中文与 emoji 不会被截成半个字符。
 */
export function Typewriter({
  phrases,
  className,
  typingSpeed = 70,
  deletingSpeed = 35,
  pause = 1600,
  cursor = "▍",
}: TypewriterProps) {
  const [index, setIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [deleting, setDeleting] = useState(false);

  const phrase = phrases[index % phrases.length] ?? "";
  const chars = Array.from(phrase);

  useEffect(() => {
    if (phrases.length === 0) return;
    let delay = deleting ? deletingSpeed : typingSpeed;

    if (!deleting && length === chars.length) delay = pause;
    if (deleting && length === 0) delay = 400;

    const timer = window.setTimeout(() => {
      if (!deleting && length === chars.length) {
        setDeleting(true);
      } else if (deleting && length === 0) {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      } else {
        setLength((n) => n + (deleting ? -1 : 1));
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [chars.length, deleting, deletingSpeed, length, pause, phrases.length, typingSpeed]);

  return (
    <span className={cn("inline-flex items-baseline", className)} aria-live="polite">
      <span>{chars.slice(0, length).join("")}</span>
      <span
        aria-hidden
        className="ml-0.5 motion-safe:animate-[typewriter-blink_1s_linear_infinite]"
      >
        {cursor}
      </span>
      <style href="typewriter-keyframes" precedence="medium">
        {`@keyframes typewriter-blink{0%,49%{opacity:1}50%,100%{opacity:0}}`}
      </style>
    </span>
  );
}
