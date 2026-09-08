"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";

export interface MetricPoint {
  label: string;
  value: number;
  formattedValue?: string;
}

interface ChartPoint extends MetricPoint { x: number; y: number }
type MetricTone = "positive" | "negative" | "neutral";

export interface MetricCardProps {
  label: string;
  value: string;
  change?: string;
  tone?: MetricTone;
  data: readonly MetricPoint[];
  footnote?: string;
  className?: string;
}

const COLORS: Record<MetricTone, string> = {
  positive: "#bdd5ac", negative: "#e8b4a4", neutral: "#adbed4",
};

export function MetricCard({ label, value, change, tone = "positive", data, footnote, className }: MetricCardProps) {
  const id = useId();
  const [active, setActive] = useState<number | null>(null);
  const valid = data.filter((point) => Number.isFinite(point.value));
  const minimum = Math.min(...valid.map((point) => point.value));
  const maximum = Math.max(...valid.map((point) => point.value));
  const span = maximum - minimum || 1;
  const points: ChartPoint[] = valid.map((point, index) => ({
    ...point,
    x: valid.length === 1 ? 160 : 8 + index / (valid.length - 1) * 304,
    y: maximum === minimum ? 48 : 80 - (point.value - minimum) / span * 64,
  }));
  const selected = active === null ? undefined : points[active];
  const stroke = COLORS[tone];
  const line = points.map((point, index) => {
    if (index === 0) return `M ${point.x} ${point.y}`;
    const previous = points[index - 1];
    const middle = (previous.x + point.x) / 2;
    return `C ${middle} ${previous.y}, ${middle} ${point.y}, ${point.x} ${point.y}`;
  }).join(" ");

  return (
    <figure className={cn("w-full overflow-hidden rounded-2xl border border-white/10 bg-[#141719] p-3 shadow-[inset_0_1px_0_#ffffff08,0_20px_50px_-35px_#000] @xs:p-4 @md:p-6", className)}>
      <figcaption className="flex items-center justify-between gap-3 text-[10px] text-zinc-400 @md:text-xs">
        <span>{label}</span>
        {change && <span className="rounded-full border px-2 py-1 font-mono text-[9px]" style={{ color: stroke, borderColor: `color-mix(in srgb, ${stroke} 22%, transparent)`, backgroundColor: `color-mix(in srgb, ${stroke} 6%, transparent)` }}>{change}</span>}
      </figcaption>
      <p className="mt-2 font-mono text-[28px] leading-none font-light tabular-nums tracking-[-0.06em] text-[#e9ede3] @xs:mt-3 @md:mt-4 @md:text-4xl">
        {selected?.formattedValue ?? (selected ? selected.value.toLocaleString("en-US") : value)}
      </p>
      <p className="mt-1 min-h-3 text-[9px] text-zinc-500 @md:mt-1.5 @md:text-[10px]">{selected?.label ?? footnote}</p>
      <div className="relative mt-2 h-10 rounded focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-[#c4d4bd]/60 @xs:mt-3 @xs:h-14 @md:mt-4 @md:h-28">
        <svg aria-hidden viewBox="0 0 320 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
          <defs><linearGradient id={`${id}-area`} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={stroke} stopOpacity="0.18" /><stop offset="100%" stopColor={stroke} stopOpacity="0" /></linearGradient></defs>
          {[20, 50, 80].map((y) => <line key={y} x1="0" x2="320" y1={y} y2={y} stroke="white" strokeOpacity="0.06" strokeDasharray="2 5" />)}
          {points.length > 1 && <>
            <path d={`${line} L ${points[points.length - 1].x} 100 L ${points[0].x} 100 Z`} fill={`url(#${id}-area)`} />
            <path d={line} fill="none" stroke={stroke} strokeWidth="2" vectorEffect="non-scaling-stroke" strokeLinecap="round" />
          </>}
          {points.length === 1 && <circle cx={points[0].x} cy={points[0].y} r="3" fill={stroke} />}
          {selected && <>
            <line x1={selected.x} x2={selected.x} y1="0" y2="100" stroke={stroke} strokeOpacity="0.35" strokeDasharray="3 4" />
            <circle cx={selected.x} cy={selected.y} r="7" fill={stroke} fillOpacity="0.15" />
            <circle cx={selected.x} cy={selected.y} r="3" fill={stroke} stroke="#141719" strokeWidth="1.5" />
          </>}
        </svg>
        {points.length > 1 && <input type="range" min={0} max={points.length - 1} step={1}
          value={active ?? points.length - 1} aria-label={`${label}，浏览历史数据`}
          aria-valuetext={`${(selected ?? points[points.length - 1]).label}：${(selected ?? points[points.length - 1]).formattedValue ?? (selected ?? points[points.length - 1]).value}`}
          className="absolute inset-0 h-full w-full cursor-crosshair opacity-0"
          onChange={(event) => setActive(Number(event.target.value))}
          onFocus={() => setActive((previous) => previous ?? points.length - 1)} onBlur={() => setActive(null)}
          onPointerMove={(event) => {
            const bounds = event.currentTarget.getBoundingClientRect();
            setActive(Math.max(0, Math.min(points.length - 1, Math.round((event.clientX - bounds.left) / bounds.width * (points.length - 1)))));
          }}
          onPointerLeave={(event) => { if (document.activeElement !== event.currentTarget) setActive(null); }}
        />}
      </div>
      <div className="mt-1 flex justify-between font-mono text-[8px] text-zinc-500 @xs:mt-2 @md:text-[9px]">
        <span>{points[0]?.label ?? "暂无数据"}</span><span>{points.length > 1 ? points[points.length - 1].label : ""}</span>
      </div>
    </figure>
  );
}
