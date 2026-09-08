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

const W = 320;
const H = 88;
const PAD = 40;
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
  const [value, setValue] = useState(clamp01(defaultValue / 100));
  const valueRef = useRef(value);
  const pointerRef = useRef<number | null>(null);
  const [dragging, setDragging] = useState(false);
  const [, setTick] = useState(0);
  const svgRef = useRef<SVGSVGElement>(null);
  const gradId = `elastic-${useId().replace(/[:]/g, "")}`;
  const reduce = useReducedMotion();
  const bend = useSpring(0, { stiffness: 240, damping: 12, mass: 0.7 });

  useMotionValueEvent(bend, "change", () => setTick((t) => t + 1));

  const commit = useCallback(
    (v: number) => {
      valueRef.current = v;
      setValue(v);
      onChange?.(Math.round(v * 100));
    },
    [onChange],
  );

  const onPointerDown = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (!e.isPrimary || e.button !== 0) return;
    pointerRef.current = e.pointerId;
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.focus();
    setDragging(true);
    const rect = svgRef.current?.getBoundingClientRect();
    if (rect) {
      valueRef.current = clamp01(((e.clientX - rect.left) * (W / rect.width) - PAD) / RANGE);
      setValue(valueRef.current);
    }
  };

  const onPointerMove = (e: ReactPointerEvent<SVGSVGElement>) => {
    if (pointerRef.current !== e.pointerId) return;
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    const raw = ((e.clientX - rect.left) * (W / rect.width) - PAD) / RANGE;
    valueRef.current = clamp01(raw);
    setValue(valueRef.current);
    bend.set(reduce ? 0 : raw < 0 ? Math.max(raw, -0.3) : raw > 1 ? Math.min(raw - 1, 0.3) : 0);
  };

  const endDrag = () => {
    if (pointerRef.current === null) return;
    pointerRef.current = null;
    setDragging(false);
    bend.set(0);
    commit(valueRef.current);
  };

  const onKeyDown = (e: ReactKeyboardEvent<SVGSVGElement>) => {
    let next = valueRef.current;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next += 0.05;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next -= 0.05;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = 1;
    else return;
    e.preventDefault();
    commit(clamp01(next));
  };

  const b = reduce ? 0 : bend.get();
  const startX = PAD + Math.min(0, b) * RANGE;
  const endX = W - PAD + Math.max(0, b) * RANGE;
  const thumbX = startX + value * (endX - startX);
  const bendPx = -Math.abs(b) * 110;
  const thumbY = Y + 2 * (1 - value) * value * bendPx;
  const d = `M ${startX} ${Y} Q ${(startX + endX) / 2} ${Y + bendPx} ${endX} ${Y}`;

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
      onLostPointerCapture={endDrag}
      className={cn(
        "w-full max-w-[320px] overflow-visible rounded-lg cursor-pointer touch-none select-none outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-200/60",
        className,
      )}
    >
      <defs>
        <linearGradient id={gradId} gradientUnits="userSpaceOnUse" x1={PAD} y1="0" x2={W - PAD} y2="0">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#a5b4fc" />
        </linearGradient>
      </defs>
      <path d={d} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={5} strokeLinecap="round" />
      <path d={d} pathLength={1} strokeDasharray={`${value} 1`} fill="none" stroke={`url(#${gradId})`} strokeWidth={5} strokeLinecap="round" />
      <text
        x={thumbX}
        y={thumbY - 20}
        textAnchor="middle"
        className="fill-zinc-400 text-[14px] tabular-nums"
      >
        {Math.round(value * 100)}
      </text>
      <circle cx={thumbX} cy={thumbY} r={dragging && !reduce ? 8 : 6.5} fill="#ffffff" />
      <circle cx={thumbX} cy={thumbY} r={dragging && !reduce ? 14 : 11} fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth={1} />
    </svg>
  );
}
