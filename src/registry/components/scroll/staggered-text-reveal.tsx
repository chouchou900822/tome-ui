"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

interface StaggeredTextRevealProps {
  text: string;
  stagger?: number;
  duration?: number;
  className?: string;
}

export function StaggeredTextReveal({
  text,
  stagger = 0.035,
  duration = 0.55,
  className,
}: StaggeredTextRevealProps) {
  const reduceMotion = useReducedMotion();

  const character: Variants = {
    hidden: reduceMotion
      ? { opacity: 1, y: 0, rotate: 0, filter: "blur(0px)" }
      : { opacity: 0, y: 32, rotate: 4, filter: "blur(8px)" },
    visible: (index: number) => ({
      opacity: 1,
      y: 0,
      rotate: 0,
      filter: "blur(0px)",
      transition: reduceMotion
        ? { duration: 0 }
        : {
            duration,
            delay: index * stagger,
            ease: [0.22, 1, 0.36, 1],
          },
    }),
  };

  return (
    <motion.span
      aria-label={text}
      className={cn("inline-flex flex-wrap overflow-hidden", className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.65 }}
    >
      {Array.from(text).map((characterText, index) => (
        <motion.span
          key={`${characterText}-${index}`}
          aria-hidden
          className="inline-block origin-bottom"
          custom={index}
          variants={character}
        >
          {characterText === " " ? "\u00a0" : characterText}
        </motion.span>
      ))}
    </motion.span>
  );
}
