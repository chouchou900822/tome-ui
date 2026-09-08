"use client";

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface DockItem {
  label: string;
  icon: ReactNode;
  onClick?: () => void;
}

interface DockProps {
  items: DockItem[];
  className?: string;
  /** 图标基础尺寸（像素） */
  size?: number;
  /** 指针正下方图标的放大倍数 */
  magnification?: number;
  /** 放大影响的横向范围（像素） */
  distance?: number;
}

/**
 * 程序坞：仿 macOS Dock，图标随指针距离平滑放大，相邻图标被推开，附悬停标签。
 * 每个图标用自己的弹簧，放大与回弹都带有惯性。
 */
export function Dock({
  items,
  className,
  size = 44,
  magnification = 1.7,
  distance = 140,
}: DockProps) {
  const mouseX = useMotionValue(Number.POSITIVE_INFINITY);
  const rootRef = useRef<HTMLDivElement>(null);
  const [available, setAvailable] = useState(320);
  const reduce = useReducedMotion();
  const growth = Math.min(items.length, Math.ceil(distance / (size + 8))) * Math.max(0, magnification - 1);
  const fittedSize = Math.max(16, Math.min(size, (available - 26 - Math.max(0, items.length - 1) * 8) / Math.max(1, items.length + growth)));

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const observer = new ResizeObserver(() => setAvailable(root.clientWidth));
    setAvailable(root.clientWidth);
    observer.observe(root);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={rootRef} className="flex w-full min-w-0 max-w-lg justify-center py-10">
    <nav
      aria-label="应用程序坞"
      onMouseMove={(e) => { if (!reduce) mouseX.set(e.clientX); }}
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) mouseX.set(Number.POSITIVE_INFINITY); }}
      className={cn(
        "inline-flex h-fit items-end gap-2 rounded-[20px] border border-white/15 bg-linear-to-b from-white/10 to-white/[0.035] px-3 py-2.5 backdrop-blur-xl",
        "shadow-[inset_0_1px_0_rgba(255,255,255,0.1),0_16px_40px_-16px_rgba(0,0,0,0.8)]",
        className,
      )}
    >
      {items.map((item) => (
        <DockIcon
          key={item.label}
          item={item}
          mouseX={mouseX}
          size={fittedSize}
          magnification={magnification}
          distance={distance * fittedSize / size}
        />
      ))}
    </nav>
    </div>
  );
}

interface DockIconProps {
  item: DockItem;
  mouseX: MotionValue<number>;
  size: number;
  magnification: number;
  distance: number;
}

function DockIcon({ item, mouseX, size, magnification, distance }: DockIconProps) {
  const ref = useRef<HTMLButtonElement>(null);
  const reduce = useReducedMotion();

  const offset = useTransform(mouseX, (x) => {
    const rect = ref.current?.getBoundingClientRect();
    return rect ? x - (rect.left + rect.width / 2) : Number.POSITIVE_INFINITY;
  });
  const target = useTransform(offset, [-distance, 0, distance], [size, size * magnification, size]);
  const width = useSpring(target, { mass: 0.1, stiffness: 170, damping: 14 });

  return (
    <motion.button
      ref={ref}
      type="button"
      aria-label={item.label}
      onClick={item.onClick}
      onFocus={() => { if (!reduce && ref.current) { const bounds = ref.current.getBoundingClientRect(); mouseX.set(bounds.left + bounds.width / 2); } }}
      style={{ width: reduce ? size : width, height: reduce ? size : width }}
      className="group/dock relative flex shrink-0 items-center justify-center rounded-[28%] border border-white/10 bg-linear-to-b from-[#303237] to-[#1b1c20] text-zinc-200 shadow-[inset_0_1px_0_rgba(255,255,255,0.08),0_4px_8px_rgba(0,0,0,0.25)] outline-none transition-colors hover:border-white/25 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white/70"
    >
      <span aria-hidden className="flex size-1/2 items-center justify-center [&>svg]:size-full">
        {item.icon}
      </span>
      <span
        aria-hidden
        className="pointer-events-none absolute -top-10 whitespace-nowrap rounded-md border border-white/15 bg-[#1b1c20] px-2.5 py-1 text-[11px] text-zinc-200 opacity-0 shadow-lg transition-opacity group-hover/dock:opacity-100 group-focus-visible/dock:opacity-100 motion-reduce:transition-none"
      >
        {item.label}
      </span>
    </motion.button>
  );
}
