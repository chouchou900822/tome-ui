"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

interface TextRevealProps {
  text: string;
  className?: string;
  /** 首个单元开始前的延迟（秒） */
  delay?: number;
  /** 相邻单元之间的间隔（秒） */
  stagger?: number;
  /** 只播放一次，还是每次进入视口都播放 */
  once?: boolean;
}

const container: Variants = {
  hidden: {},
  visible: (custom: { stagger: number; delay: number }) => ({
    transition: { staggerChildren: custom.stagger, delayChildren: custom.delay },
  }),
};

const unit: Variants = {
  hidden: { opacity: 0, y: "0.6em", filter: "blur(12px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

/**
 * 文字显现：进入视口时逐字（中文）或逐词（含空格的文本）从模糊中浮现。
 * 使用 aria-label 保证屏幕阅读器读到完整文本。
 */
export function TextReveal({
  text,
  className,
  delay = 0,
  stagger = 0.05,
  once = true,
}: TextRevealProps) {
  const reduce = useReducedMotion();
  const byWord = /\s/.test(text);
  const units = byWord ? text.split(/\s+/) : Array.from(text);

  return (
    <motion.span
      aria-label={text}
      className={cn("inline-block", className)}
      custom={{ stagger, delay }}
      variants={container}
      initial={reduce ? "visible" : "hidden"}
      whileInView="visible"
      viewport={{ once, amount: 0.2 }}
    >
      {units.map((u, i) => (
        <motion.span
          key={`${u}-${i}`}
          aria-hidden
          variants={unit}
          className="inline-block will-change-transform"
        >
          {u}
          {byWord && i < units.length - 1 ? " " : null}
        </motion.span>
      ))}
    </motion.span>
  );
}
