"use client";

import { Fragment, useEffect, useId, useRef, useState } from "react";
import type { CSSProperties, KeyboardEvent, PointerEvent, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface LiquidGlassProps {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
  /** 圆角半径 px */
  radius?: number;
  /** 折射强度 0–90：边缘处背景被拉入的最大像素数 */
  refraction?: number;
  /** 曲面边缘宽度 px，折射与受光都发生在这一圈 */
  bevel?: number;
  /** 玻璃后方的模糊 px，0.35 左右保持通透 */
  blur?: number;
  /** 色散 px：R / B 通道相对 G 的位移差 */
  dispersion?: number;
  /** 玻璃着色 */
  tint?: string;
  /** 允许在最近的定位父容器内拖动，也支持方向键与 Home 复位 */
  draggable?: boolean;
}

interface Textures {
  map: string;
  light: string;
  width: number;
  height: number;
}

type Renderer = "svg" | "css" | "solid";

/** 折射率 1.46 的玻璃在最大入射角下的偏折量，用于把偏移归一化到 0–1 */
const EDGE = Math.tan(Math.asin(0.985) - Math.asin(0.985 / 1.46));

/** 三张只保留单通道的色彩矩阵，位移量不同后 screen 叠回即为色散 */
const CHANNELS = [
  "1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 1 0",
  "0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0",
  "0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0",
];

/**
 * 按圆角矩形的有向距离场合成两张贴图：
 * 位移贴图 RG 通道存边缘法线方向的折射偏移（128 为不偏移），
 * 受光贴图存顶部、底部窄高光与右侧轻微暗部，只在 bevel 圈内有像素。
 */
function buildTextures(width: number, height: number, radius: number, bevel: number): Textures | null {
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  const w = Math.max(2, Math.round(width * scale));
  const h = Math.max(2, Math.round(height * scale));
  const canvas = Object.assign(document.createElement("canvas"), { width: w, height: h });
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const map = ctx.createImageData(w, h);
  const light = ctx.createImageData(w, h);
  const { data: md } = map;
  const { data: ld } = light;
  const r = Math.min(radius, width / 2, height / 2);
  const b = Math.max(1, Math.min(bevel, width / 2, height / 2));
  for (let y = 0; y < h; y++) {
    const py = (y + 0.5) / scale - height / 2;
    const qy = Math.abs(py) - (height / 2 - r);
    const oy = Math.max(qy, 0);
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      const px = (x + 0.5) / scale - width / 2;
      const qx = Math.abs(px) - (width / 2 - r);
      const ox = Math.max(qx, 0);
      const len = Math.hypot(ox, oy);
      // 有向距离：内部为负，越靠近轮廓越接近 0
      const d = len + Math.min(Math.max(qx, qy), 0) - r;
      md[i] = md[i + 1] = 128;
      md[i + 3] = 255;
      if (d > 0 || -d > b + 4) continue;
      let nx = 0;
      let ny = 0;
      if (len > 1e-4) {
        nx = (ox / len) * Math.sign(px);
        ny = (oy / len) * Math.sign(py);
      } else if (qx > qy) nx = Math.sign(px);
      else ny = Math.sign(py);
      const s = -d;
      // 边缘入射角最大、向内快速趋平：斯涅尔定律的美术化近似
      const sin = Math.pow(1 - Math.min(s / b, 1), 1.28) * 0.985;
      const bend = Math.tan(Math.asin(sin) - Math.asin(sin / 1.46)) / EDGE;
      md[i] = Math.round(127.5 - nx * bend * 127.5);
      md[i + 1] = Math.round(127.5 - ny * bend * 127.5);
      const top = Math.max(0, -nx * 0.4 - ny * 0.92);
      const bottom = Math.max(0, nx * 0.22 + ny * 0.98);
      const side = Math.max(0, nx * 0.95 - ny * 0.31);
      const edge = Math.exp(-(((s - 0.72) / 0.6) ** 2));
      const shoulder = Math.exp(-(((s - b * 0.31) / (b * 0.29)) ** 2));
      const shade = Math.exp(-(((s - 1.8) / 0.86) ** 2)) * 0.21 + shoulder * 0.032;
      const v = edge * (0.08 + 0.78 * top * top + 0.64 * bottom ** 3) + shoulder * (0.033 * top + 0.054 * bottom ** 3) - shade * side;
      ld[i] = v >= 0 ? 255 : 37;
      ld[i + 1] = v >= 0 ? 255 : 46;
      ld[i + 2] = v >= 0 ? 255 : 62;
      ld[i + 3] = Math.round(Math.min(Math.abs(v), 0.96) * 255 * Math.min(1, 0.5 - d));
    }
  }
  ctx.putImageData(map, 0, 0);
  const mapURL = canvas.toDataURL();
  ctx.putImageData(light, 0, 0);
  return { map: mapURL, light: canvas.toDataURL(), width, height };
}

