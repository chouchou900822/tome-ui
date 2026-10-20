"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface AsciiMediaProps {
  /** 图片或视频地址（同源或已开启 CORS）；画面亮部会化作更亮的字符浮现，留空只显示代码底纹 */
  src?: string;
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

/** 媒体在画布上的 contain 适配框，以及按字符密度缩采样的像素 */
interface Frame {
  x: number;
  y: number;
  w: number;
  h: number;
  cols: number;
  rows: number;
  data: Uint8ClampedArray | null;
}

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

const rand = (n: number) => Math.floor(Math.random() * n);
const pick = (list: string | readonly string[], n = list.length) => list[rand(n)];
const run = (list: string, n: number) => Array.from({ length: n }, () => pick(list)).join("");

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
 * 字符影像：满屏伪代码字符按正弦波成片跳变，图片或视频的亮部化作更亮的字符浮现。
 * 复刻自 Inception（inceptionlabs.ai）登录页右侧面板。
 */
export function AsciiMedia({
  src,
  children,
  className,
  fontSize = 10,
  showPattern = true,
  patternOpacity = 0.15,
}: AsciiMediaProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const font = `${fontSize}px "Courier New", monospace`;
    const pattern = `rgba(255,255,255,${patternOpacity})`;
    const sampler = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
    let video: HTMLVideoElement | null = null;
    let image: HTMLImageElement | null = null;
    let ready = false;
    let rows: Row[] = [];
    let charWidth = 0;
    let frame: Frame | null = null;
    let visible = false;
    let raf = 0;
    let last = 0;

    /** 把当前画面缩到字符网格大小再读像素；跨域且未开 CORS 时读取失败，只保留底纹 */
    const sample = () => {
      const media = video ?? image;
      if (!frame || !sampler || !media) return;
      sampler.clearRect(0, 0, frame.cols, frame.rows);
      sampler.drawImage(media, 0, 0, frame.cols, frame.rows);
      try {
        frame.data = sampler.getImageData(0, 0, frame.cols, frame.rows).data;
      } catch {
        frame.data = null;
      }
    };

    /** 媒体按 contain 适配到画布的 95% 并居中 */
    const fit = () => {
      frame = null;
      const mw = video ? video.videoWidth : image?.naturalWidth ?? 0;
      const mh = video ? video.videoHeight : image?.naturalHeight ?? 0;
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!ready || !sampler || !mw || !mh || !charWidth) return;
      const scale = Math.min((w * 0.95) / mw, (h * 0.95) / mh);
      const fw = mw * scale;
      const fh = mh * scale;
      frame = { x: (w - fw) / 2, y: (h - fh) / 2, w: fw, h: fh, cols: Math.ceil(fw / charWidth), rows: Math.ceil(fh / fontSize), data: null };
      sampler.canvas.width = frame.cols;
      sampler.canvas.height = frame.rows;
      sample();
    };

    const layout = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      if (!w || !h) return false;
      canvas.width = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      ctx.font = font;
      charWidth = ctx.measureText("M").width;
      const cols = Math.floor(w / (charWidth * 1.3));
      rows = Array.from({ length: Math.floor(h / fontSize) }, () => ({ cells: codeLine(cols), phase: Math.random() * Math.PI * 2 }));
      fit();
      return true;
    };

    const draw = () => {
      if (video && !video.paused) sample();
      const pitch = charWidth * 1.3;
      const data = frame?.data;
      let style = "";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = font;
      ctx.textBaseline = "top";
      for (let r = 0; r < rows.length; r++) {
        const y = r * fontSize;
        const cells = rows[r].cells;
        for (let c = 0; c < cells.length; c++) {
          if (cells[c].space) continue;
          const x = c * pitch;
          let fill = showPattern ? pattern : "";
          if (frame && data) {
            // 以字符格中心取样：亮度 > 0.05 且不透明的像素把这一格点亮
            const fx = x + pitch / 2 - frame.x;
            const fy = y + fontSize / 2 - frame.y;
            if (fx >= 0 && fx < frame.w && fy >= 0 && fy < frame.h) {
              const i = (Math.floor((fy / frame.h) * frame.rows) * frame.cols + Math.floor((fx / frame.w) * frame.cols)) * 4;
              const luma = (0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2]) / 255;
              if (luma > 0.05 && data[i + 3] > 20) fill = `rgba(255,255,255,${((data[i + 3] / 255) * (0.15 + 0.85 * luma)).toFixed(2)})`;
            }
          }
          if (!fill) continue;
          if (fill !== style) {
            ctx.fillStyle = fill;
            style = fill;
          }
          ctx.fillText(cells[c].char, x, y);
        }
      }
    };

    const tick = (now: number) => {
      raf = requestAnimationFrame(tick);
      if (now - last < 40) return;
      last = now;
      // 每格跳变概率在 0–20% 间随正弦波起伏，约 3.1s 一个周期
      for (const row of rows) {
        for (const cell of row.cells) {
          if (!cell.space && Math.random() < ((Math.sin(now * 0.002 + row.phase + cell.phase) + 1) / 2) * 0.2) cell.char = pick(CHARS);
        }
      }
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
      if (!video || !ready) return;
      if (active) video.play().catch(() => {});
      else video.pause();
    };

    const onReady = () => {
      ready = true;
      fit();
      draw();
      sync();
    };

    if (src && VIDEO.test(src)) {
      video = Object.assign(document.createElement("video"), { crossOrigin: "anonymous", muted: true, loop: true, playsInline: true, preload: "auto" });
      video.onloadeddata = onReady;
      video.src = src;
    } else if (src) {
      image = Object.assign(new Image(), { crossOrigin: "anonymous" });
      image.onload = onReady;
      image.src = src;
    }

    const visibility = new IntersectionObserver((entries) => {
      visible = entries[entries.length - 1]?.isIntersecting ?? false;
      sync();
    });
    const resize = new ResizeObserver(() => {
      if (layout()) draw();
    });
    visibility.observe(canvas);
    resize.observe(canvas);

    return () => {
      visibility.disconnect();
      resize.disconnect();
      cancelAnimationFrame(raf);
      if (image) image.onload = null;
      if (video) {
        video.onloadeddata = null;
        video.pause();
        video.removeAttribute("src");
        video.load();
      }
    };
  }, [src, fontSize, showPattern, patternOpacity]);

  return (
    <div className={cn("relative isolate overflow-hidden bg-black", className)}>
      <canvas ref={canvasRef} aria-hidden className="pointer-events-none absolute inset-0 size-full" />
      {children != null && <div className="relative">{children}</div>}
    </div>
  );
}
