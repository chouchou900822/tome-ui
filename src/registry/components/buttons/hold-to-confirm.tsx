"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type HoldStatus = "idle" | "holding" | "busy" | "success" | "error";

export interface HoldToConfirmProps {
  label: string;
  holdingLabel?: string;
  confirmedLabel?: string;
  duration?: number;
  onConfirm?: () => void | Promise<void>;
  icon?: ReactNode;
  disabled?: boolean;
  className?: string;
}

/** 松开、移出、切换窗口或失焦都会取消尚未完成的长按。 */
export function HoldToConfirm({
  label, holdingLabel = "继续按住", confirmedLabel = "已确认", duration = 1200,
  onConfirm, icon, disabled = false, className,
}: HoldToConfirmProps) {
  const [status, setStatus] = useState<HoldStatus>("idle");
  const state = useRef<HoldStatus>("idle");
  const fill = useRef<HTMLSpanElement>(null);
  const frame = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);
  const reduced = useRef(false);
  const delay = Math.max(400, Number.isFinite(duration) ? duration : 1200);

  const changeStatus = (next: HoldStatus) => {
    state.current = next;
    setStatus(next);
  };

  const cancel = () => {
    if (state.current !== "holding") return;
    cancelAnimationFrame(frame.current);
    if (fill.current) fill.current.style.scale = "0 1";
    changeStatus("idle");
  };

  useEffect(() => {
    mounted.current = true;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncMotion = () => { reduced.current = media.matches; };
    const onVisibility = () => { if (document.hidden) cancel(); };
    syncMotion();
    media.addEventListener("change", syncMotion);
    window.addEventListener("blur", cancel);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      mounted.current = false;
      cancelAnimationFrame(frame.current);
      if (timer.current) clearTimeout(timer.current);
      media.removeEventListener("change", syncMotion);
      window.removeEventListener("blur", cancel);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  useEffect(() => { if (disabled) cancel(); }, [disabled]);

  const confirm = async () => {
    changeStatus("busy");
    if (fill.current) fill.current.style.scale = "1 1";
    try {
      await onConfirm?.();
      if (mounted.current) changeStatus("success");
    } catch {
      if (mounted.current) changeStatus("error");
    } finally {
      if (mounted.current) timer.current = setTimeout(() => {
        if (fill.current) fill.current.style.scale = "0 1";
        changeStatus("idle");
      }, 2200);
    }
  };

  const start = () => {
    if (disabled || state.current !== "idle") return;
    changeStatus("holding");
    const started = performance.now();
    const tick = (now: number) => {
      if (!mounted.current || state.current !== "holding") return;
      const progress = Math.min(1, (now - started) / delay);
      if (fill.current) fill.current.style.scale = `${reduced.current ? 0 : progress} 1`;
      if (progress >= 1) void confirm();
      else frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
  };

  const message = status === "success" ? confirmedLabel : status === "busy" ? "正在处理" : status === "error" ? "操作失败，请重试" : status === "holding" ? holdingLabel : label;

  return (
    <div className={cn("w-full max-w-xs", className)}>
      <button
        type="button" disabled={disabled || status === "busy" || status === "success" || status === "error"}
        aria-label={label} aria-busy={status === "busy"}
        onPointerDown={(event) => {
          if (!event.isPrimary || event.button !== 0) return;
          event.preventDefault();
          event.currentTarget.focus();
          event.currentTarget.setPointerCapture(event.pointerId);
          start();
        }}
        onPointerMove={(event) => {
          const bounds = event.currentTarget.getBoundingClientRect();
          if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) cancel();
        }}
        onPointerUp={cancel} onPointerCancel={cancel} onLostPointerCapture={cancel} onBlur={cancel}
        onKeyDown={(event) => {
          if (event.key !== " " && event.key !== "Enter") return;
          event.preventDefault();
          if (!event.repeat) start();
        }}
        onKeyUp={(event) => {
          if (event.key === " " || event.key === "Enter") { event.preventDefault(); cancel(); }
        }}
        className={cn(
          "relative flex min-h-14 w-full touch-none select-none items-center justify-between gap-4 overflow-hidden rounded-2xl border border-[#eef2e4]/70 bg-[#e3e7d9] px-5 text-[#262e22] shadow-[inset_0_1px_0_#fff,0_6px_0_#777e69,0_12px_24px_#0005] outline-none focus-visible:ring-2 focus-visible:ring-[#e3e7d9] focus-visible:ring-offset-8 focus-visible:ring-offset-[#0b0b0d]",
          status === "holding" && "translate-y-1 shadow-[inset_0_1px_0_#fff,0_2px_0_#777e69,0_6px_16px_#0005] motion-reduce:translate-y-0",
          disabled && "cursor-not-allowed opacity-45",
        )}
      >
        <span ref={fill} aria-hidden className="absolute inset-0 origin-left bg-[#bacda2]" style={{ scale: "0 1" }} />
        <span className="relative flex items-center gap-2.5 text-xs font-semibold @md:text-sm">{icon && <span aria-hidden>{icon}</span>}{message}</span>
        <span aria-hidden className="relative rounded-md border border-black/10 bg-white/25 px-2 py-1 font-mono text-[9px]">{(delay / 1000).toFixed(1)} s</span>
      </button>
      <p className="mt-5 text-center text-[10px] leading-relaxed text-zinc-500">按住鼠标、空格或 Enter，松开即取消</p>
      <span role="status" className="sr-only">{status !== "idle" ? message : ""}</span>
    </div>
  );
}
