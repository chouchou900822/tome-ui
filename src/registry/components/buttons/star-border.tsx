import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface StarBorderProps {
  children: ReactNode;
  className?: string;
  /** 内层底色与文字类名，默认深底浅字 */
  innerClassName?: string;
  /** 光点环绕一圈的时长（秒） */
  speed?: number;
}

/**
 * 流星描边按钮：两颗白光点沿圆角边框相向环绕，
 * 内层深色实底把光点遮成一圈流动的描边。纯 CSS 实现。
 */
export function StarBorder({
  children,
  className,
  innerClassName,
  speed = 5,
}: StarBorderProps) {
  return (
    <button
      type="button"
      className={cn(
        "relative inline-flex cursor-pointer items-center justify-center overflow-hidden rounded-full p-px",
        className,
      )}
    >
      <span aria-hidden className="pointer-events-none absolute inset-0">
        <span className="star-border-orbit absolute left-1/2 top-1/2 h-px w-1/2 origin-left" style={{ animationDuration: `${speed}s` }}>
          <span className="absolute right-0 top-1/2 size-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_8px_2px_rgba(255,255,255,0.7)]" />
        </span>
        <span
          className="star-border-orbit star-border-reverse absolute left-1/2 top-1/2 h-px w-1/2 origin-left"
          style={{ animationDuration: `${speed}s`, animationDelay: `${-speed / 2}s` }}
        >
          <span className="absolute right-0 top-1/2 size-2 translate-x-1/2 -translate-y-1/2 rounded-full bg-sky-300 shadow-[0_0_8px_2px_rgba(125,211,252,0.7)]" />
        </span>
      </span>
      <span
        className={cn(
          "relative inline-flex items-center gap-2 rounded-[inherit] bg-zinc-950 px-5 py-2 text-sm font-medium text-zinc-200",
          innerClassName,
        )}
      >
        {children}
      </span>
      <style href="star-border-keyframes" precedence="medium">
        {`@media (prefers-reduced-motion: no-preference) {
  .star-border-orbit { animation: star-border-spin linear infinite; }
  .star-border-reverse { animation-direction: reverse; }
}
@keyframes star-border-spin { to { transform: rotate(360deg); } }`}
      </style>
    </button>
  );
}
