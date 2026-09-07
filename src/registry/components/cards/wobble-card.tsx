"use client";

import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionStyle,
  type SpringOptions,
} from "motion/react";
import { useRef, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface WobbleCardProps {
  children: ReactNode;
  className?: string;
}

/** 果冻卡片：等面积挤压、柔软边角与低阻尼回弹共同表现胶质感。 */
export function WobbleCard({ children, className }: WobbleCardProps) {
  const reduce = useReducedMotion();
  const activePointer = useRef<number | null>(null);
  const spring: SpringOptions = { stiffness: 180, damping: 10, mass: 0.8 };
  const x = useSpring(0, spring);
  const y = useSpring(0, spring);
  const squash = useSpring(0, { stiffness: 240, damping: 9, mass: 0.8 });

  // 横纵缩放互为倒数，挤压时保留面积，避免变成普通的整体缩放。
  const scaleX = useTransform(
    () => 1 + squash.get() + (Math.abs(x.get()) - Math.abs(y.get())) * 0.035,
  );
  const scaleY = useTransform(scaleX, (value) => 1 / value);
  const borderRadius = useTransform(() => {
    const horizontal = x.get() * 10;
    const vertical = y.get() * 8;
    const radius = 32 + squash.get() * 60;
    return [
      radius - horizontal - vertical,
      radius + horizontal - vertical,
      radius + horizontal + vertical,
      radius - horizontal + vertical,
    ].map((value) => `${Math.max(14, value)}px`).join(" ");
  });
  const bodyStyle: MotionStyle = {
    x: useTransform(x, (value) => value * 10),
    y: useTransform(y, (value) => value * 6),
    rotate: useTransform(x, (value) => value * 2),
    rotateX: useTransform(y, (value) => value * -5),
    rotateY: useTransform(x, (value) => value * 5),
    skewX: useTransform(x, (value) => value * -4),
    scaleX,
    scaleY,
    borderRadius,
  };
  const blobX = useTransform(x, (value) => value * -24);
  const blobY = useTransform(y, (value) => value * -18);
  const contentStyle: MotionStyle = {
    x: useSpring(useTransform(x, (value) => value * -6), spring),
    y: useSpring(useTransform(y, (value) => value * -4), spring),
  };
  const glossX = useTransform(x, (value) => 50 + value * 26);
  const glossY = useTransform(y, (value) => 30 + value * 20);
  const gloss = useMotionTemplate`radial-gradient(ellipse at ${glossX}% ${glossY}%, rgb(224 242 254 / 0.18), transparent 65%)`;

  const onMove = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || (!event.isPrimary) || (event.pointerType === "touch" && activePointer.current === null)) return;
    // 从不参与形变的外层测量，避免卡体变形反过来干扰指针坐标。
    const rect = event.currentTarget.getBoundingClientRect();
    if (!rect.width || !rect.height) return;
    x.set(Math.max(-1, Math.min(1, (event.clientX - rect.left) / rect.width * 2 - 1)));
    y.set(Math.max(-1, Math.min(1, (event.clientY - rect.top) / rect.height * 2 - 1)));
  };

  const reset = () => {
    activePointer.current = null;
    x.set(0);
    y.set(0);
    squash.set(0);
  };

  const onPress = (event: PointerEvent<HTMLDivElement>) => {
    if (reduce || !event.isPrimary || event.button !== 0) return;
    // 子元素仍保留自己的点击、输入与焦点行为。
    if (event.target instanceof Element && event.target.closest("a, button, input, select, textarea, [contenteditable], [role='button']")) return;
    activePointer.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    onMove(event);
    squash.set(0.18);
  };

  const onRelease = (event: PointerEvent<HTMLDivElement>) => {
    if (activePointer.current !== event.pointerId) return;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }
    reset();
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget || !["Enter", " "].includes(event.key)) return;
    event.preventDefault();
    if (!reduce && !event.repeat) squash.set(0.18);
  };

  return (
    <div
      role="group"
      aria-label="可按压的弹性卡片"
      aria-keyshortcuts="Enter Space"
      tabIndex={0}
      onPointerEnter={(event) => {
        if (reduce || event.pointerType === "touch") return;
        onMove(event);
        squash.set(0.06);
      }}
      onPointerMove={onMove}
      onPointerDown={onPress}
      onPointerUp={onRelease}
      onPointerCancel={reset}
      onLostPointerCapture={reset}
      onPointerLeave={() => { if (activePointer.current === null) reset(); }}
      onKeyDown={onKeyDown}
      onKeyUp={(event) => {
        if (event.target === event.currentTarget && ["Enter", " "].includes(event.key)) reset();
      }}
      onBlur={reset}
      className="relative min-w-0 max-w-full cursor-grab rounded-[32px] outline-none [perspective:800px] active:cursor-grabbing focus-visible:outline-2 focus-visible:outline-offset-8 focus-visible:outline-sky-300/70"
    >
      <motion.div
        style={bodyStyle}
        className={cn(
          "relative w-80 max-w-full overflow-hidden rounded-[32px] border border-white/20 bg-[#111225] p-8",
          "shadow-[inset_0_2px_3px_rgb(255_255_255/0.18),inset_0_-10px_24px_rgb(139_92_246/0.12),0_24px_60px_-20px_rgb(0_0_0/0.8)]",
          className,
        )}
      >
        <motion.div
          aria-hidden
          style={{ x: blobX, y: blobY }}
          className="pointer-events-none absolute -right-10 -top-16 size-56 rounded-full bg-sky-400/30 blur-2xl"
        />
        <motion.div
          aria-hidden
          style={{ x: blobY, y: blobX }}
          className="pointer-events-none absolute -bottom-20 -left-12 size-64 rounded-full bg-violet-500/35 blur-2xl"
        />
        <motion.div aria-hidden style={{ background: gloss }} className="pointer-events-none absolute inset-0" />
        <div aria-hidden className="pointer-events-none absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent" />
        <motion.div style={contentStyle} className="relative">{children}</motion.div>
      </motion.div>
    </div>
  );
}
