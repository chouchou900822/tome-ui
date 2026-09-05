import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** 滚动一轮的时长（秒），越小越快 */
  duration?: number;
  /** 反向滚动 */
  reverse?: boolean;
  /** 悬停时暂停 */
  pauseOnHover?: boolean;
  /** 元素之间的间距 */
  gap?: string;
  /** 两侧淡出遮罩 */
  fade?: boolean;
}

/**
 * 无限跑马灯：内容渲染两份首尾相接，每份位移自身宽度的 100% 后无缝循环。
 * 间距作为每份的右内边距计入宽度，保证接缝处距离一致。纯 CSS 动画。
 */
export function Marquee({
  children,
  className,
  duration = 30,
  reverse = false,
  pauseOnHover = true,
  gap = "2.5rem",
  fade = true,
}: MarqueeProps) {
  return (
    <div
      className={cn("group flex w-full overflow-hidden", className)}
      style={
        fade
          ? {
              maskImage: "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
              WebkitMaskImage:
                "linear-gradient(to right, transparent, #000 12%, #000 88%, transparent)",
            }
          : undefined
      }
    >
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className={cn(
            "flex shrink-0 items-center motion-safe:animate-[marquee_30s_linear_infinite]",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
          style={{
            gap,
            paddingRight: gap,
            animationDuration: `${duration}s`,
            animationDirection: reverse ? "reverse" : "normal",
          }}
        >
          {children}
        </div>
      ))}
      <style href="marquee-keyframes" precedence="medium">
        {`@keyframes marquee{to{transform:translateX(-100%)}}`}
      </style>
    </div>
  );
}
