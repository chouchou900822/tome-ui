"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

interface BlurTextProps {
  text: string;
  className?: string;
  /** 相邻词之间的间隔（秒） */
  stagger?: number;
  /** 首个词开始前的延迟（秒） */
  delay?: number;
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
 */
export function BlurText({ text, className, stagger = 0.12, delay = 0 }: BlurTextProps) {
  const reduce = useReducedMotion();
  const words = text.split(" ");

  return (
    <motion.span
      aria-label={text}
      className={cn("inline-block", className)}
      custom={{ stagger, delay }}
      variants={container}
      initial={reduce ? "visible" : "hidden"}
      animate="visible"
    >
      {words.map((w, i) => (
        <motion.span
          key={`${w}-${i}`}
          aria-hidden
          variants={word}
          className="inline-block will-change-transform"
        >
          {w}
          {i < words.length - 1 ? " " : null}
        </motion.span>
      ))}
    </motion.span>
  );
}
