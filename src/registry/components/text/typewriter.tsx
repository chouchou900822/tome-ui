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
 * 隐藏的短语共同撑开网格，输入与删除时周围文案保持原位。
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
  const [reduced, setReduced] = useState(true);
  const [announcement, setAnnouncement] = useState(phrases[0] ?? "");

  const phrase = phrases[index % phrases.length] ?? "";
  const chars = Array.from(new Intl.Segmenter("zh-CN", { granularity: "grapheme" }).segment(phrase), (part) => part.segment);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduced(media.matches);
    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reduced || phrases.length === 0) return;
    let delay = deleting ? deletingSpeed : typingSpeed;

    if (!deleting && length === chars.length) delay = pause;
    if (deleting && length === 0) delay = 400;

    const timer = window.setTimeout(() => {
      if (!deleting && length === chars.length) {
        setAnnouncement(phrase);
        setDeleting(true);
      } else if (deleting && length === 0) {
        setDeleting(false);
        setIndex((i) => (i + 1) % phrases.length);
      } else {
        setLength((n) => n + (deleting ? -1 : 1));
      }
    }, delay);

    return () => window.clearTimeout(timer);
  }, [chars.length, deleting, deletingSpeed, length, pause, phrase, phrases.length, typingSpeed, reduced]);

  if (phrases.length === 0) return null;

  return (
    <span className={cn("relative inline-grid max-w-full align-baseline", className)}>
      {phrases.map((item, i) => (
        <span key={i} aria-hidden className="invisible col-start-1 row-start-1 whitespace-pre">
          {item}<span className="ml-0.5">{cursor}</span>
        </span>
      ))}
      <span aria-hidden className="col-start-1 row-start-1 inline-flex items-baseline whitespace-pre">
        <span>{reduced ? phrases[0] : chars.slice(0, length).join("")}</span>
        <span className="ml-0.5 text-current/70 motion-safe:animate-[typewriter-blink_1.1s_step-end_infinite]">{cursor}</span>
      </span>
      <span className="sr-only" aria-live="polite" aria-atomic="true">{reduced ? phrases[0] : announcement}</span>
      <style href="typewriter-keyframes" precedence="medium">
        {`@keyframes typewriter-blink{0%,49%{opacity:1}50%,100%{opacity:0}}`}
      </style>
    </span>
  );
}
