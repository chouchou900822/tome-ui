"use client";

import { useReducedMotion, useSpring, useMotionValueEvent } from "motion/react";
import {
  useCallback,
  useId,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { cn } from "@/lib/utils";

interface ElasticSliderProps {
  /** 无障碍标签 */
  label: string;
  className?: string;
  /** 初始值（0–100） */
  defaultValue?: number;
  /** 松手或键盘操作后的回调 */
  onChange?: (value: number) => void;
}

const W = 260;
const H = 72;
const PAD = 10;
const Y = H - 28;
const RANGE = W - PAD * 2;

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

/**
 * 弹性滑杆：把拖到端点后继续拖，整条轨道被拉弯、端点被拽出，
 * 松手后弹簧拉回原位。支持指针与键盘，触摸设备禁用默认拖拽。
 */
export function ElasticSlider({
  label,
  className,
  defaultValue = 40,
  onChange,
}: ElasticSliderProps) {
  const [value, setValue] = useState(defaultValue / 100);
  const [dragging, setDragging] = useState(false);
  const [, setTick] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const gradId = `elastic-${useId().replace(/[:]/g, "")}`;
  const reduce = useReducedMotion();
  const bend = useSpring(0, { stiffness: 240, damping: 12, mass: 0.7 });

  useMotionValueEvent(bend, "change", () => setTick((t) => t + 1));

  const commit = useCallback(
    (v: number) => {
      setValue(v);
      onChange?.(Math.round(v * 100));
    },
    [onChange],
  );

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) setValue(clamp01(((e.clientX - rect.left) * (W / rect.width) - PAD) / RANGE));
  };

  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!dragging) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const raw = ((e.clientX - rect.left) * (W / rect.width) - PAD) / RANGE;
    if (raw < 0) {
      setValue(0);
      bend.set(reduce ? 0 : Math.max(raw, -0.3));
    } else if (raw > 1) {
      setValue(1);
      bend.set(reduce ? 0 : Math.min(raw - 1, 0.3));
    } else {
      setValue(raw);
      bend.set(0);
    }
  };

  const endDrag = () => {
    if (!dragging) return;
    setDragging(false);
    bend.set(0);
    commit(value);
  };

  const onKeyDown = (e: ReactKeyboardEvent<SVGSVGElement>) => {
    const step = e.key === "ArrowRight" ? 0.05 : e.key === "ArrowLeft" ? -0.05 : 0;
    if (!step) return;
    e.preventDefault();
    commit(clamp01(value + step));
  };

  const b = bend.get();
  const thumbX = PAD + value * RANGE + b * RANGE;
  const bendPx = -Math.abs(b) * 110;
  const midX = (PAD + thumbX) / 2;
  const d = `M ${PAD} ${Y} Q ${midX.toFixed(1)} ${(Y + bendPx).toFixed(1)} ${thumbX.toFixed(1)} ${Y}`;

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${W} ${H}`}
      role="slider"
      aria-label={label}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(value * 100)}
      tabIndex={0}
      onKeyDown={onKeyDown}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      className={cn(
        "w-full max-w-[280px] cursor-pointer touch-none select-none outline-none",
        className,
      )}
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={5} strokeLinecap="round" />
      <path d={d} fill="none" stroke={`url(#${gradId})`} strokeWidth={5} strokeLinecap="round" />
      <text
        x={thumbX}
        y={Y - 16}
        textAnchor="middle"
        className="fill-zinc-400 text-[11px] tabular-nums"
      >
        {Math.round(value * 100)}
      </text>
      <circle cx={thumbX} cy={Y} r={dragging ? 8 : 6.5} fill="#ffffff" />
      <circle cx={thumbX} cy={Y} r={dragging ? 14 : 11} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1} />
    </svg>
  );
}
