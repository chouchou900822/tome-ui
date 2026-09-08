"use client";

import {
  memo, useCallback, useEffect, useId, useRef, useState,
  type FocusEvent as ReactFocusEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type ReactNode,
} from "react";
import {
  motion, useMotionValue, useReducedMotion, useSpring, useTransform,
  type MotionValue,
} from "motion/react";
import { cn } from "@/lib/utils";

export interface Chapter {
  /** 稳定唯一标识 */
  id: string;
  /** 预览卡顶部的加粗标题 */
  title: string;
  /** 说明文字（最多三行）与标题上方的小号弱化标签（如时间戳） */
  description?: ReactNode;
  meta?: ReactNode;
}

export interface ChapterScrubberProps {
  /** 章节自上而下每章渲染一行刻度 */
  chapters: Chapter[];
  /** 预览卡默认开向哪侧，靠近视口边缘时自动翻转。默认 "right" */
  side?: "left" | "right";
  /** 波峰处刻度长度 px，默认 56；静止长度 px，默认 14 */
  peakLength?: number;
  restLength?: number;
  /** 每行高度 px 即刻度间距，默认 10；放大波半径（行数），默认 4 */
  rowHeight?: number;
  radius?: number;
  /** 常驻「当前」章节的索引 */
  currentIndex?: number;
  /** 活动（悬停/聚焦）章节变化 / 点击或 Enter/Space 选中时触发 */
  onActiveChange?: (chapter: Chapter | null, index: number) => void;
  onSelect?: (chapter: Chapter, index: number) => void;
  /** 轨道的无障碍名称，默认「章节」 */
  label?: string;
  className?: string;
}

const CARD_WIDTH = 260;
const GAP = 20;
// 指针弹簧：近临界阻尼，几乎零延迟跟随光标且从不过冲，波形像粘在指针上
const POINTER_SPRING = { stiffness: 700, damping: 52, mass: 0.5 };
// 强度弹簧更软，波形的起与落带呼吸感
const STRENGTH_SPRING = { stiffness: 260, damping: 30, mass: 0.6 };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// 升余弦凸包：波峰处为 1、半径外为 0、两端斜率为零，衰减曲线无接缝
function bump(distance: number, radius: number) {
  if (distance >= radius) return 0;
  return 0.5 * (1 + Math.cos(Math.PI * (distance / radius)));
}

interface TickProps {
  index: number;
  radius: number;
  restLength: number;
  peakLength: number;
  isCurrent: boolean;
  pointer: MotionValue<number>;
  strength: MotionValue<number>;
}

/** 单根刻度：从共享的指针/强度值读出自己的抬升量，避免每行独立状态 */
const Tick = memo(function Tick({
  index, pointer, strength, radius, restLength, peakLength, isCurrent,
}: TickProps) {
  // 长度承担主视觉，厚度只在波峰轻微增厚（2px → 约 2.8px）
  const rise = () => strength.get() * bump(Math.abs(index - pointer.get()), radius);
  const width = useTransform(() => restLength + rise() * (peakLength - restLength));
  const opacity = useTransform(() => {
    const base = isCurrent ? 0.55 : 0.22;
    return base + rise() * (1 - base);
  });
  const scaleY = useTransform(() => 1 + rise() * 0.4);

  return (
    <motion.span
      aria-hidden="true"
      style={{ width, opacity, scaleY }}
      className={cn("block h-[2px] rounded-full", isCurrent ? "bg-lime-300" : "bg-zinc-100")}
    />
  );
});

/**
 * 章节擦洗器：垂直刻度轨道，悬停或键盘聚焦时指针周围的刻度按升余弦
 * 波形抬升变亮，预览卡跟随光标逐章扫过。适合视频、播客与长文的章节导航。
 */
