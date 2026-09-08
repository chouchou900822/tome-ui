"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface WordRotateProps {
  /** 轮换展示的词组，至少两个 */
  words: string[];
  className?: string;
  /** 每个词的停留时长（毫秒） */
  interval?: number;
}

/**
 * 词语轮换：关键词在同一个位置上翻出、翻入，
 * 旧词上移出走、新词从下方补位，适合标语中的动态部分。
 */
export function WordRotate({ words, className, interval = 2400 }: WordRotateProps) {
  const [index, setIndex] = useState(0);
  const reduce = useReducedMotion();
  const current = words[index % words.length];

  useEffect(() => {
    if (reduce || words.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(timer);
  }, [reduce, words.length, interval]);

  if (!current) return null;

  return (
    <span
      className={cn("relative inline-grid overflow-hidden align-bottom", className)}
    >
      {words.map((word, i) => (
        <span key={i} aria-hidden className="invisible col-start-1 row-start-1 whitespace-nowrap">{word}</span>
      ))}
      <AnimatePresence initial={false}>
        <motion.span
          key={index}
          aria-hidden
          className="col-start-1 row-start-1 inline-block whitespace-nowrap"
          initial={reduce ? false : { y: "65%", opacity: 0, filter: "blur(4px)" }}
          animate={{ y: "0%", opacity: 1, filter: "blur(0px)" }}
          exit={{ y: reduce ? "0%" : "-65%", opacity: 0, filter: reduce ? "blur(0px)" : "blur(4px)" }}
          transition={{ duration: reduce ? 0 : 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {current}
        </motion.span>
      </AnimatePresence>
      <span className="sr-only" aria-live="polite" aria-atomic="true">{current}</span>
    </span>
  );
}
