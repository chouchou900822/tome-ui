"use client";

import { useEffect, useRef } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TierSliderProps {
  /** 标题与无障碍标签 */
  label: string;
  /** 档位名称，从低到高，至少两档 */
  levels: string[];
  /** 初始档位索引 */
  defaultIndex?: number;
  /** 档位变化回调（松手吸附或键盘操作后触发） */
  onChange?: (index: number) => void;
  /** 标题左侧图标，缺省为闪电 */
  icon?: ReactNode;
  className?: string;
}

interface Hsl {
  h: number;
  s: number;
  l: number;
}

/** 左朴素右绚烂的五段色标：石墨灰蓝 → 靛蓝 → 电光紫 → 品红 → 熔金橙 */
const STOPS: readonly Hsl[] = [
  { h: 225, s: 8, l: 62 },
  { h: 235, s: 62, l: 62 },
  { h: 275, s: 72, l: 60 },
  { h: 320, s: 88, l: 58 },
  { h: 25, s: 95, l: 55 },
];

const hsl = (c: Hsl, alpha = 1): string =>
  `hsl(${c.h.toFixed(1)} ${c.s.toFixed(1)}% ${c.l.toFixed(1)}%${alpha < 1 ? ` / ${alpha}` : ""})`;

const wordColor = (c: Hsl): string =>
  hsl({ h: c.h, s: Math.min(c.s + 10, 95), l: Math.min(c.l + 8, 72) });

/** HSL 多段插值；品红 → 橙金跨 0° 相位时给终点补一圈 360° */
function palette(t: number): Hsl {
  const x = Math.min(Math.max(t, 0), 1);
  const seg = Math.min(Math.floor(x * (STOPS.length - 1)), STOPS.length - 2);
  const k = x * (STOPS.length - 1) - seg;
  const a = STOPS[seg];
  const b = STOPS[seg + 1];
  const mix = (p: number, q: number) => p + (q - p) * k;
  return { h: mix(a.h, b.h < a.h ? b.h + 360 : b.h), s: mix(a.s, b.s), l: mix(a.l, b.l) };
}

/** 填充画法：渐变从更朴素的起点流向当前位置，高位叠加同色光晕 */
function fillPaint(t: number, widthPx: number): CSSProperties {
  const c = palette(t);
  const from = palette(Math.max(t - 0.35, 0));
  return {
    background: `linear-gradient(90deg, ${hsl(from)} 0%, ${hsl(c)} 100%)`,
    boxShadow: t > 0.6 ? `0 0 ${Math.round((18 * (t - 0.6)) / 0.4)}px ${hsl(c, 0.35)}` : "none",
    backgroundSize: `${Math.max(widthPx, 1)}px 100%`,
  };
}

/** 固定种子伪随机生成星光参数，保证服务端与客户端渲染一致 */
const SPARKS = (() => {
  let seed = 2026;
  const rand = () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
  return Array.from({ length: 16 }, (_, i) => ({
    left: (i / 15) * 88 + 4,
    top: 12 + rand() * 76,
    size: 2 + rand() * 3.5,
    dur: 1.4 + rand() * 1.8,
    delay: -rand() * 3,
  }));
})();

