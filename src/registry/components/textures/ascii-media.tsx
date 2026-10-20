"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AsciiMediaProps {
  /** 图片或视频地址（同源或已开启 CORS），传数组时依次拉远过渡；画面亮部化作更亮的字符浮现，留空只显示代码底纹 */
  src?: string | readonly string[];
  /** 传数组时每个画面的时长（毫秒，含与下一画面的过渡） */
  interval?: number;
  children?: ReactNode;
  className?: string;
  /** 字号兼行高（像素），列距为字宽的 1.3 倍 */
  fontSize?: number;
  /** 是否在画面之外绘制暗色代码底纹 */
  showPattern?: boolean;
  /** 底纹字符的不透明度 */
  patternOpacity?: number;
}

interface Cell {
  char: string;
  /** 空格永不跳变，保住伪代码的排版骨架 */
  space: boolean;
  /** 沿行从 0 递增到 π 的相位，让跳变像波一样横扫整行 */
  phase: number;
}

interface Row {
  cells: Cell[];
  phase: number;
}

type Media = HTMLImageElement | HTMLVideoElement;

const CHARS = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";
const HEX = "0123456789ABCDEFabcdef";
const SYMBOLS = "!@#$%^&*()_+-=[]{}|;:,.<>?/~`'\"\\";
const PUNCTUATION = ".,;:!?";
const OPERATORS = "=> -> :: && || == != <= >= ++ -- += -= *= /= << >> ** ?. ?? ... |> <|".split(" ");
/** 伪代码词库；拼标识符和括号内容时只取前 20 / 30 / 40 个高频关键字 */
const WORDS = (
  "function const let var return async await import export class extends interface type enum struct void int char if else " +
  "for while switch case break continue default try catch throw finally new delete typeof instanceof public private protected " +
  "static readonly abstract virtual null undefined true false NaN Infinity never Array Object String Number Boolean Symbol Map " +
  "Set Promise Observable Stream Buffer Event Error Exception document window console process module require exports TCP HTTP " +
  "HTTPS SSH FTP DNS API REST JSON XML kernel socket buffer stream pipe fork exec spawn kill malloc free sizeof typedef volatile " +
  "extern inline register SELECT FROM WHERE JOIN INSERT UPDATE DELETE CREATE DROP the and for are but not you all can had her " +
  "was with this that have from they been would there their which when make like time just know take into year your some them " +
  "than then only come over such also back after most made being where through before between"
).split(" ");
const VIDEO = /\.(mp4|webm|ogg|mov|avi)(?:[?#]|$)/i;
/** 每个画面末尾与下一画面交叉淡化的时长占比 */
const FADE = 0.35;
/** 单个画面在整个可见窗口（淡入 → 停留 → 淡出）内的总缩放比，约 1.48 → 0.67 倍 */
const ZOOM = 2.2;

const rand = (n: number) => Math.floor(Math.random() * n);
const pick = (list: string | readonly string[], n = list.length) => list[rand(n)];
const run = (list: string, n: number) => Array.from({ length: n }, () => pick(list)).join("");
const smooth = (x: number) => x * x * (3 - 2 * x);
/** 窗口进度 k（0–1）对应的缩放：三次曲线让停留时缓慢推远、过渡时加速，像镜头一路拉远 */
const zoomAt = (k: number) => ZOOM ** -(0.4 * (k - 0.5) + 2.4 * (k - 0.5) ** 3);
const sizeOf = (m: Media): [number, number] =>
  m instanceof HTMLVideoElement ? (m.readyState >= 2 ? [m.videoWidth, m.videoHeight] : [0, 0]) : [m.naturalWidth, m.naturalHeight];

/** 一行伪代码：关键字、随机串、十六进制、运算符、括号组、标识符与符号交替，以空格或标点分隔 */
function codeLine(length: number): Cell[] {
  let line = Math.random() < 0.12 ? " ".repeat(2 + rand(4)) : "";
  while (line.length < length - 15) {
    const r = Math.random();
    if (r < 0.3) line += pick(WORDS);
    else if (r < 0.45) line += run(CHARS, 2 + rand(10));
    else if (r < 0.55) line += "0x" + run(HEX, 2 + rand(6));
    else if (r < 0.65) line += pick(OPERATORS);
    else if (r < 0.75) {
      const pair = Math.random() < 0.33 ? "()" : Math.random() < 0.5 ? "[]" : "{}";
      const inner = Array.from({ length: 1 + rand(8) }, () => (Math.random() < 0.3 ? pick(WORDS, 30) : pick(CHARS)));
      line += pair[0] + inner.join("") + pair[1];
    } else if (r < 0.85) {
      line += pick(WORDS, 40) + (Math.random() < 0.4 ? "_" + pick(WORDS, 20) : "") + (Math.random() < 0.3 ? rand(1000) : "");
    } else line += run(SYMBOLS, 1 + rand(4));

    if (line.length < length - 10) {
      const s = Math.random();
      line += s < 0.45 ? " " : s < 0.6 ? pick(PUNCTUATION) + " " : s < 0.75 ? "  " : s < 0.85 ? " | " : " - ";
    }
  }
  while (line.length < length) line += pick(CHARS);
  return Array.from(line.slice(0, length), (char, i) => ({
    char,
    space: char === " ",
    phase: (i / length) * Math.PI + Math.random() * 0.5,
  }));
}

/**
 * 字符影像：满屏伪代码字符按正弦波成片跳变，图片或视频的亮部化作更亮的字符浮现；
 * 传入多个画面时依次拉远过渡。复刻自 Inception（inceptionlabs.ai）登录页右侧面板。
 */
export function AsciiMedia({
  src,
  interval = 4000,
  children,
  className,
  fontSize = 10,
  showPattern = true,
  patternOpacity = 0.15,
}: AsciiMediaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // 数组字面量每次渲染都是新引用，序列化后作依赖，避免重复加载媒体
  const sources = JSON.stringify(typeof src === "string" ? [src] : src ?? []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const font = `${fontSize}px "Courier New", monospace`;
    const pattern = `rgba(255,255,255,${patternOpacity})`;
    const period = Math.max(500, interval);
    // 采样画布每格对应一个像素：画面缩到字符网格大小后逐格读亮度
    const sampler = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    const media: Media[] = [];
    let rows: Row[] = [];
    let cols = 0;
    let width = 0;
    let height = 0;
    let pitch = 0;
    let data: Uint8ClampedArray | null = null;
    let elapsed = 0;
    let visible = false;
    let raf = 0;
    let last = 0;

    const layout = () => {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
      if (!width || !height) return false;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.font = font;
      pitch = ctx.measureText("M").width * 1.3;
      cols = Math.floor(width / pitch);
      rows = Array.from({ length: Math.floor(height / fontSize) }, () => ({ cells: codeLine(cols), phase: Math.random() * Math.PI * 2 }));
      if (sampler) {
        sampler.canvas.width = cols;
        sampler.canvas.height = rows.length;
      }
      return true;
    };

    /** 合成当前时刻的画面：黑底上按 contain 95% 居中绘制，过渡期前后两个画面加色混合，交叉淡化不发暗 */
    const compose = () => {
      data = null;
      const n = media.length;
      if (!sampler || !n || !cols || !rows.length) return;
      const t = elapsed / period;
      const i = Math.floor(t);
      const f = t - i;
      const p = n > 1 && f > 1 - FADE ? smooth((f - 1 + FADE) / FADE) : 0;
      sampler.setTransform(1, 0, 0, 1, 0, 0);
      sampler.globalCompositeOperation = "source-over";
      sampler.globalAlpha = 1;
      sampler.fillStyle = "#000";
      sampler.fillRect(0, 0, cols, rows.length);
      sampler.setTransform(1 / pitch, 0, 0, 1 / fontSize, 0, 0);
      sampler.globalCompositeOperation = "lighter";
      // v：画面自身进度，-FADE→0 淡入，0→1 停留并在末段淡出
      const layer = (k: number, v: number, alpha: number) => {
        const m = media[k % n];
        const [mw, mh] = sizeOf(m);
        if (!mw || !mh) return;
        const zoom = n > 1 && !reduced ? zoomAt((v + FADE) / (1 + FADE)) : 1;
        const s = Math.min((width * 0.95) / mw, (height * 0.95) / mh) * zoom;
        sampler.globalAlpha = alpha;
        sampler.drawImage(m, (width - mw * s) / 2, (height - mh * s) / 2, mw * s, mh * s);
      };
      layer(i, f, 1 - p);
      if (p > 0) layer(i + 1, f - 1, p);
      try {
        data = sampler.getImageData(0, 0, cols, rows.length).data;
      } catch {
        // 跨域且未开 CORS 时无法读取像素，只保留底纹
      }
    };

    const draw = () => {
      let style = "";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.font = font;
      ctx.textBaseline = "top";
      for (let r = 0; r < rows.length; r++) {
        const cells = rows[r].cells;
        for (let c = 0; c < cells.length; c++) {
          if (cells[c].space) continue;
          let fill = showPattern ? pattern : "";
          if (data) {
            const i = (r * cols + c) * 4;
            const luma = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
            if (luma > 0.05) fill = `rgba(255,255,255,${(0.15 + 0.85 * luma).toFixed(2)})`;
          }
          if (!fill) continue;
          if (fill !== style) {
            ctx.fillStyle = fill;
            style = fill;
          }
          ctx.fillText(cells[c].char, c * pitch, r * fontSize);
        }
      }
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 40) return;
      // 离屏或切后台回来时最多推进 250ms，画面序列不会跳段；低帧率设备上也基本按实时推进
      elapsed += Math.min(now - last, 250);
      last = now;
      // 每格跳变概率在 0–20% 间随正弦波起伏，约 3.1s 一个周期
      for (const row of rows) {
        for (const cell of row.cells) {
          if (!cell.space && Math.random() < ((Math.sin(now * 0.002 + row.phase + cell.phase) + 1) / 2) * 0.2) cell.char = pick(CHARS);
        }
      }
      compose();
      draw();
    };

    /** 只在可见且允许动效时运行循环与视频 */
    const sync = () => {
      const active = visible && !reduced;
      if (active && !raf) raf = requestAnimationFrame(tick);
      if (!active && raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
      for (const m of media) {
        if (!(m instanceof HTMLVideoElement)) continue;
        if (active) m.play().catch(() => {});
        else m.pause();
      }
    };

    /** 媒体就绪时若循环未运行（降级或离屏），手动补一帧 */
    const onReady = () => {
      if (raf) return;
      compose();
      draw();
    };

    for (const url of JSON.parse(sources) as string[]) {
      const el: Media = VIDEO.test(url)
        ? Object.assign(document.createElement("video"), { muted: true, loop: true, playsInline: true, preload: "auto", onloadeddata: onReady })
        : Object.assign(new Image(), { onload: onReady });
      el.crossOrigin = "anonymous";
      el.src = url;
      media.push(el);
    }

    const visibility = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1]?.isIntersecting ?? false;
      sync();
    });
    const resize = new ResizeObserver(() => {
      if (!layout()) return;
      compose();
      draw();
    });
    visibility.observe(canvas);
    resize.observe(canvas);

    return () => {
      visibility.disconnect();
      resize.disconnect();
      cancelAnimationFrame(raf);
      for (const m of media) {
        m.onload = m.onloadeddata = null;
        if (m instanceof HTMLVideoElement) {
          m.pause();
          m.removeAttribute("src");
          m.load();
        }
      }
    };
  }, [sources, interval, fontSize, showPattern, patternOpacity]);

  return (
    <div className={cn("relative isolate overflow-hidden bg-black", className)}>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
      {children != null && <div className="relative">{children}</div>}
    </div>
  );
}
