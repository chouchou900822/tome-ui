"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type MotionValue,
} from "motion/react";
import { useRef, type ReactNode } from "react";
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

  return (
    <nav
      aria-label="dock"
      onMouseMove={(e) => mouseX.set(e.clientX)}
      onMouseLeave={() => mouseX.set(Number.POSITIVE_INFINITY)}
      className={cn(
        "inline-flex h-fit items-end gap-3 rounded-2xl border border-white/10 bg-white/5 px-3 py-2.5 backdrop-blur-xl",
        className,
      )}
    >
      {items.map((item) => (
        <DockIcon
          key={item.label}
          item={item}
          mouseX={mouseX}
          size={size}
          magnification={magnification}
          distance={distance}
        />
      ))}
    </nav>
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
      style={{ width, height: width }}
      className="group relative flex items-center justify-center rounded-xl border border-white/10 bg-zinc-900 text-zinc-200 shadow-lg transition-colors hover:bg-zinc-800"
    >
      <span className="flex size-1/2 items-center justify-center [&>svg]:size-full">
        {item.icon}
      </span>
      <span
        role="tooltip"
        className="pointer-events-none absolute -top-9 whitespace-nowrap rounded-md border border-white/10 bg-zinc-950 px-2 py-1 text-xs text-zinc-200 opacity-0 transition-opacity group-hover:opacity-100"
      >
        {item.label}
      </span>
    </motion.button>
  );
}