const KEYFRAMES = `
@keyframes tier-slider-twinkle {
  0%, 100% { transform: scale(0.4); opacity: calc(var(--ts-master, 0) * 0.25); }
  50% { transform: scale(1); opacity: var(--ts-master, 0); }
}
@keyframes tier-slider-fill-breathe {
  0%, 100% { box-shadow: 0 0 8px hsl(var(--ts-gh, 300) 80% 55% / 0.22), 0 0 0 0 hsl(var(--ts-gh, 300) 80% 55% / 0); }
  50% { box-shadow: 0 0 30px hsl(var(--ts-gh, 300) 95% 60% / 0.55), 0 0 0 9px hsl(var(--ts-gh, 300) 95% 60% / 0.1); }
}
@keyframes tier-slider-thumb-breathe {
  0%, 100% { box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25), 0 6px 18px rgba(0, 0, 0, 0.4); }
  50% { box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3), 0 10px 30px hsl(var(--ts-gh, 300) 90% 55% / 0.38); }
}
@keyframes tier-slider-word-breathe {
  0%, 100% { text-shadow: 0 0 0 hsl(var(--ts-gh, 300) 90% 58% / 0); }
  50% { text-shadow: 0 0 14px hsl(var(--ts-gh, 300) 90% 58% / 0.45); }
}
.tier-slider-ring { transition: opacity 0.2s; }
.tier-slider:focus-visible { outline: none; }
.tier-slider:focus-visible .tier-slider-ring { opacity: 1; }
@media (prefers-reduced-motion: no-preference) {
  .tier-slider-spark { animation: tier-slider-twinkle var(--ts-dur, 2s) ease-in-out infinite; animation-delay: var(--ts-delay, 0s); }
  .tier-slider-thumb { transition: scale 0.18s cubic-bezier(0.22, 1, 0.36, 1); }
  .tier-slider[data-drag="true"] .tier-slider-thumb { scale: 1.08; }
  .tier-slider[data-ultra="true"] .tier-slider-fill { animation: tier-slider-fill-breathe 2.8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  .tier-slider[data-ultra="true"] .tier-slider-spark { animation-duration: 0.95s; }
  .tier-slider[data-ultra="true"] .tier-slider-thumb { animation: tier-slider-thumb-breathe 2.8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
  .tier-slider[data-ultra="true"] .tier-slider-word { animation: tier-slider-word-breathe 2.8s cubic-bezier(0.4, 0, 0.6, 1) infinite; }
}
`;

/**
 * 档位滑杆：渐变填充随拖动流动，松手吸附到最近档位；最高档进入满档呼吸发光。
 * 位置更新走 rAF 直接写样式，避免每帧 setState。
 */
