"use client";

import { memo, useCallback, useEffect, useId, useRef, useState, type FocusEvent as ReactFocusEvent, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform, type MotionValue } from "motion/react";
import { cn } from "@/lib/utils";

export interface Chapter {
  /** 稳定唯一标识；预览卡顶部的加粗标题 */
  id: string;
  title: string;
  /** 说明文字（最多三行）与标题上方的小号弱化标签（如时间戳） */
  description?: ReactNode; meta?: ReactNode;
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
  /** 渲染音乐联动开关：授权共享系统音频后刻度按频段随音乐跳动。默认关闭 */
  audioReactive?: boolean;
  className?: string;
}

const CARD_WIDTH = 260, GAP = 20, FFT_SIZE = 64;
// 指针弹簧：近临界阻尼，几乎零延迟跟随光标且从不过冲，波形像粘在指针上；强度弹簧更软，波形起落带呼吸感
const POINTER_SPRING = { stiffness: 700, damping: 52, mass: 0.5 };
const STRENGTH_SPRING = { stiffness: 260, damping: 30, mass: 0.6 };

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

// 升余弦凸包：波峰处为 1、半径外为 0、两端斜率为零，衰减曲线无接缝
function bump(distance: number, radius: number) {
  return distance >= radius ? 0 : 0.5 * (1 + Math.cos(Math.PI * (distance / radius)));
}

interface TickProps {
  index: number; radius: number; restLength: number; peakLength: number; isCurrent: boolean;
  pointer: MotionValue<number>; strength: MotionValue<number>; audioFrame: MotionValue<number[]>;
}

/** 单根刻度：从共享的指针/强度/音频值读出自己的抬升量，避免每行独立状态 */
const Tick = memo(function Tick({ index, pointer, strength, audioFrame, radius, restLength, peakLength, isCurrent }: TickProps) {
  // 指针波与音频电平相加后钳制到 1，两套驱动互不压制；长度承担主视觉，厚度只在波峰轻微增厚（2px → 约 2.8px）
  const total = () => Math.min(1, strength.get() * bump(Math.abs(index - pointer.get()), radius) + (audioFrame.get()[index] ?? 0));
  const width = useTransform(() => restLength + total() * (peakLength - restLength));
  const base = isCurrent ? 0.55 : 0.22;
  const opacity = useTransform(() => base + total() * (1 - base));
  const scaleY = useTransform(() => 1 + total() * 0.4);

  return (
    <motion.span aria-hidden="true" style={{ width, opacity, scaleY }}
      className={cn("block h-[2px] rounded-full", isCurrent ? "bg-lime-300" : "bg-zinc-100")} />
  );
});

/**
 * 章节擦洗器：垂直刻度轨道，悬停或键盘聚焦时指针周围的刻度按升余弦波形抬升变亮，预览卡跟随光标逐章扫过。
 * 适合视频、播客与长文的章节导航；开启 audioReactive 后刻度还能按系统音频的频段随音乐跳动（像均衡器）。
 */