export function ChapterScrubber({
  chapters, side = "right", peakLength = 56, restLength = 14,
  rowHeight = 10, radius = 4, currentIndex, onActiveChange, onSelect,
  label = "章节", className,
}: ChapterScrubberProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);
  // 加命名空间，选项 id 在多实例间不冲突，也不依赖 chapter.id 是合法 DOM id
  const baseId = useId();
  const optionId = (index: number) => `${baseId}-opt-${index}`;

  const rawPointer = useMotionValue(0);
  const rawStrength = useMotionValue(0);
  const springPointer = useSpring(rawPointer, POINTER_SPRING);
  const springStrength = useSpring(rawStrength, STRENGTH_SPRING);
  // 减少动态：去掉弹簧的时间缓动，保留空间波形，抬升即时呈现
  const pointer = prefersReducedMotion ? rawPointer : springPointer;
  const strength = prefersReducedMotion ? rawStrength : springStrength;

  const [activeIndex, setActiveIndex] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [cardHeight, setCardHeight] = useState(0);
  const hoveringRef = useRef(false);
  const focusedRef = useRef<number | null>(null);
  const activeRef = useRef(0);

  const commitActive = useCallback((index: number) => {
    if (index !== activeRef.current) {
      activeRef.current = index;
      setActiveIndex(index);
    }
  }, []);

  const last = chapters.length - 1;
  const active = chapters[activeIndex];

  useEffect(() => {
    onActiveChange?.(engaged ? chapters[activeIndex] : null, engaged ? activeIndex : -1);
  }, [engaged, activeIndex, chapters, onActiveChange]);

  // 量取卡片高度，用于把它的纵向行程钳制在轨道上下界内
  useEffect(() => {
    if (cardRef.current) setCardHeight(cardRef.current.offsetHeight);
  }, [activeIndex]);

  // 卡片若会溢出视口，自动翻向更宽敞的一侧
  useEffect(() => {
    if (!engaged) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vw = el.ownerDocument.defaultView?.innerWidth ?? 0;
    const need = CARD_WIDTH + GAP + 8;
    let useRight = side === "right";
    if (useRight && vw - rect.right < need && rect.left >= need) useRight = false;
    if (!useRight && rect.left < need && vw - rect.right >= need) useRight = true;
    setFlipped(useRight !== (side === "right"));
  }, [engaged, activeIndex, side]);

  const resolvedSide =
    side === "right" ? (flipped ? "left" : "right") : flipped ? "right" : "left";
  const totalHeight = chapters.length * rowHeight;
  // roving tabindex：同一时刻只有一章可以 Tab
  const rovingIndex = engaged ? activeIndex : (currentIndex ?? 0);

  const cardTop = useTransform(pointer, (p) => {
    const half = cardHeight / 2;
    const center = clamp((p + 0.5) * rowHeight, half, Math.max(half, totalHeight - half));
    return center - half;
  });
  const cardScale = useTransform(strength, [0, 1], [0.97, 1]);
  const cardX = useTransform(strength, [0, 1], [resolvedSide === "right" ? -6 : 6, 0]);

  const engageAt = (pointerRow: number, activeAt: number) => {
    rawPointer.set(pointerRow);
    rawStrength.set(1);
    commitActive(clamp(activeAt, 0, last));
    if (!engaged) setEngaged(true);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const rect = listRef.current?.getBoundingClientRect();
    if (!rect) return;
    const row = (event.clientY - rect.top) / rowHeight - 0.5;
    hoveringRef.current = true;
    engageAt(clamp(row, -0.5, last + 0.5), Math.round(row));
  };

  const handlePointerLeave = () => {
    hoveringRef.current = false;
    if (focusedRef.current != null) rawPointer.set(focusedRef.current);
    else {
      rawStrength.set(0);
      setEngaged(false);
    }
  };

  const handleBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    focusedRef.current = null;
    if (!hoveringRef.current) {
      rawStrength.set(0);
      setEngaged(false);
    }
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    let next = focusedRef.current ?? activeRef.current;
    if (event.key === "ArrowDown" || event.key === "ArrowRight") next = Math.min(last, next + 1);
    else if (event.key === "ArrowUp" || event.key === "ArrowLeft") next = Math.max(0, next - 1);
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    else return;
    event.preventDefault();
    buttonsRef.current[next]?.focus();
  };

  return (
    <div ref={containerRef} style={{ width: peakLength }} className={cn("relative", className)}>
      <div
        ref={listRef}
        role="listbox" aria-label={label} aria-orientation="vertical"
        aria-activedescendant={engaged ? optionId(activeIndex) : undefined}
        className="flex w-full flex-col"
        onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave}
        onKeyDown={handleKeyDown} onBlur={handleBlur}
      >
        {chapters.map((chapter, index) => {
          const isCurrent = index === currentIndex;
          const descText = typeof chapter.description === "string" ? `. ${chapter.description}` : "";
          return (
            <button
              key={chapter.id}
              id={optionId(index)}
              ref={(el) => {
                buttonsRef.current[index] = el;
              }}
              type="button" role="option" aria-selected={isCurrent}
              aria-label={`${chapter.title}${descText}`}
              tabIndex={index === rovingIndex ? 0 : -1}
              onFocus={() => {
                focusedRef.current = index;
                engageAt(index, index);
              }}
              onClick={() => onSelect?.(chapter, index)}
              style={{ height: rowHeight }}
              className={cn(
                "flex w-full items-center rounded-sm outline-none",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60",
                resolvedSide === "left" ? "justify-end" : "justify-start",
              )}
            >
              <Tick
                index={index} pointer={pointer} strength={strength} radius={radius}
                restLength={restLength} peakLength={peakLength} isCurrent={isCurrent}
              />
            </button>
          );
        })}
      </div>

      {active ? (
        <motion.div
          ref={cardRef}
          aria-hidden="true"
          style={{
            top: cardTop, x: cardX, scale: cardScale, opacity: strength,
            ...(resolvedSide === "right" ? { left: peakLength + GAP } : { right: peakLength + GAP }),
          }}
          className={cn(
            "pointer-events-none absolute z-10 w-[min(260px,calc(100cqw-104px))] rounded-2xl border border-white/10 bg-[#151617] px-4 py-3.5 text-zinc-100",
            "shadow-[0_2px_8px_-2px_rgba(0,0,0,0.5),0_18px_44px_-12px_rgba(0,0,0,0.65)]",
            resolvedSide === "right" ? "origin-left" : "origin-right",
          )}
        >
          {active.meta ? (
            <div className="mb-1 text-xs font-medium tabular-nums text-zinc-400">{active.meta}</div>
          ) : null}
          <div className="truncate text-sm font-semibold leading-snug tracking-[-0.01em]">
            {active.title}
          </div>
          {active.description ? (
            <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-zinc-400">
              {active.description}
            </p>
          ) : null}
        </motion.div>
      ) : null}
    </div>
  );
}
