"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  text: string;
  className?: string;
  /** 相邻词之间的间隔（秒） */
  stagger?: number;
  /** 首个词开始前的延迟（秒） */
  delay?: number;
  /** 播完后自动重播（用于演示场景） */
  loop?: boolean;
}

const container: Variants = {
  hidden: {},
  visible: (custom: { stagger: number; delay: number }) => ({
    transition: { staggerChildren: custom.stagger, delayChildren: custom.delay },
  }),
};

const word: Variants = {
  hidden: { opacity: 0, scale: 1.06, filter: "blur(16px)" },
  visible: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * 模糊显影：以词为单位，从一团失焦的光斑里对焦成形，
 * 比逐字入场更柔和，适合大段副标题。外层保留 aria-label 完整文本。
 * loop 开启时播完停顿 1.8s 自动重播，适合卡片预览等无人值守场景。
 */
export function BlurText({
  text,
  className,
  stagger = 0.12,
  delay = 0,
  loop = false,
}: BlurTextProps) {
  const reduce = useReducedMotion();
  const [round, setRound] = useState(0);
  const words = Array.from(new Intl.Segmenter("zh-CN", { granularity: "word" }).segment(text))
    .reduce<string[]>((parts, part) => {
      if (!part.isWordLike && !/\s/.test(part.segment) && parts.length > 0) parts[parts.length - 1] += part.segment;
      else parts.push(part.segment);
      return parts;
    }, []);

  useEffect(() => {
    if (!loop || reduce) return;
    const total = (delay + stagger * Math.max(words.length - 1, 0) + 0.55 + 1.8) * 1000;
    const timer = setTimeout(() => setRound((r) => r + 1), total);
    return () => clearTimeout(timer);
  }, [round, loop, reduce, delay, stagger, words.length]);

  return (
    <motion.span
      key={round}
      aria-label={text}
      className={cn("inline-block max-w-full", className)}
      custom={{ stagger, delay }}
      variants={container}
      initial={reduce ? "visible" : "hidden"}
      animate="visible"
    >
      {words.map((w, i) => /\s+/.test(w) && !w.trim() ? <span key={i} aria-hidden>{w}</span> : (
        <motion.span
          key={`${w}-${i}`}
          aria-hidden
          variants={word}
          className="inline-block max-w-full [overflow-wrap:anywhere]"
        >
          {w}
        </motion.span>
      ))}
    </motion.span>
  );
}
