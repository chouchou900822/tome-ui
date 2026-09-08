"use client";

import { useRef, useState, type KeyboardEvent, type PointerEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ComparisonSliderProps {
  before: ReactNode;
  after: ReactNode;
  beforeLabel?: string;
  afterLabel?: string;
  label?: string;
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  className?: string;
}

export function ComparisonSlider({
  before, after, beforeLabel = "之前", afterLabel = "之后", label = "前后对比",
  value, defaultValue = 50, onValueChange, className,
}: ComparisonSliderProps) {
  const [internal, setInternal] = useState(defaultValue);
  const pointer = useRef<number | null>(null);
  const normalize = (next: number) => Math.max(0, Math.min(100, Number.isFinite(next) ? next : 50));
  const position = normalize(value ?? internal);

  const update = (next: number) => {
    const normalized = Math.round(normalize(next));
    setInternal(normalized);
    onValueChange?.(normalized);
  };

  const move = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    if (bounds.width > 0) update((event.clientX - bounds.left) / bounds.width * 100);
  };

  const release = (event: PointerEvent<HTMLDivElement>) => {
    if (pointer.current !== event.pointerId) return;
    pointer.current = null;
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId);
  };

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    let next = position;
    if (event.key === "ArrowRight" || event.key === "ArrowUp") next += event.shiftKey ? 10 : 1;
    else if (event.key === "ArrowLeft" || event.key === "ArrowDown") next -= event.shiftKey ? 10 : 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = 100;
    else return;
    event.preventDefault();
    update(next);
  };

  return (
    <div className={cn("relative isolate aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/15 bg-[#16191c]", className)}>
      <div className="absolute inset-0" inert>{after}</div>
      <div className="absolute inset-0" inert style={{ clipPath: `inset(0 ${100 - position}% 0 0)` }}>{before}</div>
      <div aria-hidden className="pointer-events-none absolute inset-x-4 top-4 flex justify-between gap-3">
        <span className={cn("rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[9px] text-white/90 backdrop-blur-md", position < 15 && "invisible")}>{beforeLabel}</span>
        <span className={cn("rounded-full border border-white/15 bg-black/35 px-2.5 py-1 text-[9px] text-white/90 backdrop-blur-md", position > 85 && "invisible")}>{afterLabel}</span>
      </div>
      <div
        role="slider" tabIndex={0} aria-label={label} aria-valuemin={0} aria-valuemax={100}
        aria-valuenow={position} aria-valuetext={`${beforeLabel} ${position}%，${afterLabel} ${100 - position}%`}
        onKeyDown={onKeyDown}
        onPointerDown={(event) => {
          if (!event.isPrimary || event.button !== 0) return;
          event.currentTarget.focus();
          event.currentTarget.setPointerCapture(event.pointerId);
          pointer.current = event.pointerId;
          move(event);
        }}
        onPointerMove={(event) => { if (pointer.current === event.pointerId) move(event); }}
        onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}
        onBlur={() => { pointer.current = null; }}
        className="group/compare absolute inset-0 cursor-ew-resize touch-pan-y select-none outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-white/90"
      >
        <div aria-hidden className="absolute inset-y-0 w-px bg-white/85 shadow-[0_0_12px_#0004]" style={{ left: `${position}%` }}>
          <div className="absolute top-1/2 grid h-11 w-8 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-white/60 bg-[#ebedeb]/90 shadow-[0_3px_14px_#0005] backdrop-blur-md group-focus-visible/compare:ring-4 group-focus-visible/compare:ring-white/20">
            <span className="flex gap-1"><span className="h-3 w-px bg-zinc-500" /><span className="h-3 w-px bg-zinc-500" /></span>
          </div>
        </div>
      </div>
    </div>
  );
}
