"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface ThinkingMarqueeProps {
  /** 完整文本；追加内容会接续播放，替换或清空会重置 */
  text: string;
  /** 实时流模式：立即接收追加内容，结束后设为 false */
  streaming?: boolean;
  /** 自动播放时每两个字符的间隔（毫秒） */
  interval?: number;
  /** 播完停顿 2 秒后重播，实时流模式下不循环 */
  loop?: boolean;
  paused?: boolean;
  shine?: boolean;
  /** 也始终尊重系统的减少动态效果设置 */
  reducedMotion?: boolean;
  onComplete?: () => void;
  className?: string;
}

interface StreamToken {
  element: HTMLSpanElement;
  width: number;
}

type PlaybackOptions = Required<Omit<ThinkingMarqueeProps, "className" | "onComplete">>
  & Pick<ThinkingMarqueeProps, "onComplete">;

/** 背压驱动的思考流：逐批插入、测量字宽、积分位移，并回收离屏节点。 */
export function ThinkingMarquee({
  text, streaming = false, interval = 48, loop = false, paused = false,
  shine = true, reducedMotion = false, onComplete, className,
}: ThinkingMarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const liveRef = useRef<HTMLSpanElement>(null);
  const wakeRef = useRef<(() => void) | null>(null);
  const options = useRef<PlaybackOptions>({ text, streaming, interval, loop, paused, shine, reducedMotion, onComplete });

  useEffect(() => {
    options.current = { text, streaming, interval, loop, paused, shine, reducedMotion, onComplete };
    wakeRef.current?.();
  }, [text, streaming, interval, loop, paused, shine, reducedMotion, onComplete]);

  useEffect(() => {
    const root = rootRef.current, viewport = viewportRef.current;
    const track = trackRef.current, live = liveRef.current;
    if (!root || !viewport || !track || !live) return;
    const media = matchMedia("(prefers-reduced-motion: reduce)");
    const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
    let source = "", cursor = 0, announcedCursor = 0;
    let segments = segmenter.segment("")[Symbol.iterator]();
    let tokens: StreamToken[] = [];
    let contentWidth = 0, position = 0, velocity = 0;
    let frame = 0, timer = 0, lastFrame = 0, lastEmission = 0, lastAnnouncement = 0;
    let reduced = false, done = false, needsMeasure = true;

    const reset = () => {
      track.replaceChildren();
      tokens = [];
      source = "";
      cursor = announcedCursor = contentWidth = position = velocity = lastEmission = 0;
      done = false;
      live.textContent = "";
      track.style.transform = "translate3d(0,0,0)";
      viewport.removeAttribute("data-overflow");
    };

    const schedule = () => {
      if (!frame) {
        lastFrame = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    const sync = () => {
      clearTimeout(timer);
      const incoming = options.current.text;
      if (!incoming.startsWith(source)) reset();
      if (incoming !== source) {
        source = incoming;
        segments = segmenter.segment(source.slice(cursor))[Symbol.iterator]();
        done = false;
      }
      reduced = media.matches || options.current.reducedMotion;
      if (options.current.streaming) done = false;
      root.dataset.state = !source && !options.current.streaming ? "idle"
        : done && !options.current.streaming ? "done" : "thinking";
      root.dataset.reduced = String(reduced);
      root.dataset.paused = String(options.current.paused);
      schedule();
    };

    const tick = (now: number) => {
      frame = 0;
      const settings = options.current;
      if (settings.paused) return;
      const elapsed = Math.min(0.05, Math.max(0, (now - lastFrame) / 1000));
      lastFrame = now;
      const added: HTMLSpanElement[] = [];

      if (reduced && cursor < source.length) {
        // 减少动态效果时一次显示全部文本，直接定位到末尾，不播放逐字动画。
        track.replaceChildren();
        tokens = [];
        contentWidth = 0;
        const element = document.createElement("span");
        element.textContent = source;
        element.className = "shrink-0";
        track.append(element);
        added.push(element);
        cursor = source.length;
        segments = segmenter.segment("")[Symbol.iterator]();
      } else if (cursor < source.length && (settings.streaming || now - lastEmission >= Math.max(8, settings.interval))) {
        const fragment = document.createDocumentFragment();
        // 每帧最多插入 48 个节点；按字素切分，避免拆开组合字符。
        for (let count = 0; count < (settings.streaming ? 48 : 1) && cursor < source.length; count++) {
          let chunk = "";
          for (let part = 0; part < 2; part++) {
            const next = segments.next();
            if (next.done) break;
            chunk += next.value.segment;
          }
          const element = document.createElement("span");
          element.className = "thinking-marquee-token shrink-0";
          element.textContent = chunk;
          cursor += chunk.length;
          fragment.append(element);
          added.push(element);
        }
        track.append(fragment);
        lastEmission = now;
      }

      for (const element of added) {
        const width = element.getBoundingClientRect().width;
        tokens.push({ element, width });
        contentWidth += width;
      }
      if (needsMeasure) {
        const previousWidth = contentWidth;
        contentWidth = 0;
        for (const token of tokens) {
          token.width = token.element.getBoundingClientRect().width;
          contentWidth += token.width;
        }
        if (previousWidth) position *= contentWidth / previousWidth;
        needsMeasure = false;
      }
      const viewportWidth = viewport.clientWidth;
      const target = Math.max(0, contentWidth - viewportWidth + 56);
      if (target > 0) viewport.dataset.overflow = "true";
      if (reduced) position = target;
      else {
        const backlog = Math.max(0, target - position);
        const speed = Math.min(2400, 24 + 1.8 * backlog);
        velocity += (speed - velocity) * (1 - Math.exp(-elapsed / 0.09));
        position = Math.min(target, position + velocity * elapsed);
        position = Math.max(position, target - Math.max(600, viewportWidth * 2.5));
      }

      // 回收左侧一屏以外的节点，同时补偿位移，保持画面连续。
      let removedWidth = 0, removedCount = 0;
      for (const token of tokens) {
        if (removedWidth + token.width >= position - viewportWidth) break;
        removedWidth += token.width;
        token.element.remove();
        removedCount++;
      }
      if (removedCount) {
        tokens.splice(0, removedCount);
        contentWidth -= removedWidth;
        position -= removedWidth;
      }
      track.style.transform = `translate3d(${(-position).toFixed(2)}px,0,0)`;
      if (cursor > announcedCursor && now - lastAnnouncement >= 900) {
        live.textContent = source.slice(Math.max(announcedCursor, cursor - 420), cursor);
        announcedCursor = cursor;
        lastAnnouncement = now;
      }

      const settled = cursor === source.length && target - removedWidth - position < 0.5
        && (reduced || now - lastEmission >= 620);
      root.dataset.state = !source && !settings.streaming ? "idle"
        : settled && !settings.streaming ? "done" : "thinking";
      if (source && settled && !settings.streaming) {
        if (!done) {
          done = true;
          velocity = 0;
          live.textContent = "思考完成";
          settings.onComplete?.();
        }
        clearTimeout(timer);
        if (settings.loop && !reduced) timer = window.setTimeout(() => { reset(); sync(); }, 2000);
        return;
      }
      if (source && !reduced) frame = requestAnimationFrame(tick);
    };

    const resize = () => { needsMeasure = true; schedule(); };
    const observer = new ResizeObserver(resize);
    observer.observe(viewport);
    document.fonts.addEventListener("loadingdone", resize);
    media.addEventListener("change", sync);
    wakeRef.current = sync;
    sync();
    return () => {
      cancelAnimationFrame(frame);
      clearTimeout(timer);
      observer.disconnect();
      document.fonts.removeEventListener("loadingdone", resize);
      media.removeEventListener("change", sync);
      wakeRef.current = null;
      reset();
    };
  }, []);

  return (
    <div ref={rootRef} role="group" aria-label={text || "等待思考内容"} data-state="idle"
      className={cn("thinking-marquee w-full min-w-0 text-[15px] font-light leading-[1.85] tracking-[0.024em] text-[oklch(72%_0.01_250)]", className)}>
      <div aria-hidden className="flex items-center gap-3">
        <div ref={viewportRef} className="thinking-marquee-viewport relative flex h-[1.85em] min-w-0 flex-1 items-center overflow-hidden">
          <div ref={trackRef} className="flex w-max shrink-0 items-baseline whitespace-pre will-change-transform" />
          {shine && <span className="thinking-marquee-shine pointer-events-none absolute inset-0 bg-[linear-gradient(110deg,transparent_38%,rgba(255,255,255,0.12)_50%,transparent_62%)] bg-[length:200%_100%] bg-no-repeat opacity-0 mix-blend-screen" />}
        </div>
        <span className="thinking-marquee-mark size-1 shrink-0 rounded-full bg-current opacity-20" />
      </div>
      <span ref={liveRef} className="sr-only" aria-live="polite" aria-atomic="false" />
      <style href="thinking-marquee-keyframes" precedence="medium">{`
        .thinking-marquee-viewport[data-overflow]{mask-image:linear-gradient(to right,transparent,#000 min(148px,22%),#000 calc(100% - min(64px,9%)),transparent)}
        @keyframes thinking-marquee-enter{from{opacity:0}to{opacity:1}}
        @keyframes thinking-marquee-breathe{0%,100%{opacity:.2;scale:.78}50%{opacity:.55;scale:1}}
        @keyframes thinking-marquee-sweep{from{background-position:200% 0}to{background-position:-200% 0}}
        @media(prefers-reduced-motion:no-preference){
          .thinking-marquee[data-reduced=false] .thinking-marquee-token{animation:thinking-marquee-enter 620ms cubic-bezier(.25,1,.5,1) both}
          .thinking-marquee[data-state=thinking][data-reduced=false] .thinking-marquee-mark{animation:thinking-marquee-breathe 3.4s ease-in-out infinite}
          .thinking-marquee[data-state=thinking][data-reduced=false] .thinking-marquee-shine{opacity:1;animation:thinking-marquee-sweep 3s linear infinite}
          .thinking-marquee[data-paused=true] *{animation-play-state:paused!important}
        }
      `}</style>
    </div>
  );
}
