"use client";

import { motion, useReducedMotion } from "motion/react";
import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ProgressStep {
  id: string;
  title: string;
  description?: string;
  content: ReactNode;
}

export interface ProgressStepsProps {
  label: string;
  steps: readonly ProgressStep[];
  value?: number;
  defaultValue?: number;
  onValueChange?: (index: number) => void;
  /** 最后一步的业务操作由调用方通过插槽提供。 */
  finalAction?: ReactNode;
  className?: string;
}

export function ProgressSteps({ label, steps, value, defaultValue = 0, onValueChange, finalAction, className }: ProgressStepsProps) {
  const id = useId();
  const reduced = useReducedMotion();
  const [internal, setInternal] = useState(defaultValue);
  const headings = useRef<(HTMLHeadingElement | null)[]>([]);
  const focusPanel = useRef(false);
  const raw = value ?? internal;
  const current = Math.max(0, Math.min(steps.length - 1, Number.isFinite(raw) ? Math.round(raw) : 0));

  useEffect(() => {
    if (!focusPanel.current) return;
    headings.current[current]?.focus({ preventScroll: true });
    focusPanel.current = false;
  }, [current]);

  if (steps.length === 0) return null;

  const select = (index: number, focusContent = false) => {
    focusPanel.current = focusContent;
    setInternal(index);
    onValueChange?.(index);
  };

  return (
    <section aria-label={label} className={cn("w-full overflow-hidden rounded-2xl border border-white/10 bg-[#141719] shadow-[inset_0_1px_0_#ffffff08]", className)}>
      <nav aria-label={label} className="border-b border-white/8 px-3 pb-2 pt-3 @md:px-6 @md:pb-4 @md:pt-6">
        <ol className="flex">
          {steps.map((step, index) => (
            <li key={step.id} className="relative min-w-0 flex-1">
              {index < steps.length - 1 && <span aria-hidden className="absolute left-1/2 right-[-50%] top-3 h-px bg-white/10 @md:top-4">
                <motion.span className="absolute inset-0 origin-left bg-[#c2d5b9]" initial={false}
                  animate={{ scaleX: index < current ? 1 : 0 }} transition={{ duration: reduced ? 0 : 0.35 }} />
              </span>}
              <button type="button" aria-current={index === current ? "step" : undefined}
                aria-controls={`${id}-content-${index}`} onClick={() => select(index)}
                disabled={index > current}
                className="relative flex w-full flex-col items-center gap-1.5 rounded-lg outline-none focus-visible:ring-2 focus-visible:ring-[#c2d5b9]/70 disabled:cursor-default @md:gap-2">
                <span aria-hidden className={cn("grid size-6 place-items-center rounded-full border font-mono text-[10px] shadow-[0_0_0_5px_#141719] motion-safe:transition-colors motion-safe:duration-300 @md:size-8", index <= current ? "border-[#dce8cd]/60 bg-[#dce8cd] text-[#253220]" : "border-white/12 bg-[#1b1f20] text-zinc-500")}>
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className={cn("max-w-full truncate px-1 text-[9px] @md:text-[11px]", index === current ? "text-zinc-100" : "text-zinc-500")}>{step.title}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>
      {steps.map((step, index) => (
        <div key={step.id} id={`${id}-content-${index}`} hidden={index !== current} className="px-3 py-2 @md:p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h3 ref={(node) => { headings.current[index] = node; }} tabIndex={-1} className="text-sm font-medium text-zinc-100 outline-none @md:text-lg">{step.title}</h3>
            <span aria-hidden className="font-mono text-[9px] text-zinc-500">{String(index + 1).padStart(2, "0")} / {String(steps.length).padStart(2, "0")}</span>
          </div>
          {step.description && <p className="mt-1.5 text-[10px] leading-relaxed text-zinc-400 @md:text-xs">{step.description}</p>}
          <div className="mt-2 @md:mt-5">{step.content}</div>
        </div>
      ))}
      <div className="flex items-center justify-between gap-4 border-t border-white/8 px-3 py-2 @md:px-6 @md:py-3">
        <button type="button" disabled={current === 0} onClick={() => select(current - 1, true)}
          className="min-h-7 rounded-lg px-2 text-[10px] text-zinc-400 hover:text-white disabled:cursor-not-allowed disabled:opacity-30 @md:min-h-9">上一步</button>
        {current === steps.length - 1 ? finalAction ?? <span role="status" className="text-[10px] text-[#c2d5b9]">已到最后一步</span> :
          <button type="button" onClick={() => select(current + 1, true)} className="min-h-7 rounded-lg border border-white/10 bg-white/8 px-4 text-[10px] text-zinc-100 hover:bg-white/12 @md:min-h-9">下一步</button>}
      </div>
      <span role="status" className="sr-only">第 {current + 1} 步，共 {steps.length} 步：{steps[current].title}</span>
    </section>
  );
}
