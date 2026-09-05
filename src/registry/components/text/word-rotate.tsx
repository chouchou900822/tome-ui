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
  const current = words[index];

  useEffect(() => {
    if (reduce || words.length < 2) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % words.length), interval);
    return () => clearInterval(timer);
  }, [reduce, words.length, interval]);

  if (!current) return null;

  return (
    <span
      aria-live="polite"
      className={cn("relative inline-flex overflow-hidden align-bottom", className)}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={index}
          aria-label={current}
          className="inline-block whitespace-nowrap will-change-transform"
          initial={reduce ? undefined : { y: "80%", opacity: 0 }}
          animate={reduce ? undefined : { y: "0%", opacity: 1 }}
          exit={reduce ? undefined : { y: "-80%", opacity: 0 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        >
          {current}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}
