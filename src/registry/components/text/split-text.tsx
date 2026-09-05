"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface SplitTextProps {
  text: string;
  className?: string;
  /** 相邻字符之间的间隔（秒） */
  stagger?: number;
  /** 首个字符开始前的延迟（秒） */
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

const char: Variants = {
  hidden: { y: "110%" },
  visible: { y: "0%", transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/**
 * 分字入场：每个字符从各自裁切框的底部依次升起，像一行排版被逐字推上来。
 * 挂载即播放；外层保留 aria-label 完整文本。
 * loop 开启时播完停顿 1.8s 自动重播，适合卡片预览等无人值守场景。
 */
export function SplitText({
  text,
  className,
  stagger = 0.035,
  delay = 0,
  loop = false,
}: SplitTextProps) {
  const reduce = useReducedMotion();
  const [round, setRound] = useState(0);
  const chars = Array.from(text);

  useEffect(() => {
    if (!loop || reduce) return;
    const total = (delay + stagger * Math.max(chars.length - 1, 0) + 0.6 + 1.8) * 1000;
    const timer = setTimeout(() => setRound((r) => r + 1), total);
    return () => clearTimeout(timer);
  }, [round, loop, reduce, delay, stagger, chars.length]);

  return (
    <motion.span
      key={round}
      aria-label={text}
      className={cn("inline-block", className)}
      custom={{ stagger, delay }}
      variants={container}
      initial={reduce ? "visible" : "hidden"}
      animate="visible"
    >
      {chars.map((c, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom">
          <motion.span variants={char} className="inline-block will-change-transform">
            {c === " " ? " " : c}
          </motion.span>
        </span>
      ))}
    </motion.span>
  );
}