const clamp = (n: number, min: number, max: number) => Math.max(min, Math.min(n, max));

/**
 * 液态玻璃：真实折射玻璃后方的网页内容，边缘随曲面弯折并带轻微色散，
 * 顶部一线冷白高光、指针靠近时边缘泛起柔光。
 * Chromium 走 SVG backdrop-filter，其他浏览器降级为毛玻璃，减少透明偏好下为实色。
 */
export function LiquidGlass({
  children,
  className,
  style,
  radius = 28,
  refraction = 48,
  bevel = 20,
  blur = 0.4,
  dispersion = 1.2,
  tint = "rgba(255,255,255,0.03)",
  draggable = false,
}: LiquidGlassProps) {
  const filterId = `liquid-glass-${useId().replace(/\W/g, "")}`;
  const hostRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ x: number; y: number } | null>(null);
  const offset = useRef({ x: 0, y: 0 });
  const [renderer, setRenderer] = useState<Renderer>("css");
  const [textures, setTextures] = useState<Textures | null>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    const ua = navigator.userAgent;
    const chromium = /Chrome\/|Chromium\/|Edg\//.test(ua) && !/iPhone|iPad|iPod/.test(ua);
    const solid = matchMedia("(prefers-reduced-transparency: reduce), (prefers-contrast: more)").matches;
    const svg = !solid && chromium && CSS.supports("backdrop-filter", "url(#probe)");
    setRenderer(solid ? "solid" : svg ? "svg" : "css");
    if (!svg) return;
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        if (host.offsetWidth && host.offsetHeight) setTextures(buildTextures(host.offsetWidth, host.offsetHeight, radius, bevel));
      });
    });
    observer.observe(host);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
    };
  }, [radius, bevel]);

  const active = renderer === "svg" ? textures : null;
  const strength = active ? Math.min(refraction, Math.min(active.width, active.height) * 0.46) : 0;
  const separation = refraction === 0 ? 0 : Math.min(dispersion, strength * 0.1);
  const pad = Math.ceil(refraction / 2 + blur * 3 + 4);
  const backdrop = renderer === "solid" ? "none" : active ? `url(#${filterId})` : `blur(${Math.max(blur, 6)}px) saturate(1.1)`;

  function place(x: number, y: number) {
    const host = hostRef.current;
    const parent = host?.offsetParent;
    if (!host || !(parent instanceof HTMLElement)) return;
    const minX = -host.offsetLeft;
    const minY = -host.offsetTop;
    offset.current = {
      x: clamp(x, minX, Math.max(minX, parent.clientWidth - host.offsetWidth + minX)),
      y: clamp(y, minY, Math.max(minY, parent.clientHeight - host.offsetHeight + minY)),
    };
    host.style.translate = `${offset.current.x}px ${offset.current.y}px`;
  }

  function onPointerDown(e: PointerEvent<HTMLDivElement>) {
    if (!draggable || e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = { x: e.clientX - offset.current.x, y: e.clientY - offset.current.y };
  }

  function onPointerMove(e: PointerEvent<HTMLDivElement>) {
    if (drag.current) place(e.clientX - drag.current.x, e.clientY - drag.current.y);
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const host = e.currentTarget;
    const rect = host.getBoundingClientRect();
    host.style.setProperty("--lg-x", `${((e.clientX - rect.left) / rect.width) * 100}%`);
    host.style.setProperty("--lg-y", `${((e.clientY - rect.top) / rect.height) * 100}%`);
  }

  function onPointerLeave(e: PointerEvent<HTMLDivElement>) {
    e.currentTarget.style.removeProperty("--lg-x");
    e.currentTarget.style.removeProperty("--lg-y");
  }

  function onKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (!draggable) return;
    const step = e.shiftKey ? 24 : 8;
    const { x, y } = offset.current;
    const moves: Record<string, [number, number]> = {
      ArrowLeft: [x - step, y], ArrowRight: [x + step, y], ArrowUp: [x, y - step], ArrowDown: [x, y + step], Home: [0, 0],
    };
    const next = moves[e.key];
    if (!next) return;
    e.preventDefault();
    place(next[0], next[1]);
  }

  const stopDrag = () => (drag.current = null);

  return (
    <div
      ref={hostRef}
      role={draggable ? "group" : undefined}
      tabIndex={draggable ? 0 : undefined}
      aria-label={draggable ? "玻璃镜片：拖动或使用方向键移动，Home 键复位" : undefined}
      className={cn(
        "relative select-none rounded-[var(--lg-radius)] [--lg-x:28%] [--lg-y:12%] shadow-[0_24px_36px_-20px_rgba(0,0,0,0.5),0_8px_16px_-10px_rgba(0,0,0,0.4)]",
        draggable && "cursor-grab touch-none outline-none active:cursor-grabbing focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-4 focus-visible:ring-offset-transparent",
        className,
      )}
      style={{ "--lg-radius": `${radius}px`, ...style } as CSSProperties}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={stopDrag}
      onPointerCancel={stopDrag}
      onPointerLeave={onPointerLeave}
      onKeyDown={onKeyDown}
    >
      {active && (
        <svg aria-hidden className="absolute size-0 overflow-hidden" focusable="false">
          <filter id={filterId} filterUnits="userSpaceOnUse" primitiveUnits="userSpaceOnUse" colorInterpolationFilters="sRGB" x={-pad} y={-pad} width={active.width + pad * 2} height={active.height + pad * 2}>
            <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="source" />
            <feImage href={active.map} x={0} y={0} width={active.width} height={active.height} preserveAspectRatio="none" result="raw" />
            <feGaussianBlur in="raw" stdDeviation={0.55} edgeMode="duplicate" result="map" />
            {CHANNELS.map((values, c) => (
              <Fragment key={values}>
                <feDisplacementMap in="source" in2="map" scale={strength + (c - 1) * separation} xChannelSelector="R" yChannelSelector="G" result={`d${c}`} />
                <feColorMatrix in={`d${c}`} type="matrix" values={values} result={`c${c}`} />
              </Fragment>
            ))}
            <feBlend in="c0" in2="c1" mode="screen" result="rg" />
            <feBlend in="rg" in2="c2" mode="screen" result="rgb" />
            <feGaussianBlur in="rgb" stdDeviation={0.48} />
          </filter>
        </svg>
      )}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{ background: renderer === "solid" ? "#26282e" : tint, backdropFilter: backdrop, WebkitBackdropFilter: backdrop }}
      />
      {renderer !== "solid" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={
            active
              ? { backgroundImage: `url(${active.light})`, backgroundSize: "100% 100%" }
              : { boxShadow: "inset 0 1px 0 rgba(255,255,255,0.4), inset 0 -1px 0 rgba(255,255,255,0.08), inset 0 0 0 1px rgba(255,255,255,0.1)" }
          }
        />
      )}
      {active && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background: "radial-gradient(ellipse at var(--lg-x) var(--lg-y), rgba(255,255,255,0.68), rgba(255,255,255,0.15) 38%, transparent 68%)",
            maskImage: `url(${active.light})`,
            maskSize: "100% 100%",
            WebkitMaskImage: `url(${active.light})`,
            WebkitMaskSize: "100% 100%",
          }}
        />
      )}
      {renderer !== "solid" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit]"
          style={{
            background:
              "linear-gradient(155deg, rgba(255,255,255,0.075), transparent 24%, transparent 77%, rgba(255,255,255,0.018)), radial-gradient(ellipse at var(--lg-x) var(--lg-y), rgba(255,255,255,0.042), transparent 57%)",
          }}
        />
      )}
      <div className="relative z-10 h-full rounded-[inherit]">{children}</div>
    </div>
  );
}
