"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent } from "react";
import { cn } from "@/lib/utils";

export interface RotaryDialProps {
  label: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  disabled?: boolean;
  name?: string;
  className?: string;
}

interface DragOrigin { pointerId: number; y: number; value: number }

export function RotaryDial({
  label, min = 0, max = 100, step = 1, unit = "", value,
  defaultValue = min, onValueChange, disabled = false, name, className,
}: RotaryDialProps) {
  const lower = Number.isFinite(min) ? min : 0;
  const upper = Number.isFinite(max) && max > lower ? max : lower + 100;
  const increment = Number.isFinite(step) && step > 0 ? step : 1;
  const normalize = (next: number) => {
    if (!Number.isFinite(next) || next <= lower) return lower;
    if (next >= upper) return upper;
    return Math.min(upper, Math.max(lower, Number((lower + Math.round((next - lower) / increment) * increment).toFixed(6))));
  };
  const [internal, setInternal] = useState(defaultValue);
  const [dragging, setDragging] = useState(false);
  const origin = useRef<DragOrigin | null>(null);
  const current = normalize(value ?? internal);
  const ratio = (current - lower) / (upper - lower);

  const update = (next: number) => {
    const normalized = normalize(next);
    setInternal(normalized);
    if (normalized !== current) onValueChange?.(normalized);
  };

  const endDrag = (event: PointerEvent<HTMLDivElement>) => {
    if (origin.current?.pointerId !== event.pointerId) return;
    origin.current = null;
    setDragging(false);
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    let next = current;
    if (event.key === "ArrowUp" || event.key === "ArrowRight") next += increment;
    else if (event.key === "ArrowDown" || event.key === "ArrowLeft") next -= increment;
    else if (event.key === "Home") next = lower;
    else if (event.key === "End") next = upper;
    else return;
    event.preventDefault();
    update(next);
  };

  return (
    <div className={cn("flex flex-col items-center", disabled && "opacity-45", className)}>
      <span className="text-[10px] tracking-[0.12em] text-zinc-400 @md:text-xs">{label}</span>
      <div
        role="slider" tabIndex={disabled ? -1 : 0} aria-label={label}
        aria-valuemin={lower} aria-valuemax={upper} aria-valuenow={current}
        aria-valuetext={`${current}${unit}`} aria-orientation="vertical" aria-disabled={disabled}
        onKeyDown={onKeyDown}
        onPointerDown={(event) => {
          if (disabled || !event.isPrimary || event.button !== 0) return;
          event.preventDefault();
          event.currentTarget.focus();
          event.currentTarget.setPointerCapture(event.pointerId);
          origin.current = { pointerId: event.pointerId, y: event.clientY, value: current };
          setDragging(true);
        }}
        onPointerMove={(event) => {
          const start = origin.current;
          if (!start || start.pointerId !== event.pointerId || disabled) return;
          update(start.value + (start.y - event.clientY) / 160 * (upper - lower));
        }}
        onPointerUp={endDrag} onPointerCancel={endDrag} onLostPointerCapture={endDrag}
        onBlur={() => { origin.current = null; setDragging(false); }}
        className={cn("relative my-2 size-32 touch-none select-none rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[#c4d4bd]/70 focus-visible:ring-offset-4 focus-visible:ring-offset-[#111315] @md:my-3 @md:size-44", disabled ? "cursor-not-allowed" : "cursor-ns-resize")}
      >
        <div aria-hidden className="absolute inset-0">
          {Array.from({ length: 41 }, (_, index) => {
            const angle = -135 + index / 40 * 270;
            const radians = angle * Math.PI / 180;
            return <span key={index}
              className={cn("absolute w-px -translate-x-1/2 -translate-y-1/2 rounded-full", index % 5 === 0 ? "h-2.5" : "h-1.5", index / 40 <= ratio ? "bg-[#d0dfbf] shadow-[0_0_5px_#c4d4bd45]" : "bg-white/15")}
              style={{ left: `${Number((50 + Math.sin(radians) * 46).toFixed(4))}%`, top: `${Number((50 - Math.cos(radians) * 46).toFixed(4))}%`, rotate: `${angle}deg` }} />;
          })}
          <span className="absolute inset-[14%] rounded-full border border-white/15 bg-[conic-gradient(from_30deg,#555955,#202322_20%,#454944_45%,#1c201e_65%,#62665e_85%,#555955)] p-1 shadow-[0_10px_18px_#0008,inset_0_1px_0_#ffffff30]">
            <span className="absolute inset-1 rounded-full border border-black/80 bg-[radial-gradient(circle_at_35%_20%,#414640,#1a1e1b_75%)] shadow-[inset_0_1px_2px_#ffffff25]" />
            <span className={cn("absolute inset-2 rounded-full", !dragging && "motion-safe:transition-[rotate] motion-safe:duration-150")}
              style={{ rotate: `${Number((-135 + ratio * 270).toFixed(4))}deg` }}>
              <span className="absolute left-1/2 top-2 h-3 w-0.5 -translate-x-1/2 rounded-full bg-[#e0efcb] shadow-[0_0_8px_#d5f4a980]" />
            </span>
          </span>
        </div>
      </div>
      <output aria-hidden className="-mt-1 font-mono text-2xl font-light tabular-nums tracking-tight text-[#e0e7d7] @md:text-3xl">
        {current}<span className="ml-1 text-xs text-zinc-500">{unit}</span>
      </output>
      {name && <input type="hidden" name={name} value={current} disabled={disabled} />}
    </div>
  );
}