export function TierSlider({ label, levels, defaultIndex = 0, onChange, icon, className }: TierSliderProps) {
  const tiers = Math.max(levels.length, 2);
  const snap = 100 / (tiers - 1);
  const startIndex = Math.min(Math.max(defaultIndex, 0), tiers - 1);
  const startT = startIndex / (tiers - 1);
  const startColor = palette(startT);

  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);
  const wordRef = useRef<HTMLSpanElement>(null);
  const valueRef = useRef(startIndex * snap);
  const displayRef = useRef(startIndex * snap);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    const loop = () => {
      raf = requestAnimationFrame(loop);
      const root = rootRef.current;
      const fill = fillRef.current;
      const thumb = thumbRef.current;
      const word = wordRef.current;
      if (!root || !fill || !thumb || !word) return;
      const target = valueRef.current;
      let display = displayRef.current;
      display += (target - display) * (reduced.matches ? 1 : 0.18);
      if (Math.abs(target - display) < 0.05) display = target;
      displayRef.current = display;
      const t = display / 100;
      const x = t * root.clientWidth;
      fill.style.width = `${x}px`;
      // background 简写会重置 background-size，故在同一对象里随后写入
      Object.assign(fill.style, fillPaint(t, x));
      thumb.style.left = `${x}px`;
      const idx = Math.min(Math.round(t * (tiers - 1)), tiers - 1);
      const c = palette(t);
      word.textContent = levels[idx] ?? "";
      word.style.color = wordColor(c);
      root.dataset.ultra = String(idx === tiers - 1 && display > 99.2);
      root.style.setProperty("--ts-gh", c.h.toFixed(1));
      root.style.setProperty("--ts-master", Math.max(0, (t - 0.4) / 0.6).toFixed(2));
      root.setAttribute("aria-valuenow", String(idx));
      root.setAttribute("aria-valuetext", levels[idx] ?? "");
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [levels, tiers]);

  const posToValue = (clientX: number): number => {
    const rect = rootRef.current?.getBoundingClientRect();
    if (!rect || rect.width === 0) return valueRef.current;
    return Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1) * 100;
  };

  const commit = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), tiers - 1);
    valueRef.current = clamped * snap;
    onChange?.(clamped);
  };

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    // 阻止长按触发浏览器默认的文本选择 / 拖拽，避免 pointercancel 中断拖动
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    e.currentTarget.focus();
    rootRef.current?.setAttribute("data-drag", "true");
    valueRef.current = posToValue(e.clientX);
  };

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    if (rootRef.current?.dataset.drag === "true") valueRef.current = posToValue(e.clientX);
  };

  const endDrag = () => {
    const root = rootRef.current;
    if (!root || root.dataset.drag !== "true") return;
    root.setAttribute("data-drag", "false");
    commit(Math.round(valueRef.current / snap));
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const current = Math.round(valueRef.current / snap);
    let next: number | null = null;
    if (e.key === "ArrowRight" || e.key === "ArrowUp") next = current + 1;
    else if (e.key === "ArrowLeft" || e.key === "ArrowDown") next = current - 1;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = tiers - 1;
    if (next === null) return;
    e.preventDefault();
    if (next !== current) commit(next);
  };

  return (
    <div
      className={cn(
        "w-full max-w-[430px] rounded-[28px] border border-white/10 bg-zinc-900/90 p-5 pb-7 shadow-[0_12px_40px_rgba(0,0,0,0.4)] @md:p-6 @md:pb-7",
        className,
      )}
    >
      <style href="tier-slider-keyframes" precedence="medium">{KEYFRAMES}</style>
      <div className="mb-6 flex items-center gap-2 @md:gap-3.5">
        <span aria-hidden className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/[0.06] text-zinc-400">
          {icon ?? (
            <svg
              viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8}
              strokeLinecap="round" strokeLinejoin="round" className="size-5"
            >
              <path d="M13 2 4.5 13.5H11L9.5 22 18.5 10.5H12L13 2z" />
            </svg>
          )}
        </span>
        <div className="flex flex-1 items-baseline justify-center gap-2 whitespace-nowrap">
          <span className="text-lg font-semibold tracking-tight tabular-nums text-white @md:text-2xl">{label}</span>
          <span
            ref={wordRef}
            className="tier-slider-word text-lg font-semibold tracking-tight @md:text-2xl"
            style={{ color: wordColor(startColor) }}
          >
            {levels[startIndex]}
          </span>
        </div>
        {/* 占位平衡左侧图标，保持标题视觉居中 */}
        <span aria-hidden className="hidden size-10 shrink-0 @md:block" />
      </div>
      <div className="relative h-[52px]">
        <div
          ref={rootRef}
          role="slider"
          tabIndex={0}
          aria-label={label}
          aria-valuemin={0}
          aria-valuemax={tiers - 1}
          aria-valuenow={startIndex}
          aria-valuetext={levels[startIndex]}
          className="tier-slider absolute inset-0 cursor-pointer touch-none select-none outline-none"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onKeyDown={handleKeyDown}
        >
          <div className="absolute inset-x-0 top-1/2 h-11 -translate-y-1/2 rounded-full bg-white/[0.07]">
            <div ref={fillRef} className="tier-slider-fill absolute inset-y-0 left-0 rounded-full" style={{ width: `${startT * 100}%`, ...fillPaint(startT, startT * 430) }}>
              <div aria-hidden className="absolute inset-0 overflow-hidden rounded-full">
                {SPARKS.map((s, i) => (
                  <i
                    key={i}
                    className="tier-slider-spark absolute rounded-full bg-white opacity-0"
                    style={
                      {
                        left: `${s.left}%`,
                        top: `${s.top}%`,
                        width: s.size,
                        height: s.size,
                        "--ts-dur": `${s.dur.toFixed(2)}s`,
                        "--ts-delay": `${s.delay.toFixed(2)}s`,
                      } as CSSProperties
                    }
                  />
                ))}
              </div>
            </div>
            <div aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-[34px]">
              {levels.slice(0, tiers).map((_, i) => (
                <i key={i} className="size-[7px] rounded-full bg-white/55" />
              ))}
            </div>
          </div>
          <div
            aria-hidden
            ref={thumbRef}
            className="tier-slider-thumb pointer-events-none absolute top-1/2 size-[52px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25),0_6px_18px_rgba(0,0,0,0.4)]"
            style={{ left: `${startT * 100}%` }}
          >
            <span
              className="tier-slider-ring absolute -inset-1.5 rounded-full border-2 opacity-0"
              style={{ borderColor: hsl({ h: startColor.h, s: Math.min(startColor.s + 15, 95), l: 62 }) }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
