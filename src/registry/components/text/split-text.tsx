"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  /** 相邻字符之间的间隔（秒） */
  stagger?: number;
  /** 首个字符开始前的延迟（秒） */
  delay?: number;
}

const container: Variants = {
  hidden: {},
  visible: (custom: { stagger: number; delay: number }) => ({
    transition: { staggerChildren: custom.stagger, delayChildren: custom.delay },
  }),
};

const char: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * 分字入场：每个字符从各自裁切框的底部依次升起，像一行排版被逐字推上来。
 * 挂载即播放；外层保留 aria-label 完整文本。
 */
export function SplitText({ text, className, stagger = 0.035, delay = 0 }: SplitTextProps) {
  const reduce = useReducedMotion();

  return (
    <motion.span
      aria-label={text}
      className={cn("inline-block", className)}
      custom={{ stagger, delay }}
      variants={container}
      initial={reduce ? "visible" : "hidden"}
      animate="visible"
    >
      {Array.from(text).map((c, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom">
          <motion.span variants={char} className="inline-block will-change-transform">
            {c === " " ? " " : c}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