export function ChapterScrubber({ chapters, side = "right", peakLength = 56, restLength = 14, rowHeight = 10, radius = 4, currentIndex, onActiveChange, onSelect, label = "章节", audioReactive = false, className }: ChapterScrubberProps) {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const buttonsRef = useRef<Array<HTMLButtonElement | null>>([]);
  // 加命名空间，选项 id 在多实例间不冲突，也不依赖 chapter.id 是合法 DOM id
  const baseId = useId();
  const optionId = (i: number) => `${baseId}-opt-${i}`;

  const rawPointer = useMotionValue(0);
  const rawStrength = useMotionValue(0);
  // 减少动态：去掉弹簧的时间缓动，保留空间波形，抬升即时呈现
  const pointer = prefersReducedMotion ? rawPointer : useSpring(rawPointer, POINTER_SPRING);
  const strength = prefersReducedMotion ? rawStrength : useSpring(rawStrength, STRENGTH_SPRING);
  // 每章一个 0–1 音频电平：FFT 频段按行映射，低频落在轨道底部
  const audioFrame = useMotionValue<number[]>(chapters.map(() => 0));

  const audioRef = useRef<{ ctx: AudioContext; analyser: AnalyserNode; raf: number } | null>(null);
  const errorTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const hoveringRef = useRef(false);
  const focusedRef = useRef<number | null>(null);
  const activeRef = useRef(0);
  const [audioOn, setAudioOn] = useState(false);
  const [audioError, setAudioError] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [engaged, setEngaged] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [cardHeight, setCardHeight] = useState(0);

  const stopAudio = useCallback(() => {
    const handle = audioRef.current;
    if (handle) { cancelAnimationFrame(handle.raf); void handle.ctx.close().catch(() => {}); audioRef.current = null; }
    audioFrame.set(chapters.map(() => 0));
    setAudioOn(false);
  }, [audioFrame, chapters]);

  // 浏览器沙箱无法直读系统音频输出，借屏幕共享的「共享系统音频」轨道
  const startAudio = useCallback(async () => {
    const getDisplayMedia = navigator.mediaDevices?.getDisplayMedia;
    if (!getDisplayMedia) {
      setAudioError(true);
      return;
    }
    try {
      const stream = await getDisplayMedia({ video: true, audio: true });
      const track = stream.getAudioTracks()[0];
      stream.getVideoTracks().forEach((t) => t.stop());
      if (!track) {
        stream.getAudioTracks().forEach((t) => t.stop());
        throw new Error("未共享系统音频");
      }
      const ctx = new AudioContext();
      const analyser = ctx.createAnalyser();
      analyser.fftSize = FFT_SIZE;
      analyser.smoothingTimeConstant = 0.75;
      ctx.createMediaStreamSource(new MediaStream([track])).connect(analyser);
      const bins = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        const handle = audioRef.current;
        if (!handle) return;
        handle.analyser.getByteFrequencyData(bins);
        audioFrame.set(chapters.map((_, i) => bins[Math.floor((1 - i / chapters.length) * (bins.length - 1))] / 255));
        handle.raf = requestAnimationFrame(tick);
      };
      audioRef.current = { ctx, analyser, raf: 0 };
      track.addEventListener("ended", stopAudio);
      setAudioOn(true);
      tick();
    } catch {
      // 用户取消授权，或浏览器/平台不支持共享系统音频
      stopAudio();
      setAudioError(true);
      clearTimeout(errorTimer.current);
      errorTimer.current = setTimeout(() => setAudioError(false), 2400);
    }
  }, [audioFrame, chapters, stopAudio]);

  // 卸载时关闭 AudioContext 与采样循环，避免页面停留期间的资源泄漏
  useEffect(() => () => { clearTimeout(errorTimer.current); stopAudio(); }, [stopAudio]);

  const commitActive = useCallback((index: number) => {
    if (index !== activeRef.current) { activeRef.current = index; setActiveIndex(index); }
  }, []);

  const last = chapters.length - 1, active = chapters[activeIndex];

  useEffect(() => { onActiveChange?.(engaged ? chapters[activeIndex] : null, engaged ? activeIndex : -1); }, [engaged, activeIndex, chapters, onActiveChange]);

  // 量取卡片高度，用于把它的纵向行程钳制在轨道上下界内
  useEffect(() => { if (cardRef.current) setCardHeight(cardRef.current.offsetHeight); }, [activeIndex]);

  // 卡片若会溢出视口，自动翻向更宽敞的一侧
  useEffect(() => {
    const el = engaged ? containerRef.current : null;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const vw = el.ownerDocument.defaultView?.innerWidth ?? 0;
    const need = CARD_WIDTH + GAP + 8;
    let useRight = side === "right";
    if (useRight ? vw - rect.right < need && rect.left >= need : rect.left < need && vw - rect.right >= need) useRight = !useRight;
    setFlipped(useRight !== (side === "right"));
  }, [engaged, activeIndex, side]);

  const resolvedSide = side === "right" ? (flipped ? "left" : "right") : flipped ? "right" : "left";
  const totalHeight = chapters.length * rowHeight;
  // roving tabindex：同一时刻只有一章可以 Tab
  const rovingIndex = engaged ? activeIndex : (currentIndex ?? 0);

  const cardTop = useTransform(pointer, (p) => {
    const half = cardHeight / 2;
    return clamp((p + 0.5) * rowHeight, half, Math.max(half, totalHeight - half)) - half;
  });
  const cardScale = useTransform(strength, [0, 1], [0.97, 1]);
  const cardX = useTransform(strength, [0, 1], [resolvedSide === "right" ? -6 : 6, 0]);

  const engageAt = (pointerRow: number, activeAt: number) => {
    rawPointer.set(pointerRow);
    rawStrength.set(1);
    commitActive(clamp(activeAt, 0, last));
    setEngaged(true);
  };

  const disengage = () => { rawStrength.set(0); setEngaged(false); };

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
    else disengage();
  };

  const handleBlur = (event: ReactFocusEvent<HTMLDivElement>) => {
    if (event.currentTarget.contains(event.relatedTarget as Node | null)) return;
    focusedRef.current = null;
    if (!hoveringRef.current) disengage();
  };

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const step = event.key === "ArrowDown" || event.key === "ArrowRight" ? 1 : event.key === "ArrowUp" || event.key === "ArrowLeft" ? -1 : 0;
    const base = focusedRef.current ?? activeRef.current;
    const next = step ? clamp(base + step, 0, last) : event.key === "Home" ? 0 : event.key === "End" ? last : null;
    if (next === null) return;
    event.preventDefault();
    buttonsRef.current[next]?.focus();
  };

  const audioTitle = prefersReducedMotion ? "系统已减少动态，音乐联动不可用" : audioOn ? "停止音乐联动" : "随系统音乐跳动（需在共享对话框勾选「共享系统音频」）";

  return (
    <div ref={containerRef} style={{ width: peakLength }} className={cn("relative", className)}>
      <div ref={listRef} role="listbox" aria-label={label} aria-orientation="vertical"
        aria-activedescendant={engaged ? optionId(activeIndex) : undefined} className="flex w-full flex-col"
        onPointerMove={handlePointerMove} onPointerLeave={handlePointerLeave} onKeyDown={handleKeyDown} onBlur={handleBlur}
      >
        {chapters.map((chapter, index) => {
          const isCurrent = index === currentIndex, descText = typeof chapter.description === "string" ? `. ${chapter.description}` : "";
          return (
            <button
              key={chapter.id} id={optionId(index)} ref={(el) => { buttonsRef.current[index] = el; }}
              type="button" role="option" aria-selected={isCurrent} aria-label={`${chapter.title}${descText}`}
              tabIndex={index === rovingIndex ? 0 : -1}
              onFocus={() => { focusedRef.current = index; engageAt(index, index); }}
              onClick={() => onSelect?.(chapter, index)} style={{ height: rowHeight }}
              className={cn(
                "flex w-full items-center rounded-sm outline-none",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white/60",
                resolvedSide === "left" ? "justify-end" : "justify-start",
              )}
            >
              <Tick index={index} pointer={pointer} strength={strength} audioFrame={audioFrame}
                radius={radius} restLength={restLength} peakLength={peakLength} isCurrent={isCurrent} />
            </button>
          );
        })}
      </div>

      {audioReactive ? (
        <button
          type="button"
          onClick={() => (audioOn ? stopAudio() : void startAudio())}
          disabled={prefersReducedMotion}
          aria-pressed={audioOn}
          aria-label={audioOn ? "停止音乐联动" : "随系统音乐跳动"}
          title={audioTitle}
          className={cn(
            "mx-auto mt-2 grid size-7 shrink-0 place-items-center rounded-full border text-white/55 transition-colors border-white/10 bg-black/40 backdrop-blur-sm hover:text-white",
            audioOn && "border-lime-300/40 text-lime-300 motion-safe:animate-pulse",
            audioError && "border-red-400/50 text-red-400", prefersReducedMotion && "opacity-40",
          )}
        >
          <svg aria-hidden="true" viewBox="0 0 16 16" className="size-3.5 fill-current">
            <rect x="0.5" y="6" width="2.6" height="4" rx="1.3" />
            <rect x="4.4" y="3" width="2.6" height="10" rx="1.3" />
            <rect x="8.3" y="8" width="2.6" height="3" rx="1.3" />
            <rect x="12.2" y="1.5" width="2.6" height="13" rx="1.3" />
          </svg>
        </button>
      ) : null}

      {active ? (
        <motion.div
          ref={cardRef}
          aria-hidden="true"
          style={{ top: cardTop, x: cardX, scale: cardScale, opacity: strength, ...(resolvedSide === "right" ? { left: peakLength + GAP } : { right: peakLength + GAP }) }}
          className={cn(
            "pointer-events-none absolute z-10 w-[min(260px,calc(100cqw-104px))] rounded-2xl border border-white/10 bg-[#151617] px-4 py-3.5 text-zinc-100 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.5),0_18px_44px_-12px_rgba(0,0,0,0.65)]",
            resolvedSide === "right" ? "origin-left" : "origin-right",
          )}
        >
          {active.meta ? <div className="mb-1 text-xs font-medium tabular-nums text-zinc-400">{active.meta}</div> : null}
          <div className="truncate text-sm font-semibold leading-snug tracking-[-0.01em]">{active.title}</div>
          {active.description ? <p className="mt-1 line-clamp-3 text-sm leading-relaxed text-zinc-400">{active.description}</p> : null}
        </motion.div>
      ) : null}
    </div>
  );
}
